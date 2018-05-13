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
    var iconStartIndex=0;
    var per_page = 30;
    $.fn.iconPicker = function (options) {
        var mouseOver = false;
        var $popup = null;
        var glyphicon = new Array("glyphicon glyphicon-asterisk", "glyphicon glyphicon-plus", "glyphicon glyphicon-euro", "glyphicon glyphicon-eur", "glyphicon glyphicon-minus", "glyphicon glyphicon-cloud", "glyphicon glyphicon-envelope", "glyphicon glyphicon-pencil", "glyphicon glyphicon-glass", "glyphicon glyphicon-music", "glyphicon glyphicon-search", "glyphicon glyphicon-heart", "glyphicon glyphicon-star", "glyphicon glyphicon-star-empty", "glyphicon glyphicon-user", "glyphicon glyphicon-film", "glyphicon glyphicon-th-large", "glyphicon glyphicon-th", "glyphicon glyphicon-th-list", "glyphicon glyphicon-ok", "glyphicon glyphicon-remove", "glyphicon glyphicon-zoom-in", "glyphicon glyphicon-zoom-out", "glyphicon glyphicon-off", "glyphicon glyphicon-signal", "glyphicon glyphicon-cog", "glyphicon glyphicon-trash", "glyphicon glyphicon-home", "glyphicon glyphicon-file", "glyphicon glyphicon-time", "glyphicon glyphicon-road", "glyphicon glyphicon-download-alt", "glyphicon glyphicon-download", "glyphicon glyphicon-upload", "glyphicon glyphicon-inbox", "glyphicon glyphicon-play-circle", "glyphicon glyphicon-repeat", "glyphicon glyphicon-refresh", "glyphicon glyphicon-list-alt", "glyphicon glyphicon-lock", "glyphicon glyphicon-flag", "glyphicon glyphicon-headphones", "glyphicon glyphicon-volume-off", "glyphicon glyphicon-volume-down", "glyphicon glyphicon-volume-up", "glyphicon glyphicon-qrcode", "glyphicon glyphicon-barcode", "glyphicon glyphicon-tag", "glyphicon glyphicon-tags", "glyphicon glyphicon-book", "glyphicon glyphicon-bookmark", "glyphicon glyphicon-print", "glyphicon glyphicon-camera", "glyphicon glyphicon-font", "glyphicon glyphicon-bold", "glyphicon glyphicon-italic", "glyphicon glyphicon-text-height", "glyphicon glyphicon-text-width", "glyphicon glyphicon-align-left", "glyphicon glyphicon-align-center", "glyphicon glyphicon-align-right", "glyphicon glyphicon-align-justify", "glyphicon glyphicon-list", "glyphicon glyphicon-indent-left", "glyphicon glyphicon-indent-right", "glyphicon glyphicon-facetime-video", "glyphicon glyphicon-picture", "glyphicon glyphicon-map-marker", "glyphicon glyphicon-adjust", "glyphicon glyphicon-tint", "glyphicon glyphicon-edit", "glyphicon glyphicon-share", "glyphicon glyphicon-check", "glyphicon glyphicon-move", "glyphicon glyphicon-step-backward", "glyphicon glyphicon-fast-backward", "glyphicon glyphicon-backward", "glyphicon glyphicon-play", "glyphicon glyphicon-pause", "glyphicon glyphicon-stop", "glyphicon glyphicon-forward", "glyphicon glyphicon-fast-forward", "glyphicon glyphicon-step-forward", "glyphicon glyphicon-eject", "glyphicon glyphicon-chevron-left", "glyphicon glyphicon-chevron-right", "glyphicon glyphicon-plus-sign", "glyphicon glyphicon-minus-sign", "glyphicon glyphicon-remove-sign", "glyphicon glyphicon-ok-sign", "glyphicon glyphicon-question-sign", "glyphicon glyphicon-info-sign", "glyphicon glyphicon-screenshot", "glyphicon glyphicon-remove-circle", "glyphicon glyphicon-ok-circle", "glyphicon glyphicon-ban-circle", "glyphicon glyphicon-arrow-left", "glyphicon glyphicon-arrow-right", "glyphicon glyphicon-arrow-up", "glyphicon glyphicon-arrow-down", "glyphicon glyphicon-share-alt", "glyphicon glyphicon-resize-full", "glyphicon glyphicon-resize-small", "glyphicon glyphicon-exclamation-sign", "glyphicon glyphicon-gift", "glyphicon glyphicon-leaf", "glyphicon glyphicon-fire", "glyphicon glyphicon-eye-open", "glyphicon glyphicon-eye-close", "glyphicon glyphicon-warning-sign", "glyphicon glyphicon-plane", "glyphicon glyphicon-calendar", "glyphicon glyphicon-random", "glyphicon glyphicon-comment", "glyphicon glyphicon-magnet", "glyphicon glyphicon-chevron-up", "glyphicon glyphicon-chevron-down", "glyphicon glyphicon-retweet", "glyphicon glyphicon-shopping-cart", "glyphicon glyphicon-folder-close", "glyphicon glyphicon-folder-open", "glyphicon glyphicon-resize-vertical", "glyphicon glyphicon-resize-horizontal", "glyphicon glyphicon-hdd", "glyphicon glyphicon-bullhorn", "glyphicon glyphicon-bell", "glyphicon glyphicon-certificate", "glyphicon glyphicon-thumbs-up", "glyphicon glyphicon-thumbs-down", "glyphicon glyphicon-hand-right", "glyphicon glyphicon-hand-left", "glyphicon glyphicon-hand-up", "glyphicon glyphicon-hand-down", "glyphicon glyphicon-circle-arrow-right", "glyphicon glyphicon-circle-arrow-left", "glyphicon glyphicon-circle-arrow-up", "glyphicon glyphicon-circle-arrow-down", "glyphicon glyphicon-globe", "glyphicon glyphicon-wrench", "glyphicon glyphicon-tasks", "glyphicon glyphicon-filter", "glyphicon glyphicon-briefcase", "glyphicon glyphicon-fullscreen", "glyphicon glyphicon-dashboard", "glyphicon glyphicon-paperclip", "glyphicon glyphicon-heart-empty", "glyphicon glyphicon-link", "glyphicon glyphicon-phone", "glyphicon glyphicon-pushpin", "glyphicon glyphicon-usd", "glyphicon glyphicon-gbp", "glyphicon glyphicon-sort", "glyphicon glyphicon-sort-by-alphabet", "glyphicon glyphicon-sort-by-alphabet-alt", "glyphicon glyphicon-sort-by-order", "glyphicon glyphicon-sort-by-order-alt", "glyphicon glyphicon-sort-by-attributes", "glyphicon glyphicon-sort-by-attributes-alt", "glyphicon glyphicon-unchecked", "glyphicon glyphicon-expand", "glyphicon glyphicon-collapse-down", "glyphicon glyphicon-collapse-up", "glyphicon glyphicon-log-in", "glyphicon glyphicon-flash", "glyphicon glyphicon-log-out", "glyphicon glyphicon-new-window", "glyphicon glyphicon-record", "glyphicon glyphicon-save", "glyphicon glyphicon-open", "glyphicon glyphicon-saved", "glyphicon glyphicon-import", "glyphicon glyphicon-export", "glyphicon glyphicon-send", "glyphicon glyphicon-floppy-disk", "glyphicon glyphicon-floppy-saved", "glyphicon glyphicon-floppy-remove", "glyphicon glyphicon-floppy-save", "glyphicon glyphicon-floppy-open", "glyphicon glyphicon-credit-card", "glyphicon glyphicon-transfer", "glyphicon glyphicon-cutlery", "glyphicon glyphicon-header", "glyphicon glyphicon-compressed", "glyphicon glyphicon-earphone", "glyphicon glyphicon-phone-alt", "glyphicon glyphicon-tower", "glyphicon glyphicon-stats", "glyphicon glyphicon-sd-video", "glyphicon glyphicon-hd-video", "glyphicon glyphicon-subtitles", "glyphicon glyphicon-sound-stereo", "glyphicon glyphicon-sound-dolby", "glyphicon glyphicon-sound-5-1", "glyphicon glyphicon-sound-6-1", "glyphicon glyphicon-sound-7-1", "glyphicon glyphicon-copyright-mark", "glyphicon glyphicon-registration-mark", "glyphicon glyphicon-cloud-download", "glyphicon glyphicon-cloud-upload", "glyphicon glyphicon-tree-conifer", "glyphicon glyphicon-tree-deciduous", "glyphicon glyphicon-cd", "glyphicon glyphicon-save-file", "glyphicon glyphicon-open-file", "glyphicon glyphicon-level-up", "glyphicon glyphicon-copy", "glyphicon glyphicon-paste", "glyphicon glyphicon-alert", "glyphicon glyphicon-equalizer", "glyphicon glyphicon-king", "glyphicon glyphicon-queen", "glyphicon glyphicon-pawn", "glyphicon glyphicon-bishop", "glyphicon glyphicon-knight", "glyphicon glyphicon-baby-formula", "glyphicon glyphicon-tent", "glyphicon glyphicon-blackboard", "glyphicon glyphicon-bed", "glyphicon glyphicon-apple", "glyphicon glyphicon-erase", "glyphicon glyphicon-hourglass", "glyphicon glyphicon-lamp", "glyphicon glyphicon-duplicate", "glyphicon glyphicon-piggy-bank", "glyphicon glyphicon-scissors", "glyphicon glyphicon-bitcoin", "glyphicon glyphicon-btc", "glyphicon glyphicon-xbt", "glyphicon glyphicon-yen", "glyphicon glyphicon-jpy", "glyphicon glyphicon-ruble", "glyphicon glyphicon-rub", "glyphicon glyphicon-scale", "glyphicon glyphicon-ice-lolly", "glyphicon glyphicon-ice-lolly-tasted", "glyphicon glyphicon-education", "glyphicon glyphicon-option-horizontal", "glyphicon glyphicon-option-vertical", "glyphicon glyphicon-menu-hamburger", "glyphicon glyphicon-modal-window", "glyphicon glyphicon-oil", "glyphicon glyphicon-grain", "glyphicon glyphicon-sunglasses", "glyphicon glyphicon-text-size", "glyphicon glyphicon-text-color", "glyphicon glyphicon-text-background", "glyphicon glyphicon-object-align-top", "glyphicon glyphicon-object-align-bottom", "glyphicon glyphicon-object-align-horizontal", "glyphicon glyphicon-object-align-left", "glyphicon glyphicon-object-align-vertical", "glyphicon glyphicon-object-align-right", "glyphicon glyphicon-triangle-right", "glyphicon glyphicon-triangle-left", "glyphicon glyphicon-triangle-bottom", "glyphicon glyphicon-triangle-top", "glyphicon glyphicon-console", "glyphicon glyphicon-superscript", "glyphicon glyphicon-subscript", "glyphicon glyphicon-menu-left", "glyphicon glyphicon-menu-right", "glyphicon glyphicon-menu-down", "glyphicon glyphicon-menu-up");
        var icons = glyphicon;
        var settings = $.extend({}, options);
        return this.each(function () {
            element = this;
            if (!settings.buttonOnly && $(this).data("iconPicker") == undefined) {
                $(this).click(function (e) {
                    var existMenus = $(".icon-popup").remove();
                    if (existMenus.length > 0) {
                        removeInstance();
                    } else {
                        createUI($(element));
                        showList($(element), icons);
                    }
                    $(".emoji-popup").remove();
                    e.stopPropagation();
                });
                $(this).data("iconPicker", {attached: true});
            }
            function createUI($element) {
                $popup = $('<div/>', {
                    css: {
                        'top': $element.offset().top + $element.outerHeight(),
                        'left': $element.offset().left - 3
                    },
                    class: 'icon-popup'
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
                var lastVal = "", start_index = iconStartIndex, per_page = 30, end_index = start_index + per_page;
                $(".ip-control .btn", $popup).click(function (e) {
                    e.stopPropagation();
                    var dir = $(this).attr("data-dir");
                    start_index = start_index + per_page * dir;
                    start_index = start_index < 0 ? 0 : start_index;
                    var maxPage = icons.length % per_page === 0 ? parseInt(icons.length / per_page) : parseInt(icons.length / per_page) + 1;
                    start_index=start_index>=maxPage*per_page?(maxPage-1)*per_page:start_index;
                    $.each($(".icon-list>ul li"), function (i) {
                        if (i >= start_index && i < start_index + per_page) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                    iconStartIndex=start_index;
                });
            }

            function removeInstance() {
                $(".icon-popup").remove();
            }

            function showList($element, arrLis) {
                $ul = $("<ul>");
                for (var i in arrLis) {
                    var changeTitle = arrLis[i].replace(" ", "_");
                    $ul.append("<li><a href=\"#\" title=" + changeTitle + "><span class=\"" + arrLis[i] + "\"></span></a></li>");
                }
                $(".icon-list", $popup).html($ul);
                $.each($(".icon-popup .icon-list>ul li"), function (i) {
                    if (i >= iconStartIndex && i < iconStartIndex + per_page) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
                $(".icon-list li a", $popup).click(function (e) {
                    var title = $(this).attr("title");
                    var realStyle = title.replace("_", " ");
                    if (settings.clickIconEvent) {
                        settings.clickIconEvent(realStyle);
                    }
                    removeInstance();
                });
            }
        });
    }

}(jQuery));
