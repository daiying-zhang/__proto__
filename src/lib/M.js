/**
 * @fileOverview
 * @author daiying.zhang
 */
(function(window, undefined){
define(["lib/core","lib/Event"],
    function(Mo, Event){
        var Model = {
            initialize: function(){
                console.log('Model initialize...');
                return this
            },
            load: function(){
                // TODO load data from remote
            },
            update: function(){
                //TODO update remote
            },
            addItem: function(item){
                var len = this.getList().push(item);
                this.trigger('additem', [item, this.getList()]);
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