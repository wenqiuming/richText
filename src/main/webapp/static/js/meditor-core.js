/**
 * 富文本主体
 **/
const rootNode = $(".meditor-body")[0];
/**
 * 光标位置
 * @type {{}}
 */
var position = {};

var titleType = ["H1", "H2", "H3", "H4", "SECTION"];
var titleName = ["H1", "H2", "H3", "H4", "正文"];
var fontList = [1, 2, 3, 4, 5, 6, 7];
var fontSizeList = [12, 14, 16, 18, 20, 22, 24];
var breakActiveDiv;

/*key down function */
$(window).keydown(function (e) {
    // console.log(e.keyCode);
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    //判断是否行内元素
    var existLine = $(e.target).parents(".line-div");
    if (existLine.length === 0 && !$(e.target).hasClass("line-div")) {
        return;
    }
    breakActiveDiv = findLineDiv(anchorNode);
});


/**
 * key up function
 */
$(window).keyup(function (e) {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    //判断是否行内元素
    var existLine = $(anchorNode).parents(".line-div");
    if (existLine.length === 0 && !$(anchorNode).hasClass("line-div")) {
        return;
    }
    if (e.keyCode === 8) {
        if (rootNode.childNodes.length === 0) {
            var lineNode = $("<div class='line-div' p-line-height='{0}'><br/></div>".format($("#show-line-height").text()))[0];
            $(rootNode).append(lineNode);
            selection.collapse(lineNode, 0);
        }
    }
    //最后空留一行
    if (rootNode.childNodes[rootNode.childNodes.length - 1].outerHTML != '<div class="line-div"><br></div>') {
        var lastLineNode = $("<div class='line-div'><br/></div>")[0];
        $(rootNode).append(lastLineNode);
    }
    //enter 换行
    if (e.keyCode === 13) {
        //列表样式不做处理
        if (anchorNode.localName === 'li') {
            return;
        }
        //代码块不处理
        if (findLineDivBelow(anchorNode) !== null && findLineDivBelow(anchorNode).nodeType === 1 && findLineDivBelow(anchorNode).localName === 'pre') {
            return;
        }
        var lineDiv = findLineDiv(anchorNode);
        if (breakActiveDiv === lineDiv) {
            //一个line-div出现行元素大于1,移除该line-div中的后一个,新增line-div,内容为后一个行元素
            if (lineDiv.childNodes.length > 1 && lineDiv.childNodes[0].nodeType === 1 && titleType.indexOf(lineDiv.childNodes[0].localName.toUpperCase()) >= 0) {
                var newLineDiv = $("<div class='line-div'></div>")[0];
                newLineDiv.appendChild(lineDiv.childNodes[1]);
                insertAfter(newLineDiv, lineDiv);
                selection.collapse(lineDiv.nextSibling, 0);
                return;
            }
        }
        //如果没有行距样式，默认给予目前选定的行距
        var nowLine = findLineDiv(anchorNode);
        if ($(nowLine).attr("p-line-height") === undefined) {
            $(nowLine).attr("p-line-height", $("#show-line-height").text());
        }
    }
    //动态标题样式显示
    if (isRootNodeActive(e.target)) {
        dynamicModHeaderShow();
        dynamicModFontShow();
        dynamicModFontColorShow();
        dynamicModFontBackColorShow();
        dynamicModFontCssShow();
        dynamicModJustifyShow();
        dynamicModLineHeightShow();
    }
});


/**
 * mouse click function
 */
$(window).click(function (e) {
    var node = document.getElementsByClassName("icon-popup");
    var iconNode = document.getElementById("txt_boostrap_icon");
    //表情框出现隐藏控制
    if (e.target === iconNode || iconNode.contains(e.target)) {
    } else {
        if (node.length > 0 && e.target !== node[0] && !node[0].contains(e.target)) {
            node[0].remove();
        }
    }
    //判断是否行内元素
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var lineDiv = $(anchorNode).parents(".line-div");
    if (lineDiv.length === 0&& !$(e.target).hasClass("line-div")) {
        return;
    }
    if (isRootNodeActive(e.target)) {
        dynamicModHeaderShow();
        dynamicModFontShow();
        dynamicModFontColorShow();
        dynamicModFontBackColorShow();
        dynamicModFontCssShow();
        dynamicModJustifyShow();
        dynamicModLineHeightShow();
    }
});

