/**
 * @fileOverview
 * @author daiying.zhang
 */

(function(window){
    var TAB = "    ";
    var ed = document.getElementById('ed_bak');
    var ed_show = document.getElementById('ed');
    var domLN = document.getElementById('j-line-number');
    var typePanel = document.getElementById('j-eval-type');

    var jed = Dom('#j-editor')[0];
    var edtitle = Dom('#before')[0];

    ed.addEventListener('input', function(eve){
        onInput()
    });

    ed.addEventListener('paste', function(eve){
        //onInput()
    });

    ed.addEventListener('keydown', function(eve) {
        if(eve.keyCode === 13){

        }else if(eve.keyCode === 9){
            // tab key
            eve.preventDefault();

            //return
            ed.focus(); //This is very important.
            //var value = ed.value;
            var start = ed.selectionStart;
            var end = ed.selectionEnd;

            if(eve.shiftKey){
                return shiftTab(start, end)
            }else{
                return tab(start, end)
            }

            // set textarea value to: text before caret + tab + text after caret
            var con = ed.value.replace(/\t/g,"    ");
            // console.warn(start, end);
            ed.value = con.substring(0, start)
                        + "    "
                        + con.substring(end);

            // put caret at right position again
            ed.selectionStart =
                ed.selectionEnd = start + 4;

            onInput()
        }
    });

    /**
     * Shift + Tab key event
     * @param start
     * @param end
     */
    function shiftTab(start, end){
        var range = getLineRange(start, end);
        var lines = getLines();
        var startLine = range[0],
            endLine = range[1];

        //console.log("startLine = ", startLine, "endLine = ", endLine);

        for(var i = startLine; i <= endLine; i++){
            if(lines[i].match(/^ {4}/)){
                lines[i] = lines[i].replace(/^ {4}/,'');
            }
        }
        ed.value = lines.join('\n');
        ed.selectionStart = ed.selectionEnd = start - 4;
        onInput();
        return
    }

    /**
     * Tab key event
     * @param start
     * @param end
     */
    function tab(start, end){
        var range = getLineRange(start, end);
        var con = ed.value.replace(/\t/g,TAB);
        var lines = [], i = 0, len = 0;

        if(range[0] === range[1]){
            // 如果光标位置在一行, 当前位置插入空格
            ed.value = con.substring(0, start) + TAB + con.substring(end);
            ed.selectionStart = ed.selectionEnd = start + 4;
        }else{
            // 如果是多行，在每一行行首添加空格
            lines = getLines();
            len = range[1];
            i = range[0];
            for(; i<=len; i++){
                lines[i] = TAB + lines[i]
            }
            ed.value = lines.join('\n')
        }
        onInput()
    }

    /**
     * 根据光标的位置获取所在的行号
     * @param start
     * @param end
     * @returns {*[]}
     */
    function getLineRange(start, end){
        if(arguments.length !== 2){
            ed.focus(); //This is very important.
            start = ed.selectionStart;
            end = ed.selectionEnd;
        }

        var value = ed.value;
        var startLine = 0, endLine = 0, lastIndex = value.indexOf("\n", 0);
        while(lastIndex !== -1 && lastIndex < start){
            //console.log("lastIndex", lastIndex, start)
            startLine++;
            lastIndex = value.indexOf("\n", lastIndex + 1)
        }

        lastIndex = value.indexOf("\n", 0);

        while(lastIndex !== -1 && lastIndex < end){
            //console.log("lastIndex", lastIndex, start)
            endLine++;
            lastIndex = value.indexOf("\n", lastIndex + 1)
        }
        return [startLine, endLine]
    }

    function onInput(){
        //if(!eve.keyCode.toString().match(/(37|38|39|40)/)){
        //ed.innerHTML = ed.textContent.replace(/\n/g, '<br/>');
        //console.warn(ed.textContent.replace(/\n/g, '<br/>'));
        var tabSpace = "&nbsp;".times(4);
        //ed.value = ed.value.replace(/ /g, '0')
        ed_show.innerHTML = highlight(ed.value.replace(/ /g, "&nbsp;"))
            .replace(/\n/g, '<br/>')
            .replace(/<br\/?>$/, '<br/>&nbsp;')
            .replace(/\t/g, tabSpace)
        //.replace(/[\s ]/g, "&nbsp;")
        //ed.value = ed.value.replace(/ /g, '0')
        /*var range = document.createRange();
         var sel = window.getSelection();
         range.setStart(ed, ed.textContent + 1);
         range.collapse(true);
         sel.removeAllRanges();
         sel.addRange(range);*/
        setPos();
        setLineNumbers();
        //}
    }

    function setPos(eve){
        //console.log("ed.scrollTop", ed.scrollTop);
        //console.log("ed.scrollHeight", ed.scrollHeight, ed_show.scrollHeight)
        //if(!eve){
        //    // 如果eve为空 ==> 是手动调用setPos(), 处理最后一行
        //
        //    var range = getLineRange(), isSameLine = range[0] === range[1],
        //        isLast = isSameLine && range[1] === getLines().length;
        //
        //    console.log(range, getLines().length)
        //    if(isLast){
        //        console.log("isLast line....")
        //        ed.scrollTop = ed.scrollHeight
        //    }
        //}
        ed_show.scrollLeft = ed.scrollLeft;
        ed_show.scrollTop = ed.scrollTop;
        domLN.scrollTop = ed.scrollTop;
    }

    function getLines(){
        return ed.value.split(/\n/)
    }

    function setLineNumbers(){
        var lines = ed.value.split(/\n/);
        var i = 1, len = lines.length, html = ['<ul>'];
        for(; i<=len; i++){
            html.push('<li>' + i + '</li>')
        }
        html.push('</ul>');

        domLN.innerHTML = html.join('');
        //console.log("lines = ", lines.length)
    }

    ed.addEventListener('scroll', function(eve){
        setPos(eve)
    });

    onInput();


    document.getElementById('run').addEventListener('click', function(eve) {
        var err = function(eve) {
            alert(eve.message);
        };
        window.addEventListener('error', err);
        var code = document.getElementById('ed_bak').value;

        if($('#j-eval-type-closure')[0].checked){
            code = '(function(window){' + code + '})(this)'
        }
        //console.log("code = ", code)
        Dom.globalEval(code);
        window.removeEventListener('error', err);
        jed.style.display = 'none';
    });

    document.addEventListener('dblclick', function(eve){
        eve.preventDefault();
        var ed = jed;
        ed.style.display = ed.style.display === 'none' ? '' : 'none';
    });

    typePanel.addEventListener('click', function (eve){
        var target = eve.target, tagName = target.tagName;
        if(tagName === "LABEL"){
            target = target.getElementsByTagName('input')[0];
            tagName = "INPUT"
        }
        if(tagName === 'INPUT'){
            if(target.value === '0'){
                Dom.removeClass(Dom('#before')[0], 'clours');
                Dom.removeClass(Dom('#after')[0], 'clours')
            }else{
                Dom.addClass(Dom('#before')[0], 'clours');
                Dom.addClass(Dom('#after')[0], 'clours')
            }
        }
    });

    Dom('#ed_bak')[0].addEventListener('dblclick', function(eve){
        eve.preventDefault();
        eve.stopPropagation();
    });

    function highlight(str){
        var colors = [
            'color:#FFD177; /*font-weight:700*/',
            'color:#66d9ef',
            'color:rgb(9, 197, 9)',
            'color:red',
            'color:rgba(185,177,177,.8);/*font-style: italic;*/',
            'color:orange;'];
        var reg = /\b(document|body|alert|if|else|while|this|arguments)\b|(var|new|function|return|true|false)|([\"'].*?[\"'])|(\b[+-]?\d+(?:\.\d+)?)|(\/\/.*|\/\*[\s\S]*?\*\/)|(\?|:|\+\+|--|\+|-|\|{1,2}|={1,3}|\*=|\/=|\+=|-=)/g;
        var res = str.replace(reg, function(match){
            var args = [].slice.call(arguments,1);
            return '<span style="' + colors[args.indexOf(match)] + '">' + match + '</span>';
        });
        return res;
    }

    Dom.css(jed, {
        "left" : (document.body.offsetWidth - jed.offsetWidth) / 2 + "px",
        "top" : (document.body.offsetHeight - jed.offsetHeight) / 2 + "px"
    });

    Dom.drag(edtitle, true);

    edtitle.addEventListener('dblclick', function(eve){
        var isMaxed = Dom.data(edtitle, "isMaxed");
        if(isMaxed){
            var size = Dom.data(edtitle, 'size');
            Dom.data(edtitle, "isMaxed", false);
            Dom.css(jed, size);
        }else{
            Dom.data(edtitle, "isMaxed", true)
            Dom.data(edtitle, "size", {
                    "width": jed.offsetWidth + "px",
                    "height": jed.offsetHeight + "px",
                    "left": Dom.css(jed, "left"),
                    "top": Dom.css(jed, "top")
                }
            );
            Dom.css(jed, {
                    "width": "100%",
                    "height": "100%",
                    "left": "0",
                    "top": "0"
                }
            );
        }
        eve.stopPropagation()
    });
})(this);