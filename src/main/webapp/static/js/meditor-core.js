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
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    //处理第一行
    var nowLine = findLineDiv(anchorNode, selection);
    if (e.keyCode === 8 && nowLine === $(rootNode).children("div.line-div")[0] && nowLine.innerHTML === '<br>') {
        nowLine.remove();
    }
    //判断是否行内元素
    var existLine = $(e.target).parents(".line-div");
    if (existLine.length === 0 && !$(e.target).hasClass("line-div")) {
        return;
    }
    breakActiveDiv = findLineDiv(anchorNode, selection);
});


/**
 * key up function
 */
$(window).keyup(function (e) {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    //最后空留一行
    dealLastLine();
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
        //处理code 代码块
        if ($(anchorNode).hasClass("prettyprint")) {
            $(anchorNode).html("<div><br/></div>");
        } else if ($(anchorNode).parents(".prettyprint").length > 0 && $($(anchorNode).parents(".prettyprint")[0]).children("div").length === 0) {
            var preNode = $(anchorNode).parents(".prettyprint")[0];
            savePos();
            var container = $("<div></div>")[0];
            mvChildNode(container, preNode);
            preNode.appendChild(container);
            restorePos();
        }

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
        var lineDiv = findLineDiv(anchorNode, selection);
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
        var nowLine = findLineDiv(anchorNode, selection);
        if ($(nowLine).attr("p-line-height") === undefined) {
            $(nowLine).attr("p-line-height", $("#show-line-height").text());
        }
    }
    //动态标题样式显示
    if (isRootNodeActive(e.target) && anchorNode !== null && anchorNode !== undefined) {
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
    var iconPop = document.getElementsByClassName("icon-popup");
    var emojinPop = document.getElementsByClassName("emoji-popup");
    var iconNode = document.getElementById("txt_boostrap_icon");
    var emojiNode = document.getElementById("emoji_icon");
    var clickOnIcon = e.target === iconNode || iconNode.contains(e.target);
    var clickOnEmoji = e.target === emojiNode || emojiNode.contains(e.target);
    //表情框出现隐藏控制
    if (!clickOnIcon || iconPop.length > 0) {
        $(".icon-popup").remove();
    }
    if (!clickOnEmoji || emojinPop.length > 0) {
        $(".emoji-popup").remove();
    }

    //判断是否行内元素
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var lineDiv = $(anchorNode).parents(".line-div");
    if (lineDiv.length === 0 && !$(e.target).hasClass("line-div")) {
        return;
    }
    if (isRootNodeActive(e.target) && anchorNode !== null && anchorNode !== undefined) {
        dynamicModHeaderShow();
        dynamicModFontShow();
        dynamicModFontColorShow();
        dynamicModFontBackColorShow();
        dynamicModFontCssShow();
        dynamicModJustifyShow();
        dynamicModLineHeightShow();
    }
    //最后一行
    dealLastLine();
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
function findLineDiv(node, selection) {
    if (node === null || node === undefined) {
        return null;
    }
    if (node === rootNode) {
        return node.childNodes[selection.anchorOffset];
    }
    if ($(node).hasClass("line-div")) {
        return node;
    } else {
        return findLineDiv(node.parentNode, selection);
    }
}

/**
 * find line div direct childNode
 * @param node
 * @returns {*}
 */
function findLineDivBelow(node) {
    if (node === null) {
        return null;
    }
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
    var lineDiv = findLineDiv(anchorNode, selection);
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
    if (anchorNode.nodeType === 1) {
        var justifyCss = $(anchorNode).css("text-align");
        selectAlign(justifyCss);
    } else {
        var pjustifyCss = $(anchorNode.parentNode).css("text-align");
        selectAlign(pjustifyCss);
    }
}

/**
 * 动态显示line-height类型
 */
function dynamicModLineHeightShow() {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode, selection);
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
    setFocus();
    var hrCode = "<div class='line-div line-hr-div' contenteditable='false'><hr class='line-hr hr-{0}'/></div>".format(num);
    var underLine = "<div class='line-div'><br ></div>";
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode, selection);
    insertAfter($(hrCode)[0], nowLine);
    insertAfter($(underLine)[0], nowLine.nextElementSibling);
    $(".line-hr").parent(".line-div").smartMenu(hrSettings, {"name": "hr"});
    //如果空行,删除
    if (nowLine.innerHTML === undefined || nowLine.innerHTML === null || nowLine.innerHTML === "<br>" || $.trim(nowLine.innerHTML.replace(/&nbsp;/g, "")) === "") {
        nowLine.remove();
    }
}

