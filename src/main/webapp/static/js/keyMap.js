var onClickCtrl=false;
$(window).keyup(function (e) {
    //backspace delete
    if(e.keyCode===8||e.keyCode===46){
        /*如果文本内容已div结尾,追加<br/>*/
        var content=$("#rich-body").html();
        var trimContent=$.trim(content);
        if(trimContent.lastIndexOf("</div>")>=0&&trimContent.lastIndexOf("</div>")>=(trimContent.length-6)){
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
        if(trimContent.lastIndexOf("</pre>")>=0&&trimContent.lastIndexOf("</pre>")>=(trimContent.length-6)){
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
        if(trimContent.lastIndexOf("</div>&nbsp;")>=0&&trimContent.lastIndexOf("</div>&nbsp;")>=(trimContent.length-12)){
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
        if(trimContent.lastIndexOf("</pre>&nbsp;")>=0&&trimContent.lastIndexOf("</pre>&nbsp;")>=(trimContent.length-12)){
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
    }
    //restoreSelection();
});

$(window).keydown(function (e) {
    //console.log(e);
    //Tab按键
    if (e.keyCode===9){
        e.preventDefault();
        document.execCommand("insertHtml",false,"&nbsp;&nbsp;&nbsp;&nbsp;");
    }
    //S按键
    if(e.keyCode===83&&onClickCtrl){
        e.preventDefault();
        saveDoc();
    }

    //Ctrl按键
    if (e.keyCode===17){
        onClickCtrl=true;
    }else{
        onClickCtrl=false;
    }
});

function saveDoc() {
    alert("save doc now");
}
