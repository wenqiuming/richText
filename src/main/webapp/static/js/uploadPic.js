document.addEventListener('paste', function (event) {
        //console.log(event);
        var isChrome = false;
        if (event.clipboardData || event.originalEvent) {
            //阻止默认行为即不让剪贴板内容在div中显示出来
            event.preventDefault();
            //not for ie11  某些chrome版本使用的是event.originalEvent
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            var text = clipboardData.getData('text/plain');
            if (text !== "") {
                document.execCommand('insertText', false, text);
                //如果代码粘贴,更新代码格式显示
                //代码高亮
                var selection = window.getSelection ? window.getSelection() : document.getSelection();
                var anchorNode = selection.anchorNode;
                if ($(anchorNode).hasClass(".prettyprint")||$(anchorNode).parents(".prettyprint").length>0){
                    var prettyNode=$(anchorNode).hasClass(".prettyprint")?anchorNode:$(anchorNode).parents(".prettyprint")[0];
                    var c=$("<div></div>")[0];
                    c.innerText=prettyNode.innerText;
                    $(prettyNode).html(c.outerHTML);
                    $(prettyNode).removeClass("prettyprinted");
                    //prettyPrintOne(prettyNode);
                    prettyPrint();
                    selection.collapse(prettyNode,1);
                }
                return;
            }
            if (clipboardData.items) {
                // for chrome
                var items = clipboardData.items,
                    len = items.length,
                    blob = null;
                isChrome = true;
                //items.length比较有意思，初步判断是根据mime类型来的，即有几种mime类型，长度就是几（待验证）
                //如果粘贴纯文本，那么len=1，如果粘贴网页图片，len=2, items[0].type = 'text/plain', items[1].type = 'image/*'
                //如果使用截图工具粘贴图片，len=1, items[0].type = 'image/png'
                //如果粘贴纯文本+HTML，len=2, items[0].type = 'text/plain', items[1].type = 'text/html'
                // console.log('len:' + len);
                // console.log(items[0]);
                // console.log(items[1]);
                // console.log( 'items[0] kind:', items[0].kind );
                // console.log( 'items[0] MIME type:', items[0].type );
                // console.log( 'items[1] kind:', items[1].kind );
                // console.log( 'items[1] MIME type:', items[1].type );
                //在items里找粘贴的image,据上面分析,需要循环
                for (var i = 0; i < len; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        //getAsFile() 此方法只是living standard firefox ie11 并不支持
                        blob = items[i].getAsFile();
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            // event.target.result 即为图片的Base64编码字符串
                            var base64_str = event.target.result;
                            var outerHtml = createStretchPic(base64_str).outerHTML;
                            var selection = window.getSelection ? window.getSelection() : document.getSelection();
                            var anchorNode = selection.anchorNode;
                            var nowLine = findLineDiv(anchorNode, selection);
                            var imgLine = $("<div class='line-div' contenteditable='false'></div>")[0];
                            $(imgLine).append(outerHtml);
                            insertAfter(imgLine, nowLine);
                            //如果空行,删除
                            if (nowLine.innerHTML===undefined||nowLine.innerHTML===null||nowLine.innerHTML==="<br>"||$.trim(nowLine.innerHTML.replace(/&nbsp;/g,""))===""){
                                nowLine.remove();
                            }
                            $(".stretch-photo-container .focus-cell").css("display", "none");
                            $(".right-bottom-focus").mousedown(function (e) {
                                active_StretchPic_isEnter = true;
                                active_StretchPic_orginalX = e.clientX;
                                active_StretchPic_orginalY = e.clientY;
                                active_StretchPic_wid = $(".stretch-photo-container.active img").width();
                                active_StretchPic_hei = $(".stretch-photo-container.active img").height();
                            });
                            //添加右键删除功能
                            $(".stretch-photo-container").parent(".line-div").smartMenu(imgSettings, {"name": "img"});
                            dealLastLine();
                            //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
                        };//reader.onload
                        reader.readAsDataURL(blob);
                    }
                }
            } else {
                //for firefox
                setTimeout(function () {
                    //设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
                    var imgList = document.querySelectorAll('#aaa img'),
                        len = imgList.length,
                        src_str = '',
                        i;
                    for (i = 0; i < len; i++) {
                        if (imgList[i].className !== 'my_img') {
                            //如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
                            src_str = imgList[i].src;
                        }
                    }
                }, 1);
            }
        } else {
            //for ie11
            setTimeout(function () {
                var imgList = document.querySelectorAll('#aaa img'),
                    len = imgList.length,
                    src_str = '',
                    i;
                for (i = 0; i < len; i++) {
                    if (imgList[i].className !== 'my_img') {
                        src_str = imgList[i].src;
                    }
                }
            }, 1);
        }
    }
);