//清除样式
function clearFontStyle() {
    setFocus();
    document.execCommand("RemoveFormat", false, null);
}

function lineHeightStyle(num) {
    setFocus();
    savePos();
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode, selection);
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
    setFocus();
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
    setFocus();
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode, selection);
    var selectiveHtml = getRangeHtml();
    if ($.trim(selectiveHtml) === '') {
        selectiveHtml = "<div>&zwnj;</div>";
    }
    var codeStr = "<pre class='prettyprint' contenteditable='true'>" + selectiveHtml + "</pre>";
    var codeLineDiv = $("<div class='line-div'>{0}</div>".format(codeStr))[0];
    insertAfter(codeLineDiv, nowLine);
    //如果空行,删除
    if (nowLine.innerHTML === undefined || nowLine.innerHTML === null || nowLine.innerHTML === "<br>" || $.trim(nowLine.innerHTML.replace(/&nbsp;/g, "")) === "") {
        nowLine.remove();
    }
    $(".prettyprint").removeClass("prettyprinted");
    //重新渲染code style
    prettyPrint();
    selection.collapse(codeLineDiv, 1);
    dealLastLine();
    //添加右键删除功能
    $("pre").parent(".line-div").smartMenu(codeSettings, {"name": "code"});
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
    var nowLine = findLineDiv(anchorNode, selection);
    var selectiveHtml = getRangeHtml();
    if ($.trim(selectiveHtml) === '') {
        selectiveHtml = "<div>&zwnj;</div>";
    }
    var codeStr = "<div class='blockquote-body' contenteditable='true'>" + selectiveHtml + "</div>";
    var codeLineDiv = $("<div class='line-div'>{0}</div>".format(codeStr))[0];
    insertAfter(codeLineDiv, nowLine);
    selection.collapse(codeLineDiv, 1);
    //添加右键删除功能
    $(".blockquote-body").parent(".line-div").smartMenu(blockSettings, {"name": "block"});
    //如果空行,删除
    if (nowLine.innerHTML === undefined || nowLine.innerHTML === null || nowLine.innerHTML === "<br>" || $.trim(nowLine.innerHTML.replace(/&nbsp;/g, "")) === "") {
        nowLine.remove();
    }
    dealLastLine();
}


//bootstrap icon初始化
var settings = {
    clickIconEvent: clickIcon
};
var emojiSettings = {
    clickIconEvent: clickEmoji
};
//表情选择器初始化
$(function () {
    $("#txt_boostrap_icon").iconPicker(settings);
    $("#emoji_icon").emojiPicker(emojiSettings);
    bindTodoEvt();
});

//图标
function clickIcon(val) {
    setFocus();
    var emoji = "<img src='' class='" + val + "'/>";
    document.execCommand("insertHtml", false, emoji);
}

//表情
function clickEmoji(val) {
    setFocus();
    var emoji = "<img class='emoji-cell' src='{0}'/>".format(val);
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

var blockSettings = [
    [{
        text: "删除",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var p = findLineDiv(selection.anchorNode, selection);
            p.remove();
            dealLastLine();
        }
    }, {
        text: "复制内容",
        func: function () {
            document.execCommand('copy');
        }
    }, {
        text: "下移一行",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var p = findLineDiv(selection.anchorNode, selection);
            var nline = $("<div class='line-div'><br/></div>")[0];
            insertBefore(nline, p);
        }
    }]
];
var hrSettings = [
    [{
        text: "删除",
        func: function () {
            var p = $(smartMenuTarget).hasClass("line-hr-div") ? smartMenuTarget : $(smartMenuTarget).parents(".line-div")[0];
            p.remove();
            dealLastLine();
        }
    }]
];

