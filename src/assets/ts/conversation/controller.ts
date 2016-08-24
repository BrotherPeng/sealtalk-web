/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-file-upload/angular-file-upload.d.ts"/>

var conversationCtr = angular.module("webim.conversation.controller", ["webim.main.server", "webim.conversation.server"]);
var IMGDOMAIN = "http://7xogjk.com1.z0.glb.clouddn.com/";
var FILEDOMAIN = "http://o83059m7d.bkt.clouddn.com/";
function adjustScrollbars() {
    var ele = document.getElementById("Messages");
    if (!ele)
        return;
    ele.style.height = document.documentElement.clientHeight -
        parseFloat(getComputedStyle(document.querySelector('.inputBox')).height) -
        parseFloat(getComputedStyle(document.querySelector('.box_hd')).height) + "px";

    ele.scrollTop = ele.scrollHeight;
}

conversationCtr.controller("conversationController", ["$scope", "$state", "mainDataServer", "conversationServer", "mainServer", "RongIMSDKServer", "$http", "$timeout", "$location", "$anchorScroll",
    function($scope: any, $state: angular.ui.IStateService, mainDataServer: mainDataServer, conversationServer: conversationServer, mainServer: mainServer, RongIMSDKServer: RongIMSDKServer, $http: angular.IHttpService, $timeout: angular.ITimeoutService, $location: angular.ILocationService, $anchorScroll: angular.IAnchorScrollService) {

        var targetId = $state.params["targetId"];
        var targetType = Number($state.params["targetType"]);
        var currentCon = new webimmodel.Conversation();
        currentCon.targetId = targetId;
        currentCon.targetType = targetType;
        $scope.currentConversation = currentCon;
        $scope.mainData = <mainDataServer>mainDataServer;

        //判断是否有此会话没有则创建一个。清除未读消息
        var conversation = {};
        var pasteImgFile : any = null;
        var groupid = targetType == webimmodel.conversationType.Private ? "0" : targetId;
        var atArray : any[]  = [];  //TODO 删除时 atArray 同步删除
        var isAtScroll = false;
        var rawGroutList: webimmodel.Member[];
        var lastMsgTime: number = null;
        $scope.cursorPos = -1;
        $scope.searchStr = '';
        $scope.lastSearchStr = '';
        $scope.defaultSearch = false;


        if (groupid != "0") {
          $scope.groupInfo = mainDataServer.contactsList.getGroupById(groupid);
          if($scope.groupInfo){
            rawGroutList = webimutil.Helper.cloneObject($scope.groupInfo.memberList);
            for (var i = rawGroutList.length-1; i >= 0; i--) {
                if (rawGroutList[i].id === mainDataServer.loginUser.id) {
                    rawGroutList.splice(i, 1);
                }
            }
          }

          $scope.showGroupList = webimutil.Helper.cloneObject(rawGroutList);
        }
        $scope.selectMember = function (item: webimmodel.Member) {
            var obj = document.getElementById("message-content");
            var curPos = $scope.cursorPos;
            $scope.atShow = false;
            if($scope.cursorPos == -1 || obj.textContent.length <= curPos){
              $scope.currentConversation.draftMsg = obj.innerHTML + item.name + ' ';
            }
            else{
              var regS = new RegExp($scope.searchStr, "i");
              $scope.currentConversation.draftMsg = obj.textContent.slice(0, curPos) + item.name + ' ' + obj.textContent.slice(curPos).replace(regS,'');
            }
            var exitFlag = false;
            for(var i=0; i<atArray.length;i++){
               if(atArray[i].id == item.id){
                 exitFlag = true;
                 break;
               }
            }
            if(!exitFlag){
              atArray.push({ "id": item.id, "name": item.name, "everychar": item.everychar });
            }

            setTimeout(function () {
                $scope.setFocus(obj, curPos + item.name.length + 1);
            }, 0);
            $scope.cursorPos = -1;
            $scope.lastSearchStr = $scope.searchStr;
            $scope.defaultSearch = false;
        };
        $scope.getCaretPosition = function(editableDiv: any) {
            var caretPos = 0, containerEl:any = null, sel:any , range:any ;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    if (range.commonAncestorContainer.parentNode == editableDiv) {
                        caretPos = range.endOffset;
                    }
                }
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                if (range.parentElement() == editableDiv) {
                    var tempEl = document.createElement("span");
                    editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                    var tempRange = range.duplicate();
                    tempRange.moveToElementText(tempEl);
                    tempRange.setEndPoint("EndToEnd", range);
                    caretPos = tempRange.text.length;
                }
            }
            return caretPos;
        }
        $scope.searchfriend = function(str: string) {
            if(!$scope.groupInfo.memberList){
              return
            }
            if (str == "") {
                $scope.showGroupList = webimutil.Helper.cloneObject(rawGroutList);
            } else {
                var list = mainDataServer.contactsList.find(str, rawGroutList);
                $scope.showGroupList = webimutil.Helper.cloneObject(list);
            }
        }
        if (groupid) {
          $scope.$watch('searchStr', function (newVal: string, oldVal: string) {
              if (newVal === oldVal)
                  return;
              $scope.searchfriend(newVal);
          });
        }

        $scope.setFocus = function(el: any, pos: number) {
            el.focus();
            var range: any;
            var textNode = el.firstChild;
            if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
              range = document.createRange();
              if(pos == -1){
                 range.selectNodeContents(el);
              }else{
                 range.setStart(textNode, pos);
                 range.setEnd(textNode, pos);
              }
              range.collapse(false);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
              range = document.selection.createRange();
              this.last = range;
              range.moveToElementText(el);
              range.select();
            }
        }　

        if(webimutil.Helper.os.mac){
           if(webimutil.Helper.browser.safari){
             angular.element(document.getElementsByClassName("expressionWrap")).css("top", "-230px");
           }
        }
        else{
           angular.element(document.getElementsByClassName("expressionWrap")).css("top", "-250px");
           angular.element(document.getElementsByClassName("expressionWrap")).css("padding", "5px 18px");
        }

        $scope.messagesloading = true;
        $scope.showCutScreen = false;
        if (window.Electron && window.Electron.appInfo){
          if(window.Electron.appInfo.version > '1.0.1'){
              $scope.showCutScreen = true;
          }
        }

        $scope.scrollTo = function(id: string) {
              $location.hash(id);
              $anchorScroll();
        }

        RongIMSDKServer.getConversation(targetType, targetId).then(function(data) {
            if (!data) {
                var conv = mainDataServer.conversation.createConversation(targetType, targetId);
                mainDataServer.conversation.currentConversation = conv;
                $scope.currentConversation = conv;
            } else {
                mainDataServer.conversation.currentConversation = mainDataServer.conversation.getConversation(targetType, targetId);
                $scope.currentConversation = mainDataServer.conversation.currentConversation;
            }
            $scope.currentConversation.draftMsg = RongIMSDKServer.getDraft(targetType, targetId);

        }, function() {

        });

        // RongIMSDKServer.clearMessagesUnreadStatus(targetType, targetId);
        RongIMSDKServer.clearUnreadCount(targetType, targetId);
        // setTimeout(function () {
        //     $scope.$emit("conversationChange");
        // }, 200);



        //初次会话消息加载有问题
        conversationServer.historyMessagesCache[targetType + "_" + targetId] = conversationServer.historyMessagesCache[targetType + "_" + targetId] || [];

        $scope.conversationServer = conversationServer;
        updateTargetDetail();

        var currenthis = conversationServer.historyMessagesCache[targetType + "_" + targetId];
        if (currenthis.length == 0) {
            conversationServer.getHistory(targetId, targetType, 0, 5).then(function(has) {
                if (has) {
                    conversationServer.unshiftHistoryMessages(targetId, targetType, new webimmodel.GetMoreMessagePanel());
                }
                conversationServer.conversationMessageList = currenthis;
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(currenthis);
                setTimeout(function() {
                    adjustScrollbars();
                    $scope.messagesloading = false;
                }, 0)
                var lastItem = conversationServer.conversationMessageListShow[conversationServer.conversationMessageListShow.length - 1];
                if(lastItem && lastItem.messageUId && lastItem.sentTime){
                  sendReadReceiptMessage(lastItem.messageUId, lastItem.sentTime.getTime());
                }
            }, function(err) {
                conversationServer.conversationMessageList = currenthis;
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(currenthis);
                setTimeout(function() {
                    adjustScrollbars();
                }, 0)
            });
            //以上是历史消息
        } else {
            //有未读消息
            conversationServer.conversationMessageList = currenthis;
            conversationServer.conversationMessageListShow.length = 0;
            conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(currenthis);
            var lastItem = conversationServer.conversationMessageListShow[conversationServer.conversationMessageListShow.length - 1];
            if(lastItem && lastItem.messageUId && lastItem.sentTime){
              sendReadReceiptMessage(lastItem.messageUId, lastItem.sentTime.getTime());
            }
            setTimeout(function() {
                adjustScrollbars();
                $scope.messagesloading = false;
            }, 0)
        }


        var atmsgs = conversationServer.atMessagesCache[targetType + "_" + targetId];
        if (atmsgs && atmsgs.length > 0) {
          var msgid = atmsgs[0].messageUId;
          setTimeout(function () {
              $scope.scrollTo(msgid);
          }, 0);
          atmsgs.length = 0;
        }

        $scope.tofriendinfo = function() {
            if ($scope.currentConversation.targetType == webimmodel.conversationType.Private) {
                $state.go("main.friendinfo", { userid: targetId, groupid: groupid, targetid: targetId, conversationtype: targetType });
            } else {
                $state.go("main.groupinfo", { groupid: targetId, conversationtype: targetType });
            }
        }

        $scope.touserinfo = function(userid: string) {
            $state.go("main.friendinfo", { userid: userid, groupid: groupid, targetid: targetId, conversationtype: targetType });
        }

        function sendReadReceiptMessage(messageuid: string, sendtime: number){
          var messageUId = messageuid;
          var lastMessageSendTime = sendtime;
          // 以上 3 个属性在会话的最后一条消息中可以获得。
          // if(targetType != webimmodel.conversationType.Private && targetType != webimmodel.conversationType.Group){
          if(targetType != webimmodel.conversationType.Private){
            return;
          }
          var msg = RongIMLib.ReadReceiptMessage.obtain(messageUId, lastMessageSendTime, 1);
          // var msg = RongIMLib.TextMessage.obtain('con');
          RongIMSDKServer.sendMessage(targetType, targetId, msg).then(function() {

          }, function(error) {
              console.log('sendReadReceiptMessage error', error.errorCode);
          });
        }

        $scope.sendTypingStatusMessage = function(){
          if(targetType != webimmodel.conversationType.Private){
            return;
          }
          var msg = RongIMLib.TypingStatusMessage.obtain('RC:TxtMsg', null);
          RongIMSDKServer.sendMessage(targetType, targetId, msg).then(function() {

          }, function(error) {
              console.log('sendTypingStatusMessage error', error.errorCode);
          });
        }

        // sendReadReceiptMessage();

        function updateTargetDetail(){
            if(targetType == webimmodel.conversationType.Private){
               var friend = mainDataServer.contactsList.getFriendById(targetId);
               var isself = friend ? null : mainDataServer.loginUser.id == targetId;
               if (friend) {
                   mainServer.friend.getProfile(targetId).success(function(data) {
                       var f = new webimmodel.Friend({ id: data.result.user.id, name: data.result.user.nickname, imgSrc: data.result.user.portraitUri });
                       f.displayName = data.result.displayName;
                       f.mobile = data.result.user.phone;
                       // f = mainDataServer.contactsList.addFriend(f);
                       f = mainDataServer.contactsList.updateOrAddFriend(f);
                       mainDataServer.conversation.updateConversationDetail(targetType, targetId, data.result.displayName || data.result.user.nickname, data.result.user.portraitUri);
                       conversationServer.updateHistoryMessagesCache(targetId, targetType, data.result.displayName || data.result.user.nickname, data.result.user.portraitUri);
                   })

               } else if (isself)
               {

               }
               else {
                  //  mainServer.user.getInfo(targetId).then(function(rep) {
                  //      $scope.user.id = rep.data.result.id
                  //      $scope.user.nickName = rep.data.result.nickname
                  //      $scope.user.portraitUri = rep.data.result.portraitUri;
                   //
                  //      $scope.user.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.data.result.nickname);
                  //      setPortrait();
                  //  })
               }

            }
        }

        function addmessage(msg: webimmodel.Message) {
            var hislist = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] || []
            if (hislist.length == 0) {
                hislist.push(new webimmodel.GetHistoryPanel());
                if (msg.sentTime.toLocaleDateString() != (new Date()).toLocaleDateString())
                    hislist.push(new webimmodel.TimePanl(msg.sentTime));
            }
            conversationServer.addHistoryMessages(msg.targetId, msg.conversationType, msg);
            if (msg.messageType == webimmodel.MessageType.ImageMessage) {
                setTimeout(function() {
                    $scope.$broadcast("msglistchange");
                }, 200)
            } else {
                $scope.$broadcast("msglistchange");
            }
        }

        function packmysend(msg: any, msgType: string) {
            var msgouter = new RongIMLib.Message();
            msgouter.content = msg;
            msgouter.conversationType = targetType;
            msgouter.targetId = targetId;
            msgouter.sentTime = (new Date()).getTime() - RongIMLib.RongIMClient.getInstance().getDeltaTime();
            msgouter.messageDirection = RongIMLib.MessageDirection.SEND;
            msgouter.messageType = msgType;
            msgouter.senderUserId = mainDataServer.loginUser.id;
            return msgouter;
        }

        function appendmessage(msg: webimmodel.Message) {
            var hislist = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] || []
            if (hislist.length == 0) {
                hislist.push(new webimmodel.GetHistoryPanel());
                if (msg.sentTime.toLocaleDateString() != (new Date()).toLocaleDateString())
                    hislist.push(new webimmodel.TimePanl(msg.sentTime));
            }
            conversationServer.addHistoryMessages(msg.targetId, msg.conversationType, msg);
            if (msg.messageType == webimmodel.MessageType.ImageMessage) {
                setTimeout(function() {
                    $scope.$broadcast("msglistchange");
                }, 200)
            } else {
                $scope.$broadcast("msglistchange");
            }
        }

        function findInSelArr(name: string, arr: any[],isdel: boolean){
          var result = {'exist': false, 'id': '0', 'name': '', 'everychar':''};
          for(var i=0; i< arr.length; i++){
             if(arr[i].name == name){
               result.exist = true;
               result.id = arr[i].id;
               result.name = arr[i].name;
               result.everychar = arr[i].everychar;
               if(isdel){
                 arr.splice(i, 1);
               }
               break;
             }
          }
          return result;
        }

        function getAtArray(item: string){
            var strTmp = item.split('@');
            var atUserList: string[] = [];
            if(strTmp.length > 1){
              for(var i=1; i< strTmp.length; i++){
                  // var name = strTmp[i].slice(0, strTmp[i].indexOf(' '));
                  var name = strTmp[i];
                  if(name.indexOf(' ') > -1){
                    name = name.slice(0, name.indexOf(' '));
                  }
                  var result = findInSelArr(name, atArray, false);
                  if(result.exist){
                    if (atUserList.indexOf(result.id) === -1) {
                      atUserList.push(result.id);
                    }
                  }
              }
            }
            return atUserList;
        }

        $scope.delAtContent = function (pos: number) {
           var item = $scope.currentConversation.draftMsg.slice(0, pos);
           var obj = document.getElementById("message-content");
           var strTmp = item.split('@');
           if(strTmp.length > 1){
              var name = strTmp[strTmp.length - 1];
              // name = name.replace(/(\s*$)/g,'');
              var result = findInSelArr(name, atArray, true);
              if(result.exist){
                //  obj.textContent = item.slice(0, item.lastIndexOf('@')) + $scope.currentConversation.draftMsg.slice(pos);
                 if (pos >= obj.textContent.length) {
                     obj.textContent = item.slice(0, item.lastIndexOf('@')) + $scope.currentConversation.draftMsg.slice(pos);
                     $scope.setFocus(obj, -1);
                 }
                 else {
                     obj.textContent = item.slice(0, item.lastIndexOf('@')) + $scope.currentConversation.draftMsg.slice(pos);
                     $scope.setFocus(obj, pos - strTmp[strTmp.length - 1].length - 1);
                 }
                 $scope.defaultSearch = true;
              }
           }
        }

        function getRandom (begin: number,end: number){
         return Math.floor(Math.random()*(end-begin))+begin;
        }

        $scope.sendBtn = function() {
            var ele = <any>document.querySelector(".no_network");
            if(ele && ele.style.visibility == 'visible'){
              return;
            }
            var _message = $scope.currentConversation.draftMsg;
            _message = _message.replace(/(^\s*)|(\s*$)/g,'');  //限制消息不能为空格或者空行
            if(_message == ''){
              webimutil.Helper.alertMessage.error("消息内容不能为空", 2);
              return;
            }

            _message = _message.replace(/&lt;div&gt;/gi,'<br>').replace(/&lt;\/div&gt;/gi,'');
            _message = _message.replace(/^<br>$/i, "");
            _message = _message.replace(/<br>/gi, "\n")
            _message = _message.replace(/&amp;/gi, "&");
            _message = _message.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
            $scope.showemoji = false;

            if (!targetType && !targetId) {
                webimutil.Helper.alertMessage.error("请选择一个会话对象", 2);
                return;
            }

            var con = RongIMLib.RongIMEmoji.symbolToEmoji(_message);

            if (con == "") {
                return;
            }

            //发送消息
            var msg = RongIMLib.TextMessage.obtain(con);
            var atFlag = false;
            var atUserList = getAtArray(con);
            if (atUserList && atUserList.length > 0) {
                atFlag = true;
            }
            if(atFlag){
              var mentioneds = new RongIMLib.MentionedInfo();
              mentioneds.type = webimmodel.AtTarget.Part;  // 1: 全部 2: 部分
              mentioneds.userIdList = atUserList;
              // mentioneds.mentionedContent = con;
              msg.mentionedInfo = mentioneds;
            }
            msg.extra = getRandom(1,1000).toString();

            RongIMSDKServer.sendMessage(targetType, targetId, msg, atFlag && (targetType == webimmodel.conversationType.Group || targetType == webimmodel.conversationType.Discussion)).then(function(msg) {
               atArray = [];
               var _message = webimmodel.Message.convertMsg(msg);
               $scope.mainData.conversation.updateConStatic(_message, true, true);
              //  conversationServer.updateSendMessage(targetId, targetType, _message);
            }, function(error: any) {
              var content = '';
              switch (error.errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  //  if(!mainDataServer.isConnected){
                  //     $scope.$broadcast('reconnect');
                  //  }
                   break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                   content = "您的消息已经发出，但被对方拒收";
                   break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                   content = "你不在该群组中";
                   break;
                default:
                  //  webimutil.Helper.alertMessage.error("消息发送失败,错误代码 " + error.errorCode, 2);
              }
              console.log('消息发送失败,错误代码:' + error.errorCode);
              if(content){
                var msg = webimutil.Helper.cloneObject(error.message);
                msg.content = content;
                msg.panelType = webimmodel.PanelType.InformationNotification;
                appendmessage(msg);
              }
            });

            var msgouter = packmysend(msg, webimmodel.MessageType.TextMessage);
            msgouter.sentStatus = webimmodel.SentStatus.SENDING;

            //添加消息到历史消息并清空发送消息框
            conversationServer.addHistoryMessages(targetId, targetType, webimmodel.Message.convertMsg(msgouter));
            $scope.$emit("msglistchange");
            // setTimeout(function () {
            //     $scope.$emit("conversationChange");
            // }, 200);
            // $scope.mainData.conversation.updateConStatic(webimmodel.Message.convertMsg(msgouter), true, true);
            $scope.currentConversation.draftMsg = "";

            var obj = document.getElementById("message-content");
            webimutil.Helper.getFocus(obj);
        }

        $scope.back = function() {
            $state.go("main");
        }

        $scope.sendImg = function(){
            //TODO:获取base64
            // uploadBase64();
        }

        $scope.showPasteDiv = function(visible: boolean){
           var pic = <any>document.getElementsByClassName("previewPic")[0];
           var picBackground = <any>document.getElementsByClassName("previewPicLayer")[0];
           if(visible){
             pic.style.visibility = "visible";
             picBackground.style.visibility = "visible";
             pic.focus();
           }else{
             pic.style.visibility = "hidden";
             picBackground.style.visibility = "hidden";
             showLoading(false);
           }
        }

        $scope.uploadPasteImage = function(){
          var reg = new RegExp('^data:image/[^;]+;base64,');
          var picContent = <any>document.getElementsByClassName("picContent")[0];
          var base64Code = picContent.src;
          base64Code = base64Code.replace(reg,'');
          showLoading(true);
          uploadBase64(base64Code, pasteImgFile);
          // $scope.showPasteDiv(false);
        }

        $scope.takeScreenShot = function () {
          if (window.Electron) {
              if (typeof window.Electron.screenShot === "undefined"){
                 console.log('您的app版本过低,不支持截图功能')
                 return;
              }
              window.Electron.screenShot();
          }
        };

        $scope.$on('showPasteDiv', function(event: any, visible: boolean) {
          $scope.showPasteDiv(visible);
        });

        $scope.$on('uploadPasteImage', function(event: any) {
          $scope.uploadPasteImage();
        });

        function showLoading(visible: boolean){
           var loading = <any>document.getElementsByClassName("load-container")[0];
           if(visible){
             loading.style.visibility = "visible";
           }else{
             loading.style.visibility = "hidden";
           }
        }

        function getThumbnailAndSendImg(info: any, file: any) {
          webimutil.ImageHelper.getThumbnail(file, 60000, function(obj: any, data: any) {
              var reg = new RegExp('^data:image/[^;]+;base64,');
              var dataFinal = data.replace(reg, '');
              var im = RongIMLib.ImageMessage.obtain(dataFinal, IMGDOMAIN + info.key);
              var content = packmysend(im, webimmodel.MessageType.ImageMessage);
              RongIMSDKServer.sendMessage($scope.currentConversation.targetType, $scope.currentConversation.targetId, im).then(function() {
                setTimeout(function () {
                    $scope.$emit("msglistchange");
                    $scope.$emit("conversationChange");
                }, 200);
              }, function() {
                setTimeout(function () {
                    $scope.$emit("msglistchange");
                    $scope.$emit("conversationChange");
                }, 200);
              })
              conversationServer.addHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType,
                  webimmodel.Message.convertMsg(content));
              setTimeout(function() {
                  $scope.$emit("msglistchange");
                  $scope.$emit("conversationChange");
              }, 200);
          })
        }

        $scope.$watch("currentConversation.draftMsg", function(newVal: string, oldVal: string) {
            if (newVal === oldVal)
                return;

            RongIMSDKServer.setDraft(+$scope.currentConversation.targetType, $scope.currentConversation.targetId, newVal)
            mainDataServer.conversation.setDraft($scope.currentConversation.targetType, $scope.currentConversation.targetId, newVal);
        })



        $scope.getHistoryMessage = function() {
            conversationServer.historyMessagesCache[targetType + "_" + targetId] = [];
            var _pullMessageTime = conversationServer.getLastMessageTime(targetId, targetType);
            conversationServer.getHistory(targetId, targetType, _pullMessageTime, 5).then(function(has) {
                conversationServer.conversationMessageList = conversationServer.historyMessagesCache[targetType + "_" + targetId];
                if (has) {
                    conversationServer.unshiftHistoryMessages(targetId, targetType, new webimmodel.GetMoreMessagePanel());
                }
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(conversationServer.conversationMessageList);
                // setTimeout(function() {
                //     adjustScrollbars();
                // }, 0)
            });
        }

        $scope.getMoreMessage = function() {
            conversationServer.historyMessagesCache[targetType + "_" + targetId].shift();
            var _pullMessageTime = conversationServer.getLastMessageTime(targetId, targetType);
            conversationServer.getHistory(targetId, targetType, _pullMessageTime, 5).then(function(has) {
                if (has) {
                    conversationServer.unshiftHistoryMessages(targetId, targetType, new webimmodel.GetMoreMessagePanel());
                }
                var ele = document.getElementById("Messages");
                if (!ele)
                    return;
                var scrollRemaining = ele.scrollHeight - ele.scrollTop;
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(conversationServer.conversationMessageList);
                $timeout(function(){
                      ele.scrollTop = ele.scrollHeight - scrollRemaining;
                    },0);
            });
        }

        $scope.$on("msglistchange", function() {
            setTimeout(function() {
                adjustScrollbars();
            }, 0)
        });

        //显示表情
        $scope.showemoji = false;
        document.addEventListener("click", function(e: any) {
            if ($scope.showemoji && e.target.className != "iconfont-smile") {
                $scope.$apply(function() {
                    $scope.showemoji = false;
                });
            }
            if($scope.atShow){
              $scope.$apply(function () {
                $scope.atShow = false;
              });
            }
        });
        // $scope.emojiList = RongIMLib.Expression.getAllExpression(60, 0);

        $scope.emojiList = RongIMLib.RongIMEmoji.emojis.slice(0, 60);  //128

        // conversationServer.initUpload = function(){
        //   mainServer.user.getImageToken().success(function(rep) {
        //       //qiniu上传
        //       conversationServer.uploadFileToken = rep.result.token;
        //       uploadFileInit();
        //   }).error(function() {
        //       webimutil.Helper.alertMessage.error("图片上传初始化失败", 2);
        //   });
        // }
        // conversationServer.initUpload();
        $scope.uploadStatus = {
            show: false,
            progress: 0,
            cancle: function() {
                // qiniuuploader.stop && qiniuuploader.stop();
                $scope.uploadStatus.show = false;
                $scope.uploadStatus.progress = 0;
                // qiniuuploader.files.pop();
            }
        }
        // var qiniuuploader: any;
        // function uploadFileInit() {
        //     qiniuuploader = Qiniu.uploader({
        //         // runtimes: 'html5,flash,html4',
        //         runtimes: 'html5,html4',
        //         browse_button: 'upload-file',
        //         container: 'MessageForm',
        //         drop_element: 'Message',
        //         max_file_size: '100mb',
        //         // flash_swf_url: 'js/plupload/Moxie.swf',
        //         dragdrop: true,
        //         chunk_size: '4mb',
        //         // uptoken_url: "http://webim.demo.rong.io/getUploadToken",
        //         uptoken: conversationServer.uploadFileToken,
        //         domain: IMGDOMAIN,
        //         get_new_uptoken: false,
        //         unique_names: true,
        //         filters: {
        //             mime_types: [{ title: "Image files", extensions: "jpg,gif,png" }],
        //             prevent_duplicates: false
        //         },
        //         multi_selection: false,
        //         // auto_start: true,
        //         init: {
        //             'FilesAdded': function(up: any, files: any) {
        //
        //                 if ($scope.uploadStatus.show) {
        //                     webimutil.Helper.alertMessage.error("正在上传请稍后", 2);
        //                     // up.removeFile(file);
        //                     for (var i = 0, len = files.length; i < len; i++) {
        //                         up.removeFile(files[0]);
        //                     }
        //                 } else {
        //                     qiniuuploader.start();
        //                 }
        //             },
        //             'BeforeUpload': function(up: any, file: any) {
        //                 $scope.uploadStatus.show = true;
        //                 $scope.$apply();
        //             },
        //             'UploadProgress': function(up: any, file: any) {
        //                 $scope.uploadStatus.progress = file.percent + "%";
        //                 setTimeout(function() {
        //                     $scope.$apply();
        //                 })
        //             },
        //             'UploadComplete': function() {
        //             },
        //             'FileUploaded': function(up: any, file: any, info: any) {
        //                 $scope.uploadStatus.show = false;
        //                 $scope.uploadStatus.progress = 0;
        //                 $scope.$apply();
        //                 !function(info: any) {
        //                     var info = JSON.parse(info);
        //                     webimutil.ImageHelper.getThumbnail(file.getNative(), 60000, function(obj: any, data: any) {
        //                         var reg = new RegExp('^data:image/[^;]+;base64,');
        //                         var dataFinal = data.replace(reg, '');
        //                         var im = RongIMLib.ImageMessage.obtain(dataFinal, IMGDOMAIN + info.key);
        //                         var content = packmysend(im, webimmodel.MessageType.ImageMessage);
        //                         RongIMSDKServer.sendMessage($scope.currentConversation.targetType, $scope.currentConversation.targetId, im).then(function() {
        //                           setTimeout(function () {
        //                               $scope.$emit("msglistchange");
        //                               $scope.$emit("conversationChange");
        //                           }, 200);
        //                         }, function() {
        //                           setTimeout(function () {
        //                               $scope.$emit("msglistchange");
        //                               $scope.$emit("conversationChange");
        //                           }, 200);
        //                         })
        //                         conversationServer.addHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType,
        //                             webimmodel.Message.convertMsg(content));
        //                         setTimeout(function() {
        //                             $scope.$emit("msglistchange");
        //                             $scope.$emit("conversationChange");
        //                         }, 200);
        //                     })
        //                 } (info)
        //
        //             },
        //             'Error': function(up: any, err: any, errTip: any) {
        //                 $scope.uploadStatus.show = false;
        //                 webimutil.Helper.alertMessage.error("上传图片出错！", 2);
        //
        //             }
        //             // ,
        //             // 'Key': function(up: any, file: any) {
        //             //     var key = "";
        //             //     // do something with key
        //             //     return key
        //             // }
        //         }
        //     });
        // }

        RongIMLib.RongUploadLib.getInstance().setListeners({
          onFileAdded:function(file: any){
              RongIMLib.RongUploadLib.getInstance().start($scope.currentConversation.targetType,$scope.currentConversation.targetId);
              // for (var i = 0, len = files.length; i < len; i++) {
                if (file.uploadType == 'IMAGE') {
                  return;
                }
                var msg = new webimmodel.Message();
                msg.conversationType = $scope.currentConversation.targetType;
                msg.objectName = 'RC:FileMsg';
                msg.messageDirection = webimmodel.MessageDirection.SEND;
                msg.messageId = file.id;
                msg.messageUId = file.id;
                msg.senderUserId = mainDataServer.loginUser.id;
                msg.sentTime = new Date();
                msg.targetId = $scope.currentConversation.targetId;
                msg.messageType = webimmodel.MessageType.FileMessage;
                var filemsg: any = new webimmodel.FileMessage();
                filemsg.name = file.oldName || file.name;
                filemsg.size = file.size;
                filemsg.type = file.name.replace(/.+\./, "").toLowerCase();
                // file.uri = SDKmsg.content.uri;
                // file.extra = SDKmsg.content.extra;
                filemsg.state = webimmodel.FileState.Uploading;
                msg.content = filemsg;
                addmessage(msg);
              // }
              $scope.$apply();
          },
          onBeforeUpload:function(file: any){
            if (file.uploadType == 'IMAGE') {
              $scope.uploadStatus.show = true;
              $scope.$apply();
            }
          },
          onUploadProgress:function(file: any){
            if (file.uploadType == 'IMAGE') {
              $scope.uploadStatus.progress = file.percent + "%";
            }
            else if(file.percent > 0){
              var item = conversationServer.getMessageById($scope.currentConversation.targetId, $scope.currentConversation.targetType, file.id);
              // item.content.extra = file.percent + "%";
              item.content.progress = file.percent;
              item.content.state = item.content.state == webimmodel.FileState.Uploading ? -1 : webimmodel.FileState.Uploading;
            }
            // else if(file.percent == 0){
            //   var item = conversationServer.getMessageById($scope.currentConversation.targetId, $scope.currentConversation.targetType, file.id);
            //   if(item){
            //     item.content.state = webimmodel.FileState.Failed;
            //   }
            // }
            // $('#'+file.id).find('div.up_process > div').css('width', file.percent + "%");
            setTimeout(function () {
                $scope.$apply();
            });
          },
          onFileUploaded:function( file: any, message: webimmodel.Message, err: any){
              if(err){

              }
              if (file.uploadType == 'IMAGE') {
                $scope.uploadStatus.show = false;
                $scope.uploadStatus.progress = 0;
              }
              else{
                var item = conversationServer.getMessageById($scope.currentConversation.targetId, $scope.currentConversation.targetType, file.id);
                item.content.fileUrl = message.content.fileUrl;
                item.content.state = webimmodel.FileState.Success;
                $scope.mainData.conversation.updateConStatic(webimmodel.Message.convertMsg(message), true, true);
              }
              if(message.messageType == webimmodel.MessageType.ImageMessage){
                conversationServer.addHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType, webimmodel.Message.convertMsg(message));
                setTimeout(function () {
                    $scope.$emit("msglistchange");
                    $scope.$emit("conversationChange");
                }, 200);
              }
              $scope.$apply();
          },
          onError:function( up: any, err: any, errTip: string){
              if (up.files[0].uploadType == 'IMAGE') {
                $scope.uploadStatus.show = false;
                webimutil.Helper.alertMessage.error("上传图片出错！", 2);
              }else{
                for(var i = 0;i < up.files.length;i++){
                  var item = conversationServer.getMessageById($scope.currentConversation.targetId, $scope.currentConversation.targetType, up.files[i].id);
                  if(item){
                    item.content.state = webimmodel.FileState.Failed;
                  }
                }
              }

          },
          onUploadComplete:function(){
          }
        });

        RongIMLib.RongUploadLib.getInstance().reload('IMAGE','FILE');

        function uploadBase64(strBase64: string, file: any) {
            // var req = {
            //     method: 'POST',
            //     url: 'http://up.qiniu.com/putb64/-1',
            //     headers: {
            //         'Content-Type': 'application/octet-stream',
            //         'Authorization': "UpToken " + conversationServer.uploadFileToken
            //     },
            //     withCredentials: false,
            //     data: strBase64
            // };
            // $http(req).success(function (res) {
            //     // callback && callback.onSuccess && callback.onSuccess();
            //     getThumbnailAndSendImg(res, file);
            //     showLoading(false);
            //     $scope.showPasteDiv(false);
            // }).error(function (err) {
            //     console.log('uploadBase64', err);
            //     showLoading(false);
            //     webimutil.Helper.alertMessage.error("上传图片出错！", 2);
            // });
            RongIMLib.RongUploadLib.getInstance().postImage(strBase64, file, $scope.currentConversation.targetType, $scope.currentConversation.targetId, function(ret: any,msg: any, err: any){
                showLoading(false);
                if(err){
                  webimutil.Helper.alertMessage.error("上传图片出错！", 2);
                  return;
                }
                $scope.showPasteDiv(false);
                conversationServer.addHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType, webimmodel.Message.convertMsg(msg));
                setTimeout(function () {
                    $scope.$emit("msglistchange");
                    $scope.$emit("conversationChange");
                }, 200);
                $scope.$apply();
            });
        }

        window.upload_base64 = function () {
            var obj = document.getElementById("message-content");
            if(obj){
                obj.focus();
                document.execCommand("Paste");
                // window.Electron.currentWebContents ? window.Electron.currentWebContents.paste() : window.Electron.currentWindow && window.Electron.currentWindow.webContents.paste()

            }
        }

        setTimeout(function() {
            var obj = document.getElementById("message-content");
            webimutil.Helper.getFocus(obj);
        });

        function handlePaste(e: any) {
            var reg = new RegExp('^data:image/[^;]+;base64,');
            var hasImg = false;
            if(!e.clipboardData.items){
              return;
            }
            for (var i = 0 ; i < e.clipboardData.items.length ; i++) {
                var item = e.clipboardData.items[i];
                if (item.type.indexOf("image") > -1) {
                     var fr = new FileReader;
                     var data = item.getAsFile();
                     fr.onloadend = function() {
                        var base64Code = fr.result;
                        // base64Code = base64Code.replace(reg,'');
                        // uploadBase64(base64Code, data);
                        var picContent = <any>document.getElementsByClassName("picContent")[0];
                        picContent.src =  base64Code;
                        $scope.showPasteDiv(true);
                     };

                     fr.readAsDataURL(data);
                     pasteImgFile = data;
                     e.preventDefault();
                     hasImg = true;
                     break;
                }
            }
            // if(!hasImg){
            //   e.preventDefault();
            //   var strText = e.clipboardData.getData("text/plain");
            //   var obj = document.getElementById("message-content");
            //   obj.innerHTML = obj.innerHTML + strText;
            // }
        }
        document.getElementById("message-content").
            addEventListener("paste", handlePaste);
        // element.bind("paste", function(e: any) {
        //     handlePaste(e);
        // });
        $scope.$on("$destroy", function() {
           //清除配置,不然scroll会重复请求
           conversationServer.clearHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType);
          //  sendReadReceiptMessage(lastItem.messageUId, lastItem.sentTime.getTime());
          if(targetType == webimmodel.conversationType.Group){
            var lastItem = conversationServer.conversationMessageListShow[conversationServer.conversationMessageListShow.length - 1];
            if(lastItem && lastItem.messageUId && lastItem.sentTime){
              sendReadReceiptMessage(lastItem.messageUId, lastItem.sentTime.getTime());
            }
          }
        });

    }])
