/**
 * @fileOverview
 * @author daiying.zhang
 */
define(function () {
    return {
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
         */
        trigger : function(type){
            if(!type){return}
            var hs = this._handels[type], len, i = 0;
            if(hs && (len = hs.length)){
                for(; i<len; i++){
                    //TODO the first params should be the event object
                    hs[i].apply(this, [].slice.call(arguments, 1))
                }
            }
        }
    }
})


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
