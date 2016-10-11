/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../model/util.ts"/>

var conversationDire = angular.module("webim.conversation.directive", ["webim.main.server", "webim.conversation.server"]);

//conversationDire.directive("conversationItem", ["$timeout", function($timeout: angular.ITimeoutService) {
conversationDire.directive('onFinishRenderFilters', ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: 'A',
        link: function (scope: any, element: angular.IRootElementService, attrs: angular.IAttributes) {
            if (scope.$last === true) {    //判断是否是最后一条数据
                $timeout(function () {
                    scope.$emit('ngRepeatFinished'); //向父级scope传送ngRepeatFinished命令
                });
            }
        }
    };
}]);
conversationDire.directive('atshowDire', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            scope.atShow = false;
            scope.initAtDiv();
            element.bind("click", function (e) {
                scope.cursorPos = document.getSelection().focusOffset;
            });
            var _scrollTop = 0;
            element.bind("keydown", function (e) {
              if (scope.atShow && (e.keyCode == 38 || e.keyCode == 40 )) {
                  // console.log(e, $(e.target).parent().find('div.arobase>ul'));
                  var obj = $(e.target).parent().find('div.arobase>ul');
                  var selItem = obj.find('.selected');
                  var nextItem: any;
                  if(selItem.length == 0){
                    selItem = obj.find('li:first-child');
                  }
                  if(selItem.length){
                    if (e.keyCode == 38){
                       nextItem = selItem.prev();
                    }
                    else if(e.keyCode == 40){
                       nextItem = selItem.next();
                    }

                    if(nextItem.length){
                       selItem.removeClass('selected');
                       nextItem.addClass('selected');
                    }
                    if(nextItem && nextItem.position()){
                      var _target = $("#atList"), _offsetTop = nextItem.position().top;
                      if(nextItem.index() == 1){
                        _scrollTop = 0;
                      }
                      if(_offsetTop >= _target.height()){
                        _scrollTop += 36;  //nextItem.outerHeight()
                        _target.scrollTop(_scrollTop);
                      }else if(_offsetTop < 0)
                      {
                        _scrollTop -= 36;  //nextItem.outerHeight()
                        _target.scrollTop(_scrollTop);
                      }
                    }
                  }
                  e.preventDefault();
                  return;
              }
            });
            element.bind("keyup", function (e) {
                 var keyCode = e.keyCode;
                 var obj = document.getElementById("message-content");
                 var caretPos = scope.getCaretPosition(obj);
                //  e = e || event;
                if(!scope.showGroupList){
                   return;
                }
                if(obj.textContent.length > 500 && keyCode!= 8){
                   e.preventDefault();
                   return;
                }
                if (e.keyCode == 38 || e.keyCode == 40){
                    e.preventDefault();
                    return;
                }
            //  　　if ((e.shiftKey && e.keyCode == '2'.charCodeAt(0)) ) {
                // if(obj.textContent.substr(caretPos - 1, 1) == '@' && e.shiftKey) {
                if(obj.textContent.substr(caretPos - 1, 1) == '@') {
                   var lastChar = '';
                   if(caretPos > 1){
                     lastChar = obj.textContent.substr(caretPos - 2, 1);
                     var regExp = /^[A-Za-z0-9]+$/;
                     if(regExp.test(lastChar)){
                       return;
                     }
                    //  if(lastChar != ' '){
                    //    return;
                    //  }
                   }
                  scope.atShow = true;
                  var _atObj = $(e.target).parent().find('div.arobase>ul');
                  var selItem = _atObj.find('.selected');
                  if(selItem.length == 0){
                    $("#atList").scrollTop(0);
                    var objAtList = $('div.arobase').find('ul>li:first-child');
                    objAtList.addClass('selected');
                  }
                  scope.searchStr = scope.defaultSearch ? scope.lastSearchStr : '';
                  scope.cursorPos = caretPos;
                  scope.$apply();
                  var obj = document.getElementById("message-content");
                  var hidInput = document.getElementById("TestInput");
                  var styleObj = window.getComputedStyle(obj, null);
                  var lineWidth = obj.clientWidth - 80;
                  var sel = document.getSelection(),
                      text = obj.textContent.slice(0, sel.focusOffset);
                  hidInput.style.visibility = 'visible';
                  hidInput.innerText = text;
                  hidInput.style.fontSize = styleObj.getPropertyValue('font-size');
                  hidInput.style.fontFamily = styleObj.getPropertyValue('font-family');
                  hidInput.style.visibility = 'hidden';
                  var actWidth = (hidInput.clientWidth + 1) % lineWidth;
                  var lineNum = (hidInput.clientWidth + 1) / lineWidth;
                  var atDivHeight = scope.showGroupList.length > 6 ? 36*6 : 36*scope.showGroupList.length;
                  $('div.arobase').css('bottom', obj.clientHeight - lineNum * hidInput.clientHeight);
                  $('div.arobase').css('left', actWidth);
                }
                else{
                   if(!scope.atShow){
                     var obj = document.getElementById("message-content");
                    //  var caretPos = scope.getCaretPosition(obj);
                     var text = obj.textContent.slice(0, caretPos);
                     if (keyCode == 8 && text.indexOf('@') > -1){
                        // 判断名字是否在列表中,如果在,则删除该@
                        scope.delAtContent(caretPos);
                     }
                     else if(keyCode !== 16){
                       scope.defaultSearch = false;
                     }
                     scope.$apply();
                     return;
                   }
                  //  if(keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode == 32){
                  //     var text = obj.textContent.slice(0, caretPos);
                  //     if (text.indexOf('@') == 0) {
                  //       text = text.substr(1);
                  //     }
                  //     scope.searchStr = text;
                  //     // scope.searchStr = scope.searchStr + String.fromCharCode(keyCode);
                  //     scope.$apply();
                  //  }
                  if (keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode == 32 || keyCode == 13) {
                      var text = obj.textContent.slice(0, caretPos);
                      var strTmp = text.split('@');
                      if(strTmp.length > 1){
                         var name = strTmp[strTmp.length - 1];
                         scope.searchStr = name;
                         scope.$apply();
                      }
                   }
                   else if(keyCode == 8 && scope.searchStr){
                     if(scope.searchStr.length > 0){
                       scope.searchStr = scope.searchStr.substr(0, scope.searchStr.length - 1);
                       scope.$apply();
                     }
                   }
                   else if(keyCode != 16){
                     scope.atShow = false;
                     scope.initAtDiv();
                   }
                }
            });

            // element.bind("keydown", function (e) {
            //      var keyCode = e.keyCode;
            //      var obj = document.getElementById("message-content");
            //      var caretPos = scope.getCaretPosition(obj);
            //     //  e = e || event;
            //     if(!scope.showGroupList){
            //        return;
            //     }
            //     if(obj.textContent.length > 500 && keyCode!= 8){
            //        e.preventDefault();
            //        return;
            //     }
            //  　　if ((e.shiftKey && e.keyCode == '2'.charCodeAt(0)) ) {
            //       scope.atShow = true;
            //       scope.searchStr = scope.defaultSearch ? scope.lastSearchStr : '';
            //       scope.cursorPos = caretPos;
            //       var obj = document.getElementById("message-content");
            //       var hidInput = document.getElementById("TestInput");
            //       var styleObj = window.getComputedStyle(obj, null);
            //       var lineWidth = obj.clientWidth - 80;
            //       var sel = document.getSelection(),
            //           text = obj.textContent.slice(0, sel.focusOffset);
            //       hidInput.style.visibility = 'visible';
            //       hidInput.innerText = text;
            //       hidInput.style.fontSize = styleObj.getPropertyValue('font-size');
            //       hidInput.style.fontFamily = styleObj.getPropertyValue('font-family');
            //       hidInput.style.visibility = 'hidden';
            //       var actWidth = (hidInput.clientWidth + 1) % lineWidth;
            //       var lineNum = (hidInput.clientWidth + 1) / lineWidth;
            //       var atDivHeight = scope.showGroupList.length > 6 ? 36*6 : 36*scope.showGroupList.length;
            //       $('div.arobase').css('bottom', obj.clientHeight - lineNum * hidInput.clientHeight);
            //       $('div.arobase').css('left', actWidth);
            //     }
            //     else{
            //        if(!scope.atShow){
            //          var obj = document.getElementById("message-content");
            //         //  var caretPos = scope.getCaretPosition(obj);
            //          var text = obj.textContent.slice(0, caretPos);
            //          if (keyCode == 8 && text.indexOf('@') > -1){
            //             // 判断名字是否在列表中,如果在,则删除该@
            //             scope.delAtContent(caretPos);
            //          }
            //          else if(keyCode !== 16){
            //            scope.defaultSearch = false;
            //          }
            //          return;
            //        }
            //        if(keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90){
            //           scope.searchStr = scope.searchStr + String.fromCharCode(keyCode);
            //        }
            //        else if(keyCode == 8 && scope.searchStr){
            //          if(scope.searchStr.length > 0){
            //            scope.searchStr = scope.searchStr.substr(0, scope.searchStr.length - 1);
            //          }
            //        }
            //        else{
            //          scope.atShow = false;
            //        }
            //     }
            // });
        }
    };
});

