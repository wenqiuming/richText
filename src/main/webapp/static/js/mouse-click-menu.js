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

function sayhello() {
    epMenu.destory();
}

function del() {
    console.log(evt.target);
    epMenu.destory();
}

function hideSysMenu() {
    return false;
}

document.onmousedown = function (e) {
    var menuNode = document.getElementById('epMenu');
    if (e.button === 2) {
        document.oncontextmenu = hideSysMenu;//屏蔽鼠标右键
        evt = window.event || arguments[0];
        var targetEle = evt.target;
        if ($(targetEle).parents("pre").length>0 || (targetEle.nodeType === 1 && targetEle.localName === 'pre')) {
            var rightedge = evt.clientX;
            var bottomedge = evt.clientY;
            epMenu.create({left: rightedge, top: bottomedge}, [{name: '删除', 'action': del}]);
        }
    }
}
