var onClickCtrl = false;
$(window).keyup(function (e) {
    //backspace delete
    if (e.keyCode === 8 || e.keyCode === 46) {
        /*如果文本内容已div结尾,追加<br/>*/
        var content = $("#rich-body").html();
        var trimContent = $.trim(content);
        if (trimContent.lastIndexOf("</div>") >= 0 && trimContent.lastIndexOf("</div>") >= (trimContent.length - 6)) {
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
        if (trimContent.lastIndexOf("</pre>") >= 0 && trimContent.lastIndexOf("</pre>") >= (trimContent.length - 6)) {
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
        if (trimContent.lastIndexOf("</div>&nbsp;") >= 0 && trimContent.lastIndexOf("</div>&nbsp;") >= (trimContent.length - 12)) {
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
        if (trimContent.lastIndexOf("</pre>&nbsp;") >= 0 && trimContent.lastIndexOf("</pre>&nbsp;") >= (trimContent.length - 12)) {
            $("#rich-body").append("<p>&zwnj;</p>");
            return;
        }
    }
    //restoreSelection();
});

$(window).keydown(function (e) {
    //console.log(e);
    //Tab按键
    if (e.keyCode === 9) {
        e.preventDefault();
        document.execCommand("insertHtml", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
    //S按键
    if (e.keyCode === 83 && onClickCtrl) {
        e.preventDefault();
        saveDoc();
    }

    //Ctrl按键
    if (e.keyCode === 17) {
        onClickCtrl = true;
    } else {
        onClickCtrl = false;
    }
    //Enter
    if (e.keyCode === 13) {
        e.preventDefault();
        var rootNode = $("#rich-body")[0];
        var selection = window.getSelection ? window.getSelection() : document.getSelection();
        var anchorNode = selection.anchorNode;
        console.log(selection);
        var rootBelow;
        if (rootNode === anchorNode) {
            if (rootNode.childNodes.length<selection.anchorOffset+1){
                rootBelow = anchorNode.childNodes[selection.anchorOffset];
            }else{
                rootBelow = anchorNode.childNodes[selection.anchorOffset-1];
            }
        } else {
            rootBelow = findRootBelow(anchorNode);
        }
        var lineNode = $("<div></div>")[0];
        //文本
        if (rootBelow.nodeType === 3) {
            $(lineNode).text(rootBelow.textContent);
        } else if (rootBelow.localName==("div")){
           lineNode=$(rootBelow.outerHTML)[0];
        }else if (rootBelow.localName==("br")){
            $(lineNode).html("&zwnj;");
        }

        var brNode = $("<br/>")[0];
        rootNode.insertBefore(lineNode, rootBelow);
        rootNode.insertBefore(brNode, rootBelow);
        rootBelow.remove();
        //设置光标
        //setTextTailSelection();
    }
});

function findRootBelow(node) {
    var rootNode = $("#rich-body")[0];
    if (node.parentNode === rootNode) {
        return node;
    } else {
        return findRootBelow(node.parentNode);
    }
}

function saveDoc() {
    alert("save doc now");
}
