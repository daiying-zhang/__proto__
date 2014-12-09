/**
 * @fileOverview
 * @author daiying.zhang
 */

(function (window, undefined){
    var cache = {
        "obj":[]
    };
    var buildInObjects = [
        Date.prototype,
        Array.prototype,
        Function.prototype,
        Object.prototype,
        String.prototype,
        Number.prototype,
        Boolean.prototype,
        RegExp.prototype
    ];

    var buildInObjStr = [
        'Date.prototype',
        'Array.prototype',
        'Function.prototype',
        'Object.prototype',
        'String.prototype',
        'Number.prototype',
        'Boolean.prototype',
        'RegExp.prototype'
    ];

    var isIE = navigator.userAgent.match(/MSIE/);

    var __ = {
        getProtoKeys: function(obj, showProto){
            var keys = typeof obj === 'object' || typeof obj === 'function'
                ? Object.getOwnPropertyNames(obj)
                : [];
            showProto && !~keys.indexOf('__proto__') && keys.push("__proto__");
            return keys;
            // return type(obj) === 'object' || type(obj) === 'function'
            //               // 如果是__proto__用getOwnPropertyNames获取不可枚举的属性名称
            //               // 否则获取自身可枚举属性名称
            //               ? isProto
            //                     ? Object.getOwnPropertyNames(obj)
            //                     : Object.keys(obj)
            //               : []
        },
        /**
         * 检测循环依赖
         */
        checkCircleDependence: function(obj, parents){
            var result = false;
            for(var i=0, len = parents.length; i<len; i++){
                if(parents[i] === obj){
                    result = true;
                    break
                }
            }

            return result
        },
        /**
         * 绘制实体关系图
         * @param {Object} obj          要展示的实体对象
         * @param {String} title        要展示的实体标题，如果实体有name属性，优先取name
         * @param {Number} [deep=0]     当前层级
         * @param {Entity} parent       当前的父级实体base
         * @param {Number} [index=0]    当前实体对应的key(在base的keys中)的序号
         * @param {Boolean} showProto   是否现实原型对象
         */
        draw: function (obj, title, deep, parent, index, showProto){
            var keys,
                tmpValue, //当前实体中某一个key的value
                type,
                entity, //当前实体
                //title = obj.name || "[" + typeof obj + "]",
                exist = false;

            if(!(obj && /^(function|object)$/.test(typeof obj))){
                return
            }

            keys = this.getProtoKeys(obj, showProto);
            if(typeof deep === 'undefined') deep = 0;

            entity = new Entity(deep, title, keys, obj);

            if(parent){
                new Relation($('#j-svg')[0], parent, entity, index || 0)
            }

            cache["obj"].push(obj);
            if(buildInObjects.indexOf(obj) !== -1){
                //todo 实现可配置
                // 如果是内置构造器，只显示__proto__属性
                keys = ["__proto__"];
                //return
            }

            for(var i = 0; i < keys.length; i++){
                try{
                    if(keys[i] === '__proto__' && isIE){
                        tmpValue = obj.constructor.prototype;
                    }else{
                        tmpValue = obj[keys[i]];
                    }
                }catch (e){
                    tmpValue = "[Exception]";
                }

                type = typeof tmpValue;

                if(/^(object|function)$/.test(type)){
                    if(type === 'function' && !(/^(constructor|__proto__)$/).test(keys[i])){
                        return
                    }

                    exist = ~cache["obj"].indexOf(tmpValue);
                    cache["obj"].push(tmpValue);
                    if(!exist){
                        var index = buildInObjects.indexOf(tmpValue);
                        if(index !== -1){
                            // 内置对象构造器
                            title = buildInObjStr[index];
                        }else{
                            // 非内置对象构造器
                            title = keys[i];
                        }
                        this.draw(tmpValue, title, deep + 1, entity, i, showProto)
                    }else{
                        // 如果实体已经存在
                        new Relation($('#j-svg')[0], entity, Entity.getEntityByObj(tmpValue), i)
                    }
                }
            }

            if(deep === 0){
                //所有的都已经处理完毕
                //Entity.smartPosition(buildInObjects);
            }
        },
        clear: function(){
            var entities = Dom("ul.m-entity"), len = entities.length, i = 0;
            Entity.clear();
            for( ;i<len; i++){
                entities[i].parentNode.removeChild(entities[i])
            }
            var lines = Dom('#j-svg > path');
            len = lines.length;
            i = 0;
            for( ;i<len; i++){
                lines[i].parentNode.removeChild(lines[i])
            }
            return this
        }
    };

    window.__ = __;
})(this);