/**
 * find the node below the root node
 * @param node focus node
 * @returns {*}
 */
function findRootBelow(node) {
    if (node.parentNode === rootNode) {
        return node;
    } else {
        return findRootBelow(node.parentNode);
    }
}

/***
 * find a line div by self or childNode
 * @param node
 * @returns {*}
 */
function findLineDiv(node) {
    if ($(node).hasClass("line-div")) {
        return node;
    } else {
        return findLineDiv(node.parentNode);
    }
}

/**
 * find line div direct childNode
 * @param node
 * @returns {*}
 */
function findLineDivBelow(node) {
    if ($(node).hasClass("line-div")) {
        if (node.childNodes.length === 0) {
            return null;
        } else {
            return node.childNodes[0];
        }
    }
    if ($(node.parentNode).hasClass("line-div")) {
        return node;
    } else {
        return findLineDivBelow(node.parentNode);
    }
}

/**
 * return the index of node in it`s parentNode childNodes postion
 * @param node
 * @param parentNode
 * @returns {number}
 */
function getPosInParentNode(node, parentNode) {
    for (var i = 0; i < parentNode.childNodes.length; i++) {
        if (node === parentNode.childNodes[i]) {
            return i;
        }
    }
    return -1;
}


/**
 * 为新父节点新增childNodes
 * childNodes为旧父节点索引后所有子节点
 * @param newParentNode
 * @param parentNode
 * @param index
 */
function fillChildAterIndex(newParentNode, parentNode, index) {
    var childLength = parentNode.childNodes.length;
    if (index + 1 > childLength) {
        return;
    }
    for (var i = index + 1; i < childLength; i++) {
        var cloneNode = parentNode.childNodes[i].cloneNode(true);
        newParentNode.appendChild(cloneNode);
    }
}

/**
 * 在某个节点后插入兄弟节点
 * @param newEl
 * @param targetEl
 */
function insertAfter(newEl, targetEl) {
    var parentEl = targetEl.parentNode;

    if (parentEl.lastChild === targetEl) {
        parentEl.appendChild(newEl);
    }
    else {
        parentEl.insertBefore(newEl, targetEl.nextSibling);
    }
}

/**
 * 在兄弟节点前面插入节点
 * @param newEl
 * @param targetEl
 */
function insertBefore(newEl, targetEl) {
    var parentEl = targetEl.parentNode;
    parentEl.insertBefore(newEl, targetEl);
}

/**
 * 判断是否行尾节点
 * @param anchorNode
 * @param offset
 * @returns {boolean}
 */
function isLineEnd(anchorNode, offset) {
    var lineDiv = findLineDiv(anchorNode);
    if (lineDiv.length === 0) return true;
    if (anchorNode.nodeType === 3 && anchorNode.textContent.length > offset) {
        return false;
    }
    return isEndChild(anchorNode, anchorNode.parentNode);
}

/**
 * 判断是否行头
 * @param anchorNode
 * @param offset
 * @returns {boolean}
 */
function isLineStart(anchorNode, offset) {
    if (offset > 0) {
        return false;
    }
    return isFirstChild(anchorNode, anchorNode.parentNode);
}

/**
 * 判断是否是父节点的最后子节点
 * @param node
 * @param parentNode
 * @returns {boolean}
 */
function isEndChild(node, parentNode) {
    if (parentNode.parentNode !== rootNode) {
        var result = parentNode.lastChild === node;
        if (!result) {
            return false;
        } else {
            return isEndChild(node.parentNode, parentNode.parentNode);
        }
    }
    return parentNode.lastChild === node;
}