conversationDire.directive("tagInput",function() {
    return {
        restrict: "E",
        template: '<div class="input-tag" data-ng-repeat=\"tag in tagArray()\">{{tag}}</div>',
        scope: {
          inputTags: '=taglist',
          autocomplete: '=autocomplete'
        }, link: function($scope: any, ele: angular.IRootElementService, attrs: any) {
             $scope.defaultWidth = 200;
             if($scope.autocomplete){

             }
             $scope.tagArray = function() {
                if ($scope.inputTags === undefined) {
                  return [];
                }
                return $scope.inputTags.split(',').filter(function(tag: string) {
                  return tag !== "";
                });
            };

            $scope.addTag = function() {
              var tagArray: string[];
              if ($scope.tagText.length === 0) {
                return;
              }
              tagArray = $scope.tagArray();
              tagArray.push($scope.tagText);
              $scope.inputTags = tagArray.join(',');
              return $scope.tagText = "";
            };

            $scope.deleteTag = function(key: number) {
              var tagArray: string[];
              tagArray = $scope.tagArray();
              if (tagArray.length > 0 && $scope.tagText.length === 0 && key === undefined) {
                tagArray.pop();
              } else {
                if (key !== undefined) {
                  tagArray.splice(key, 1);
                }
              }
              return $scope.inputTags = tagArray.join(',');
            };

            ele.bind("keydown", function(e) {
             var key: number;
             key = e.which;
             if (key === 9 || key === 13) {
               e.preventDefault();
             }
             if (key === 8) {
               return $scope.$apply('deleteTag()');
             }
           });

        }
    }
});

