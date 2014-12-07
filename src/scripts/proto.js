/**
 * 遍历对象的属性，包括原型属性
 */
/*var person = {
    NO : 'CA92384',
    city : 'BeiJing'
}

var obj = {
    'testA' : 'a',
    'testB' : 'b'
}

person.person = {
    name:'Tom',
    address : {
        province: '北京',
        city: '北京市',
        area : '海淀区'
    },
    getName: function(){
        alert(this.name);
        return this.name;
    },
    age : 23,
    test: obj,
    department : '机票事业部',
    job : 'FE'
}

person.other = {
    //aa : obj.a,
    company: 'Qunar',
    mobile : '1861222222',
    sex : 'F',
    person: 'person',
    test: obj
}

person._id = "CA9238419"*/

//obj.a.b = obj.b;

// obj.a = {
//     'a1' : 'a',
//     'b1' : {
//         'aa' : 'aa',
//         'bb' : {
//             'aaa' : 'aaa',
//             'ccc' : [1, 2, 3]
//         }
//     }
// }
// obj.b = 'b';
// obj.c = [1, 2, 3, 4];
// obj.sayName = function(){
//     //...
// }

// var a = {
//     name : 'a',
//     b : b
// }
//
// var b = {
//     name : 'b',
//     c : c
// }
//
// var c = {
//     name : 'c',
//     a : a
// }
//
// b.c = c;
//
// a.b = b;


// function Person(){
//     this.name = 'name';
//     this.age = 23;
//     this.addr = 'addr'
// }
// Person.prototype.sayName = function(){alert('sayName')}
// Person.prototype.sayName.name = "sayName"
//
// var obj = new Person();

