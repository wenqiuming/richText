//全局变量
var before_pos = "";

///------------

$(document).ready(function () {
    $('[tooltip="true"]').tooltip({trigger: "hover ", placement: "bottom"});

    $(".dropdown-toggle").click(function () {
        setTimeout(function () {
            $('[tooltip="true"]').tooltip("hide");
        }, 300);
    });

    $("#rich-body").click(function (e) {
        determineMenuStyle();
    });
    $("#rich-body").keyup(function (e) {
        determineMenuStyle();
    });
});

function determineMenuStyle() {
    //获取光标像素位置
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var now_pos = range.getBoundingClientRect();
    var style = getCaretStyle();
    selectAlign(style.textAlign);
    if (!isSamePos(before_pos, now_pos)) {
        var bStyle = style.bold;
        //设置字号显示
        var fontSize = style.fontSize;
        $("#show_font_size").text(fontSize);
        //设置字色
        var fontColor = style.fontColor;
        $("#color-line").css({"background-color": '' + fontColor});
        //设置字体背景色
        var bgColor = style.bgcolor;
        $(".font-bg").css({"background-color": bgColor});
        //设置粗体
        if (style.bold) {
            $("#btn-bold").css({"background-color": '#CFEE91', 'color': "#fff"});
        } else {
            $("#btn-bold").css({"background-color": '#FFFFFF', 'color': "#333"});
        }
        //设置斜体
        if (style.italic) {
            $("#btn-italic").css({"background-color": '#CFEE91', 'color': "#fff"});
        } else {
            $("#btn-italic").css({"background-color": '#FFFFFF', 'color': "#333"});
        }
        //设置下划线
        if (style.underline) {
            $("#btn-underline").css({"background-color": '#CFEE91', 'color': "#fff"});
        } else {
            $("#btn-underline").css({"background-color": '#FFFFFF', 'color': "#333"});
        }
        //设置删除线
        if (style.strike) {
            $("#btn-strikethrough").css({"background-color": '#CFEE91', 'color': "#fff"});
        } else {
            $("#btn-strikethrough").css({"background-color": '#FFFFFF', 'color': "#333"});
        }
    }
}

function isSamePos(target_pos, orgin_pos) {
    if (target_pos == null) {
        return false;
    }
    if (target_pos.x == orgin_pos.x && target_pos.y == orgin_pos.y) {
        return true;
    } else {
        return false;
    }
}

function getFirst(elem) {
    for (var i = 0, e; e = elem.childNodes[i++];) {
        if (e.nodeType == 1)
            return e;
    }
    return null;
}

//设置标题类型
function headerStyle(ele) {
    setFocus();
    document.execCommand('formatBlock', false, '<' + ele + '>');
}

//设置字号 1~7
function fontSizeStyle(size) {
    setFocus();
    document.execCommand('fontSize', 'false', size);
    $("#show_font_size").text(size);
    before_pos = getBeforePos();
}

//设置字体前景色
function fontColorStyle(color) {
    setFocus();
    document.execCommand('foreColor', 'false', color);
    $("#color-line").css({"background-color": '' + color});
    before_pos = getBeforePos();
}

//设置字体背景色
function fontBgColorStyle(color) {
    setFocus();
    document.execCommand('hiliteColor', true, color);
    $(".font-bg").css({"background-color": color});
    before_pos = getBeforePos();
}

//设置字体样式 加粗/斜体/下划线/删除线
function fontStyle(type) {
    setFocus();
    document.execCommand(type, false, null);
    var bgFlag = $("#btn-" + type.toLowerCase()).css("background-color");
    if (bgFlag && bgFlag == 'rgb(207, 238, 145)') {
        $("#btn-" + type.toLowerCase()).css({"background-color": '#FFFFFF', 'color': "#333"});
    } else {
        $("#btn-" + type.toLowerCase()).css({"background-color": '#CFEE91', 'color': "#ffffff"});
    }

    before_pos = getBeforePos();
}

//清除样式
function clearFontStyle() {
    setFocus();
    document.execCommand("RemoveFormat", false, null);
    $("#btn-clearFontStyle").css({"background-color": "#ffffff"});
}

//对光标插入位置或所选内容进行文字居中/左对齐/右对齐
function justifyAlign(asign) {
    setFocus();
    document.execCommand("justify" + asign.substring(0, 1).toUpperCase() + asign.substring(1), false, null);
    selectAlign(asign);
}

//段落
//在插入点或选中文字上创建一个有序列表
function insertList(isOrder) {
    if (isOrder) {
        document.execCommand("insertOrderedList", false, null);
    } else {
        document.execCommand("insertUnorderedList", false, null);
    }
}


