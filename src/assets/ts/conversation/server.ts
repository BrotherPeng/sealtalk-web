/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../model/webimModel.ts"/>

var conversationServer = angular.module("webim.conversation.server", []);

conversationServer.factory("conversationServer", ["$q", "mainDataServer", "mainServer", "RongIMSDKServer",
    function($q: any, mainDataServer: mainDataServer, mainServer: mainServer, RongIMSDKServer: RongIMSDKServer) {

        var conversationServer = <any>{};

        conversationServer.atMessagesCache = <any>{};
        conversationServer.historyMessagesCache = <any>{};
        conversationServer.conversationMessageList = <any>[];
        conversationServer.conversationMessageListShow = <any>[];
        conversationServer.pullMessageTime = null;
        conversationServer.remainMessageCount = 5;

        function asyncConverGroupNotifition(msgsdk: any, item: any) {
            var detail = <any>msgsdk.content
            var comment = "", members = <any>[]
            var isself = detail.operatorUserId == mainDataServer.loginUser.id ? true : false;
            switch (detail.operation) {
                case "Add":
                    if(isself){
                       comment = '你邀请' +detail.data.data.targetUserDisplayNames.join('、') + "加入了群组";
                    }else{
                       comment = detail.data.data.operatorNickname + '邀请' +detail.data.data.targetUserDisplayNames.join('、') + "加入了群组";
                    }
                    members = detail.data.data.targetUserIds;
                    break;
                case "Quit":
                    comment = detail.data.data.targetUserDisplayNames.join('、') + "退出了群组"
                    members = detail.data.data.targetUserIds;
                    break;
                case "Kicked":
                    if(isself){
                       comment = '你将' + detail.data.data.targetUserDisplayNames.join('、') + " 移出了群组";
                    }else{
                       comment = detail.data.data.operatorNickname + '将' + detail.data.data.targetUserDisplayNames.join('、') + " 移出了群组";
                    }
                    members = detail.data.data.targetUserIds;
                    break;
                case "Rename":
                    if(isself){
                      comment = "你修改名称为" + detail.data.data.targetGroupName;
                      // + detail.data.data.targetGroupName;
                    }else{
                      comment = detail.data.data.operatorNickname + "修改群名称为" + detail.data.data.targetGroupName;
                    }
                    break;
                case "Create":
                    if(detail.operatorUserId == mainDataServer.loginUser.id){
                      comment = "你创建了群组";
                    }else{
                      comment = detail.data.data.operatorNickname + "创建了群组";
                    }
                    break;
                case "Dismiss":
                    comment = detail.data.data.operatorNickname + "解散了群组";
                    break;
                default:
                    console.log("未知群组通知");
            }

            item.content  = comment;
            // for (var i = 0, len = members.length; i < len; i++) {
            //     mainServer.user.getInfo(members[i]).success(function(rep) {
            //         if (item.content  === comment) {
            //             item.content  = rep.result.nickname + item.content ;
            //         } else {
            //             item.content  = rep.result.nickname + "、" + item.content ;
            //         }
            //     })
            // }
        }

        function asyncConverDiscussionNotifition(msgsdk: any, item: any) {
            var detail = <any>msgsdk
            var comment = "", members = <any>[]
            switch (detail.content.type) {
                case 1:
                    comment = " 加入讨论组";
                    members = detail.content.extension.split(',');
                    break;
                case 2:
                    comment = " 退出讨论组"
                    members = detail.content.extension.split(',');
                    break;
                case 4:
                    comment = " 被踢出讨论组";
                    members = detail.content.extension.split(',');
                    break;
                case 3:
                    comment = " 讨论组更名";
                    break;
                default:
                    console.log("未知讨论组通知");
            }

            item.content  = comment;
            mainServer.user.getBatchInfo(members).then(function (repmem) {
                var lists = repmem.data.result;
                var membersName:string[] = [];
                for (var j = 0, len = lists.length; j < len; j++) {
                    membersName.push(lists[j].nickname);
                }
                if(membersName){
                  item.content = membersName.join('、') + item.content;
                }
            });
            // for (var i = 0, len = members.length; i < len; i++) {
            //     mainServer.user.getInfo(members[i]).success(function(rep) {
            //         if (item.content  === comment) {
            //             item.content  = rep.result.nickname + item.content ;
            //         } else {
            //             item.content  = rep.result.nickname + "、" + item.content ;
            //         }
            //     })
            // }
        }

        function getHistory(id: string, type: string, lastTime: number, count: number) {
            var d = $q.defer();
            var conver = type;
            var currentConversationTargetId = id;

            if (!conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId]) {
                conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId] = [];
            }

            try {

                RongIMSDKServer.getHistoryMessages(+conver, currentConversationTargetId, lastTime, count).then(function(data) {
                    var has = data.has, list = <RongIMLib.Message[]>data.data;
                    var msglen = list.length;
                    if(msglen > 0){
                      conversationServer.pullMessageTime = list[msglen - 1].sentTime;
                    }
                    while (msglen--) {
                        var msgsdk = list[msglen];

                        switch (msgsdk.messageType) {
                            case webimmodel.MessageType.ContactNotificationMessage:
                                //历史邀请消息不做处理
                                break;
                            case webimmodel.MessageType.TextMessage:
                            case webimmodel.MessageType.VoiceMessage:
                            case webimmodel.MessageType.LocationMessage:
                            case webimmodel.MessageType.ImageMessage:
                            case webimmodel.MessageType.RichContentMessage:
                            case webimmodel.MessageType.FileMessage:
                                var item = webimmodel.Message.convertMsg(msgsdk);
                                if (item) {
                                    unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                }
                                break;
                            case webimmodel.MessageType.GroupNotificationMessage:
                                if (msgsdk.objectName == "RC:GrpNtf") {
                                  var item = webimmodel.Message.convertMsg(msgsdk);
                                  if (item) {
                                      conversationServer.asyncConverGroupNotifition(msgsdk, item);
                                      unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                  }
                                }
                                break;
                            case webimmodel.MessageType.UnknownMessage:
                                if (msgsdk.objectName == "RC:GrpNtf") {
                                  var item = webimmodel.Message.convertMsg(msgsdk);
                                  if (item) {
                                      conversationServer.asyncConverGroupNotifition(msgsdk, item);
                                      unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                  }
                                }
                                break;
                            case webimmodel.MessageType.InformationNotificationMessage:
                                var item = webimmodel.Message.convertMsg(msgsdk);
                                if (item) {
                                    unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                }
                                break;
                            case webimmodel.MessageType.DiscussionNotificationMessage:
                                if (msgsdk.objectName == "RC:DizNtf") {

                                }
                                break;
                            default:
                                console.log("此消息类型未处理：" + msgsdk.messageType);
                                break;
                        }

                    }
                    var addtime = conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId][0];
                    if (addtime && addtime.panelType != webimmodel.PanelType.Time) {
                        unshiftHistoryMessages(currentConversationTargetId, conver, new webimmodel.TimePanl(conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId][0].sentTime));
                    }

                    d.resolve(has);
                }, function(err: any) {
                    d.reject(err);
                    console.log('获取历史消息失败');
                });
            } catch (err) {
                console.log("SDK error" + err);
            }

            return d.promise;
        }

        function unshiftHistoryMessages(id: string, type: string, item: any) {
            var arr = conversationServer.historyMessagesCache[type + "_" + id] = conversationServer.historyMessagesCache[type + "_" + id] || [];
            if (arr[0] && item.messageUId && item.messageUId === arr[0].messageUId) {
                return;
            }

            if (arr[0] && arr[0].sentTime && arr[0].panelType != webimmodel.PanelType.Time && item.sentTime) {
                if (compareDateIsAddSpan(arr[0].sentTime, item.sentTime)) {
                    arr.unshift(new webimmodel.TimePanl(arr[0].sentTime));
                }
            }
            messageAddUserInfo(item);
            arr.unshift(item);
        }
