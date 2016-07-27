/* global $:true */
+function ($) {
  var modal = $.modal.prototype.defaults;
  modal.modalButtonOk = "确定";
  modal.modalButtonCancel = "取消";
  modal.modalPreloaderTitle = "正在加载...";

  var calendar = $.fn.calendar.prototype.defaults;
  
  calendar.monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'];
  calendar.monthNamesShort = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'];
  calendar.dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  calendar.dayNamesShort = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
}($);
/*===============================================================================
************   Accordion   ************
===============================================================================*/
/* global Zepto:true */
+function ($) {
    "use strict";

    $.accordionToggle = function (item) {
        item = $(item);
        if (item.length === 0) return;
        if (item.hasClass('accordion-item-expanded')) $.accordionClose(item);
        else $.accordionOpen(item);
    };
    $.accordionOpen = function (item) {
        item = $(item);
        var list = item.parents('.accordion-list').eq(0);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        var expandedItem = list.length > 0 && item.parent().children('.accordion-item-expanded');
        if (expandedItem.length > 0) {
            $.accordionClose(expandedItem);
        }
        content.css('height', content[0].scrollHeight + 'px').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                //content.transition(0);
                //content.css('height', 'auto');
                //var clientLeft = content[0].clientLeft;
                //content.transition('');
                item.trigger('opened');
            }
            else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('open');
        item.addClass('accordion-item-expanded');
    };
    $.accordionClose = function (item) {
        item = $(item);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        item.removeClass('accordion-item-expanded');
        //content.transition(0);
        content.css('height', content[0].scrollHeight + 'px');
        // Relayout
        //var clientLeft = content[0].clientLeft;
        // Close
        //content.transition('');
        content.css('height', '').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                //content.transition(0);
                //content.css('height', 'auto');
                //var clientLeft = content[0].clientLeft;
                //content.transition('');
                item.trigger('opened');
            }
            else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('close');
    };

    $(document).on("click", ".accordion-item .item-content, .accordion-item-toggle", function(e) {
        e.preventDefault();
        var clicked = $(this);
        // Accordion
        if (clicked.hasClass('accordion-item-toggle') || (clicked.hasClass('item-link') && clicked.parent().hasClass('accordion-item'))) {
            var accordionItem = clicked.parent('.accordion-item');
            if (accordionItem.length === 0) accordionItem = clicked.parents('.accordion-item');
            if (accordionItem.length === 0) accordionItem = clicked.parents('li');
            $.accordionToggle(accordionItem);
        }
    });
}(jQuery);

