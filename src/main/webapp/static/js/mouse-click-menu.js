var epMenu = {
    create: function (point, option) {
        var menuNode = document.getElementById('epMenu');
        if (!menuNode) {
            //没有菜单节点的时候创建一个
            menuNode = document.createElement("div");
            menuNode.setAttribute('class', 'epMenu');
            menuNode.setAttribute('id', 'epMenu');
        } else $(menuNode).html('');//清空里面的内容

        $(menuNode).css({left: point.left + 'px', top: point.top + 'px'});
        for (var x in option) {
            var tempNode = document.createElement("a");
            $(tempNode).text(option[x]['name']).on('click', option[x].action);
            menuNode.appendChild(tempNode);
        }

        $("body").append(menuNode);
    },
    destory: function () {
        $(".epMenu").remove();
    }
};
var evt;
var evtRange;

function cdel() {
    epMenu.destory();
    var fireEle=evt.target;
    $(fireEle).parents(".line-div").remove();
}

function hideSysMenu() {
    return false;
}
function ccopy() {
    alert(document.execCommand('copy'));
    epMenu.destory();
}
function cpaste() {
    document.execCommand('paste');
    epMenu.destory();
}

document.onmousedown = function (e) {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    var menuNode = document.getElementById('epMenu');
    if (e.button === 2) {
        //$(rootNode).contentEditable=false;
        if (selection.rangeCount>0){
            evtRange=selection.getRangeAt(0);
        }
        evt = window.event || arguments[0];
        var targetEle = evt.target;
        if ($(targetEle).parents("pre").length>0 || (targetEle.nodeType === 1 && targetEle.localName === 'pre')) {
            document.oncontextmenu = hideSysMenu;//屏蔽鼠标右键
            var rightedge = evt.clientX;
            var bottomedge = evt.clientY;
            epMenu.create({left: rightedge, top: bottomedge}, [
                {name: '删除', 'action': cdel},
                {name: '复制', 'action': ccopy},
                {name: '粘贴', 'action': cpaste}
            ]);
        }
        //$(".epMenu").fadeIn();
        // epMenu.create({left: rightedge, top: bottomedge}, [
        //     {name: '删除', 'action': cdel},
        //     {name: '复制', 'action': ccopy},
        //     {name: '粘贴', 'action': cpaste}
        // ]);
        showEpMenu(e);
    }
};
document.onmouseup = function (e) {
    var selection = window.getSelection ? window.getSelection() : document.getSelection();
    // if (e.button === 2&&evtRange!==null){
    //     selection.removeAllRanges();
    //     selection.addRange(evtRange);
    //     evtRange=null;
    // }
};

function showEpMenu(evt) {
    //document.oncontextmenu = hideSysMenu;//屏蔽鼠标右键
    var rightedge = evt.clientX;
    var bottomedge = evt.clientY;
    $(".epMenu").css({
        "left":rightedge,
        "top":bottomedge,
        "height":"auto"
    });
}