conversationDire.directive("conversationItem", ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: "EA",
        templateUrl: 'assets/template/messagetemplate.html',
        scope: {
            item: "="
        }, link: function(scope: any, ele: angular.IRootElementService, attrs: any) {
            if (scope.item.senderUserId) {
                $timeout(function() {
                    angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.senderUserId.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                }, 50);
            }
            scope.sendReadReceiptRequestMessage = function(uid: string){
               scope.$parent.sendReadReceiptRequestMessage(uid);
            }
        }
    }
}]);

conversationDire.directive('contenteditableDire', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            function replacemy(e: string) {
                // return e.replace(new RegExp("<[\\s\\S.]*?>", "ig"), "");
                return e.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

            var domElement = <any>element[0];
            var lastSendTime: any, counter = 0;

            // scope.$watch(function() {
            //     return ngModel.$modelValue;
            // }, function(newVal: string) {
            //     if (document.activeElement === domElement) {
            //         return;
            //     }
            //     if (newVal === '' || newVal === attrs["placeholder"]) {
            //         domElement.innerHTML = attrs["placeholder"];
            //         domElement.style.color = "#a9a9a9";
            //     }
            // });
            //
            // element.bind('focus', function() {
            //     if (domElement.innerHTML == attrs["placeholder"]) {
            //         domElement.innerHTML = '';
            //         domElement.style.color = '';
            //     }
            // });
            // element.bind('blur', function() {
            //     if (domElement.innerHTML === '') {
            //         domElement.innerHTML = attrs["placeholder"];
            //         domElement.style.color = "#a9a9a9";
            //     }
            // });

            element.bind('input propertychange keydown', function () {
                //发送正在输入消息

                if(lastSendTime && (new Date()).getTime() - lastSendTime > 6000){
                  scope.sendTypingStatusMessage();
                  lastSendTime = (new Date()).getTime();
                }
                else if(!lastSendTime){
                  lastSendTime = (new Date()).getTime();
                  scope.sendTypingStatusMessage();
                }

                if (domElement.innerHTML == attrs["placeholder"] || domElement.innerHTML === '' || domElement.innerHTML == '<br>') {
                  element.empty();
                }
                else{
                  domElement.style.color = "";
                }
            });


            if (!ngModel) return;

            element.bind("paste", function(e: any) {
              var content = '', hasImg = false, items = (e.clipboardData || e.originalEvent.clipboardData).items;
              if (items) {
                  for (var i = 0; i < items.length; i++) {
                      var item = items[i];
                      if (item.type.indexOf("image") > -1) {
                          hasImg = true;
                          break;
                      }
                  }
              }
              e.preventDefault();
              if(!hasImg){
                if ((e.originalEvent || e).clipboardData) {
                    content = (e.originalEvent || e).clipboardData.getData('text/plain');
                    // content = replacemy(content);
                    document.execCommand('insertText', false, content);
                }
                else if (window.clipboardData) {
                    content = window.clipboardData.getData('Text');
                    // content = replacemy(content);
                    document.selection.createRange().pasteHTML(content);
                }
              }
                // var that = this, ohtml = that.innerHTML;
                // timeoutid && clearTimeout(timeoutid);
                // var timeoutid = setTimeout(function() {
                //     that.innerHTML = replacemy(that.innerHTML);
                //     ngModel.$setViewValue(that.innerHTML);
                //     timeoutid = null;
                // }, 50);
            });


            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };

            webimutil.Helper.browser.msie ? element.bind("keyup paste", read) : element.bind("input", read);

            //仅转义复制的部分
            function read() {
                var html = element.html();
                html = html.replace(/^<br>$/i, "");
                html = html.replace(/<br>/gi, "\n");
                html = replacemy(html);
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs["stripBr"] && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});