function isFirstChild(node, parentNode) {
    if (parentNode.parentNode !== rootNode) {
        var result = parentNode.firstChild === node;
        if (!result) {
            return false;
        } else {
            return isFirstChild(node.parentNode, parentNode.parentNode);
        }
    }
    return parentNode.firstChild === node;
}


/*  font style list  */

//设置标题类型
/**
 * 顶层结构,整行修改
 * @param ele
 */
function headerStyle(ele) {
    setFocus();
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var lineDiv = findLineDiv(anchorNode);
    savePos();
    var tag = $("<{0}>".format(ele))[0];
    var lineBelow = findLineDivBelow(anchorNode);
    //行元素木有子节点
    if (lineBelow === null) {
        $(tag).html("<br/>");
        $(lineDiv).html(tag.outerHTML);
    } else {
        lineBelow = buildLineBelowContainer(lineBelow);
        //已经是标题类型
        if (lineBelow.nodeType === 1 && titleType.indexOf(lineBelow.tagName) >= 0) {
            mvChildNode(tag, lineBelow);
            removeAllChildNode(lineDiv);
            lineDiv.appendChild(tag);
        } else {
            //已经是正文格式,不处理
            if (lineBelow.nodeType === 1 && lineBelow.tagName.toLowerCase() === ele) {
            } else {
                tag.appendChild(lineBelow);
                lineDiv.appendChild(tag);
            }
        }
        restorePos();
    }
    //set header name show
    var titleIndex = titleType.indexOf(ele.toUpperCase());
    $(".meditor-header .header-name").text(titleName[titleIndex]);
}

//设置字体大小
//分2种情况,有选中文字,没选中文字
function fontSizeStyle(size) {
    setFocus();
    console.log(fontList[fontSizeList.indexOf(size)]);
    document.execCommand('fontSize', false, fontList[fontSizeList.indexOf(size)]);
    $("#show_font_size").text(size);
}


/**
 * 获取子节点位于父节点的下标
 * @param node
 * @param parentNodes
 * @returns {number}
 */
function getChildIndex(node, parentNodes) {
    for (var i = 0; i < parentNodes.childNodes.length; i++) {
        if (parentNodes.childNodes[i] === node) {
            return i;
        }
    }
    return -1;
}

/**
 * focus editor body
 */
function setFocus() {
    el = $(".meditor-body")[0];
    el.focus();
}

function savePos() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    position = {
        parentNode: anchorNode,
        offset: selection.anchorOffset
    };
    if (!selection.isCollapsed) {
        position = {
            parentNode: selection.focusNode,
            offset: selection.focusOffset
        };
    }
}

function restorePos() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    selection.collapse(position.parentNode, position.offset);
}

/**
 * 字符串占位符格式化
 * @returns {String}
 */
String.prototype.format = function () {
    if (arguments.length === 0) return this;
    var param = arguments[0];
    var s = this;
    if (typeof(param) == 'object') {
        for (var key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    } else {
        for (var i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
};

/**
 * 动态显示标题类型
 */
function dynamicModHeaderShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var lineBelow = findLineDivBelow(anchorNode);
    var $headerNameShow = $(".meditor-header .header-name");
    if (lineBelow === null) {
        //set header name show
        $headerNameShow.text("正文");
    } else {
        if (lineBelow.nodeType !== 1) {
            $headerNameShow.text("正文");
        } else {
            var titleIndex = titleType.indexOf(lineBelow.tagName.toUpperCase());
            if (titleIndex < 0) {
                $headerNameShow.text("正文");
            } else {
                $headerNameShow.text(titleName[titleIndex]);
            }
        }
    }
}

/**
 * 动态显示字体大小类型
 */
function dynamicModFontShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    if (selection.isCollapsed) {
        var anchorNode = selection.anchorNode;
        var selfSize = $(anchorNode).attr("size");
        if (selfSize !== undefined) {
            $("#show_font_size").text(fontSizeList[fontList.indexOf(selfSize)]);
            return;
        }
        var parents = $(anchorNode).parents("font[size]");
        if (parents.length === 0) {
            $("#show_font_size").text("14");
        } else {
            var size = $(parents[0]).attr("size");
            $("#show_font_size").text(fontSizeList[fontList.indexOf(selfSize)]);
        }
    }
}

/**
 * 动态显示字体颜色类型
 */
function dynamicModFontColorShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    if (selection.isCollapsed) {
        var anchorNode = selection.anchorNode;
        var color = $(anchorNode).attr("color");
        if (color !== undefined) {
            $("#color-line").css({"background-color": '' + color});
            return;
        }
        color = "#333333";
        var parents = $(anchorNode).parents("font[color]");
        if (parents.length === 0) {
            $("#color-line").css({"background-color": '' + color});
        } else {
            color = $(parents[0]).attr("color");
            $("#color-line").css({"background-color": '' + color});
        }
    }
}