//调用图片上传接口,将file文件以formData形式上传
function uploadImgFromPaste(file, type, isChrome) {
    var formData = new FormData();
    formData.append('files', file);
    formData.append('submission-type', type);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload_editor_photo3');
    xhr.onload = function () {
        console.log(xhr.readyState);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText),
                    editor = document.getElementById('aaa');
                if (isChrome) {
                    var len = data.data.length;
                    for (var i = 0; i < len; i++) {
                        var img = document.createElement('img');
                        img.className = 'my_img';
                        img.src = data.data[i]; //设置上传完图片之后展示的图片
                        editor.appendChild(img);
                    }
                } else {
                    var imgList = document.querySelectorAll('#aaa img'),
                        len = imgList.length,
                        i;
                    for (i = 0; i < len; i++) {
                        if (imgList[i].className !== 'my_img') {
                            imgList[i].className = 'my_img';
                            imgList[i].src = data.data[i];
                        }
                    }
                }

            } else {
                console.log(xhr.statusText);
            }
        }
        ;
    };
    xhr.onerror = function (e) {
        console.log(xhr.statusText);
    }
    xhr.send(formData);
}

function createStretchPic(srcRes) {
    var imgContainer = document.createElement('div');
    imgContainer.className = 'stretch-photo-container';
    var leftTop = document.createElement('s');
    leftTop.className = 'left-top-focus focus-cell';
    var leftBottom = document.createElement('s');
    leftBottom.className = 'left-bottom-focus focus-cell';
    var rightTop = document.createElement('s');
    rightTop.className = 'right-top-focus focus-cell';
    var rightBottom = document.createElement('s');
    rightBottom.className = 'right-bottom-focus focus-cell';
    $(imgContainer).append(leftTop);
    $(imgContainer).append(leftBottom);
    $(imgContainer).append(rightTop);
    $(imgContainer).append(rightBottom);
    $(imgContainer).attr("contenteditable", "false");
    var img = document.createElement('img');
    img.src = srcRes;
    $(imgContainer).append(img);
    return imgContainer;
}

$(window).click(function (e) {
    var tarEle = e.target;
    var isStretchPic = false;
    $(".stretch-photo-container").removeClass("active");
    if ($(tarEle).hasClass("stretch-photo-container")) {
        isStretchPic = true;
        $($(tarEle)).addClass("active");
    }
    if ($(tarEle).parents(".stretch-photo-container").length > 0) {
        isStretchPic = true;
        $($(tarEle).parents(".stretch-photo-container")[0]).addClass("active");
    }
    $(".stretch-photo-container .focus-cell").css({"display": "none"});

    if (isStretchPic) {
        $(".stretch-photo-container.active").width($(".stretch-photo-container.active img").width);
        $(".stretch-photo-container.active").height($(".stretch-photo-container.active img").height);
        $(".stretch-photo-container.active .focus-cell").css({"display": "inline-block"});
    }


});
var active_StretchPic_orginalX = 0;
var active_StretchPic_orginalY = 0;
var active_StretchPic_wid = 0;
var active_StretchPic_hei = 0;
var active_StretchPic_isEnter = false;
$(".right-bottom-focus").mousedown(function (e) {
    active_StretchPic_isEnter = true;
    active_StretchPic_orginalX = e.clientX;
    active_StretchPic_orginalY = e.clientY;
    active_StretchPic_wid = $(".stretch-photo-container.active img").width();
    active_StretchPic_hei = $(".stretch-photo-container.active img").height();
});
$(window).mousemove(function (e) {
    if (!active_StretchPic_isEnter) {
        return;
    }
    var diffY = e.clientY - active_StretchPic_orginalY;
    var diffX = e.clientX - active_StretchPic_orginalX;
    $(".stretch-photo-container.active").css("width", "auto");
    $(".stretch-photo-container.active img").width(active_StretchPic_wid + diffX);
    if ($(".stretch-photo-container.active img").width() < 40) {
        $(".stretch-photo-container.active img").width(40);
    }
    //$(".stretch-photo-container.active").height(active_StretchPic_hei+diffY);
    $(".stretch-photo-container.active img").height(active_StretchPic_hei + diffY);
    if ($(".stretch-photo-container.active img").height() < 40) {
        $(".stretch-photo-container.active img").height(40);
    }
});
$(window).mouseup(function () {
    active_StretchPic_isEnter = false;
});

var contains = function (root, el) {
    if (root.compareDocumentPosition)
        return root === el || !!(root.compareDocumentPosition(el) & 16);
    if (root.contains && el.nodeType === 1) {
        return root.contains(el) && root !== el;
    }
    while ((el = el.parentNode))
        if (el === root) return true;
    return false;
}