conversationDire.directive("preplaceholderasdfrs", [function() {
    return {

    }
}])

conversationDire.directive("ctrlEnterKeys", ["$timeout", "mainDataServer", "conversationServer", function($timeout: angular.ITimeoutService, mainDataServer: any, conversationServer: any) {
    return {
        restrict: "A",
        require: '?ngModel',
        scope: {
            fun: "&",
            ctrlenter: "=",
            content: "="
        },
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            scope.ctrlenter = scope.ctrlenter || false;
            element.bind("keypress", function(e: any) {
                if (scope.ctrlenter) {
                    if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                } else {
                    if (e.ctrlKey === false && e.shiftKey === false && (e.keyCode === 13 || e.keyCode === 10)) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    } else if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        //ctrl+enter 换行
                    }
                }
            })
        }
    }
}]);

conversationDire.directive("emoji", [function() {
    return {
        restrict: "E",
        scope: {
            item: "=",
            content: "="
        },
        template: '<div style="display:inline-block"></div>',
        replace: true,
        link: function(scope: any, ele: angular.IRootElementService, attr: angular.IAttributes) {

            ele.append(scope.item);
            ele.on("click", function() {
                scope.$parent.currentConversation.draftMsg = scope.$parent.currentConversation.draftMsg.replace(/\n$/, "");
                scope.$parent.currentConversation.draftMsg = scope.$parent.currentConversation.draftMsg + scope.item.children[0].getAttribute("name");
                scope.$parent.$apply();
                var obj = document.getElementById("message-content");
                webimutil.Helper.getFocus(obj);
            })

            if(webimutil.Helper.os.mac){
               if(webimutil.Helper.browser.safari){
                 angular.element(ele[0]).css("padding-top", "5px");
               }
            }
            else{
               angular.element(ele[0]).css("padding-bottom", "5px");
               angular.element(ele[0]).css("padding-right", "4px");
            }
        }
    }
}]);

conversationDire.directive("voiceMessage", ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: "E",
        scope: { item: "=" },
        template: '<div class="">' +
        '<div class="Message-audio">' +
        '<span class="Message-entry" style="">' +
        // '<span class="audioBox clearfix " ng-class="{\'animate\':isplaying}" ng-click="play()"><i></i><i></i><i></i></span>'+
        '<span class="audioBox clearfix"  ng-class="{\'animate\':isplaying}" ng-click="play()"><i></i><i></i><i></i><i></i></span>' +
        '<span class="audioTimer">{{item.duration}}”</span><span class="audioState" ng-show="item.isUnReade"></span>' +
        '</span>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            scope.item.duration = parseInt(scope.item.duration || scope.item.content.length / 1024);
            RongIMLib.RongIMVoice.preLoaded(scope.item.content);
            scope.play = function() {
                RongIMLib.RongIMVoice.stop();
                if (!scope.isplaying) {
                    scope.item.isUnReade = false;
                    RongIMLib.RongIMVoice.play(scope.item.content, scope.item.duration);
                    scope.isplaying = true;
                    if (scope.timeoutid) {
                        $timeout.cancel(scope.timeoutid);
                    }
                    scope.timeoutid = $timeout(function() {
                        scope.isplaying = false;
                    }, scope.item.duration * 1000);
                } else {
                    scope.isplaying = false;
                    $timeout.cancel(scope.timeoutid);
                }
            }

        }
    }
}]);

// conversationDire.directive("unknownMessage", [function () {
//         return {
//             restrict: "E",
//             scope: {
//                 item: "="
//             },
//             template: '<div class="Messages-getHistory"><b>{{item.content}}</b></div>',
//             replace: true,
//             link: function(scope: any, ele: angular.IRootElementService, attr: any) {
//             }
//         };
//     }]);