/**
 * 动态显示字体背景颜色类型
 */
function dynamicModFontBackColorShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    if (selection.isCollapsed) {
        var anchorNode = selection.anchorNode;
        //var st=getComputedStyle($(anchorNode)[0],"background-color");
        if (anchorNode.nodeType === 1 && anchorNode.localName === 'span') {
            var color = $(anchorNode).css("background-color");
            if (color !== undefined && color != 'rgba(0, 0, 0, 0)') {
                $(".font-bg").css({"background-color": color});
                return;
            }
        }
        color = "#FFFFFF";
        //获取带有style属性的span父节点
        var spanParents = $(anchorNode).parents("span[style]");
        if (spanParents.length === 0) {
            $(".font-bg").css({"background-color": '' + color});
            return;
        }
        var parents = [];
        //帅选出带有background-color属性的父节点
        for (var i = 0; i < spanParents.length; i++) {
            var styleCss = $(spanParents[i]).attr("style");
            if (styleCss.indexOf("background-color") >= 0) {
                parents.push(spanParents[i]);
            }
        }
        if (parents.length === 0) {
            $(".font-bg").css({"background-color": '' + color});
        } else {
            color = $(parents[0]).css("background-color");
            $(".font-bg").css({"background-color": '' + color});
        }
    }
}

/**
 * 动态显示文字样式类型
 */
function dynamicModFontCssShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    if (selection.isCollapsed) {
        var anchorNode = selection.anchorNode;
        //b
        var $bbtn = $("#btn-bold");
        if (anchorNode.nodeType === 1 && anchorNode.localName === 'b') {
            $bbtn.addClass("font-style-active");
        }
        var parents = $(anchorNode).parents("b");
        if (parents.length === 0 && parents.context.localName !== 'b') {
            $bbtn.removeClass("font-style-active");
        } else {
            $bbtn.addClass("font-style-active");
        }
        //i
        var $ibtn = $("#btn-italic");
        if (anchorNode.nodeType === 1 && anchorNode.localName === 'i') {
            $ibtn.addClass("font-style-active");
        }
        var iparents = $(anchorNode).parents("i");
        if (iparents.length === 0 && iparents.context.localName !== 'i') {
            $ibtn.removeClass("font-style-active");
        } else {
            $ibtn.addClass("font-style-active");
        }
        //u
        var $ubtn = $("#btn-underline");
        if (anchorNode.nodeType === 1 && anchorNode.localName === 'u') {
            $ubtn.addClass("font-style-active");
        }
        var uparents = $(anchorNode).parents("u");
        if (uparents.length === 0 && uparents.context.localName !== 'u') {
            $ubtn.removeClass("font-style-active");
        } else {
            $ubtn.addClass("font-style-active");
        }
        //s
        var $sbtn = $("#btn-strikethrough");
        if (anchorNode.nodeType === 1 && anchorNode.localName === 'strike') {
            $sbtn.addClass("font-style-active");
        }
        var sparents = $(anchorNode).parents("strike");
        if (sparents.length === 0 && sparents.context.localName !== 'strike') {
            $sbtn.removeClass("font-style-active");
        } else {
            $sbtn.addClass("font-style-active");
        }
    }
}

