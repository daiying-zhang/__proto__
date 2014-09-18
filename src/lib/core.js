/**
 * @fileOverview
 * @author daiying.zhang
 */
define(['lib/var/toString'], function(toString) {
    function Mo(){

    }

    Mo.prototype = Mo.fn = {
        constructor: Mo,
        initialize: function(){

        }
    };

    /**
     * extend
     * @param deep
     * @param target
     * @param source
     * @returns {*}
     */
    Mo.extend = function(deep, target, source/*, source1, source2, ...*/){
        var tmp,
            type,
            isArray,
            isBool = typeof deep === 'boolean',
            args = [].slice.call(arguments, 0),
            len = args.length,
            i = 2;
        // .extend(object)        or .extend(true|false, object)
        if((len === 1 && !isBool) || (len === 2 && isBool)){
            target = this;
            deep = len === 1 ? false : deep;
            i = len - 1;
        // .extend(target, source, ...)
        }else if(!isBool){
            target = deep;
            deep = false;
            i = 1;
        }

        for(; i<len; i++){
            source = args[i];
            for(var key in source){
                // deep clone
                if(deep){
                    if(source.hasOwnProperty(key)){
                        type = Mo.type(tmp = source[key]);
                        isArray = Mo.isArray(tmp);
                        if(/^(object|array)$/.test(type)){
                            target[key] = target[key] ? target[key] :
                                    isArray ? [] : {};
                            Mo.extend(true, target[key] , tmp)
                        }else{
                            target[key] = tmp
                        }
                    }
                }else{
                    if(source.hasOwnProperty(key)){
                        target[key] = source[key]
                    }
                }
            }
        }
        return target
    };

    Mo.extend({
        type: function(obj){
            return obj === null ? 'null' :
                toString.call(obj).replace(/^\[object (\w+)\]$/, '$1').toLowerCase()
        },
        isArray: function(obj) {
            return Mo.type(obj) === 'array'
        },
        ifFunction: function(obj) {
            return Mo.type(obj) === 'function'
        }
    });

    return Mo
});