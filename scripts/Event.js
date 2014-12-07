/**
 * @fileOverview
 * @author daiying.zhang
 */
(function (window) {
    window.Event = {
        _handels : {},
        /**
         * bind event
         * @param type
         * @param handel
         * @example
         *    eve.on('add remove', function(){//...})
         *    eve.on('click', function(){//...})
         */
        on : function(type, handel){
            if(typeof type !== 'string' || typeof handel !== 'function'){
                return
            }
            var hs,
                types = type.split(/\s+/),
                len = types.length,
                i = 0;

            for(; i<len; i++){
                hs = this._handels[types[i]];
                !hs && (hs = this._handels[types[i]] = []);
                hs.push(handel);
            }
        },
        /**
         * remove event handel
         * @param type
         * @param handel
         */
        off: function(type, handel) {
            //TODO
        },
        /**
         * trigger event
         * @param type
         * @example
         *    eve.trigger('click', param1, param2)
         *    eve.trigger('click', [param1, param2])
         */
        trigger : function(type){
            if(!type){return}
            var hs = this._handels[type], len, i = 0;
            if(hs && (len = hs.length)){
                for(; i<len; i++){
                    //todo 优化：不要每次循环都判断arguments
                    //todo 优化：第一个参数应为event
                    if(arguments.length === 2
                        && Object.prototype.toString.call(arguments[1]) === '[object Array]'){
                        hs[i].apply(this, arguments[1])
                    }else{
                        hs[i].apply(this, [].slice.call(arguments, 1))
                    }
                }
            }
        }
    }
})(this);


// var eve = new Event(document.body);
//
// eve.on('click', function(time){
//     console.log('sender ==>', this, 'time ==>', time)
// });
//
// eve.on('click', function(time, str){
//     console.log(str + ' ' + [time.getFullYear(), time.getMonth() + 1, time.getDate()].join('-'));
// });
//
// eve.trigger('click', new Date, 'Now ==>');