// 定时清理消息缓存
        function clearHistoryMessages(id: string, type: string) {
          var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
          var counter = 0;
          for(var i = currenthis.length - 1; i > -1; i--){
            if (currenthis[i].panelType == webimmodel.PanelType.Message) {
                counter++;
            }
            if (counter >= conversationServer.remainMessageCount && currenthis[i].panelType == webimmodel.PanelType.Time) {
                currenthis.splice(0, i);
                conversationServer.unshiftHistoryMessages(id, type, new webimmodel.GetMoreMessagePanel());
                break;
            }
          }
        }

        function getLastMessageTime(id: string, type: string){
          var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
          var sentTime = 0;
          for (var i = 0; i < currenthis.length; i++) {
            if (currenthis[i].panelType == webimmodel.PanelType.Message) {
                sentTime = (new Date(currenthis[i].sentTime)).getTime();
                break;
            }
          }
          return sentTime;
        }

        function compareDateIsAddSpan(first: Date, second: Date) {
            if (Object.prototype.toString.call(first) == "[object Date]" && Object.prototype.toString.call(second) == "[object Date]") {
                var pre = first.toString();
                var cur = second.toString();
                return pre.substring(0, pre.lastIndexOf(":")) != cur.substring(0, cur.lastIndexOf(":"))
            } else {
                return false;
            }
        }

        function addHistoryMessages(id: string, type: string, item: webimmodel.Message) {
            var arr = conversationServer.historyMessagesCache[type + "_" + id] || [];
            var exist = false;
            // if(item.senderUserId != mainDataServer.loginUser.id){
              exist = checkMessageExist(id, type, item.messageUId);
              if (exist) {
                  console.log('exist离线消息有重复');
                  return;
              }
            // }

            if (arr[arr.length - 1] && arr[arr.length - 1].panelType != webimmodel.PanelType.Time && arr[arr.length - 1].sentTime && item.sentTime) {
                if (compareDateIsAddSpan(arr[arr.length - 1].sentTime, item.sentTime)) {
                    arr.push(new webimmodel.TimePanl(item.sentTime));
                    //判断如果是当前会话的消息则加入
                    if (type == mainDataServer.conversation.currentConversation.targetType && id == mainDataServer.conversation.currentConversation.targetId) {
                      conversationServer.conversationMessageListShow.push(new webimmodel.TimePanl(item.sentTime));
                    }
                }
            }
            messageAddUserInfo(item);
            arr.push(item);
            //判断如果是当前会话的消息则加入
            if (type == mainDataServer.conversation.currentConversation.targetType && id == mainDataServer.conversation.currentConversation.targetId) {
              conversationServer.conversationMessageListShow.push(item);
            }
        }

        function addAtMessage(id: string, type: string, item: webimmodel.Message){
          if (!conversationServer.atMessagesCache[type + "_" + id]) {
              conversationServer.atMessagesCache[type + "_" + id] = [];
          }
          var atMsg = { "messageUId": item.messageUId, "mentionedInfo": item.mentionedInfo };
          conversationServer.atMessagesCache[type + "_" + id].push(atMsg);
        }

        //消息里没有用户信息，要去本地的好友列表里查找
        function messageAddUserInfo(item: webimmodel.Message) {
            if (!item.senderUserId) {
                return item;
            }

            var user: webimmodel.Contact;
            if (item.messageDirection == 1) {
                item.senderUserName = mainDataServer.loginUser.nickName;
                item.imgSrc = mainDataServer.loginUser.portraitUri;
                item.senderUserImgSrc = mainDataServer.loginUser.firstchar;
            } else {
                switch (item.conversationType) {
                    case webimmodel.conversationType.Private:
                        user = mainDataServer.contactsList.getFriendById(item.senderUserId);
                        break;
                    case webimmodel.conversationType.Group:
                        user = mainDataServer.contactsList.getGroupMember(item.targetId, item.senderUserId);
                        break;
                    case webimmodel.conversationType.Discussion:
                        user = mainDataServer.contactsList.getDiscussionMember(item.targetId, item.senderUserId);
                        break;
                    case webimmodel.conversationType.System:
                        user = mainDataServer.contactsList.getFriendById(item.senderUserId);
                        if (user) {
                            user = new webimmodel.Contact();
                            user.name = "系统消息";
                        }
                        break;
                    default:
                        console.log("暂不支持此会话类型");
                }
                if (user) {
                    item.senderUserName = user.displayName || user.name;
                    item.senderUserImgSrc = user.firstchar;
                    item.imgSrc = user.imgSrc
                } else {
                    if(item.senderUserId == '__system__') {
                      return;
                    }
                    mainServer.user.getInfo(item.senderUserId).success(function(rep) {
                        if (rep.code == 200) {
                            item.senderUserName = rep.result.nickname;
                            item.senderUserImgSrc = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                            item.imgSrc = rep.result.portraitUri
                        }
                    }).error(function() {
                        //之前可能清过库没有这个用户TODO：删掉
                        console.log("无此用户:" + item.senderUserId);
                    });
                }
            }
            return item;
        }

        function updateHistoryMessagesCache(id: string, type: string, name: string, portrait: string){
             var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
             angular.forEach(currenthis, function(value, key){
               if (value.panelType == webimmodel.PanelType.Message && value.senderUserId == id){
                  value.senderUserName = name;
                  value.imgSrc = portrait;
                  //TODO 重新计算头像
                 //  senderUserImgSrc
               }
             });
        }
        function checkMessageExist(id: string, type: string, messageuid: string){
          var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
          var keepGoing = true;
          if(!messageuid){
            return false;
          }
          angular.forEach(currenthis, function (value, key) {
              if(keepGoing){
                if (value.panelType == webimmodel.PanelType.Message && value.messageUId == messageuid) {
                    keepGoing = false;
                }
              }
          });
          return !keepGoing;
        }

        function updateSendMessage(id: string, type: string, msg: webimmodel.Message){
          var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
          for(var i = currenthis.length - 1; i > -1; i--){
            if (currenthis[i].panelType == webimmodel.PanelType.Message
              && currenthis[i].messageUId == undefined
              && currenthis[i].messageDirection == webimmodel.MessageDirection.SEND
              && currenthis[i].messageId == msg.messageId
            ) {
                currenthis[i].messageUId = msg.messageUId;
                currenthis[i].sentStatus = webimmodel.SentStatus.SENT;
                currenthis.splice(i, 1, msg);
                break;
            }
          }
        }

        function updateSendStatus(id: string, type: string, messageid: string, status: webimmodel.SentStatus){
          var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
          for(var i = currenthis.length - 1; i > -1; i--){
            if (currenthis[i].panelType == webimmodel.PanelType.Message
              && currenthis[i].messageUId == undefined
              && currenthis[i].messageDirection == webimmodel.MessageDirection.SEND
              && currenthis[i].messageId == messageid
            ) {
                currenthis[i].sentStatus = status;
                break;
            }
          }
        }

        function getMessageById(id: string, type: string, messageuid: string){
          var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
          var keepGoing = true;
          var msg:webimmodel.Message = null;
          angular.forEach(currenthis, function (value, key) {
              if(keepGoing){
                if (value.panelType == webimmodel.PanelType.Message && value.messageUId == messageuid) {
                    keepGoing = false;
                    msg = value;
                }
              }
          });
          return msg;
        }

        conversationServer.getHistory = getHistory;
        conversationServer.addHistoryMessages = addHistoryMessages;
        conversationServer.messageAddUserInfo = messageAddUserInfo;
        conversationServer.unshiftHistoryMessages = unshiftHistoryMessages;
        conversationServer.asyncConverGroupNotifition = asyncConverGroupNotifition;
        conversationServer.asyncConverDiscussionNotifition = asyncConverDiscussionNotifition;
        conversationServer.updateHistoryMessagesCache = updateHistoryMessagesCache;
        conversationServer.checkMessageExist = checkMessageExist;
        conversationServer.addAtMessage = addAtMessage;
        conversationServer.clearHistoryMessages = clearHistoryMessages;
        conversationServer.getLastMessageTime = getLastMessageTime;
        conversationServer.getMessageById = getMessageById;
        conversationServer.updateSendMessage = updateSendMessage;
        conversationServer.updateSendStatus = updateSendStatus;

        return conversationServer;
    }])

interface conversationServer {
    atMessagesCache: any
    pullMessageTime: number
    historyMessagesCache: any
    conversationMessageList: any[]
    conversationMessageListShow: any[]
    getHistory(id: string, type: number, lasttime: number, count: number): angular.IPromise<any>
    addHistoryMessages(id: string, type: number, item: webimmodel.Message): void
    messageAddUserInfo(item: webimmodel.Message): void
    unshiftHistoryMessages(id: string, type: number, item: any): void
    asyncConverGroupNotifition(msgsdk: any, item: any): void
    asyncConverDiscussionNotifition(msgsdk: any, item: any): void
    uploadFileToken: string
    initUpload(): void
    updateHistoryMessagesCache(id: string, type:number, name: string, portrait: string): void
    checkMessageExist(id: string, type:number, messageuid: string): boolean
    addAtMessage(id: string, type: number, item: webimmodel.Message): void
    getMessageById(id: string, type:number, messageuid: string): webimmodel.Message
    clearHistoryMessages(id: string, type: number): void
    getLastMessageTime(id: string, type: number): number
    updateSendMessage(id: string, type:number, message: webimmodel.Message): boolean
    updateSendStatus(id: string, type:number, uid: string, status: webimmodel.SentStatus): boolean
}