/**
 * 动态显示标题类型
 */
function dynamicModJustifyShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    if (anchorNode.parentNode.nodeType === 1) {
        var pjustifyCss = $(anchorNode.parentNode).css("text-align");
        selectAlign(pjustifyCss);
        return;
    }
    var lineBelow = findLineDivBelow(anchorNode);
    if (lineBelow !== null && lineBelow.nodeType === 1) {
        var titleIndex = titleType.indexOf(lineBelow.localName.toUpperCase());
        if (titleIndex >= 0 || lineBelow.localName === 'div') {
            var justifyCss = $(lineBelow).css("text-align");
            selectAlign(justifyCss);
            return;
        }
    }
    var lineDiv = findLineDiv(anchorNode);
    var justifyDivCss = $(lineDiv).css("text-align");
    selectAlign(justifyDivCss);
}
/**
 * 动态显示line-height类型
 */
function dynamicModLineHeightShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode);
    var lineNum = $(nowLine).attr("p-line-height");
    if (lineNum === null || lineNum === undefined) {
        $("#show-line-height").html("1.4");
    } else {
        $("#show-line-height").html(lineNum);
    }
}


/**
 * 判断editor是否聚焦(活跃态)
 * @param targetNode
 * @returns {boolean}
 */
function isRootNodeActive(targetNode) {
    if (targetNode === rootNode) {
        return true;
    }
    return rootNode.contains(targetNode);
}

function buildLineBelowContainer(lineBelow) {
    if (lineBelow.parentNode.childNodes.length === 1) {
        return lineBelow;
    } else {
        var section = $("<section>")[0];
        //section.innerHTML=lineBelow.parentNode.innerHTML;
        mvChildNode(section, lineBelow.parentNode);
        return section;
    }
}

/**
 * 移动子节点到新parent node
 * @param newEl
 * @param targetEl
 */
function mvChildNode(newEl, targetEl) {
    var oriLength = targetEl.childNodes.length;
    for (var i = 0; i < oriLength; i++) {
        newEl.appendChild(targetEl.childNodes[0]);
    }
}

function removeAllChildNode(targetEl) {
    var oriLength = targetEl.childNodes.length;
    for (var i = 0; i < oriLength; i++) {
        targetEl.childNodes[0].remove();
    }
}

//前景色

//设置字体前景色
function fontColorStyle(color) {
    setFocus();
    document.execCommand('foreColor', false, color);
    $("#color-line").css({"background-color": '' + color});
}


//设置字体背景色
function fontBgColorStyle(color) {
    setFocus();
    document.execCommand('hiliteColor', true, color);
    $(".font-bg").css({"background-color": color});
}

//设置字体样式 加粗/斜体/下划线/删除线
function fontStyle(type) {
    setFocus();
    document.execCommand(type, false, null);
    var $btn = $("#btn-" + type.toLowerCase());
    if ($btn.hasClass("font-style-active")) {
        $btn.removeClass("font-style-active");
    } else {
        $btn.addClass("font-style-active");
    }
}
//横线
function hrStyle(num) {
    var hrCode = "<div class='line-div' contenteditable='false'><hr class='line-hr hr-{0}'/></div>".format(num);
    var underLine = "<div class='line-div'><br ></div>";
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode);
    insertAfter($(hrCode)[0], nowLine);
    insertAfter($(underLine)[0], nowLine.nextElementSibling);
}

//清除样式
function clearFontStyle() {
    setFocus();
    document.execCommand("RemoveFormat", false, null);
}

function lineHeightStyle(num) {
    savePos();
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode);
    $(nowLine).attr("p-line-height", num);
    $("#show-line-height").html(num);
    setFocus();
    restorePos();
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

