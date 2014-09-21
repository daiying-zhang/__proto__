/**
 * @fileOverview
 * @author daiying.zhang
 */
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
    //if(!eve.keyCode.toString().match(/(37|38|39|40)/)){
        //ed.innerHTML = ed.innerHTML.replace(/<br.*>/g, '\n').replace(/<.*>/g, '');
        ed_show.innerHTML = highlight(ed.innerHTML);

        /*var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(ed, ed.textContent + 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);*/
        setPos()
    //}
});

ed.addEventListener('keydown', function(eve) {
    if(eve.keyCode === 13){

    }else if(eve.keyCode === 9){
        //alert('tab');
        eve.preventDefault();


        return
        var start = ed.selectionStart;
        var end = ed.selectionEnd;
        // set textarea value to: text before caret + tab + text after caret
        var con = ed.textContent;
        console.warn(start, end)
        ed.textContent = con.substring(0, start)
            + "    "
            + con.substring(end);

        // put caret at right position again
        ed.selectionStart =
            ed.selectionEnd = start + 1;
    }
});

function setPos(){
    ed_show.scrollLeft = ed.scrollLeft;
    ed_show.scrollTop = ed.scrollTop;
}
ed.addEventListener('scroll', function(eve){
    setPos()
});
