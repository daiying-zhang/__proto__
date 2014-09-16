/**
 * @fileOverview
 * @author daiying.zhang
 */
require(['lib/M'], function(Mo){
    // test extend
    /*var a0 = {'c':'c','d':1, 'f':[1,2,3]};
    var a1 = {arr:[1,2,3], func: function(){}};
    var a = Mo.extend(false, {'a':'a','b':'b'}, a0, a1);
    console.log(a)*/

    // test model
    var m = Mo.M.create({
        initialize: function(){ console.log('initialize :)'); }
     });
     console.dir(window.m = m)

    // test controller
    /*var c = Mo.Controller.create(null, null, {
        aaaa:'aaaa',
        initialize: function () {
            console.log(':(');
        }
    })
     console.dir(c)
    */

    window.Mo = Mo;
});