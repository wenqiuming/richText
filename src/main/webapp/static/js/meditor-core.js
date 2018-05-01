/**
 * 富文本主体
 **/
const rootNode = $(".meditor-body")[0];
/**
 * 光标位置
 * @type {{}}
 */
var position = {};

var titleType = ["H1", "H2", "H3", "H4","SECTION"];
var titleName = ["H1", "H2", "H3", "H4","正文"];


/*key down function */
$(window).keydown(function (e) {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var offset = selection.anchorOffset;
    var anchorNode = selection.anchorNode;
    //key ENTER
    if (e.keyCode === 13) {
        e.preventDefault();
        if (anchorNode === rootNode) {
            var lineNode = $("<div class='line-div'><br/></div>")[0];
            $(rootNode).append(lineNode);
        } else {
            var operNode = findLineDiv(anchorNode);
            createNewLine(selection, offset);
            remainContent(selection, offset);
            console.log(selection);
            if ($(anchorNode).hasClass("line-div") && offset === 0) {
                console.log("do nothing");
            } else {
                selection.collapse(operNode.nextSibling, 0);
            }
        }
    }
});

/**
 * key up function
 */
$(window).keyup(function (e) {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    if (e.keyCode === 8) {
        if (rootNode.childNodes.length === 0) {
            var lineNode = $("<div class='line-div'><br/></div>")[0];
            $(rootNode).append(lineNode);
            selection.collapse(lineNode, 0);
        }
    }
    var anchorNode = selection.anchorNode;
    if ($(anchorNode).hasClass("div-img")) {
        alert();
        selection.collapse(anchorNode.previousSibling, 0);
    }
    //动态标题样式显示
    if(isRootNodeActive(e.target)){
        dynamicModHeaderShow();
    }
});


/**
 * mouse click function
 */
$(window).click(function (e) {
    if(isRootNodeActive(e.target)){
        dynamicModHeaderShow();
    }
});


/**
 * 换行后,余留本行数据处理
 * */
function remainContent(selection, offset) {
    var anchorNode = selection.anchorNode;
    var lineDiv = findLineDiv(anchorNode);
    if (lineDiv === anchorNode) {
        return;
    }
    //如果行首
    if (isLineStart(anchorNode,offset)){
        $(lineDiv).html("<br/>");
        return ;
    }
    if (anchorNode.nodeType === 3) {
        var allContent = anchorNode.textContent;
        anchorNode.textContent = allContent.substring(0, offset);
    }
    var lineDivBelow = findLineDivBelow(anchorNode);
    var deleteNode=anchorNode;
    while (!$(deleteNode.parentNode).hasClass("line-div")){
        deleteOtherChildNodesAfterIndex(deleteNode.parentNode, getPosInParentNode(deleteNode, deleteNode.parentNode));
        deleteNode=deleteNode.parentNode;
    }
    if (lineDiv.innerHTML === '') {
        $(lineDiv).append($("<br/>")[0]);
    }
}

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
        return null;
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
 * 删除索引(index)后所有子节点
 * @param parentNode
 * @param index
 */
function deleteOtherChildNodesAfterIndex(parentNode, index) {
    var childLength = parentNode.childNodes.length;
    if (index + 1 > childLength) {
        return;
    }
    for (var i = index + 1; i < childLength; i++) {
        parentNode.lastChild.remove();
    }
}
/**
 * 删除索引(index)前所有子节点
 * @param parentNode
 * @param index
 */