(function(){
    console.log = function(){};

    function loadJQ() {
        $.loadScript('http://code.jquery.com/jquery-2.1.0.min.js', function(){
            proto(jQuery, false, [],'jQuery', '', Math.guid());
        })
    }


    function $(selector){
        return document.getElementById(selector);
        //return document.querySelectorAll(selector);
    }

    $.attr = function(elem, key, val){
        if(typeof key === 'string'){
            if(val){
                elem.setAttribute(key, val)
            }else{
                return elem.getAttribute(key) || ''
            }
        }else if(typeof key === 'object'){
            var obj = key;
            for(var _key in obj){
                if(obj.hasOwnProperty(_key)){
                    elem.setAttribute(_key, obj[_key])
                }
            }
        }
    };

    $.css = function(elem, key, val){
        if(typeof key === 'string'){
            if(val){
                elem.style[key] = val
            }else{
                return elem.style[key] || ''
            }
        }else if(typeof key === 'object'){
            var obj = key;
            for(var _key in obj){
                if(obj.hasOwnProperty(_key)){
                    elem.style[_key] =  obj[_key]
                }
            }
        }
    };

    $.drag = function(elem, parent, cb){
        var sX, sY, sL, sT, el;
        if(typeof parent !== 'boolean'){
            cb = parent;
            parent = true
        }

        el = parent ? elem.parentNode : elem;

        function moveHandel(eve){
            var x, y;
            el.style.left = x = sL + (eve.pageX - sX);
            el.style.top  = y = sT + (eve.pageY - sY);
            cb && cb.call(el, x, y);
        }
        elem.addEventListener('mousedown', function(eve){
            sX = eve.pageX;
            sY = eve.pageY;
            sL = parseInt(el.style.left);
            sT = parseInt(el.style.top);

            document.addEventListener('mousemove', moveHandel);
            return false
        });
        document.addEventListener('mouseup', function(eve){
            document.removeEventListener('mousemove', moveHandel)
        })
    };

    $.type = function(obj) {
        return obj === null ? 'null' :
            toString.call(obj).replace(/^\[object (\w+)\]$/, '$1')//.toLowerCase()
    };

    $.globalEval = function(code) {
        var sc = document.createElement('script');
        sc.text = code;
        document.head.appendChild(sc).parentNode.removeChild(sc);
    };

    $.loadScript = function(src, cbk){
        var iHead = document.head;
        var iScript= document.createElement("script");
        iScript.addEventListener('load', function(){
            cbk && cbk()
        });
        iScript.type = "text/javascript";
        iScript.src=src;
        iHead.appendChild(iScript);
    };

    $.loadStyle = function(src){
        var node = document.createElement('link');
        node.rel = 'stylesheet';
        node.href = src;
        document.head.appendChild(node);
    };

    $.data = function(ele, key, data){
        var id = ele._id;
        if(typeof data === 'undefined'){
            return id ? $._cache[id][key] : null
        }
        ele._id = id ? id : id = Math.guid();

        $._cache[id] = $._cache[id] || {};
        $._cache[id][key] = data;
    };
    $.id = '$' + (String(Math.random())).replace(/\W/g,'');
    $._cache = {};

    window.__ = $;

    // proto start ==============================================

    var buildInObjects = [
        Date.prototype,
        Function.prototype,
        Object.prototype,
        String.prototype,
        Number.prototype,
        Boolean.prototype,
        RegExp.prototype
    ];

    var buildInObjStr = [
        'Date.prototype',
        'Function.prototype',
        'Object.prototype',
        'String.prototype',
        'Number.prototype',
        'Boolean.prototype',
        'RegExp.prototype'
    ];

    var objDB = [];

    var posDB = [];

    function getProps(obj, isProto){
        return type(obj) === 'object' || type(obj) === 'function'
            ? Object.getOwnPropertyNames(obj)
            : []
        // return type(obj) === 'object' || type(obj) === 'function'
        //               // 如果是__proto__用getOwnPropertyNames获取不可枚举的属性名称
        //               // 否则获取自身可枚举属性名称
        //               ? isProto
        //                     ? Object.getOwnPropertyNames(obj)
        //                     : Object.keys(obj)
        //               : []
    }

    function type(obj){
        return typeof obj
    }

    /**
     * 检测循环依赖
     */
    function checkCircleDependence(obj, parents){
        var result = false;
        for(var i=0, len = parents.length; i<len; i++){
            if(parents[i] === obj){
                result = true
                break
            }
        }

        return result
    }

    /**
     *
     * @param obj
     * @param isProto
     * @param from
     * @param name
     * @param prex
     * @param _id
     * @param _parentID
     * @param index
     */
    function proto(obj, isProto, from, name, prex, _id, _parentID, index, showProto){
        var keys, curr, currPrex, len, objType, buildObjIndex;

        isProto = isProto || false;
        from = from || [];
        name = name || $.type(obj);
        prex = prex || '';
        _id = _id || Math.guid();

        //console.warn('from' ,from)

        // 如果prex===''(第一级)显示为: |--
        // 否则显示为: |    |--,空格个数根据级别增加
        currPrex = '|' + prex + (prex === '' ? '--' : '|--');

        if(!obj){
            // 如果obj为null,返回
            console.log(currPrex + 'null');
            return
        }
        ///////////////////
        //////posObj[_id] = createEntity(obj, name, from.length, _id, _parentID, index || 0);
        createEntity(obj, name, from.length, _id, _parentID, index || 0);

        ///_id && _parentID && relation(_id, _parentID, index || 0)
        //////////////////
        keys = getProps(obj, isProto);
        //如果没有__proto__属性，加入数组遍历__proto__
        showProto && !~keys.indexOf('__proto__') && keys.push('__proto__');
        len = keys.length;

        keys.forEach(function(ele, idx, all){

            console.log(currPrex + ele)
            // 访问属性可能报错
            // 比如:
            // function Person(){}
            // Person.prototype.sayName = function(){}
            // Person.prototype.sayName.prototype.__proto__.constructor.deliverChangeRecords.arguments
            // TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
            try{
                objType = type(curr = obj[ele]);

                if(objType === 'object' || objType === 'function'){
                    if(~(buildObjIndex = buildInObjects.indexOf(curr))){
                        //console.log('指向', buildInObjects[buildObjIndex])
                        //console.log('|' + prex + (idx === len -1 ? '   |--' : '|  |--'), buildInObjects[buildObjIndex])

                        ////console.log('|' + prex + (idx === len -1 ? '   |--' : '|  |--'), buildInObjStr[buildObjIndex])
                        createEntity(curr, buildInObjStr[buildObjIndex], from.length + 1, Math.guid(), _id, idx);
                        return
                    }
                    //检测循环依赖
                    if(!checkCircleDependence(curr, from)){
                        // 递归处理对象
                        // 如果第一级增加两个个空格， 最后一级增加三个空格，其他增加'|  '
                        var __from = from.concat();
                        __from.push(obj);
                        proto(curr,
                            ele === '__proto__' || objType === 'function',
                            //from.concat(obj),
                            //from.push(obj),
                            __from,
                            ele, prex + (prex === '' ? '  ' : (idx === len - 1 ? '   ' : '|  '))
                            ,Math.guid(), _id, idx
                        )
                    }else{
                        console.log('|' + prex + (idx === len -1 ? '   |--' : '|  |--'), curr)
                        //console.log('循环依赖');
                    }
                }
            }catch(e){
                console.warn('Exception : ', e.message, e)
            }
        });
    }

    //var deepObj = {};
    var posObj = {};

    /**
     * 创建实体
     * @param obj
     * @param name
     * @param deep
     * @param _id
     * @param _parentID
     * @param index
     * @returns {{left: number, top: *}}
     */
    function createEntity(obj, name, deep, _id, _parentID, index){
        var cls = ['', 'orange', 'red', 'green'];
        if(~objDB.indexOf(obj)){
            //console.warn('cunzai::', obj,_parentID, posDB[objDB.indexOf(obj)]);
            relation(posDB[objDB.indexOf(obj)], _parentID, index)
            return
        }

        objDB.push(obj);
        posDB.push(_id);

        var ul = document.createElement('ul'),
            li = document.createElement('li'),
            keys = Object.getOwnPropertyNames(obj),
            i = 0,
            len = keys.length,
            tmp,
            _type;

        if(!~keys.indexOf('__proto__')){
            keys.push('__proto__');
            len++;
        }

        //deepObj[deep] = (deepObj[deep] || 0) + 1;


        // var title = document.createElement('div');
        // title.innerHTML = name || ':(';
        // document.body.appendChild(title);
        var prevHeight = getPrevHeight(deep);

        //console.log('deep', deep, 'height:', prevHeight);
        var posX = deep * 260 + 10,
        //posY = (deepObj[deep] - 1) * 200 + 20;
            posY = prevHeight + 10;
        var title;

        ul.className = 'entity m-entity j-entity' + ' ' + cls[deep % cls.length];

        $.css(ul, {
            'position' : 'absolute',
            'width' : '200px',
            'top' : posY,
            'left' : posX,
            'overflow' : 'scroll',
            'border' : '1px solid black'
        });

        ul.setAttribute('data-deep', deep);

        ul.id = _id;

        tmp = title = li.cloneNode();
        tmp.className = 'title';
        //tmp.style.background = '#BEF4AA';
        tmp.innerHTML = '<div style="font-size:14px; text-align:center">' + (name || '') + ' [' + $.type(obj) + ']</div>';
        ul.appendChild(tmp);


        for(; i<len; i++){
            tmp = li.cloneNode();
            tmp.className = 'content';
            _type = type(obj[keys[i]]);
            tmp.innerHTML = '<span class="cell" title="' + keys[i] + '">' + keys[i] + '</span>' +
                ' <span class="cell j-tips" title="' +
                /*(_type === 'function' ? String(obj[keys[i]]) : JSON.stringify(obj[keys[i]])).substr(0, 100).replace(/"$/,'') +*/ '">' +
                (_type === 'function' || _type === 'object'
                    ? obj[keys[i]] === null ? '<strong>null</strong>' : '[' + (_type.charAt(0).toUpperCase() + _type.slice(1)) + ']'
                    : _type === 'string' ? '"' + obj[keys[i]] + '"' : obj[keys[i]]) + '</span>' ;
            $.data(tmp, 'tips', _type === 'function' ? String(obj[keys[i]]) : JSON.stringify(obj[keys[i]]));
            tmp.addEventListener('click', tips);
            ul.appendChild(tmp);
        }

        //document.getElementById('main').appendChild(ul);
        document.body.appendChild(ul);

        $.drag(title, function(x, y){
            //console.warn($.attr(this, 'import'), $.attr(this, 'export'));
            var imp = $.attr(this, 'import'),
                exp = $.attr(this, 'export'),
                all = (imp ? imp.split('_') : []).concat( exp ? exp.split('_') : []);
            all.forEach(function(value, index){
                //console.warn($(value));
                setPosition($(value))
            });
            //console.warn('(', x, ',', y, ')');
        });

        posObj[_id] = {
            left : posX,
            top  : posY
        };

        if(_id && _parentID){
            var iidd = relation(_id, _parentID, index || 0);
            var _li = $(_parentID).getElementsByTagName('li')[index + 1];
            _li.setAttribute('data-id', _id);

            _li.style.cursor = 'pointer';
            _li.addEventListener('mouseover', function(){
                setTimeout(function(){
                    !~$(_id).className.indexOf('current') && ($(_id).className += " current");
                    _li.style.background = "rgba(181, 45, 235, .6)";
                    $.attr($(iidd), {
                        'stroke': 'red',
                        //'stroke-dasharray': '10, 5, 3, 5',
                        'class': 'pathAnimation'
                        //'stroke-dashoffset': "669.67"
                    });
                    //$('arrow').setAttribute('stroke', 'red')
                    //$(iidd).setAttribute('stroke-width', '2')
                },0)
            });
            _li.addEventListener('mouseout', function(){
                $(_id).className = $(_id).className.replace(/\s*current/g,'');
                setTimeout(function(){
                    $(_id).style.background = "";
                    _li.style.background = "";
                    $.attr($(iidd), {
                        'stroke': 'black',
                        //'stroke-dasharray': '0,0,0,0',
                        'class': ''
                        //'stroke-dashoffset': "669.67"
                    });
                    //$('arrow').setAttribute('stroke', 'black')
                    //$(iidd).setAttribute('stroke-width', '1')
                },0)
            });
        }


        return {
            left : posX,
            top  : posY
        }

    }

    /**
     * 获取对应层级实体容器目前的高度
     * @param deep
     * @returns {number}
     */
    function getPrevHeight(deep){
        var list = document.querySelectorAll('[data-deep="' + deep + '"]'),
            len = list.length,
            i = 0,
            height = 0;

        for(; i<len; i++){
            height += list[i].offsetHeight + 15;
        }

        return height
    }

    function setPosition(path){
        var relation = $.attr(path, 'relation').split('_'),
            parentID = relation[1],
            id = relation[0],
            $parent = $(parentID),
            $cur = $(id),
            index = parseInt($.attr(path, 'index'));

        var start = {
                left: parseInt($.css($parent, 'left')),
                top: parseInt($.css($parent, 'top'))
            },  //起
            end = {
                left: parseInt($.css($cur, 'left')),
                top: parseInt($.css($cur, 'top'))
            };  //止

        //var svgLineID = Math.guid();


        /*if(!start || !end){
            return
        }
        var startX = start.left + 201,
            startY = (start.top + 22 * index + 37),
            endX = end.left - 10,
            endY = end.top + 13;

        // 折线
        path.setAttribute('d',
            //起点
                'M ' + startX + ' ' + startY +
                //下中点
                ' L ' + (endX + startX) / 2 + ' ' + startY +
                //上中点
                ' L ' + (endX + startX) / 2 + ' ' + endY +
                //终点
                ' L ' + endX + ' ' + endY);
        // 贝塞尔曲线
        // <path d="M97 336 C288 339 143 55 327 51" />
        // tools http://blogs.sitepointstatic.com/examples/tech/svg-curves/cubic-curve.html
        path.setAttribute('d',
                'M' + startX + ',' + startY + ' C' + [endX, startY, startX, endY, endX, endY].join(' ')
        );*/



        if(!start || !end){
            return
        }
        var startX = start.left + 201,
            startY = (start.top + 22 * index + 37),
            endX = end.left - 10,
            endY = end.top + 13;
        var p1, p2, p3, p4;

        var isRightDir = endX > startX;
        var isTopDir = endY > startY;

        if(!isRightDir){
            endX = end.left + 215;
            if(endY > start.top){
                endY = start.top - 10;
                p3 = {
                    x: endX + 10,
                    y: start.top - 10
                };
                p1 = {
                    x: Math.max(startX, endX) + 10,
                    y: startY
                };
                p2 = {
                    x: Math.max(startX, endX) + 10,
                    y: endY
                };

                endY = end.top + 13;

                p4 = {
                    x: endX + 10,
                    y: endY
                }
            }else{
                p1 = {
                    x: Math.max(startX, endX) + 10,
                    y: startY
                };
                p2 = {
                    x: isRightDir ? (endX + startX) / 2 : Math.max(startX, endX) + 10,
                    y: endY
                };
            }
        }else{
            p1 = {
                x: (endX + startX) / 2,
                y: startY
            };
            p2 = {
                x: (endX + startX) / 2,
                y: endY
            };
        }

        /*p1 = {
            x: isRightDir ? (endX + startX) / 2 : Math.max(startX, endX) + 10,
            y: startY
        };*/

        /*p2 = {
            x: isRightDir ? (endX + startX) / 2 : Math.max(startX, endX) + 10,
            y: endY
        };*/


        // 折线
        path.setAttribute('d',
            //起点
                'M ' + startX + ' ' + startY +
                //下中点
                ' L ' + p1.x + ' ' + p1.y +
                //上中点
                ' L ' + p2.x + ' ' + p2.y +
                (p3 ? (' L ' + p3.x + ' ' + p3.y) : '') +
                (p4 ? (' L ' + p4.x + ' ' + p4.y) : '') +
                //终点
                ' L ' + endX + ' ' + endY);
        // 贝塞尔曲线
        // <path d="M97 336 C288 339 143 55 327 51" />
        // tools http://blogs.sitepointstatic.com/examples/tech/svg-curves/cubic-curve.html
        path.setAttribute('d',
                'M' + startX + ',' + startY + ' C' + [endX, startY, startX, endY, endX, endY].join(' ')
        );
    }

    /**
     * 从parentID 到 id划线
     */
    function relation(id, parentID, index){
        //console.warn('relation:::', id, parentID);
        //var svg = document.createElement('svg');
        var svg = document.getElementById('j-svg');
        //var path = document.createElement('path');
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        //svg.setAttribute('width', '100%');
        //svg.setAttribute('height', '100%');

        /*var start = posObj[parentID],  //起
         end = posObj[id];          //止

         var svgLineID = Math.guid();

         if(!start || !end){
         return
         }
         var startX = start.left + 200,
         startY = (start.top + 21 * index + 26),
         endX = end.left,
         endY = end.top + 10;

         path.setAttribute('d',
         'M' + startX + ',' + startY + ' C' + [endX, startY, startX, endY, endX, endY].join(' ')
         );*/
        var $parent = $(parentID),
            $cur = $(id);

        if(!$parent || !$cur){
            return -1
        }

        var svgLineID = Math.guid();
        $.attr(path, {
            'id':  svgLineID,
            'stroke':  "black",
            'stroke-width':  "1",
            'fill':  "none",
            'index': index,
            'marker-end': "url(#markerArrow)",
            //'stroke-dasharray':  "10 5 5 5",
            'style': 'cursor:pointer',
            'relation': id + '_' + parentID,
            'class': 'arrow-path'
        });

        setPosition(path);

        var idImport = $.attr($(id), 'import');
        var idExport = $.attr($(parentID), 'export');
        $.attr($(id), 'import', idImport ? idImport  + '_' + svgLineID : svgLineID);
        $.attr($(parentID), 'export', idExport ? idExport  + '_' + svgLineID : svgLineID);

        /*path.setAttribute('id', svgLineID);
         path.setAttribute('stroke', "orange");
         path.setAttribute('stroke-width', "1");
         path.setAttribute('fill', "none");
         path.setAttribute('marker-end',"url(#markerArrow)");
         //path.setAttribute('stroke-dasharray', "10 5 5 5");
         path.setAttribute('style','cursor:pointer');
         path.setAttribute('relation',id + '_' + parentID);*/
        path.addEventListener('mouseover', function(){
            setTimeout(function(){
                $(id).style.background = "rgba(235,13,13,.6)";
                $(parentID).style.background = "rgba(235,13,13,.6)";
                path.setAttribute('stroke-dasharray', "10 5 5 5");
            },200)
        })
        path.addEventListener('mouseout', function(){
            setTimeout(function(){
                path.setAttribute('stroke-dasharray', "");
                $(id).style.background = "";
                $(parentID).style.background = "";
            },200)
        });
        svg.appendChild(path);
        //document.body.appendChild(svg);
        return svgLineID
    }

    // proto end ==============================================

    /**
     * Math.guid
     * from : http://www.broofa.com/2008/09/javascript-uuid-function/
     */
    /*Math.guid = function(){
     return 'xxxxxxxx-xxxx-4xxx-yxxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
     var r = Math.random() * 16 | 0,
     v = c === 'x' ? r : (r & 0x3 | 0x8);

     return v.toString(16)
     }).toUpperCase();
     }*/

    Math.guid = (function(){
        var count = 0;
        return function(){
            return ++count;
        }
    })();

    console.log('person:')
    //proto(person, false, [],'person', '', Math.guid());
    console.log('over....');

    var person = {
        "name": "daiying.zhang",
        "age": 24,
        "address":{
            "province": "BeiJing",
            "city": "HaiDian"
        }
    }

    window.proto = proto;
    window.p = function() {
        objDB = [];
        posDB = [];
        posObj = {};

        var //paths = [].slice.call(document.getElementsByClassName('j-entity')),
            paths = [].slice.call(document.querySelectorAll('.j-entity, .arrow-path')),
            i = 0,
            len = paths.length;
        var svg = document.getElementById('j-svg'),
            ent = document.getElementById('main');
        for(; i<len; i++){
            paths[i].parentNode.removeChild(paths[i])
        }

        //ent.innerHTML = '';
        $.css($('j-svg'), {
            'width':  '100%',
            'height': '100%'
        })
        $('j-editor').style.display = 'none';
        proto.apply(this, arguments);
        setTimeout(function(){
            var sw = document.body.scrollWidth,
                ow = document.body.offsetWidth,
                sh = document.body.scrollHeight,
                oh = document.body.offsetHeight;
            $.css($('j-svg'), {
                'width': sw + 'px',
                'height': sh + 'px'
            })
        }, 200)
    };
    //proto(person, false, [],'person', '', Math.guid());



    //loadJQ()
    /*setTimeout(function() {
        console.warn('jQuery', jQuery, '$', $, $ === jQuery);
    }, 3000)*/

    function tips(eve) {
        var tar = eve.target,
            nodeName = tar.nodeName.toLowerCase();
        if(nodeName !== 'svg' && ~eve.target.className.indexOf('j-tips')){
            alert($.data(eve.target.parentNode, 'tips'))
        }
    }
    $.loadJQ = function(show){
        $.loadScript('http://localhost/scripts/jquery.js', function(){
            show ? p(jQuery) : console.warn('加载成功');
        })
    };

    $.loadJQ();

    window.loadJQ = loadJQ

})()

// Person:
// |--name
// |--age
// |--addr
// |--__proto__
// |  |--constructor
// |  |  |--length
// |  |  |--name
// |  |  |--arguments
// |  |  |  |--null
// |  |  |--caller
// |  |  |  |--null
// |  |  |--prototype
// |  |  |  |-- Person {sayName...}
// Person {sayName: function}
//
// |  |  |--__proto__
// |  |     |-- Function.prototype
// |  |--sayName
// |  |  |--length
// |  |  |--name
// |  |  |--arguments
// |  |  |  |--null
// |  |  |--caller
// |  |  |  |--null
// |  |  |--prototype
// |  |  |  |--constructor
// |  |  |  |  |-- function (){alert('sayName')}
// |  |  |  |--__proto__
// |  |  |     |-- Object.prototype
// |  |  |--__proto__
// |  |     |-- Function.prototype
// |  |--__proto__
// |     |-- Object.prototype