conversationDire.directive("textMessage", [function() {
    return {
        restrict: "E",
        scope: {
            item: "=",
            message: "="
        },
        template: '<div class="" id="{{message.messageUId || message.messageId}}">' +
        //     '<div class="{{msgStyle}} message_statue_position"></div>' +
        // '<div class="{{msgStyle}} message_statue_position"></div>' +
        '<div class="Message-text">' +
        // '<pre class="at_all_people" ng-show="isAtAll">@所有人</pre>' +
        '<pre class="Message-entry" ng-bind-html="content|trustHtml">' +
        // '<i class="at_function" ng-show="isAtPart">@****</i>' +
        '</pre>' +
        '<br></span></div>' +
        // '<input type="button" value="回执" ng-show="requestShow" ng-click="sendReadReceiptRequestMessage()" >' +
        // '<span class="receiptResponse"></span>' +
        '</div>',
        replace: true,
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            var EMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi
            var EMailArr = <string[]>[];
            var requestShow = false;
            scope.isAtAll = false;
            scope.isAtPart = false;
            if(scope.$parent.item.mentionedInfo && scope.$parent.item.mentionedInfo.type == webimmodel.AtTarget.All){
              scope.isAtAll = true;
            }
            if(scope.$parent.item.mentionedInfo && scope.$parent.item.mentionedInfo.type == webimmodel.AtTarget.Part){
              scope.isAtPart = true;
            }
            scope.itemid = scope.$parent.item.messageUId;
            scope.content = scope.item.content.replace(EMailReg, function(str: any) {
                EMailArr.push(str);
                return '[email`' + (EMailArr.length - 1) + ']';
            });

            // var URLReg = /(((ht|f)tp(s?))\:\/\/)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|me|im))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*/gi
            // var URLReg = /(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?/
            var URLReg = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;

            scope.content = scope.content.replace(URLReg, function(str: any, $1: any) {
                if ($1) {
                    return '<a target="_blank" href="' + str + '">' + str + '</a>';
                } else {
                    return '<a target="_blank" href="//' + str + '">' + str + '</a>';
                }
            });
            // scope.content = scope.content.replace(URLReg, function(str: any, $1: any) {
            //     if ($1) {
            //         return '<a target="_blank" href="' + str + '">' + str + '</a>';
            //     } else {
            //         return '<a target="_blank" href="//' + str + '">' + str + '</a>';
            //     }
            // });

            for (var i = 0, len = EMailArr.length; i < len; i++) {
                scope.content = scope.content.replace('[email`' + i + ']', '<a href="mailto:' + EMailArr[i] + '">' + EMailArr[i] + '<a>');
            }
            // TODO 匹配 @ 信息显示消息内容
            // ele.on('contextmenu', function(e) {
            //     var _parent = <any>e.target.parentNode.parentNode;
            //     console.log('显示右键菜单', e.which, e.target.id || _parent.id, e);
            //     e.preventDefault();
            //     return false;
            // })
            scope.sendReadReceiptRequestMessage = function(){
              scope.$parent.sendReadReceiptRequestMessage(scope.message.messageUId);
            }

            if(!scope.message.receiptResponse
              && scope.message.conversationType == webimmodel.conversationType.Group
              && scope.message.messageDirection == webimmodel.MessageDirection.SEND){
              requestShow = true;
            }
            scope.requestShow = requestShow;

            // if(scope.message.receiptResponse
            //   && scope.message.conversationType == webimmodel.conversationType.Group
            //   && scope.message.messageDirection == webimmodel.MessageDirection.SEND){
            //   $(ele).find('span.receiptResponse').text(scope.message.receiptResponse[scope.message.messageUId] + '人已读');
            // }

            $(ele).contextmenu(function(e: any){
              console.log('显示右键菜单', e.which, e.currentTarget.id, e);
              return false;
            });

            switch (scope.message.sentStatus) {
                case webimmodel.SentStatus.SENDING:
                    scope.msgStyle = 'message_statue_sending';
                    break;
                case webimmodel.SentStatus.FAILED:
                    scope.msgStyle = 'message_statue_unsend';
                    break;
                case webimmodel.SentStatus.SENT:
                    scope.msgStyle = '';
                    break;
                default:
                    scope.msgStyle = '';
                    break;

            }

          //   var unbingWatch = scope.$watch("message.sentStatus", function (newVal: number, oldVal: number) {
          //      switch(newVal){
          //        case webimmodel.SentStatus.SENDING:
          //           scope.msgStyle = 'message_statue_sending';
          //           break;
          //        case webimmodel.SentStatus.FAILED:
          //            scope.msgStyle = 'message_statue_unsend';
          //            unbingWatch();
          //            break;
          //        case webimmodel.SentStatus.SENT:
          //           scope.msgStyle = '';
          //           unbingWatch();
          //           break;
           //
          //      }
          //  });
        }
    }
}])