var codeSettings = [
    [{
        text: "删除",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var p = findLineDiv(selection.anchorNode, selection);
            p.remove();
            dealLastLine();
        }
    }, {
        text: "复制内容",
        func: function () {
            document.execCommand('copy');
        }
    }, {
        text: "下移一行",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var p = findLineDiv(selection.anchorNode, selection);
            var nline = $("<div class='line-div'><br/></div>")[0];
            insertBefore(nline, p);
        }
    }, {
        text: "代码高亮",
        func: function () {
            $(".prettyprint").removeClass("prettyprinted");
            prettyPrint();
        }
    }]
];
var imgSettings = [
    [{
        text: "删除",
        func: function () {
            // var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            var p = $(smartMenuTarget).parents(".line-div")[0];
            p.remove();
            dealLastLine();
        }
    }, {
        text: "居左",
        func: function () {
            //var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            var p = $(smartMenuTarget).parents(".line-div")[0];
            $(p).css("text-align", "left");
        }
    }, {
        text: "居中",
        func: function () {
            //var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            var p = $(smartMenuTarget).parents(".line-div")[0];
            $(p).css("text-align", "center");
        }
    }, {
        text: "居右",
        func: function () {
            //var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            var p = $(smartMenuTarget).parents(".line-div")[0];
            $(p).css("text-align", "right");
        }
    }, {
        text: "下移一行",
        func: function () {
            //var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            var p = $(smartMenuTarget).parents(".line-div")[0];
            var nline = $("<div class='line-div'><br/></div>")[0];
            insertBefore(nline, p);
        }
    }, {
        text: "宽度填满",
        func: function () {
            //var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            var p = $(smartMenuTarget).parents(".line-div")[0];
            $(p).find("img").css("width", "100%");
            $(p).find(".stretch-photo-container").css("width", "100%");
        }
    }, {
        text: "原始尺寸",
        func: function () {
            //var p = $(".stretch-photo-container.active").parents(".line-div")[0];
            var p = $(smartMenuTarget).parents(".line-div")[0];
            $(p).find("img").css("width", "auto");
            $(p).find("img").css("height", "auto");
            $(p).find(".stretch-photo-container").css("width", "auto");
        }
    }]
];
var tableSettings = [
    [{
        text: "删除表格",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var anchorNode = selection.anchorNode;
            var p = findLineDiv(anchorNode, selection);
            p.remove();
            dealLastLine();
        }
    }, {
        text: "表格下移",
        func: function () {
            var p = $(smartMenuTarget).parents(".line-div")[0];
            var nline = $("<div class='line-div'><br/></div>")[0];
            insertBefore(nline, p);
        }
    }, {
        text: "删除当前行",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var anchorNode = selection.anchorNode;
            delTableRow(anchorNode, selection);
            dealLastLine();
        }
    }, {
        text: "删除当前列",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var anchorNode = selection.anchorNode;
            delTableCol(anchorNode, selection);
            dealLastLine();
        }
    }, {
        text: "上方添加行",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var anchorNode = selection.anchorNode;
            var tr = $(anchorNode).parents("tr")[0];
            var tdCount = $(tr).find("td").length;
            var newTr = "<tr>";
            for (var i = 0; i < tdCount; i++) {
                newTr += "<td></td>";
            }
            newTr += "</tr>";
            insertBefore($(newTr)[0], tr);
        }
    }, {
        text: "下方添加行",
        func: function () {
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var anchorNode = selection.anchorNode;
            var tr = $(anchorNode).parents("tr")[0];
            var tdCount = $(tr).find("td").length;
            var newTr = "<tr>";
            for (var i = 0; i < tdCount; i++) {
                newTr += "<td></td>";
            }
            newTr += "</tr>";
            insertAfter($(newTr)[0], tr);
        }
    }, {
        text: "左侧添加列",
        func: function () {
            savePos();
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var anchorNode = selection.anchorNode;
            var trs = $($(anchorNode).parents("table")[0]).find("tr");
            var tr = $(anchorNode).parents("tr")[0];
            var td = anchorNode.localName === "td" ? anchorNode : $(anchorNode).parents("td")[0];
            var ptrChilds = $(tr).find("td");
            var index = [].indexOf.call(ptrChilds, td);
            for (var i = 0; i < trs.length; i++) {
                var targetTd = $(trs[i]).find("td")[index];
                var ele = $("<td style='width: 300px'></td>")[0];
                insertBefore(ele, targetTd);
            }
            var tbl = $(anchorNode).parents("table")[0];
            var lineDiv = findLineDiv(anchorNode, selection);
            var alterTable = $("<table class='meditor-table'></table>")[0];
            mvChildNode(alterTable, tbl);
            $(lineDiv).html("");
            lineDiv.appendChild(alterTable);
            $("table").colResizable({
                //fit flex overflow
                resizeMode: 'fit',
                liveDrag: true,
                draggingClass: "dragging"
            });
            restorePos();
            $("table").smartMenu(tableSettings, {"name": "table"});
        }
    }, {
        text: "右侧添加列",
        func: function () {
            savePos();
            var selection = window.getSelection ? window.getSelection() : document.getSelection();
            var anchorNode = selection.anchorNode;
            var trs = $($(anchorNode).parents("table")[0]).find("tr");
            var tr = $(anchorNode).parents("tr")[0];
            var td = anchorNode.localName === "td" ? anchorNode : $(anchorNode).parents("td")[0];
            var ptrChilds = $(tr).find("td");
            var index = [].indexOf.call(ptrChilds, td);
            for (var i = 0; i < trs.length; i++) {
                var targetTd = $(trs[i]).find("td")[index];
                var ele = $("<td style='width: 300px'></td>")[0];
                insertAfter(ele, targetTd);
            }
            var tbl = $(anchorNode).parents("table")[0];
            var lineDiv = findLineDiv(anchorNode, selection);
            var alterTable = $("<table class='meditor-table'></table>")[0];
            mvChildNode(alterTable, tbl);
            $(lineDiv).html("");
            lineDiv.appendChild(alterTable);
            $("table").colResizable({
                //fit flex overflow
                resizeMode: 'fit',
                liveDrag: true,
                draggingClass: "dragging"
            });
            restorePos();
            $("table").smartMenu(tableSettings, {"name": "table"});
        }
    }]
];

