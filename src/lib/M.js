/**
 * @fileOverview
 * @author daiying.zhang
 */
(function(window, undefined){
define(["lib/Event"],
    function(Event){
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
            var tmp, type, args = [].slice.call(arguments, 0), len = args.length, i = 2;
            // .extend(target, source, ...)
            if(typeof deep !== 'boolean'){
                //source = target;
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
                            if(/^(object|array)$/.test(type)){
                                target[key] = target[key] ? target[key] :
                                        type === 'object' ? {} : [];
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

        Mo.extend(Mo, {
            type: function(obj){
                return obj === null ? 'null' :
                    Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, '$1').toLowerCase()
            }
        });

        var Model = {
            initialize: function(){
                console.log('Model initialize...');
                return this
            },
            load: function(){

            },
            update: function(){

            },
            addItem: function(item){
                this.getList().push(item)
            },
            removeItem: function (index) {
                var list = this.getList();
                index = typeof index !== 'object' ? +index : list.indexOf(index);
                index && list.splice(index, 1, 0)
            },
            modifyItem: function() {

            },
            findById: function() {

            },
            selectAll: function() {
                return this.getList().concat()
            },
            clear: function(){
                this.getList().length = 0;
                return this
            },
            destroy: function() {

            }
        };

        Mo.extend(Model, {
            create: function(config){
                var _list = [];
                var model = Mo.extend(true, Object.create(Model), config || {});
                model._init(_list).initialize();
                return model
            },
            _init: function(_list){
                console.log('_init');
                return Mo.extend(this, {
                    getList: function () {
                        return _list
                    }
                });
            }
        }, Event);


        var View = {

        };

        var Controller = {
            initialize: function(){
                console.log('Model initialize...');
                return this
            }
        };

        Mo.extend(Controller, {
            create: function(view, model, config){
                var ctrl = Mo.extend(true, Object.create(Controller), config || {});
                ctrl._init(view, model).initialize();
                return ctrl
            },
            _init: function (view, model) {
                Mo.extend(this, {
                    getView: function () {
                        return view
                    },
                    getModel: function () {
                        return model
                    }
                });
                return this
            }
        })

        Mo.extend(Mo, {
            Model: Model,
            M: Model,
            View: View,
            V: View,
            Controller: Controller,
            C: Controller
        });

        return Mo
    })
})(window)

;(function(global, undefined){


    /*Mo.extend(global, {
        Model: M,
        M: M,
        View: V,
        V: V,
        Controller: C,
        C: C,
        Mo: Mo
    })

    global.Mo = Mo*/
})(window);