// conversationDire.directive("imageMessage", [function() {
//     return {
//         restrict: "E",
//         scope: { item: "=" },
//         template: '<div class="" id={{itemid}}>' +
//         '<div class="Message-img">' +
//         '<span id="{{\'rebox_\'+$id}}" ng-click="showBigImage()"   class="Message-entry gallery" style="">' +
//         '<!-- <p>发给您一张示意图</p> -->' +
//         // '<img ng-src="{{item.content||\'../../static/images/barBg.png\'}}" data-image="{{item.imageUri}}" alt=""/>' +
//         '<a href="{{item.imageUri||\'assets/img/barBg.png\'}}"><img ng-src="{{item.content||\'../../static/images/barBg.png\'}}"  data-image="{{item.imageUri}}" alt=""/></a>' +
//         '</span>' +
//         // '<a href="{{item.imageUri}}" download>下载</a>' +
//         '</div>' +
//         '</div>',
//         link: function(scope: any, ele: angular.IRootElementService, attr: any) {
//             var img = new Image();
//             scope.itemid = scope.$parent.item.messageUId;
//             img.src = scope.item.imageUri;
//             setTimeout(function() {
//                 $('#rebox_' + scope.$id).rebox({ selector: 'a' }).bind("rebox:open", function() {
//                     //jQuery rebox 点击空白关闭
//                     var rebox = <any>document.getElementsByClassName("rebox")[0];
//                     rebox.onclick = function(e: any) {
//                         if (e.target.tagName.toLowerCase() != "img") {
//                             var rebox_close = <any>document.getElementsByClassName("rebox-close")[0];
//                             rebox_close.click();
//                             rebox = null; rebox_close = null;
//                         }
//                     }
//                 });
//             })
//
//
//
//             img.onload = function() {
//                 scope.$apply(function() {
//                     scope.item.content = scope.item.imageUri
//                 });
//             }
//             scope.showBigImage = function() {
//
//             }
//             $(ele).contextmenu(function(e: any){
//               console.log('显示右键菜单', e.which, e.currentTarget.firstChild.id, e);
//               return false;
//             });
//         }
//     }
// }])

conversationDire.directive("imageMessage", [function() {
  return {
    restrict: "E",
    scope: { item: "=" },
    template: '<div class="" id={{itemid}}>' +
    '<div class="Message-img">' +
    '<span id="{{\'rebox_\'+$id}}" class="Message-entry gallery" style="max-height:240px;max-width:240px;border-radius:5px;">' +
    '<a href="{{item.imageUri}}" style="max-height:240px;max-width:240px;display:inline-block;"></a>' +
    '</span>' +
    // '<a href="{{item.imageUri}}" download>下载</a>' +
    '</div>' +
    '</div>',
    link: function(scope: any, ele: angular.IRootElementService, attr: any) {
      var base64img = new Image();
      base64img.src = scope.item.content;
      var abox=ele.find('a')[0];
      base64img.onload = function() {
        var box = document.getElementById('rebox_' + scope.$id);
        var pos = getBackgrund(base64img.width, base64img.height);
        box.style.backgroundImage = 'url(' + scope.item.content + ')';
        box.style.backgroundSize = pos.w + 'px ' + pos.h + 'px';
        box.style.backgroundPosition = pos.x + 'px ' + pos.y + 'px';
        box.style.height = pos.h + 'px';
        box.style.width = pos.w + 'px';
        abox.style.height = pos.h + 'px';
        abox.style.width = pos.w + 'px';
      }
      function getBackgrund(width: number, height: number) {

        var isheight = width < height;
        var scale = isheight ? height / width : width / height;
        var zoom: number, x: number = 0, y: number = 0, w: number, h: number;
        if (scale > 2.4) {
          if (isheight) {
            zoom = width / 100;
            w = 100;
            h = height / zoom;
            y = (h - 240) / 2;
          } else {
            zoom = height / 100;
            h = 100;
            w = width / zoom;
            x = (w - 240) / 2;
          }
        } else {
          if (isheight) {
            zoom = height / 240;
            h = 240;
            w = width / zoom;
          } else {
            zoom = width / 240;
            w = 240;
            h = height / zoom;
          }
        }
        return {
          w: w,
          h: h,
          x: -x,
          y: -y
        }
      }



      var img = new Image();
      scope.itemid = scope.$parent.item.messageUId;
      img.src = scope.item.imageUri;

      setTimeout(function(){
        $('#rebox_' + scope.$id).rebox({ selector: 'a' }).bind("rebox:open", function() {
          //jQuery rebox 点击空白关闭
          var rebox = <any>document.getElementsByClassName("rebox")[0];
          rebox.onclick = function(e: any) {
            if (e.target.tagName.toLowerCase() != "img") {
              var rebox_close = <any>document.getElementsByClassName("rebox-close")[0];
              rebox_close.click();
              rebox = null; rebox_close = null;
            }
          }
        });
      })

      img.onload = function() {

        var box = document.getElementById('rebox_' + scope.$id);
        var pos = getBackgrund(img.width, img.height);
        box.style.backgroundImage = 'url(' + scope.item.imageUri + ')';
        box.style.backgroundSize = pos.w + 'px ' + pos.h + 'px';
        box.style.backgroundPosition = pos.x + 'px ' + pos.y + 'px';

      }

      $(ele).contextmenu(function(e: any) {
        console.log('显示右键菜单', e.which, e.currentTarget.firstChild.id, e);
        return false;
      });
    }
  }
}])