/*
    h5上传图片带预览功能控件
    时间：2016年6月6日
    版本：1.0
*/
(function (jq) {
    //opt:配置 
    //  name = input表单名称(默认uploadfile)
    //  exts = 允许的后缀名(array,默认4种图片格式) 
    //  max = 最大上传数量(默认3)
    //  size = 文件最大大小(字节,默认3M)
    //  del = 移除图片时是否提示(默认提示)
    //msg:消息内容，配置项与opt项同
    jq.fn.h5upload = function (opt, msg) {
        opt = jq.extend({ exts: ['jpg', 'gif', 'png', 'jpeg'], max: 3, size: 3145728, del: true, name: 'uploadfile' }, opt);
        msg = jq.extend({ exts: "文件格式不合法！", max: "最多允许上传" + opt.max + "张", size: "文件大小不得超过" + (opt.size / 1024) + "kb", del: "是否移除此图像？" }, msg);
        var $self = $(this);
        var $plus = null;
        var curFileCount = 0;
        function onadd() {
            //console.log($self);
            $self.find("input[name=" + opt.name+ "]:last").click();
            return $self.find("input[name=" + opt.name+ "]:last").click();
        }
        function addEvent($input) {
            $input.change(function () {
                var file = this.files[0];
                var URL = window.URL || window.webkitURL;
                console.log(URL.createObjectURL(file));
                if (checkFile(file)) {
                    var r = new FileReader();
                    r.readAsDataURL(file);
                    r.onload = function () {
                    	$.showPreloader('图片正在加载中，请稍候！');
                    	lrz(file,{width: 750})
                    	.then(function (results) {
      						// 你需要的数据都在这里，可以以字符串的形式传送base64给服务端转存为图片。
      						console.log(results); 
      						console.log(results.blob);
      						console.log(results.origin.size);
      						console.log(results.base64);
      						console.log(results.base64.length * 0.8);

      						setTimeout(function () {
        						$.hidePreloader();
    						}, 2000);
                        	
                        	//$img = $("<div class='cropper-body'><img class='cropper-image' src='" + URL.createObjectURL(file) + "'></div>");
                        	$img = $("<div class='cropper-body'><img class='cropper-image' src='" + results.base64 + "'></div>");
                        	$('.popup-cropper').find('.cropper-preview').append($img);
                        	$.popup('.popup-cropper');

                        	//cropper
                        	var $image = $('.cropper-image');
                        	var $button = $('.btn-cropper');
                        	var croppable = false;
                        	$image.cropper({
                            	aspectRatio: 1,
                            	viewMode: 1,
                            	dragMode: 'move', // 'crop', 'move' or 'none'
                            	cropBoxMovable: false,
                            	cropBoxResizable: false,
                            	built: function () {
                                	croppable = true;
                            	}
                        	});
                        	$('.popup-cropper .close-popup').unbind("click").on('click', function () {
                            	$image.cropper("reset");
                            	$('.popup-cropper').find('.cropper-preview').empty();
                            	$.closeModal('.popup-cropper');
                        	});
                        	$button.unbind("click").on('click', function () {
                        		$.showPreloader('正在处理，请稍候！');
                            	var croppedCanvas=null;
                            	if (!croppable) {
                                	return;
                            	}
                            	// Crop
                            	croppedCanvas = $image.cropper('getCroppedCanvas');
                            	console.log(croppedCanvas);
                            	$imgdiv = $("<div class='h5upload_item h5upload_img' style='background-image:url(" + croppedCanvas.toDataURL() + ")'></div>");
                            	$imgclose = $("<img class='h5upload_delimg' src='"+closeimg+"'/>");
                            	//保存关联对象到dom，以便删除使用
                            	$imgclose[0].link = [$input, $imgdiv];
                            	$imgclose.unbind("click").on('click', function () {
                                	removefile(this);
                                	$self.find("input[name=" + opt.name+ "]:last").data('base64', '');
                            	});
                            	// $plus.before($imgdiv.append($imgclose));
                            	// $self.find("input[name=" + opt.name+ "]:last").data('base64', croppedCanvas.toDataURL());
                            	// console.log($self.find("input[name=" + opt.name+ "]:last").data('base64'));
                            	//newfile();
                            	
                            	setTimeout(function(){
                            		//$image.cropper("destroy");
                            		$image.cropper("reset");
                            		$('.popup-cropper').find('.cropper-preview').empty();
                            		$.closeModal('.popup-cropper');
                            		$plus.before($imgdiv.append($imgclose));
                            		$self.find("input[name=" + opt.name+ "]:last").data('base64', croppedCanvas.toDataURL());
                            		console.log($self.find("input[name=" + opt.name+ "]:last").data('base64'));
                            		newfile();
                            	},2000);
                            	
                        	});
                        })
						.catch(function (err) {
            				// 处理失败会执行
            				$.showPreloader('图片加载失败，请重试！');
            				setTimeout(function () {
        						$.hidePreloader();
    						}, 2000);
    						$.closeModal('.popup-cropper');
        				})
        				.always(function () {
            				// 不管是成功失败，都会执行
        				});
                        /*$imgdiv = $("<div class='h5upload_item h5upload_img' style='background-image:url(" + this.result + ")'></div>");
                        $imgclose = $("<img class='h5upload_delimg' src='"+closeimg+"'/>");
                        //保存关联对象到dom，以便删除使用
                        $imgclose[0].link = [$input, $imgdiv];
                        $imgclose.click(function () {
                            removefile(this);
                        });
                        $plus.before($imgdiv.append($imgclose));
                        newfile();*/
                    }
                }
            });
        }
        function addInput($parent) {
            return $("<input type='file' name='" + opt.name + "' style='display:none'/>").appendTo($parent);
        }
        function newfile() {
        	setTimeout(function () {
        		$.hidePreloader();
    		}, 2000);
            if (curFileCount < opt.max) {
            	$input = addInput($self);
           		addEvent($input);  
           		curFileCount++;
            }else{
            	$plus.hide();
            } 
            return true;                   
        }
        // function newfile() {
        //     curFileCount++;
        //     console.log(curFileCount);
        //     if (curFileCount > opt.max) {
        //         $plus.hide();
        //     }
        //     $input = addInput($self);
        //    	addEvent($input);          
        // }
        function removefile(base) {
            if (opt.del) {
                $.confirm(msg.del, function () {
                	if(curFileCount!=1){
                		base.link[0].remove();
                		curFileCount--;
                	}
                	base.link[1].remove();
                    if (curFileCount <= opt.max) {
                        $plus.show();
                    }
                });
            }
        }
        function init() {
            $plus = $("<img src='"+plusimg+"' class='h5upload_item'/>");
            $self.append($plus).append("<div class='h5upload_clear'></div>");
            $plus.click(onadd);
            return $plus;
        }
        function checkFile(file) {
            //后缀名检测
            var sps = file.name.substring(file.name.lastIndexOf(".")+1,file.name.length);
            if (opt.exts.indexOf(sps.toLowerCase()) < 0) return falsemsg('exts');
            //大小检测
            if (file.size > opt.size) return falsemsg("size");
            return true;
        }
        function falsemsg(key) {
            //if (msg[key]) alert(msg[key]); 
            if (msg[key]) $.alert(msg[key]);
            return false;
        }
        $plus = init();
        newfile();
    }
    var plusimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKEAAAChCAYAAACvUd+2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTRBQzkwRTMyQkIxMTFFNkFEMUNCQUQyQzgwRDk0QkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTRBQzkwRTQyQkIxMTFFNkFEMUNCQUQyQzgwRDk0QkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NEFDOTBFMTJCQjExMUU2QUQxQ0JBRDJDODBEOTRCRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NEFDOTBFMjJCQjExMUU2QUQxQ0JBRDJDODBEOTRCRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvFhRYoAAALtSURBVHja7NxPSuNQHMDxGLProOIBxPXAiAvBG3gDr+HKY3gDZ+sluutScGBQcC1uXPoHu1T8paRMKEGlY/Js+vnAE3yKlfBo8m36ujIajdazLDuI8RhjGGP6/ZR5823Nn8fYL+LLVozTGL9rv3xY++Vb8+Zbmr+LcbISz4TlIjyKcZxBt37FOMurFWkBkkzecK6GrkyuF/PqmvDE8SCByVm4cBxIqDwL7+eOAwlNzsJ59u91HEgWJuoYdYw6VseoY9QxqGOEiTpGHaOO1THqGHUM6hhhoo5Rx6hjdYw6Rh2DOkaYqGPUMepYHaOOUcegjhEm6hh1jDpWx6hj1DGoY4SJOkYdo47VMeoYdQzqGGGijlHHqGN1jDpGHYM6ZrkV6nh+g8Hg3Z+Px2MH6ZOLcHJe9mw4t9UYuzNzf2O8ODSfq+OiVsc7jslcfsS4mJnbqA4w6hh1DOqYReDeMd9iEbp3TNI6du8YdYw6VseoY1DHqGPUsTpGHaOO1THqGNQx6hh1rI5Rx6hjdYw6BnVMcr3dd/zRxvS+/A8LvsF+KfYdlxvT11p+jKa/v1GdZdr0lC3+BvulqOOfMS4TPO5NB49RPmlcqWNQx6hjUMcfuo6x2UGYzF4Dblfh0HaYLLqlqOOyHu9bfozXhrmHzKdyqeMuXj/zIZnqGHUM6pgeLULvrCZpHXtnNeoYdayOUcegjlHHqGN1jDpGHatj1DGoY9Qx6lgdo45Rx+oYdQzqGHWMOu77vuMuPMfYa5hDHXem3GD/x2GYv44twv9gc7s6Rh2DOqYndezeMeoYdezeMeoY1DHqGHWsjlHHqGN1jDoGdYw6Rh2rY9Qx6lgdo45BHaOOUcfqGHWMOlbHqGNQx6hj1LE6Rh2jjtUx6hjUMeoYdayOUceoY3WMOgZ1jDpGHatj1DHqWB2jjkEdo45Rx+oYdYw6VseoYyiqRXge47B+sdgQLObNf/X81nQRrtcW4PRicWjefEfzwzcBBgDg09XAfXKEpgAAAABJRU5ErkJggg==";
    var closeimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAKN2lDQ1BzUkdCIElFQzYxOTY2LTIuMQAAeJydlndUU9kWh8+9N71QkhCKlNBraFICSA29SJEuKjEJEErAkAAiNkRUcERRkaYIMijggKNDkbEiioUBUbHrBBlE1HFwFBuWSWStGd+8ee/Nm98f935rn73P3Wfvfda6AJD8gwXCTFgJgAyhWBTh58WIjYtnYAcBDPAAA2wA4HCzs0IW+EYCmQJ82IxsmRP4F726DiD5+yrTP4zBAP+flLlZIjEAUJiM5/L42VwZF8k4PVecJbdPyZi2NE3OMErOIlmCMlaTc/IsW3z2mWUPOfMyhDwZy3PO4mXw5Nwn4405Er6MkWAZF+cI+LkyviZjg3RJhkDGb+SxGXxONgAoktwu5nNTZGwtY5IoMoIt43kA4EjJX/DSL1jMzxPLD8XOzFouEiSniBkmXFOGjZMTi+HPz03ni8XMMA43jSPiMdiZGVkc4XIAZs/8WRR5bRmyIjvYODk4MG0tbb4o1H9d/JuS93aWXoR/7hlEH/jD9ld+mQ0AsKZltdn6h21pFQBd6wFQu/2HzWAvAIqyvnUOfXEeunxeUsTiLGcrq9zcXEsBn2spL+jv+p8Of0NffM9Svt3v5WF485M4knQxQ143bmZ6pkTEyM7icPkM5p+H+B8H/nUeFhH8JL6IL5RFRMumTCBMlrVbyBOIBZlChkD4n5r4D8P+pNm5lona+BHQllgCpSEaQH4eACgqESAJe2Qr0O99C8ZHA/nNi9GZmJ37z4L+fVe4TP7IFiR/jmNHRDK4ElHO7Jr8WgI0IABFQAPqQBvoAxPABLbAEbgAD+ADAkEoiARxYDHgghSQAUQgFxSAtaAYlIKtYCeoBnWgETSDNnAYdIFj4DQ4By6By2AE3AFSMA6egCnwCsxAEISFyBAVUod0IEPIHLKFWJAb5AMFQxFQHJQIJUNCSAIVQOugUqgcqobqoWboW+godBq6AA1Dt6BRaBL6FXoHIzAJpsFasBFsBbNgTzgIjoQXwcnwMjgfLoK3wJVwA3wQ7oRPw5fgEVgKP4GnEYAQETqiizARFsJGQpF4JAkRIauQEqQCaUDakB6kH7mKSJGnyFsUBkVFMVBMlAvKHxWF4qKWoVahNqOqUQdQnag+1FXUKGoK9RFNRmuizdHO6AB0LDoZnYsuRlegm9Ad6LPoEfQ4+hUGg6FjjDGOGH9MHCYVswKzGbMb0445hRnGjGGmsVisOtYc64oNxXKwYmwxtgp7EHsSewU7jn2DI+J0cLY4X1w8TogrxFXgWnAncFdwE7gZvBLeEO+MD8Xz8MvxZfhGfA9+CD+OnyEoE4wJroRIQiphLaGS0EY4S7hLeEEkEvWITsRwooC4hlhJPEQ8TxwlviVRSGYkNimBJCFtIe0nnSLdIr0gk8lGZA9yPFlM3kJuJp8h3ye/UaAqWCoEKPAUVivUKHQqXFF4pohXNFT0VFysmK9YoXhEcUjxqRJeyUiJrcRRWqVUo3RU6YbStDJV2UY5VDlDebNyi/IF5UcULMWI4kPhUYoo+yhnKGNUhKpPZVO51HXURupZ6jgNQzOmBdBSaaW0b2iDtCkVioqdSrRKnkqNynEVKR2hG9ED6On0Mvph+nX6O1UtVU9Vvuom1TbVK6qv1eaoeajx1UrU2tVG1N6pM9R91NPUt6l3qd/TQGmYaYRr5Grs0Tir8XQObY7LHO6ckjmH59zWhDXNNCM0V2ju0xzQnNbS1vLTytKq0jqj9VSbru2hnaq9Q/uE9qQOVcdNR6CzQ+ekzmOGCsOTkc6oZPQxpnQ1df11Jbr1uoO6M3rGelF6hXrtevf0Cfos/ST9Hfq9+lMGOgYhBgUGrQa3DfGGLMMUw12G/YavjYyNYow2GHUZPTJWMw4wzjduNb5rQjZxN1lm0mByzRRjyjJNM91tetkMNrM3SzGrMRsyh80dzAXmu82HLdAWThZCiwaLG0wS05OZw2xljlrSLYMtCy27LJ9ZGVjFW22z6rf6aG1vnW7daH3HhmITaFNo02Pzq62ZLde2xvbaXPJc37mr53bPfW5nbse322N3055qH2K/wb7X/oODo4PIoc1h0tHAMdGx1vEGi8YKY21mnXdCO3k5rXY65vTW2cFZ7HzY+RcXpkuaS4vLo3nG8/jzGueNueq5clzrXaVuDLdEt71uUnddd457g/sDD30PnkeTx4SnqWeq50HPZ17WXiKvDq/XbGf2SvYpb8Tbz7vEe9CH4hPlU+1z31fPN9m31XfKz95vhd8pf7R/kP82/xsBWgHcgOaAqUDHwJWBfUGkoAVB1UEPgs2CRcE9IXBIYMj2kLvzDecL53eFgtCA0O2h98KMw5aFfR+OCQ8Lrwl/GGETURDRv4C6YMmClgWvIr0iyyLvRJlESaJ6oxWjE6Kbo1/HeMeUx0hjrWJXxl6K04gTxHXHY+Oj45vipxf6LNy5cDzBPqE44foi40V5iy4s1licvvj4EsUlnCVHEtGJMYktie85oZwGzvTSgKW1S6e4bO4u7hOeB28Hb5Lvyi/nTyS5JpUnPUp2Td6ePJninlKR8lTAFlQLnqf6p9alvk4LTduf9ik9Jr09A5eRmHFUSBGmCfsytTPzMoezzLOKs6TLnJftXDYlChI1ZUPZi7K7xTTZz9SAxESyXjKa45ZTk/MmNzr3SJ5ynjBvYLnZ8k3LJ/J9879egVrBXdFboFuwtmB0pefK+lXQqqWrelfrry5aPb7Gb82BtYS1aWt/KLQuLC98uS5mXU+RVtGaorH1futbixWKRcU3NrhsqNuI2ijYOLhp7qaqTR9LeCUXS61LK0rfb+ZuvviVzVeVX33akrRlsMyhbM9WzFbh1uvb3LcdKFcuzy8f2x6yvXMHY0fJjpc7l+y8UGFXUbeLsEuyS1oZXNldZVC1tep9dUr1SI1XTXutZu2m2te7ebuv7PHY01anVVda926vYO/Ner/6zgajhop9mH05+x42Rjf2f836urlJo6m06cN+4X7pgYgDfc2Ozc0tmi1lrXCrpHXyYMLBy994f9Pdxmyrb6e3lx4ChySHHn+b+O31w0GHe4+wjrR9Z/hdbQe1o6QT6lzeOdWV0iXtjusePhp4tLfHpafje8vv9x/TPVZzXOV42QnCiaITn07mn5w+lXXq6enk02O9S3rvnIk9c60vvG/wbNDZ8+d8z53p9+w/ed71/LELzheOXmRd7LrkcKlzwH6g4wf7HzoGHQY7hxyHui87Xe4Znjd84or7ldNXva+euxZw7dLI/JHh61HXb95IuCG9ybv56Fb6ree3c27P3FlzF3235J7SvYr7mvcbfjT9sV3qID0+6j068GDBgztj3LEnP2X/9H686CH5YcWEzkTzI9tHxyZ9Jy8/Xvh4/EnWk5mnxT8r/1z7zOTZd794/DIwFTs1/lz0/NOvm1+ov9j/0u5l73TY9P1XGa9mXpe8UX9z4C3rbf+7mHcTM7nvse8rP5h+6PkY9PHup4xPn34D94Tz+49wZioAAAAJcEhZcwAALiMAAC4jAXilP3YAAANNSURBVHicxZhBSBRRGMe/t/NcdTQVrLRDZGXWJQyKrBAlgxI6CBFCdGjtGmSXaLetQ+WyRZciOkSH1oME3jwEdshYkawoKLqURSARabVQUFuaO6//N47brGM4q7s7H7vMzHsz7/vNvPe+9/2fVEqRW4u3tcnmdXtafUR7SajtpMRmElSNKh3/JClKoPwNyp8bRA9Hxh/FW4eGZty2L93c9PPouRq9WJ1qqdsdEES1s6XC/NmsAtcVKFyPY7tGFMb9E+p4OJacEtfK+nomlwXz7mB38YbV5Wd0vwgKEqVuwO2GZxg8qPup2+gKX37/+ceV+nvXp7KGmQ6EGzbWlPejwcZsIRxQgkrRzgW0dwjtdvpjkTHXMDPHwq1FmhhAL1QuFyQDCi9W5KOnaL9D9kbii8LMdIVaNE0bBEhJLkH+AVGlpolB+Dkg70SH/wvDXVPk0wbyBWIDKtGENgB/TfYuS8PwYJ0dI1SVTxAbUBW6rB9+m+YGdRoGs+Z0LgZrdkCikf3itCcNMxtHRKiQIGkgIULwf5vjkAnDAQ2UuicwcM/+cRqSHOI5snoBYrMAOM7L5rW7WqxI6Zmxf17zpE8T+7wEmTOfUG0SK+2OeQueNwYOieHc4DWHaeDg2VTtqPAhYzlxhGjrJnOVy5lx7vTqLdHNu0SGMb+2mmGcU7p2JaltW3IHYTe0K9asIvroSG90hknivyKjeOIriRev8/dlPn1ZqDbJMAkHDH/CG325g3BnCcwmNYa3ryu0Z4eBA7OJnuF0v9cszCGNlHqAZOes1yyGEkNy5MPjYc7ivVwSFKmJkfHRuGRdw3ICZUGvYGAx5jBTCNY1ejGdFAvFnDwbJnvS1FVkJVec2EDXRJHoXCo4jFLRsr6IGQHTaScE1lXkwIcLmXpirLxkv/XWdRqGk2IWWEiSnxQiKUf3fPtjUKddYWZIFZYN0DMdkBH38ylXAPI7pVId/lg0Q1k6RBwLKyi+di0PitIC+Z5KKSjKTAG3IIxZCOmJLtvJuiaXY4jHCHeNvzcLrc3GXcYCi3chABRk8b5kCEW/ALL0XQg268GL0DW3LDkRyCZSc2TFIZac5v2ZyGT9Ive72iyyNnpCLCey27kaNXeuylzC/wWZUjFQ/CHAlgAAAABJRU5ErkJggg==";
    var style = ".h5upload_item{float:left;width:60px;height:60px;margin:5px}.h5upload_clear{clear:both}.h5upload_img{background-size:cover;position:relative}.h5upload_delimg{position:absolute;top:-5px;right:-5px;width:18px;height:18px}";
    //输出style到页面
    document.write("<style>"+style+"</style>")
})(jQuery);