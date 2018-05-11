/*
 * Bootstrap 3.3.6 IconPicker - jQuery plugin for Icon selection
 *
 * Copyright (c) 20013 A. K. M. Rezaul Karim<titosust@gmail.com>
 * Modifications (c) 20015 Paden Clayton<fasttracksites.com>
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://github.com/titosust/Bootstrap-icon-picker
 *
 * Version:  1.0.1
 *
 */

(function ($) {
    var emojiStartIndex=0;
    var per_page = 30;
    $.fn.emojiPicker = function (options) {
        var mouseOver = false;
        var $popup = null;
        var roote = "../../static/img/emoji/";
        var icons = ['d_aini.gif', 'd_aoteman.gif', 'd_baibai.gif', 'd_baobao.gif', 'd_beishang.gif', 'd_bingbujiandan.gif', 'd_bishi.gif', 'd_bizui.gif', 'd_chanzui.gif', 'd_chijing.gif', 'd_dahaqi.gif', 'd_dalian.gif', 'd_ding.gif', 'd_doge.gif', 'd_erha.gif', 'd_feijie.gif', 'd_feizao.gif', 'd_ganmao.gif', 'd_guzhang.gif', 'd_haha.gif', 'd_haixiu.gif', 'd_han.gif', 'd_hehe.gif', 'd_heiheihei.gif', 'd_heixian.gif', 'd_heng.gif', 'd_huaixiao.gif', 'd_huaxin.gif', 'd_jiyan.gif', 'd_keai.gif', 'd_kelian.gif', 'd_ku.gif', 'd_kulou.gif', 'd_kun.gif', 'd_landelini.gif', 'd_lei.gif', 'd_madaochenggong.gif', 'd_miao.gif', 'd_nanhaier.gif', 'd_nu.gif', 'd_numa.gif', 'd_nvhaier.gif', 'd_qian.gif', 'd_qinqin.gif', 'd_shayan.gif', 'd_shengbing.gif', 'd_shenshou.gif', 'd_shiwang.gif', 'd_shuai.gif', 'd_shuijiao.gif', 'd_sikao.gif', 'd_taikaixin.gif', 'd_tanshou.gif', 'd_tian.gif', 'd_touxiao.gif', 'd_tu.gif', 'd_tuzi.gif', 'd_wabishi.gif', 'd_weiqu.gif', 'd_wu.gif', 'd_xiaoku.gif', 'd_xingxingyan.gif', 'd_xiongmao.gif', 'd_xixi.gif', 'd_xu.gif', 'd_yinxian.gif', 'd_yiwen.gif', 'd_youhengheng.gif', 'd_yun.gif', 'd_yunbei.gif', 'd_zhuakuang.gif', 'd_zhutou.gif', 'd_zuiyou.gif'];
        var iconsName = ['爱你', '奥特曼', '拜拜', '抱抱', '悲伤', '并不简单', '鄙视', '闭嘴', '馋嘴', '吃惊', '打哈欠', '打脸', '叮', 'doge', '二哈', '费解', '肥皂', '感冒', '鼓掌', '哈哈', '害羞', '汗', '呵呵', '嘿嘿嘿', '嘿线', '哼', '坏笑', '花心', '挤眼', '可爱', '可怜', '酷', '骷髅', '困', '懒得理你', '泪', '马到成功', '喵', '男孩儿', '怒', '怒骂', '女孩儿', '钱', '亲亲', '傻眼', '生病', '神兽', '失望', '衰', '睡觉', 'd思考', '太开心', '摊手', '舔', '偷笑', '吐', '兔子', '挖鼻屎', '委屈', '污', '笑哭', '星星眼', '熊猫', '嘻嘻', '虚', '阴险', '疑问', '右哼哼', '晕', '捂脸', '抓狂', '猪头', '最右'];
        var settings = $.extend({}, options);
        var emojiElement;
        return this.each(function () {
            emojiElement = this;
            if ($(this).data("emojiPicker") == undefined) {
                $(this).click(function (e) {
                    var existMenus = $(".emoji-popup").remove();
                    if (existMenus.length > 0) {
                        removeInstance();
                    } else {
                        createUI($(emojiElement));
                        showList($(emojiElement), icons);
                    }
                    $(".icon-popup").remove();
                    e.stopPropagation();
                });
                $(this).data("emojiPicker", {attached: true});
            }
            function createUI($emojiElement) {
                $popup = $('<div/>', {
                    css: {
                        'top': $emojiElement.offset().top + $emojiElement.outerHeight(),
                        'left': $emojiElement.offset().left - 3
                    },
                    class: 'emoji-popup'
                });
                $popup.html('<div class="ip-control"> \
						          <ul> \
						            <li><a href="javascript:;" class="btn" data-dir="-1"><span class="glyphicon  glyphicon-fast-backward"></span></a></li> \
						            <li><a href="javascript:;"  class="btn" data-dir="1"><span class="glyphicon  glyphicon-fast-forward"></span></a></li> \
						          </ul> \
						      </div> \
						     <div class="icon-list"> </div> \
					         ').appendTo("body");
                $popup.addClass('dropdown-menu').show();
                $popup.mouseenter(function () {
                    mouseOver = true;
                }).mouseleave(function () {
                    mouseOver = false;
                });
                //如果超出边界
                var winWidth = $("body").outerWidth();
                var left = $popup.offset().left;
                var popWidth = $popup.outerWidth();
                if (left + popWidth > winWidth) {
                    $popup.css("left", winWidth - popWidth - 10 + "px");
                }
                var lastVal = "", start_index = emojiStartIndex,end_index = start_index + per_page;
                $(".ip-control .btn", $popup).click(function (e) {
                    e.stopPropagation();
                    var dir = $(this).attr("data-dir");
                    start_index = start_index + per_page * dir;
                    start_index = start_index < 0 ? 0 : start_index;
                    var maxPage = icons.length % per_page === 0 ? parseInt(icons.length / per_page) : parseInt(icons.length / per_page) + 1;
                    start_index = start_index >= maxPage * per_page ? (maxPage - 1) * per_page : start_index;
                    emojiStartIndex=start_index;
                    $.each($(".icon-list>ul li"), function (i) {
                        if (i >= start_index && i < start_index + per_page) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                });
            }

            function removeInstance() {
                $(".icon-popup").remove();
            }

            function showList($emojiElement, arrLis) {
                $ul = $("<ul>");
                for (var i in arrLis) {
                    var changeTitle = arrLis[i].replace(" ", "_");
                    $ul.append("<li title='"+iconsName[i]+"'><a href=\"#\" title=" + changeTitle + "><img  title='"+iconsName[i]+"' class='emoji-cell' src=\"" + roote + arrLis[i] + "\"/></a></li>");
                }
                ;
                $(".icon-list", $popup).html($ul);
                $.each($(".icon-list>ul li"), function (i) {
                    if (i >= emojiStartIndex && i < emojiStartIndex + per_page) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
                $(".icon-list li a", $popup).click(function (e) {
                    var resource = $($(this).children("img")[0]).attr("src");
                    if (settings.clickIconEvent) {
                        settings.clickIconEvent(resource);
                    }
                    removeInstance();
                });
            }
        });
    }

}(jQuery));