conversationDire.directive("bigImage", [function() {
    return {
        restrict: "E",
        scope: { show: "=", imagesrc: "=" },
        template: '<div class="bigimage-background">' +
        '<div class="bigimage">' +
        '<img src="imagesrc"></img>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {

        }
    }
}]);

conversationDire.directive("richcontentMessage", [function() {
    return {
        restrict: "E",
        scope: {
            item: "="
        },
        template: '    <a href="{{item.url}}" target="_blank">' +
        '<div class="" >' +
        '<div class="Message-image-text">' +
        '<span class="Message-entry" style="">' +
        '<div class="image-textBox">' +
        '<h4>{{item.title}}</h4>' +
        '<div class="cont clearfix">' +
        '<img ng-src="{{item.imageUri||\'assets/img/imageText.png\'}}" alt=""/>' +
        '<div>{{item.content}}</div>' +
        '</div>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</a>'
    }
}]);

conversationDire.directive("locationMessage", [function() {
    return {
        restrict: "E",
        scope: {
            item: "="
        },
        template: ' <div class="">' +
        '<div class="Message-map">' +
        '<span class="Message-entry" style="">' +
        '<div class="mapBox">' +
        '<img ng-src="{{item.content||\'assets/img/barBg.png\'}}" alt=""/>' +
        '<span>{{item.poi}}</span>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '</div>'
    }
}])