function setFocus() {
    el = document.getElementById('rich-body');
    //el=el[0];  //jquery 对象转dom对象
    el.focus();
    // if ($.support.msie) {
    //     var range = document.selection.createRange();
    //     this.last = range;
    //     range.moveToElementText(el);
    //     range.select();
    //     document.selection.empty(); //取消选中
    // }
    // else {
    //     var range = document.createRange();
    //     range.selectNodeContents(el);
    //     range.collapse(false);
    //     var sel = window.getSelection();
    //     sel.removeAllRanges();
    //     sel.addRange(range);
    // }
}

function loseRange() {
    var sel = window.getSelection();
    sel.removeAllRanges();
}

function isSelected() {
    var userSelection;
    if (window.getSelection) { //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (userSelection.getRangeAt) {
        var range = userSelection.getRangeAt(0);
        var documentFragment = range.cloneContents();
        var select_htmlText = documentFragment.textContent;
        if (select_htmlText && select_htmlText.length > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        alert("当前浏览器不支持getRangeAt");
        return false;
    }
}

function clipSelected(isDiv, styleName, styleValue) {
    var userSelection;
    if (window.getSelection) { //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (userSelection.getRangeAt) {
        var range = userSelection.getRangeAt(0);
        var documentFragment = range.extractContents();
        var select_htmlText = documentFragment.textContent;
        var childNodes = documentFragment.childNodes;
        var htmlNode;
        if (isDiv) {
            htmlNode = document.createElement("div");
        } else {
            htmlNode = document.createElement("span");
        }
        $(htmlNode).css('' + styleName, '' + styleValue);
        for (var i = 0; childNodes.length > 0; i++) {
            var insertChild = childNodes[0];
            setAllStyle(insertChild, styleName, styleValue);
            $(htmlNode).append(insertChild);
        }
        $(htmlNode).append("&zwnj;");
        range.insertNode(htmlNode);
    } else {
        alert("当前浏览器不支持getRangeAt");
    }
}

function setAllStyle(ele, styleName, styleValue) {
    var childs = ele.childNodes;
    $(ele).css('' + styleName, '' + styleValue);
    if (childs.length > 0) {
        for (var i = 0; i < childs.length; i++) {
            setAllStyle(childs[i], styleName, styleValue);
        }
    }
}

function getRangeHtml() {
    var userSelection;
    if (window.getSelection) { //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (userSelection.getRangeAt) {
        var range = userSelection.getRangeAt(0);
        var documentFragment = range.cloneContents();
        if (documentFragment.childNodes && documentFragment.childNodes.length > 0) {
            var htmlStr = "";
            for (var i = 0; i < documentFragment.childNodes.length; i++) {
                var childNode = documentFragment.childNodes[i];
                if (childNode.localName) {
                    htmlStr += "<" + childNode.localName + ">" + childNode.innerHTML + "</" + childNode.localName + ">";
                } else {
                    htmlStr += "<div>" + childNode.nodeValue + "</div>";
                }
            }
            return htmlStr;
        } else {
            var select_htmlText = documentFragment.textContent;
            return select_htmlText;
        }
    } else {
        alert("当前浏览器不支持getRangeAt");
        return "";
    }
}

function setTextTailSelection() {
    var selection;
    if (window.getSelection) { //现代浏览器
        selection = window.getSelection();
    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
        selection = document.selection.createRange();
    }
    // 如果是文本节点则先获取光标对象
    var range = selection.getRangeAt(0);
    // 获取光标对象的范围界定对象，一般就是textNode对象
    var textNode = range.startContainer;
    // 获取光标位置
    var rangeEndOffset = range.endOffset;
    // 光标移动到到原来的位置加上新内容的长度
    range.setStart(textNode, rangeEndOffset+1);
    // 光标开始和光标结束重叠
    range.collapse(true);
    // 清除选定对象的所有光标对象
    selection.removeAllRanges();
    // 插入新的光标对象
    selection.addRange(range);
}

function keepLastIndex(obj) {
    if (window.getSelection) {//ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection();//创建range
        range.selectAllChildren(range.focusNode.parentNode);//range 选择obj下所有子内容
        range.collapseToEnd();//光标移至最后
    }
    else if (document.selection) {//ie10 9 8 7 6 5
        var range = document.selection.createRange();//创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(range.focusNode.parentNode);//range定位到obj
        range.collapse(false);//光标移至最后
        range.select();
    }
}


//获取当前光标所在处样式
function getCaretStyle() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var aimEle = range.commonAncestorContainer;
    var tempEle = null;
    var tags = ["U", "I", "B", "STRIKE", "FONT"],
        result = [];
    if (aimEle.nodeType === 3) {
        aimEle = aimEle.parentNode;
    }
    tempEle = aimEle;
    var block = ["div", "p", "h1", "h2", "h3", "h4"];
    var fontSize = 2;
    var fontColor = "#333333";
    var bgcolor = "#ffffff";
    var textAlign = "left";
    while (block.indexOf(tempEle.nodeName.toLowerCase()) === -1) {
        var style = $(tempEle).attr("style");
        if (style && style.indexOf("background-color") !== -1) {
            bgcolor = $(tempEle).css("background-color");
        }
        if (tags.indexOf(tempEle.nodeName) !== -1) {
            if ("FONT".indexOf(tempEle.nodeName) !== -1) {
                var fontSizeStyle = $(tempEle).attr("size");
                var fontColorStyle = $(tempEle).attr("color");
                if (fontSizeStyle) {
                    fontSize = fontSizeStyle;
                }
                if (fontColorStyle) {
                    fontColor = fontColorStyle;
                }
            } else {
                result.push(tempEle.nodeName);
            }
        }
        tempEle = tempEle.parentNode;
        var ta = $(tempEle).css("text-align");
        if (ta) {
            textAlign = ta;
        }
    }
    var outTa = $(tempEle).css("text-align");
    if (outTa) {
        textAlign = (outTa == 'start' ? 'left' : outTa);
    }
    var viewStyle = {
        "italic": result.indexOf("I") !== -1 ? true : false,
        "underline": result.indexOf("U") !== -1 ? true : false,
        "bold": result.indexOf("B") !== -1 ? true : false,
        "strike": result.indexOf("STRIKE") !== -1 ? true : false,
        "bgcolor": bgcolor,
        "fontSize": fontSize,
        "fontColor": fontColor,
        "textAlign": textAlign
    }
    return viewStyle;
}

