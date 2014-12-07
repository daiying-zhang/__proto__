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
};

function highlight(str){
    var colors = [
        'color:#9CE732; /*font-weight:700*/',
        'background:#2C4734;font-style: italic;font-weight:700*/',
        'color:rgb(9, 197, 9)',
        'color:red',
        'color:rgba(185,177,177,.8);/*font-style: italic;*/',
        'color:orange;'];
    var reg = /\b(document|body|alert|var|this|new|return|if|else|while|true|false|function|arguments)\b|(console\.(?:log|dir|warn|error))|([\"'].*?[\"'])|(\b[+-]?\d+(?:\.\d+)?)|(\/\/.*|\/\*[\s\S]*?\*\/)|(\?|:|\+\+|--|\+|-|\|{1,2}|={1,3}|\*=|\/=|\+=|-=)/g;
    var res = str.replace(reg, function(match){
        var args = [].slice.call(arguments,1);
        return '<span style="' + colors[args.indexOf(match)] + '">' + match + '</span>';
    });
    return res;
}

var ed = document.getElementById('ed_bak');
var ed_show = document.getElementById('ed');
ed.addEventListener('input', function(eve){
    onInput()
});

ed.addEventListener('paste', function(eve){
});

ed.addEventListener('keydown', function(eve) {
    if(eve.keyCode === 13){

    }else if(eve.keyCode === 9){
        //alert('tab');
        eve.preventDefault();


        //return
        ed.focus(); //This is very important.
        var start = ed.selectionStart;
        var end = ed.selectionEnd;
        // set textarea value to: text before caret + tab + text after caret
        var con = ed.value.replace(/\t/g,"    ");
        console.warn(start, end)
        ed.value = con.substring(0, start)
            + "    "
            + con.substring(end);

        // put caret at right position again
        ed.selectionStart =
            ed.selectionEnd = start + 4;

        onInput()
    }
});

function onInput(){
    //if(!eve.keyCode.toString().match(/(37|38|39|40)/)){
        //ed.innerHTML = ed.textContent.replace(/\n/g, '<br/>');
        //console.warn(ed.textContent.replace(/\n/g, '<br/>'));
        var tabSpace = "&nbsp;".times(4);
        ed_show.innerHTML = highlight(ed.value.replace(/ /g, "&nbsp;"))
            .replace(/\n/g, '<br/>')
            .replace(/<br\/?>$/, '<br/>&nbsp;')
            .replace(/\t/g, tabSpace)
            //.replace(/[\s ]/g, "&nbsp;")

        /*var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(ed, ed.textContent + 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);*/
        setPos()
    //}
}

function setPos(){
    ed_show.scrollLeft = ed.scrollLeft;
    ed_show.scrollTop = ed.scrollTop;
}
ed.addEventListener('scroll', function(eve){
    setPos()
});