function dealLastLine() {
    //最后空留一行
    if (rootNode.childNodes.length === 0 || rootNode.childNodes[rootNode.childNodes.length - 1].outerHTML != '<div class="line-div"><br></div>') {
        var lastLineNode = $("<div class='line-div'><br/></div>")[0];
        $(rootNode).append(lastLineNode);
    }
}


function insertLink() {
    savePos();
    $("#meditor_link_addr").val("http://");
    $("#meditor_link_name").val("");
    $("#meditor_link_blank").removeAttr("checked");
    $("#linkModal").modal("show");
    setTimeout(function () {
        var addrInput = $("#meditor_link_addr")[0];
        addrInput.select();
    }, 200);
}

function doInsertLink() {
    setFocus();
    restorePos();
    var name = $("#meditor_link_name").val();
    var addr = $("#meditor_link_addr").val();
    if ($.trim(addr) === '') {
        $("#linkModal").modal("hide");
        return;
    }
    if ($.trim(name) === '') {
        name = addr;
    }
    var isBlank = $("#meditor_link_blank").is(':checked');
    var openStyle = isBlank ? "_blank" : "_self";
    var linkHtml = "<a href='{0}' title='{1}' target='{2}' class='meditor-a-link'>{3}</a>".format(addr, addr, openStyle, name);
    document.execCommand("insertHtml", false, linkHtml);
    $("#linkModal").modal("hide");
}

$(function () {
    $("table").colResizable({
        //fit flex overflow
        resizeMode: 'fit',
        liveDrag: true,
        draggingClass: "dragging"
    });
    $("table").smartMenu(tableSettings, {"name": "table"});

    $('[tooltip="true"]').tooltip({trigger: "hover ", placement: "bottom"});

    $(".dropdown-toggle").click(function () {
        setTimeout(function () {
            $('[tooltip="true"]').tooltip("hide");
        }, 300);
    });
});