function getBeforePos() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var before_pos = range.getBoundingClientRect();
    return before_pos;
}

function selectAlign(asign) {
    $("#btn-align-" + asign).css({"background-color": "#ccc"});
}

function insertBlockquoteStyle() {
    var selectiveHtml = getRangeHtml();
    if ($.trim(selectiveHtml) === '') {
        selectiveHtml = "&zwnj;";
    }
    var codeStr = "<div class='blockquote-body' contenteditable='true'>" + selectiveHtml + "</div><br/>";
    document.execCommand("insertText", false, "\r\n");
    document.execCommand("insertHtml", false, codeStr);
}

function insertCodeStyle() {
    var selectiveHtml = getRangeHtml();
    if ($.trim(selectiveHtml) === '') {
        selectiveHtml = "<div>&zwnj;</div>";
    }
    var codeStr = "<pre class='prettyprint' contenteditable='true'>" + selectiveHtml + "</pre><br/>";
    document.execCommand("insertText", false, "\r\n");
    document.execCommand("insertHtml", false, codeStr);
    $(".prettyprint").removeClass("prettyprinted");
    prettyPrint();
}

//bootstrap icon初始化
var settings = {
    clickIconEvent: clickIcon
};

function clickIcon(val) {
    var emoji = "<span class='" + val + "' contenteditable='false'></span>";
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    //取得光标所在的容器节点
    var anchorNode = selection.anchorNode;
    //获取光标容器的上级容器
    var parentNode = anchorNode.parentNode;
    //如果容器文本节点
    if (anchorNode.nodeType === 3) {
        var splitIndex = selection.anchorOffset;
        var textBefore = "";
        var textAfter = "";
        if (anchorNode.nodeValue.length > 0) {
            textBefore = anchorNode.nodeValue.substr(0, splitIndex);
            textAfter = anchorNode.nodeValue.substr(splitIndex);
        }
        var realHtml = textBefore + emoji + textAfter;
        var newEle = document.createElement("span");
        newEle.innerHTML = realHtml;
        //插入新节点
        parentNode.insertBefore(newEle, anchorNode);
        //删除旧节点
        anchorNode.remove();
        return;
    } else {//容器节点为块元素
        //获取光标节点下标
        var nodeIndex = selection.anchorOffset;
        //新增节点
        var eleSpan = $(emoji)[0];
        if(nodeIndex===0){
           anchorNode.insertBefore(eleSpan,anchorNode.childNodes[nodeIndex]);
        }else{
            insertAfter(eleSpan,anchorNode.childNodes[nodeIndex-1]);
        }
    }
    //设置光标
    setTextTailSelection();
}

function insertAfter(newEl, targetEl) {
    var parentEl = targetEl.parentNode;

    if (parentEl.lastChild === targetEl) {
        parentEl.appendChild(newEl);
    }
    else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}

$("#txt_boostrap_icon").iconPicker(settings);



