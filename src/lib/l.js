(function(global, undefined){
	global.l = global.$ = function(id){
		return document.getElementById(id);
	}

    function Light(selector){
        return new Light.fn.init(selector);
    }

    Light.prototype = Light.fn = {
        constructor: Light,
        init: function(selecotr){

        }
    }
})(window)
