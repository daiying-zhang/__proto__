/**
 * @fileOverview
 * @author daiying.zhang
 */
(function(){
    var conlog = console.log,
        message,
        tmp,
        tmpMsg,
        log = function(msg){
            $('#log').show();
            $('#log-con').append('<li><b class="arrow"></b>' + msg + '</li>');
        };

    if($('#log').length === 0){
        $('<div id="log"><ul id="log-con"></ul></div>').appendTo('body')
    }

    $('#log').on('dblclick', function(){
        var $ul = $(this).find('ul');
        if($ul.find('li').length === 0){
            $(this).hide();
        }else{
            $(this).find('ul').empty();
        }
        return false
    }).on('mousedown', function(eve){
        //eve.preventDefault();
    })

    console.log = function(){
        message = [];
        conlog.apply(console, arguments);
        for(var i=0, len = arguments.length; i<len; i++){
            tmp = arguments[i];
            tmpMsg = '';
            if(typeof tmp === 'object'){
                Object.keys(tmp).forEach(function(val, idx){
                    tmpMsg += val + ": " + (typeof tmp[val] === 'string' ? '"' + tmp[val] + '"' : tmp[val]) + ', '
                })
                tmpMsg = tmpMsg.replace(/, $/,'');
                message.push('<i>Object</i> {' + (tmpMsg.length > 80 ? tmpMsg.substring(0, 80) + '...' : tmpMsg) + '}')
            }else{
                tmp = String(tmp);
                message.push(tmp.length > 80 ? tmp.substring(0, 80) + '...' : tmp)
            }
        };
        log(message.join('  '))
    };
})();