conversationDire.directive("fileMessage", [function() {
    return {
        restrict: "E",
        scope: {
          item: "=",
          message: "="
        },
        template: '<div class="" id="{{message.messageUId || message.messageId}}">' +
        '<div class="{{msgStyle}} message_statue_position"></div>' +
        '<div class="upload_file">' +
         '<div class="out_border">' +
            '<div class="file_type fl">' +
              '<img ng-src="{{imgType}}">' +
            '</div>' +
            '<div class="file_name fl">' +
              '<p class="p1">{{showName}}</p>' +
              '<p class="p2">{{showSize}}</p>' +
              '<div class="up_process"><div></div></div>' +
            '</div>' +
            '<a ng-show="isover" href="{{item.fileUrl}}" download>' +
            // '<div class="file_btn fr" ng-click="Download()">' +
            '<div class="file_btn fr">' +
            '</div>' +
            '</a>' +
            '<div ng-show="isuploading" class="file_btn_close fr" ng-click="Cancel()">' +
            '</div>' +
         '</div>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
          var imgType = 'undefined', showSize = '', showName = '',maxSize = 20;
          showName = scope.item.name;
          if(window.Electron){
             angular.element(ele[0].getElementsByTagName("a")[0]).attr("target","_blank");
          }
          function getBLen(str: string) {
            if (str == null) return 0;
            if (typeof str != "string"){
              str += "";
            }
            return str.replace(/[^\x00-\xff]/g,"01").length;
          }

          function getStr(str: string, cutLen: number, fromHead: boolean) {
             var result = "";
             var len = 0;
             if(fromHead){
               for (var i=0; i<str.length && len < cutLen; i++) {
                 if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
                      len += 2;
                  } else {
                      len ++;
                  }
                  result += str[i];
               }
             }else{
               for (var i=str.length-1; i>-1 && len < cutLen; i--) {
                 if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
                      len += 2;
                  } else {
                      len ++;
                  }
                  result = str[i] + result;
               }
             }
             return result;
          }

          var showNameLen = getBLen(showName),
               suffix = scope.item.name.replace(/.+\./, "");

          if(showNameLen > maxSize){
            var _filename = scope.item.name.substr(0, scope.item.name.lastIndexOf('.'));
            var backLen = maxSize - 10 - 3 - suffix.length - 1;
            showName = getStr(_filename, 10, true);
            showName = showName + '...';
            showName += getStr(_filename, backLen, false);
            showName = showName + '.' + suffix;
          }
          scope.showName = showName;

          scope.itemid = scope.$parent.item.messageUId;
          scope.Cancel =  function(){
            RongIMLib.RongUploadLib.getInstance().cancel(scope.itemid);
            scope.item.state = 1;
            if(scope.item.sentStatus == webimmodel.SentStatus.SENDING){
              scope.item.sentStatus = webimmodel.SentStatus.FAILED;
            }
          }
          scope.Download =  function(){
          }
          function fomate(num: number){
            var result = Math.ceil(num * 100);
            return result / 100;
          }
          if(scope.item.type){
            switch(scope.item.type.toLowerCase()){
              case 'doc':
              case 'mp3':
              case 'mp4':
              case 'txt':
              case 'xlsx':
              case 'pdf':
                 imgType = scope.item.type.toLowerCase();
                 break;
              case 'bmp':
              case 'cod':
              case 'gif':
              case 'ief':
              case 'jpe':
              case 'jpeg':
              case 'jpg':
              case 'jfif':
              case 'svg':
              case 'tif':
              case 'tiff':
              case 'ras':
              case 'ico':
              case 'pbm':
              case 'pgm':
              case 'png':
              case 'pnm':
              case 'xbm':
              case 'xpm':
              case 'xwd':
              case 'rgb':
                 imgType = 'pic';
                 break;
              case 'docx':
              case 'dot':
                 imgType = 'doc';
                 break;
              case 'xls':
              case 'xla':
              case 'xlc':
              case 'xlm':
              case 'xlt':
              case 'xlw':
                 imgType = 'xlsx';
                 break;
              case 'wav':
              case 'wma':
              case 'au':
              case 'snd':
              case 'mid':
              case 'rmi':
              case 'aif':
              case 'aifc':
              case 'aiff':
              case 'm3u':
              case 'ra':
              case 'ram':
                 imgType = 'mp3';
                 break;
              case 'avi':
              case 'rmvb':
              case 'mp2':
              case 'mpa':
              case 'mpe':
              case 'mpeg':
              case 'mpg':
              case 'mpv2':
              case 'mov':
              case 'qt':
              case 'lsf':
              case 'lsx':
              case 'asf':
              case 'asr':
              case 'asx':
              case 'avi':
              case 'movie':
              case 'wmv':
                 imgType = 'mp4';
                 break;
              case 'log':
              case 'html':
              case 'stm':
              case 'uls':
              case 'bas':
              case 'c':
              case 'h':
              case 'rtx':
              case 'sct':
              case 'tsv':
              case 'htt':
              case 'htc':
              case 'etx':
              case 'vcf':
                 imgType = 'txt';
                 break;
            }
          }


          imgType = 'assets/img/' + imgType + '.png';
          scope.imgType = imgType;

          updateState();
          function updateState(){
            scope.isover = scope.item.state == webimmodel.FileState.Success, scope.isuploading = scope.item.state == webimmodel.FileState.Uploading || scope.item.state == -1;
            switch (scope.item.state) {
              case webimmodel.FileState.Canceled:
                showSize = '已取消';
                angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                break;
              case webimmodel.FileState.Failed:
                showSize = '上传失败';
                angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                break;
              case -1:
              case webimmodel.FileState.Uploading:
                var kbSize = scope.item.size / 1024;
                showSize = kbSize >= 1024 ? fomate(kbSize / 1024) + ' M' : fomate(kbSize) + ' K';
                angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'block');
                angular.element(ele[0].getElementsByClassName("up_process")[0].children[0]).css('width', scope.item.extra);
                break;
              case webimmodel.FileState.Success:
                var kbSize = scope.item.size / 1024;
                showSize = kbSize >= 1024 ? fomate(kbSize / 1024) + ' M' : fomate(kbSize) + ' K';
                angular.element(ele[0].getElementsByClassName("up_process")[0].children[0]).css('width', '100%');
                angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                if(typeof unbingWatch === 'function' || typeof unbingWatch === "object"){
                  unbingWatch();
                }
                ele[0].getElementsByClassName("file_btn")[0].parentElement.href = scope.item.fileUrl;
                break;
            }
            scope.showSize = showSize;
          }

          var unbingWatch = scope.$watch("item.state", function(newVal: any, oldVal: any) {
            if (newVal === oldVal)
                return;
            updateState();
          });

          $(ele).contextmenu(function(e: any){
            console.log('显示右键菜单', e.which, e.currentTarget.firstChild.id, e);
            return false;
          });
        }
    }
}])

conversationDire.directive("dateMessage", [function() {
    return {
        restrict: "E",
        scope: { date: "=" },
        template: '<div class="Messages-date"><b style="cursor: default;">{{date|historyTime}}</b></div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
        }
    }
}]);
conversationDire.directive("getHistoryMessage", [function() {
    return {
        restrict: "E",
        scope: { myclick: "&" },
        template: '<div class="Messages-getHistory"><b ng-click="myclick()" class="" style="cursor: pointer;">查看历史消息</b></div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
        }
    }
}]);
conversationDire.directive("getMoreMessage", [function() {
    return {
        restrict: "E",
        scope: { myclick: "&" },
        template: '<div class="Messages-getHistory"><b ng-click="myclick()" class="" style="cursor: pointer;">获取更多历史消息</b></div>'
    }
}]);