/**
 * 删除table行
 * @param anchorNode
 * @param selection
 */
function delTableRow(anchorNode, selection) {
    var t = $(anchorNode).parents("table")[0];
    var trLen = $(t).find("tr").length;
    if (trLen > 1) {
        var tr = $(anchorNode).parents("tr")[0];
        tr.remove();
    } else {
        var lineDiv = findLineDiv(anchorNode, selection);
        lineDiv.remove();
    }
}

function delTableCol(anchorNode, selection) {
    var t = $(anchorNode).parents("table")[0];
    var allTr = $(t).find("tr");
    var ptr = $(anchorNode).parents("tr")[0];
    var ptrChilds = $(ptr).find("td");
    if (ptrChilds.length > 1) {
        var ptd = $(anchorNode).parents("td")[0];
        var index = 0;
        for (var j = 0; j < ptrChilds.length; j++) {
            if (ptd === ptrChilds[j]) {
                index = j;
            }
        }
        for (var i = 0; i < allTr.length; i++) {
            var tds = $(allTr[i]).find("td");
            tds[index].remove();
        }
    } else {
        var lineDiv = findLineDiv(anchorNode, selection);
        lineDiv.remove();
    }
}

//表格选择器
$(".select-table .select-table-cell").hover(function (e) {
    var tableCells = $(this).parent().find(".select-table-cell");
    var index = [].indexOf.call(tableCells, this);
    var row = parseInt(index / 6);
    var col = index % 6;
    for (var i = 0; i <= row; i++) {
        for (var j = 0; j <= col; j++) {
            var noopIndex = 6 * i + j;
            $(tableCells[noopIndex]).addClass("active");
        }
    }
}, function (e) {
    $(".select-table .select-table-cell").removeClass("active");
});
$(".select-table .select-table-cell").click(function () {
    setFocus();
    restorePos();
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode, selection);
    var tableStr = createTable(this);
    var codeLineDiv = $("<div class='line-div'>{0}</div>".format(tableStr))[0];
    insertAfter(codeLineDiv, nowLine);
    selection.collapse(codeLineDiv, 1);
    //添加列宽调整组件
    $("table").colResizable({
        //fit flex overflow
        resizeMode: 'fit',
        liveDrag: true,
        draggingClass: "dragging"
    });
    //添加右键删除功能
    $("table").smartMenu(tableSettings, {"name": "table"});
    //如果空行,删除
    if (nowLine.innerHTML === undefined || nowLine.innerHTML === null || nowLine.innerHTML === "<br>" || $.trim(nowLine.innerHTML.replace(/&nbsp;/g, "")) === "") {
        nowLine.remove();
    }
    dealLastLine();
});

function createTable(pos) {
    var table = "<table class='meditor-table'>";
    var tableCells = $(pos).parent().find(".select-table-cell");
    var index = [].indexOf.call(tableCells, pos);
    var row = parseInt(index / 6);
    var col = index % 6;
    for (var i = 0; i <= row; i++) {
        table += "<tr>";
        for (var j = 0; j <= col; j++) {
            table += "<td></td>";
        }
        table += "</tr>";
    }
    table += "</table>";
    return table;
}

$(".btn.btn-default.dropdown-toggle").click(function () {
        savePos();
    }
);

function bindTodoEvt() {
    $(".todo").unbind("click");
    $(".todo").bind("click", function (e) {
        if (e.offsetX <= 20) {
            if ($(e.target).hasClass("checked")) {
                $(e.target).removeClass("checked");
            } else {
                $(e.target).addClass("checked");
            }
        }
    })
}

function insertToDo() {
    setFocus();
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var anchorNode = selection.anchorNode;
    var nowLine = findLineDiv(anchorNode, selection);
    var todoList=$(anchorNode).parents(".todo");
    if (todoList.length>0||$(anchorNode).hasClass("todo")){
        if ($(anchorNode).hasClass("todo")){
            $(anchorNode).removeClass("todo");
        }else{
            $(todoList[0]).removeClass("todo");
        }
    }else{
        $(nowLine).addClass("todo");
        bindTodoEvt();
        dealLastLine();
    }
}