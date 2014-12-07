/**
 * @fileOverview
 * @author daiying.zhang
 */
function $(selector){
    //return document.getElementById(selector);
    return document.querySelectorAll(selector);
}

$.id = '$' + (String(Math.random())).replace(/\W/g,'');
$._cache = {};

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
        el.style.left = (x = sL + (eve.pageX - sX)) + "px";
        el.style.top  = (y = sT + (eve.pageY - sY)) + "px";
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

M.extend($, {
    addClass: function(dom, cls){
        if(dom && !this.hasClass(dom, cls)){
            dom.className = this.removeSpace(dom.className + " " + cls);
        }
    },
    hasClass: function(dom, cls){
        cls = /\s/.test(cls) ? "(" + cls.replace(/(\s+)/g,"|") + ")" : cls;
        return new RegExp("\\b" + cls + "\\b").test(dom.className);
    },
    removeClass: function(dom ,cls){
        var hasCls = this.hasClass(dom , cls);
        if(dom && hasCls){
            cls = /\s/.test(cls) ? "(" + cls.replace(/(\s+)/g,"|") + ")" : cls;
            dom.className = this.removeSpace(dom.className.replace(new RegExp("\\b" + cls + "\\b","g"),""));
        }
    },
    removeSpace: function(str){
        return str.replace(/^\s+|\s+$/,"").replace(/\s+/," ");
    },
    index: function(dom, collection){
        var index = 0;
        //如果没有指定范围，查找所有同级元素
        if(!collection){
            collection = dom.previousSibling;
            while(collection){
                if(collection.nodeType !== 3){
                    index++;
                }
                collection = collection.previousSibling;
            }
        }else{
            for(var i= 0, len = collection.length; i<len; i++){
                //console.log(collection[i], collection[i].nodeType)
                if(collection[i].nodeType !== 3){
                    index++;
                }
            }
        }
        return index
    },
    closest: function(dom, cls, untilEle){
        while(dom && dom!= untilEle){
            if(this.hasClass(dom, cls)){
                return dom;
            }else{
                dom = dom.parentNode;
            }
        }
        return null
    },
    getOffset: function(elem) {
        var top=0, left=0
        while(elem) {
            top = top + parseInt(elem.offsetTop);
            left = left + parseInt(elem.offsetLeft);
            elem = elem.offsetParent;
            width = document.body.clientWidth;
        }
        return {top: top, left: left,width: width};
    }
});

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

window.Dom = $;