/**
 * @fileOverview
 * @author daiying.zhang
 */
(function(window){
    var cls = ['', 'orange', 'red', 'green'];

    function Entity(deep, title, keys, obj, canDrag){
        Entity.cache[deep] = Entity.cache[deep] || [];
        Entity.cache[deep].push(this);
        this.deep = deep;
        this.obj = obj;
        this.keys = keys;
        this.canDrag = canDrag !== false;
        this.title = this.getTitle(title);
        this.titleDom = null;
        this.dom = this.create(this.title, keys, obj, deep);
        M.extend(true, this, Event);
    }

    M.extend(Entity, {
        "ENTITY_CELL_HEIGHT" : 22,
        "ENTITY_HEADER_HEIGHT" : 26,
        "ENTITY_WIDTH" : 200,
        "ENTITY_MARGIN_BOTTOM" : 20,
        "ENTITY_MARGIN_RIGHT" : 60,

        "smartPosition" : function (objects){
            var keys = Object.keys(this.cache),
                max = keys.length,
                countInDeep = 0,
                deepEntity = null,
                i = 0, j = 0,
                tmp = null,
                maxArr,
                needModify = {};

            // 如果最后一列的第一个实体对象是内置对象，所有内置实体移动到这一列
            if(objects.indexOf(this.cache[max - 1][0].obj) !== -1){
                max--
            }

            this.cache[max] = maxArr = [];

            for(; i<max; i++){
                deepEntity = this.cache[i];
                for(j=0; j<deepEntity.length; j++){
                    //如果是内置对象 ==> 移动到末尾
                    if(objects.indexOf(deepEntity[j].obj) !== -1){
                        maxArr.push(tmp = deepEntity.splice(j, 1)[0]);
                        tmp.deep = max;
                        // 标志deep ＝ i的实体需要更新位置
                        needModify[i] = true;
                    }
                }
            }

            // 设置每个实体的位置
            for(i = 0; i<=max; i++){
                if(needModify[i] === true || i === max){
                    deepEntity = this.cache[i];
                    countInDeep = deepEntity.length;
                    for(j=0; j<countInDeep; j++){
                        tmp = deepEntity[j];
                        tmp.setPosition(tmp.deep, j)
                    }
                }
            }
        },
        "getEntityByObj" : function (obj){
            var i, j, deepEntity, countInDeep, tmp, max = Object.keys(this.cache).length;
            for(i = 0; i<max; i++){
                deepEntity = this.cache[i];
                countInDeep = deepEntity.length;
                for(j=0; j<countInDeep; j++){
                    tmp = deepEntity[j];
                    if(tmp.obj === obj){
                        return tmp
                    }
                }
            }
            return null
        },
        "getEntitiesInfo" : function (){
            var cache = this.cache, i, len, tmp,
                result = {
                    "entitiesCount":0,
                    "propertiesCount":0
                };
            for(var key in cache){
                tmp = cache[key];
                len = tmp.length;
                for(i=0; i<len; i++){
                    result.entitiesCount++;
                    result.propertiesCount += Object.keys(tmp[i]).length
                }
            }
            return result
        },
        "clear": function(){
            this.cache = {};
        },

        "cache": {}
    });

    M.extend(Entity.prototype, {
        /**
         * 创建实体对象
         * @param title
         * @param keys
         * @param obj
         * @param deep
         * @returns {*}
         */
        create: function (title, keys, obj, deep){
            if(!keys || keys.length === 0){
                return
            }

            var self = this;
            var html = ['<li class="title"><div>', title ,'</div></li>'];
            var ul = document.createElement('ul');
            var pos = self.getPosition(self.deep);
            var key, val, type, titleDom;

            for(var i=0; i < keys.length; i++){
                key = keys[i];
                try{
                    val = obj[key];
                }catch(e){
                    val = "[Exception]"
                }

                type = self.getText(val);

                html.push('<li class="content"><span class="cell">' + key
                + '</span><span class="cell ' + type.type + '">' + type.val + '</span></li>')
            }
            ul.className = 'm-entity' + (deep === 0 ? "" : " " + cls[deep % 4]);
            ul.style.left = pos.left + 'px';
            ul.style.top = pos.top + 'px';
            ul.innerHTML = html.join('');

            self.titleDom = titleDom = ul.getElementsByTagName("li")[0];

            Dom.data(titleDom, "_moveHandel", []);
            Dom.drag(titleDom, function (el, x, y){
                //var moveHandels = Dom.data(titleDom, '_moveHandel'),
                //    len = moveHandels.length, i = 0;
                //for(; i<len; i++){
                //    moveHandels[i].apply(titleDom, arguments)
                //}
                self.trigger("move", [el, x, y])
            });

            ul.addEventListener('mouseover', function (eve){
                var parentLi = Dom.closest(eve.target, "content", ul),
                    index = parentLi && Dom.index(parentLi);
                //console.log("=======================", index);
                self.trigger("mouseover", eve, index - 1, parentLi);
                //eve.stopPropagation()
            });

            ul.addEventListener('mouseout', function(eve){
                self.trigger('mouseout', eve)
            });

            document.body.appendChild(ul);
            return ul
        },
        getText: function (val){
            var type = typeof val, valText = "";
            switch(type){
                case "number":
                case "string":
                case "boolean":
                    valText = val;
                    break;
                case "function":
                    valText = "[Function]";
                    break;
                case "object":
                    valText = val === null ? "null" : "[Object]";
                    break;
            }
            return {
                type: type,
                val: valText
            }
        },
        getDom: function (){
            return this.dom
        },
        getPosition: function (deep, index){
            if(typeof index === "undefined"){
                index = Entity.cache[deep].length
            }
            return {
                "left": deep === 0 ? 20 : deep * (Entity.ENTITY_WIDTH + Entity.ENTITY_MARGIN_RIGHT),
                "top": this.getPrevHeight(deep, index)
            }
        },
        getPrevHeight: function (deep, index){
            var list = Entity.cache[deep],
                i = 0,
                endIndex = Math.min(index, list.length - 1),
                height = Entity.ENTITY_MARGIN_BOTTOM;

            for(; i < endIndex; i++){
                height += (Entity.ENTITY_CELL_HEIGHT * (list[i].keys.length + 1) + Entity.ENTITY_MARGIN_BOTTOM)
            }

            //console.log("getPrevHeight :(", deep, "," ,index, ")", height)
            return height
        },
        getTitle: function (title){
            var name = (this.obj.name || title), type = typeof name;
            return "[" + (type === 'undefined' ? typeof this.obj : name) + "]"
        },
        //addMoveHandel: function (){
        //    var args = [].slice.apply(arguments),
        //        moveHandels = Dom.data(this.titleDom, "_moveHandel");
        //    if(!this.canDrag){ return }
        //    for(var key in args){
        //        moveHandels.push(args[key])
        //    }
        //},
        setPosition: function (deep, index){
            //console.log("setPosition == ", deep, index);
            var pos = this.getPosition(deep, index);
            Dom.css(this.dom, {
                "left": pos.left + 'px',
                "top": pos.top + 'px'
            });
            var moveHandels = Dom.data(this.titleDom, '_moveHandel'),
                len = moveHandels.length, i = 0;
            for(; i<len; i++){
                moveHandels[i].apply(this.titleDom, arguments)
            }
        }
    });

    window.Entity = Entity
})(this);