function selectAlign(align) {
    if (align === 'start') {
        align = 'left';
    }
    $(".text-align").removeClass("font-style-active");
    $("#btn-align-" + align).addClass("font-style-active");
}

/**
 * 插入代码块
 */
function insertCodeStyle() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode);
    var selectiveHtml = getRangeHtml();
    if ($.trim(selectiveHtml) === '') {
        selectiveHtml = "<div>&zwnj;</div>";
    }
    var codeStr = "<pre class='prettyprint' contenteditable='true'>" + selectiveHtml + "</pre>";
    var codeLineDiv = $("<div class='line-div'>{0}</div>".format(codeStr))[0];
    insertAfter(codeLineDiv, nowLine);
    var newLineDiv = $("<div class='line-div'><br></div>")[0];
    insertAfter(newLineDiv, nowLine.nextSibling);
    $(".prettyprint").removeClass("prettyprinted");
    prettyPrint();
    selection.collapse(codeLineDiv, 1);
    //添加右键删除功能
    $("pre").parent(".line-div").smartMenu(codeSettings);
}

/**
 * 获取选中文本
 * @returns {*}
 */
function getRangeHtml() {
    var userSelection;
    if (window.getSelection) { //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (userSelection.getRangeAt) {
        var range = userSelection.getRangeAt(0);
        var documentFragment = range.extractContents();
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

/**
 * 插入引用块
 */
function insertBlockquoteStyle() {
    setFocus();
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode);
    var selectiveHtml = getRangeHtml();
    if ($.trim(selectiveHtml) === '') {
        selectiveHtml = "<div>&zwnj;</div>";
    }
    var codeStr = "<div class='blockquote-body' contenteditable='true'>" + selectiveHtml + "</div>";
    var codeLineDiv = $("<div class='line-div'>{0}</div>".format(codeStr))[0];
    insertAfter(codeLineDiv, nowLine);
    var newLineDiv = $("<div class='line-div'><br></div>")[0];
    insertAfter(newLineDiv, nowLine.nextSibling);
    selection.collapse(codeLineDiv, 1);
    //添加右键删除功能
    $(".blockquote-body").parent(".line-div").smartMenu(codeSettings);
}


//bootstrap icon初始化
var settings = {
    clickIconEvent: clickIcon
};
//表情选择器初始化
$(function () {
    $("#txt_boostrap_icon").iconPicker(settings);
});

//表情
function clickIcon(val) {
    setFocus();
    var emoji = "<img src='' class='" + val + "'/>";
    document.execCommand("insertHtml", false, emoji);
}

/**
 * 往上查找元素节点
 * @param anchorNode
 * @returns {*}
 */
function findElementNode(anchorNode) {
    if (anchorNode.nodeType === 1) {
        return anchorNode;
    } else {
        return findElementNode(anchorNode.parentNode);
    }
}


var codeSettings = [
    [{
        text: "删除",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var p = findLineDiv(selection.anchorNode);
            p.remove();
            dealLastLine();
        }
    }, {
        text: "复制内容",
        func: function () {
            document.execCommand('copy');
        }
    }]
];
var imgSettings = [
    [{
        text: "删除",
        func: function () {
            var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            p.remove();
            dealLastLine();
        }
    }, {
        text: "居左",
        func: function () {
            var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            $(p).css("text-align", "left");
        }
    }, {
        text: "居中",
        func: function () {
            var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            $(p).css("text-align", "center");
        }
    }, {
        text: "居右",
        func: function () {
            var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            $(p).css("text-align", "right");
        }
    }]
];
function dealLastLine() {
    //最后空留一行
    if (rootNode.childNodes[rootNode.childNodes.length - 1].outerHTML != '<div class="line-div"><br></div>') {
        var lastLineNode = $("<div class='line-div'><br/></div>")[0];
        $(rootNode).append(lastLineNode);
    }
}