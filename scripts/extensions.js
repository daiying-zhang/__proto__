/**
 * @fileOverview
 * @author daiying.zhang
 */
String.prototype.times = function (times){
    var res = this;
    for(var i = 0; i < times - 1; i++){
        res += this;
    }
    return times === 0 ? "" : res;
}