function deleteOtherChildNodesBeforeIndex(parentNode, index) {
    var childLength = parentNode.childNodes.length;
    if (index + 1 > childLength) {
        return;
    }
    for (var i =0; i < index; i++) {
        parentNode.firstChild.remove();
    }
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
 * 新增一行node
 * @param selection
 * @param offset
 */
function createNewLine(selection, offset) {
    var anchorNode = selection.anchorNode;
    var newLineDiv = $("<div class='line-div'></div>")[0];
    var lineDiv = findLineDiv(anchorNode);
    if (anchorNode === lineDiv) {
        $(newLineDiv).append("<br/>");
        if (offset > 0) {
            insertAfter(newLineDiv, findRootBelow(anchorNode));
        } else {
            insertBefore(newLineDiv, findRootBelow(anchorNode));
        }
        return;
    }
    if (isLineEnd(anchorNode, offset)) {
        $(newLineDiv).append("<br/>");
        insertAfter(newLineDiv, findRootBelow(anchorNode));
        return;
    }
    var lineDivBelow = findLineDivBelow(anchorNode);
    var allContent = null;
    //clone node
    if (anchorNode.nodeType === 3) {
        allContent = anchorNode.textContent;
        anchorNode.textContent = allContent.substring(offset, allContent.length);
    }
    var cloneNode = findLineDivBelow(anchorNode).cloneNode(true);
    //delete others nodes
    // while (!$(deleteNode.parentNode).hasClass("line-div")){
    //     deleteOtherChildNodesBeforeIndex(deleteNode.parentNode, getPosInParentNode(deleteNode, deleteNode.parentNode));
    //     deleteNode=deleteNode.parentNode;
    // }

    if (allContent !== null) {
        anchorNode.textContent = allContent;
    }
    newLineDiv.append(cloneNode);
    fillChildAterIndex(newLineDiv, lineDiv, getPosInParentNode(lineDivBelow, lineDiv));
    insertAfter(newLineDiv, findRootBelow(anchorNode));
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
    if (offset>0){
        return false;
    }
    return isFirstChild(anchorNode,anchorNode.parentNode);
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
        //已经是标题类型
        if (lineBelow.nodeType === 1 && titleType.indexOf(lineBelow.tagName) >= 0) {
            for (var i = 0; i < lineBelow.childNodes.length; i++) {
                tag.appendChild(lineBelow.childNodes[i]);
            }
            lineBelow.remove();
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
    var titleIndex=titleType.indexOf(ele.toUpperCase());
    $(".meditor-header .header-name").text(titleName[titleIndex]);
}

//设置字号 1~7
function fontSizeStyle(size) {
    setFocus();
    var fontSpan=$("<span font-size-style='{0}'></span>".format(size))[0];
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var range=selection.getRangeAt(0);
    if (range.collapsed){
        return;
    }
    console.log(range);
    //一个节点的一部分
    if (range.startContainer===range.endContainer){
        var operNode=range.startContainer;
        var startOffset=range.startOffset;
        var endOffset=range.endOffset;
        var diffLength=endOffset-startOffset;
        //判断父节点是否该类型节点
        if (diffLength===operNode.textContent.length&&$(operNode.parentNode).attr("font-size-style")){
            $(operNode.parentNode).attr("font-size-style",size);
            return;
        }
        var modText=range.startContainer.textContent.substring(startOffset,endOffset);
        var beforeText=operNode.textContent.substring(0,startOffset);
        var afterText=operNode.textContent.substring(endOffset,operNode.textContent.length);
        range.startContainer.textContent=beforeText;
        fontSpan.innerText=modText;
        insertAfter(fontSpan,range.startContainer);
        if(afterText.length>0){
            var afterNode=document.createTextNode(afterText);
            insertAfter(afterNode,range.startContainer.nextSibling);
        }
        selection.collapse(range.startContainer.nextSibling,1);
    }else{//包含多个节点
        //1.先将子节点字体样式去掉
        var rangeContainer=range.commonAncestorContainer;
        var startNode=range.startContainer;
        var endNode=range.endContainer;
        var containerChildNodes=rangeContainer.childNodes;
        var startIndex=getChildIndex(startNode,rangeContainer);
        var endIndex=getChildIndex(endNode,rangeContainer);
        console.log(startIndex);
        //2.外面包裹一层样式span 节点


    }
    $("#show_font_size").text(size);
}

/**
 * 获取子节点位于父节点的下标
 * @param node
 * @param parentNodes
 * @returns {number}
 */
function getChildIndex(node,parentNodes) {
    for(var i=0;i<parentNodes.childNodes.length;i++){
        if (parentNodes.childNodes[i]===node){
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
    var lineBelow=findLineDivBelow(anchorNode);
    var $headerNameShow=$(".meditor-header .header-name");
    if (lineBelow===null){
        //set header name show
        $headerNameShow.text("正文");
    }else{
        if (lineBelow.nodeType!==1){
            $headerNameShow.text("正文");
        }else{
            var titleIndex=titleType.indexOf(lineBelow.tagName.toUpperCase());
            if (titleIndex<0){
                $headerNameShow.text("正文");
            }else{
                $headerNameShow.text(titleName[titleIndex]);
            }
        }
    }
}

/**
 * 判断editor是否聚焦(活跃态)
 * @param targetNode
 * @returns {boolean}
 */
function isRootNodeActive(targetNode) {
    if (targetNode===rootNode){
        return true;
    }
    return rootNode.contains(targetNode);
}

