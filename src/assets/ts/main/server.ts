/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../model/webimModel.ts"/>
/// <reference path="../../lib/RongIMlib.d.ts"/>


var mainServer = angular.module("webim.main.server", []);

mainServer.factory("mainServer", ["$http", "$q", "appconfig", function($http: angular.IHttpService, $q: angular.IQService, appconfig: any) {

  var serverBaseUrl = appconfig.getBaseUrl();
  var mainServer = {
    user: {
      sendCode: function(phone: string, region: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/send_code",
          data: {
            phone: phone,
            region: region
          }
        })
      },
      verifyCode: function(phone: string, region: string, code: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/verify_code",
          data: {
            phone: phone,
            region: region,
            code: code
          }
        })
      },
      checkUsernameAvailable: function(userName: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/check_username_available",
          data: {
            username: userName
          }
        })
      },
      checkPhoneAvailable: function(phone: string, region: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/check_phone_available",
          data: {
            phone: phone,
            region: region
          }
        })
      },
      signup: function(nickname: string, password: string, token: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/register",
          data: {
            nickname: nickname,
            password: password,
            verification_token: token
          }
        })
      },
      signin: function(phone: string, region: string, password: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/login",
          data: {
            phone: phone,
            region: region,
            password: password
          }
        })
      },
      logout: function() {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/logout"
        })
      },
      getInfo: function(id: string) {
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/" + id
        })
      },
      getBatchInfo: function(ids: string[]) {
        var param = ids.join("&id=")
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/batch?id=" + param
        })
      },
      setNickName: function(nickname: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/set_nickname",
          data: {
            nickname: nickname
          }
        })
      },
      getUserByPhone: function(region: string, phone: string) {
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/find/" + region + "/" + phone
        });
      },
      resetPassword: function(password: string, token: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/reset_password",
          data: {
            password: password,
            verification_token: token
          }
        })
      },
      modefiyPassword: function(newPassword: string, oldPassword: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/change_password",
          data: {
            newPassword: newPassword,
            oldPassword: oldPassword
          }
        })
      },
      getToken: function() {
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/get_token"
        })
      },
      getBlackList: function() {
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/blacklist"
        });
      },
      addToBlackList: function(userId: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/add_to_blacklist",
          data: {
            friendId: userId
          }
        })
      },
      removeFromBlackList: function(userId: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/remove_from_blacklist",
          data: {
            friendId: userId
          }
        })
      },
      sync: function(version: number) {
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/sync",
          data: {
            version: version
          }
        });
      },
      getMyGroups: function() {
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/groups"
        });
      },
      getImageToken: function() {
        return $http({
          method: "get",
          url: serverBaseUrl + "/user/get_image_token"
        });
      },
      setPortraitUri: function(uri: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/user/set_portrait_uri",
          data: {
            portraitUri: uri
          }
        });
      }
    },
    friend: {
      invite: function(friendId: string, message: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/friendship/invite",
          data: {
            friendId: friendId,
            message: message
          }
        });
      },
      getAll: function() {
        return $http({
          method: "get",
          url: serverBaseUrl + "/friendship/all",
        });
      },
      agree: function(friendId: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/friendship/agree",
          data: {
            friendId: friendId
          }
        })
      },
      ignore: function(friendId: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/friendship/ignore",
          data: {
            friendId: friendId
          }
        })
      },
      delete: function(friendId: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/friendship/delete",
          data: {
            friendId: friendId
          }
        })
      },
      getProfile: function(id: string) {
        return $http({
          method: "get",
          url: serverBaseUrl + "/friendship/" + id + "/profile",
        });
      },
      setDisplayName: function(friendId: string, displayName: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/friendship/set_display_name",
          data: {
            friendId: friendId,
            displayName: displayName
          }
        })
      }
    },
    group: {
      create: function(name: string, memberIds: string[]) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/group/create",
          data: {
            name: name,
            memberIds: memberIds
          }
        })
      },
      rename: function(groupId: string, name: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/group/rename",
          data: {
            name: name,
            groupId: groupId
          }
        })
      },
      getById: function(id: string) {
        return $http({
          method: "get",
          url: serverBaseUrl + "/group/" + id
        })
      },
      getGroupMember: function(id: string) {
        return $http({
          method: "get",
          url: serverBaseUrl + "/group/" + id + "/members"
        })
      },
      addMember: function(groupId: string, memberIds: string[]) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/group/add",
          data: {
            groupId: groupId,
            memberIds: memberIds
          }
        })
      },
      kickMember: function(groupId: string, memberIds: string[]) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/group/kick",
          data: {
            groupId: groupId,
            memberIds: memberIds
          }
        })
      },
      dismissGroup: function(groupId: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/group/dismiss",
          data: {
            groupId: groupId
          }
        })
      },
      quit: function(groupId: string) {
        return $http({
          method: "POST",
          url: serverBaseUrl + "/group/quit",
          data: {
            groupId: groupId
          }
        })
      }
    }
  }
  return mainServer;
}])

mainServer.factory("mainDataServer", ["$q", "RongIMSDKServer", "mainServer", function($q: angular.IQService, RongIMSDKServer: RongIMSDKServer, mainServer: mainServer) {

  var mainDataServer = <mainDataServer>{};

  mainDataServer.loginUser = <webimmodel.UserInfo>{};
  mainDataServer.isConnected = false;
  mainDataServer.isTyping = false;
  mainDataServer.conversation = {
    totalUnreadCount: 0,
    lastOfflineMsg: null,
    conversations: <webimmodel.Conversation[]>[],
    currentConversation: <webimmodel.Conversation>{},
    parseConversation: function(item: RongIMLib.Conversation) {
      var conversationitem = webimmodel.Conversation.convertToWebIM(item, mainDataServer.loginUser.id);
      var removeUnreadCount = 0;
      if (item.unreadMessageCount) {
        removeUnreadCount = item.unreadMessageCount;
      }
      switch (item.conversationType) {
        case RongIMLib.ConversationType.CHATROOM:
          conversationitem.title = "聊天室" + item.targetId;
          break;
        case RongIMLib.ConversationType.GROUP:
          let group = mainDataServer.contactsList.getGroupById(item.targetId);
          removeUnreadCount = 0;
          if (!group) {
            if (item.targetId == '__system__') {
            } else {
              (function(id: string, conv: webimmodel.Conversation, listi: any) {
                mainServer.group.getById(id).success(function(rep) {
                  listi.conversationTitle = rep.result.name;
                  conv.title = rep.result.name;
                  var obj = webimutil.ChineseCharacter.convertToABC(rep.result.name);
                  var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.name);
                  conv.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                  conv.imgSrc = rep.result.portraitUri;
                });
              } (item.targetId, conversationitem, item));
            }

          } else {
            //TODO:添加最后一条消息的发送人
            if (conversationitem.lastMsg && item.latestMessage.objectName != "RC:GrpNtf" && item.latestMessage.objectName != "RC:InfoNtf") {
              var atStr = '';
              if (item.mentionedMsg) {
                conversationitem.mentionedInfo = item.mentionedMsg.mentionedInfo;
                var atType = conversationitem.mentionedInfo.type;
                var atUsers = conversationitem.mentionedInfo.userIdList;
                if (atType == webimmodel.AtTarget.All) {
                  atStr = "[有人@我]";
                } else if (atType == webimmodel.AtTarget.Part) {
                  for (var i = 0; i < atUsers.length; i++) {
                    if (atUsers[i] == mainDataServer.loginUser.id) {
                      atStr = "[有人@我]";
                      break;
                    }
                  }
                }
                conversationitem.atStr = atStr;
              }
              var member = mainDataServer.contactsList.getGroupMember(group.id, item.latestMessage.senderUserId);
              if(item.latestMessage.senderUserId==mainDataServer.loginUser.id){
                conversationitem.lastMsg = "你：" + conversationitem.lastMsg;
              } else if (member) {
                conversationitem.lastMsg = member.name + "：" + conversationitem.lastMsg;
              } else {
                (function(id: string, conv: webimmodel.Conversation) {
                  mainServer.user.getInfo(id).success(function(user) {
                    conv.lastMsg = user.result.nickname + "：" + conversationitem.lastMsg;
                  });
                } (item.latestMessage.senderUserId, conversationitem))
              }
            }
            item.conversationTitle = group ? group.name : "未知群组";
            conversationitem.title = group ? group.name : "未知群组";
          }
          // item.conversationTitle = group ? group.name : "未知群组";
          // conversationitem.title = group ? group.name : "未知群组";
          if (conversationitem.lastMsg && item.latestMessage.objectName == "RC:GrpNtf" && item.latestMessage.content.operation == "Create" && item.latestMessage.content.operatorUserId == mainDataServer.loginUser.id) {
            conversationitem.lastMsg = '你 创建了群组';
          }
          conversationitem.firstchar = group ? group.firstchar : "";
          conversationitem.imgSrc = group ? group.imgSrc : "";
          conversationitem.firstchar = group ? group.firstchar : "";
          conversationitem.everychar = group ? group.everychar : "";
          break;
        case RongIMLib.ConversationType.PRIVATE:
          if (item.latestMessage.messageType == webimmodel.MessageType.ContactNotificationMessage) {
            RongIMSDKServer.removeConversation(RongIMLib.ConversationType.PRIVATE, item.targetId).then(function() {

            });
            break;
          }
          removeUnreadCount = 0;
          var friendinfo = mainDataServer.contactsList.getFriendById(item.targetId || item.senderUserId)
          if (friendinfo) {
            item.conversationTitle = friendinfo.displayName || friendinfo.name;
            conversationitem.title = friendinfo.displayName || friendinfo.name;
            conversationitem.firstchar = friendinfo.firstchar;
            conversationitem.imgSrc = friendinfo.imgSrc;
            conversationitem.firstchar = friendinfo.firstchar;
            conversationitem.everychar = friendinfo.everychar;
          }
          else if (item.targetId) {
            var friendinfo = mainDataServer.contactsList.getNonFriendById(item.targetId || item.senderUserId)
            if (friendinfo) {
              item.conversationTitle = friendinfo.displayName || friendinfo.name;
              conversationitem.title = friendinfo.displayName || friendinfo.name;
              conversationitem.firstchar = friendinfo.firstchar;
              conversationitem.imgSrc = friendinfo.imgSrc;
              // conversationitem.firstchar = friendinfo.firstchar;
              // conversationitem.everychar = friendinfo.everychar;
            }
            else {
              (function(id: string, conv: webimmodel.Conversation) {
                mainServer.user.getInfo(id).success(function(rep) {
                  conv.title = rep.result.nickname + "(非好友)";
                  conv.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                  var obj = webimutil.ChineseCharacter.convertToABC(rep.result.nickname);
                  var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                  conv.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                  conv.imgSrc = rep.result.portraitUri;

                  var _friend = new webimmodel.Friend({
                    id: id,
                    name: conv.title,
                    imgSrc: conv.imgSrc
                  });
                  _friend.firstchar = f;
                  mainDataServer.contactsList.addNonFriend(_friend);
                }).error(function() {
                  conv.title = "非系统用户";
                });
              })(item.targetId || item.senderUserId, conversationitem)
            }
          }
          break;
        case RongIMLib.ConversationType.SYSTEM:
          break;
        case RongIMLib.ConversationType.DISCUSSION:
          break;
        case RongIMLib.ConversationType.CUSTOMER_SERVICE:
          break;
      }
      return { 'item': conversationitem, 'removeUnreadCount': removeUnreadCount };
    },
    // updateConversations: function() {
    //     //更新未读总数
    //     var defer = $q.defer();
    //     var allUnreadCount = 0;
    //     RongIMSDKServer.getTotalUnreadCount().then(function(data) {
    //         allUnreadCount = data;
    //     });
    //
    //     RongIMSDKServer.getConversationList().then(function(list) {
    //         RongIMLib.RongIMClient.getInstance().sortConversationList(list);
    //         mainDataServer.conversation.conversations = [];
    //         for (var i = 0, length = list.length; i < length; i++) {
    //             var conversationitem = webimmodel.Conversation.convertToWebIM(list[i], mainDataServer.loginUser.id);
    //
    //             switch (list[i].conversationType) {
    //                 case RongIMLib.ConversationType.CHATROOM:
    //                     conversationitem.title = "聊天室" + list[i].targetId;
    //                     if (list[i].unreadMessageCount) {
    //                         allUnreadCount = allUnreadCount - list[i].unreadMessageCount;
    //                     }
    //                     break;
    //                 case RongIMLib.ConversationType.GROUP:
    //                     let group = mainDataServer.contactsList.getGroupById(list[i].targetId);
    //                     if (!group) {
    //                         if (list[i].targetId == '__system__') {
    //                         }else{
    //                           (function (id: string, conv: webimmodel.Conversation, listi: any) {
    //                               mainServer.group.getById(id).success(function (rep) {
    //                                   listi.conversationTitle = rep.result.name;
    //                                   conv.title = rep.result.name;
    //                                   var obj = webimutil.ChineseCharacter.convertToABC(rep.result.name);
    //                                   var obj = webimutil.ChineseCharacter.convertToABC(rep.result.name);
    //                                   var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.name);
    //                                   conv.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f});
    //                                   conv.imgSrc = rep.result.portraitUri;
    //                               });
    //                           }(list[i].targetId, conversationitem, list[i]));
    //                         }
    //
    //                     } else {
    //                         //TODO:添加最后一条消息的发送人
    //                         if (conversationitem.lastMsg && list[i].latestMessage.objectName != "RC:GrpNtf" && list[i].latestMessage.objectName != "RC:InfoNtf") {
    //                             var member = mainDataServer.contactsList.getGroupMember(group.id, list[i].latestMessage.senderUserId);
    //                             if (member) {
    //                                 conversationitem.lastMsg = member.name + "：" + conversationitem.lastMsg;
    //                             } else {
    //                                 (function(id: string, conv: webimmodel.Conversation) {
    //                                     mainServer.user.getInfo(id).success(function(user) {
    //                                         conv.lastMsg = user.result.nickname + "：" + conversationitem.lastMsg;
    //                                     });
    //                                 } (list[i].latestMessage.senderUserId, conversationitem))
    //                             }
    //                         }
    //                         list[i].conversationTitle = group ? group.name : "未知群组";
    //                         conversationitem.title = group ? group.name : "未知群组";
    //                     }
    //                     // list[i].conversationTitle = group ? group.name : "未知群组";
    //                     // conversationitem.title = group ? group.name : "未知群组";
    //                     if (conversationitem.lastMsg && list[i].latestMessage.objectName == "RC:GrpNtf" && list[i].latestMessage.content.message.content.operation == "Create" && list[i].latestMessage.content.message.content.operatorUserId == mainDataServer.loginUser.id) {
    //                          conversationitem.lastMsg = '你 创建了群组';
    //                     }
    //                     conversationitem.firstchar = group ? group.firstchar : "";
    //                     conversationitem.imgSrc = group ? group.imgSrc : "";
    //                     conversationitem.firstchar = group ? group.firstchar : "";
    //                     conversationitem.everychar = group ? group.everychar : "";
    //                     break;
    //                 case RongIMLib.ConversationType.PRIVATE:
    //                     if (list[i].latestMessage.messageType == webimmodel.MessageType.ContactNotificationMessage) {
    //                         RongIMSDKServer.removeConversation(RongIMLib.ConversationType.PRIVATE, list[i].targetId).then(function() {
    //
    //                         });
    //                         continue;
    //                     }
    //                     var friendinfo = mainDataServer.contactsList.getFriendById(list[i].targetId || list[i].senderUserId)
    //                     if (friendinfo) {
    //                         list[i].conversationTitle = friendinfo.displayName || friendinfo.name;
    //                         conversationitem.title = friendinfo.displayName || friendinfo.name;
    //                         conversationitem.firstchar = friendinfo.firstchar;
    //                         conversationitem.imgSrc = friendinfo.imgSrc;
    //                         conversationitem.firstchar = friendinfo.firstchar;
    //                         conversationitem.everychar = friendinfo.everychar;
    //                     } else if (list[i].targetId) {
    //                         (function(id: string, conv: webimmodel.Conversation) {
    //                             mainServer.user.getInfo(id).success(function(rep) {
    //                                 // list[i].conversationTitle = rep.result.nickname;
    //                                 conv.title = rep.result.nickname + "(非好友)";
    //                                 conv.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
    //                                 var obj = webimutil.ChineseCharacter.convertToABC(rep.result.nickname);
    //                                 var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
    //                                 conv.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f});
    //                                 conv.imgSrc = rep.result.portraitUri;
    //                             }).error(function() {
    //                                 conv.title = "非系统用户";
    //                             });
    //                         })(list[i].targetId || list[i].senderUserId, conversationitem)
    //                     }
    //
    //                     break;
    //                 case RongIMLib.ConversationType.SYSTEM:
    //                     list[i].conversationTitle = "系统消息";
    //                     conversationitem.title = "系统消息";
    //                     if (list[i].unreadMessageCount) {
    //                         allUnreadCount = allUnreadCount - list[i].unreadMessageCount;
    //                     }
    //                     break;
    //
    //                 case RongIMLib.ConversationType.DISCUSSION:
    //                      if (list[i].unreadMessageCount) {
    //                         allUnreadCount = allUnreadCount - list[i].unreadMessageCount;
    //                      }
    //                      break;
    //                 case RongIMLib.ConversationType.CUSTOMER_SERVICE:
    //                     if(list[i].unreadMessageCount){
    //                         allUnreadCount = allUnreadCount - list[i].unreadMessageCount;
    //                     }
    //                     break;
    //             }
    //             if(list[i].conversationType == RongIMLib.ConversationType.CUSTOMER_SERVICE || list[i].conversationType == RongIMLib.ConversationType.DISCUSSION  || list[i].conversationType == RongIMLib.ConversationType.SYSTEM  || list[i].conversationType == RongIMLib.ConversationType.CHATROOM) continue;
    //             mainDataServer.conversation.conversations.push(conversationitem);
    //         }
    //         mainDataServer.conversation.totalUnreadCount = allUnreadCount;
    //         defer.resolve();
    //     }, function() {
    //         defer.reject();
    //     })
    //
    //     return defer.promise;
    //
    // },
    updateConversations: function() {
      //更新未读总数
      var defer = $q.defer();
      var allUnreadCount = 0;
      RongIMSDKServer.getTotalUnreadCount().then(function(data) {
        allUnreadCount = data;
      });

      RongIMSDKServer.getConversationList().then(function(list) {
        list = RongIMLib.RongIMClient.getInstance().sortConversationList(list);
        mainDataServer.conversation.conversations = [];
        for (var i = 0, length = list.length; i < length; i++) {
          var result = mainDataServer.conversation.parseConversation(list[i]);
          // allUnreadCount = allUnreadCount - result.removeUnreadCount;
          if (list[i].conversationType == RongIMLib.ConversationType.CUSTOMER_SERVICE || list[i].conversationType == RongIMLib.ConversationType.DISCUSSION || list[i].conversationType == RongIMLib.ConversationType.SYSTEM || list[i].conversationType == RongIMLib.ConversationType.CHATROOM ||list[i].conversationType == RongIMLib.ConversationType.PUBLIC_SERVICE||list[i].conversationType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ) continue;
          mainDataServer.conversation.conversations.push(result.item);
        }
        mainDataServer.conversation.totalUnreadCount = allUnreadCount;
        defer.resolve();
      }, function() {
        defer.reject();
      })
      return defer.promise;

    },
    createConversation: function(targetType: number, targetId: string) {
      var item = new webimmodel.Conversation();
      item.targetId = targetId;
      item.targetType = targetType;

      switch (targetType) {
        case webimmodel.conversationType.Private:
          var friendinfo = mainDataServer.contactsList.getFriendById(targetId)
          if (friendinfo) {
            item.title = friendinfo.displayName || friendinfo.name;
            item.firstchar = friendinfo.firstchar;
            item.imgSrc = friendinfo.imgSrc;
          } else {
            mainServer.user.getInfo(targetId).success(function(rep) {
              item.title = rep.result.nickname + "(非好友)";
              item.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
              item.imgSrc = rep.result.portraitUri;
            }).error(function() {

            });
          }
          break;
        case webimmodel.conversationType.Group:
          var groupinfo = mainDataServer.contactsList.getGroupById(targetId);
          if (groupinfo) {
            item.title = groupinfo.name;
            item.firstchar = groupinfo.firstchar;
          } else {
            mainServer.group.getById(targetId).success(function(rep) {
              item.title = rep.result.name;
              item.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.name);
              var obj = webimutil.ChineseCharacter.convertToABC(rep.result.name);
              var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.name);
              item.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
              item.imgSrc = rep.result.portraitUri;
            }).error(function() {

            });
          }
          break;
        case webimmodel.conversationType.Discussion:
          var discussioninfo = mainDataServer.contactsList.getDiscussionById(targetId);
          if (discussioninfo) {
            item.title = discussioninfo.name;
            item.firstchar = discussioninfo.firstchar;
          }
          else {
            RongIMSDKServer.getDiscussion(targetId).then(function(rep) {
              var discuss = rep.data;
              item.title = discuss.name;
              item.firstchar = webimutil.ChineseCharacter.getPortraitChar(discuss.name);
            }, function() {
              item.title = "未知讨论组";
            });
          }
          break;
        default:
          console.log("暂不支持创建此类型会话");
      }

      return item;
    },
    getConversation: function(type: number, id: string) {
      for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
        if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
          return mainDataServer.conversation.conversations[i];
        }
      }
      return null;
    },
    updateConversationTitle: function(type: number, id: string, title: string) {
      for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
        if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
          mainDataServer.conversation.conversations[i].title = title;
          return true;
        }
      }
      return false;
    },
    updateConversationDetail: function(type: number, id: string, title: string, portrait: string) {
      for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
        if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
          mainDataServer.conversation.conversations[i].title = title;
          mainDataServer.conversation.conversations[i].imgSrc = portrait;
          return true;
        }
      }
      return false;
    },
    updateConStatic: function(msg: webimmodel.Message, add: boolean, isChat: boolean) {
      var type = msg.conversationType, id = msg.targetId;
      var hasCon = false;
      if (type == webimmodel.conversationType.Discussion || type == webimmodel.conversationType.System && msg.messageType != webimmodel.MessageType.ContactNotificationMessage || type == webimmodel.conversationType.ChartRoom) {
        return;
      }
      if (msg.messageType == webimmodel.MessageType.ReadReceiptMessage
        || msg.messageType == webimmodel.MessageType.TypingStatusMessage
        || msg.messageType == webimmodel.MessageType.SyncReadStatusMessage
        || msg.messageType == webimmodel.MessageType.ReadReceiptRequestMessage
        || msg.messageType == webimmodel.MessageType.ReadReceiptResponseMessage
      ) {
        return;
      }

      RongIMSDKServer.getConversation(type, id).then(function(data) {
        if (data) {
          var result = mainDataServer.conversation.parseConversation(data);
          var oldUnread = 0, totalUnreadCount = mainDataServer.conversation.totalUnreadCount, isfirst = false, conversationItem: webimmodel.Conversation;
          for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
            conversationItem = mainDataServer.conversation.conversations[i];
            if (conversationItem.targetType == type && conversationItem.targetId == id) {
              oldUnread = conversationItem.unReadNum;
              if (i == 0 || conversationItem.isTop ||(mainDataServer.conversation.conversations[i-1]&&mainDataServer.conversation.conversations[i-1].isTop)) {
                isfirst = true;
                conversationItem.lastMsg = result.item.lastMsg;
                conversationItem.unReadNum = result.item.unReadNum;
                conversationItem.lastTime = result.item.lastTime;
                if (msg.senderUserId == mainDataServer.loginUser.id) {
                  RongIMSDKServer.clearUnreadCount(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId);
                  totalUnreadCount = totalUnreadCount - oldUnread;
                  result.item.unReadNum = 0;
                  conversationItem.atStr = '';
                }
                else {
                  conversationItem.atStr = result.item.atStr;
                }
              }
              else {
                mainDataServer.conversation.conversations.splice(i, 1);
              }
              break;
            }
          }
          if (isChat && mainDataServer.conversation.currentConversation && type == mainDataServer.conversation.currentConversation.targetType && id == mainDataServer.conversation.currentConversation.targetId) {
            RongIMSDKServer.clearUnreadCount(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId);
            totalUnreadCount = totalUnreadCount - oldUnread;
            result.item.unReadNum = 0;
            result.item.atStr = '';
          } else {
            if (msg.senderUserId == mainDataServer.loginUser.id) {
              RongIMSDKServer.clearUnreadCount(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId);
              totalUnreadCount = totalUnreadCount - oldUnread;
              result.item.unReadNum = 0;
              result.item.atStr = '';
            }
            else {
              totalUnreadCount = totalUnreadCount - oldUnread + result.item.unReadNum;
            }
          }
          // mainDataServer.conversation.totalUnreadCount = totalUnreadCount;
          RongIMSDKServer.getTotalUnreadCount().then(function (data) {
              mainDataServer.conversation.totalUnreadCount = data;
          });
          if (add && !isfirst) {
            var arr = mainDataServer.conversation.conversations;
            for(var i=0,len=arr.length;i<len;i++){
              if(arr[i].isTop == 1){
                continue;
              }
              arr.splice(i,0,result.item);
              break;
            }
            // mainDataServer.conversation.conversations.unshift(result.item);
          }
        }
        else {
          console.log('无法获取该会话', type, id);
        }
      }, function(err) {
        console.log("RongIMSDKServer.getConversation err:" + err, type, id);
      });
    },
    updateConStaticBeforeSend: function(msg: webimmodel.Message, add: boolean) {
      var type = msg.conversationType, id = msg.targetId;
      var hasCon = false;
      var oldUnread = 0, totalUnreadCount = mainDataServer.conversation.totalUnreadCount, isfirst = false, conversationItem: webimmodel.Conversation;
      for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
        conversationItem = mainDataServer.conversation.conversations[i];
        if (conversationItem.targetType == type && conversationItem.targetId == id) {
          switch (msg.messageType) {
            case webimmodel.MessageType.TextMessage:
              conversationItem.lastMsg = msg.content.content;
              break;
            case webimmodel.MessageType.ImageMessage:
              conversationItem.lastMsg = '[图片';
              break;
            case webimmodel.MessageType.FileMessage:
              conversationItem.lastMsg = '[文件] ' + msg.content.name;
              break;
          }

          conversationItem.lastTime = msg.sentTime;
          conversationItem.unReadNum = 0;
          conversationItem.atStr = '';
          if (type == webimmodel.conversationType.Group) {
            conversationItem.lastMsg = '你: ' + conversationItem.lastMsg;
          }

          if (i > 0) {
            mainDataServer.conversation.conversations.splice(i, 1);
            mainDataServer.conversation.conversations.unshift(conversationItem);
          }
          break;
        }
      }
    },
    // updateConStatic: function (msg: webimmodel.Message, add: boolean, isChat:boolean) {
    //   var type = msg.conversationType , id = msg.targetId;
    //   var hasCon = false;
    //   if (type == webimmodel.conversationType.Discussion || type == webimmodel.conversationType.System && msg.messageType != webimmodel.MessageType.ContactNotificationMessage || type == webimmodel.conversationType.ChartRoom) {
    //       return;
    //   }
    //   if(msg.messageType == webimmodel.MessageType.ReadReceiptMessage || msg.messageType == webimmodel.MessageType.TypingStatusMessage){
    //     return ;
    //   }
    //   if(add){  //add
    //      //updateCon  顺序,最近会话内容,时间
    //      var curCon : webimmodel.Conversation = null;
    //      for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
    //          if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
    //              curCon = mainDataServer.conversation.conversations[i];
    //              mainDataServer.conversation.conversations.splice(i, 1);
    //              hasCon = true;
    //              break;
    //          }
    //      }
    //      if(!hasCon){   // create con
    //          curCon = mainDataServer.conversation.createConversation(type, id);
    //      }
    //      switch (msg.messageType) {
    //        case webimmodel.MessageType.VoiceMessage:
    //            curCon.lastMsg = '[声音]';
    //            break;
    //        case webimmodel.MessageType.TextMessage:
    //            curCon.lastMsg = msg.content.content;
    //            break;
    //        case webimmodel.MessageType.LocationMessage:
    //            curCon.lastMsg = '[位置]';
    //            break;
    //        case webimmodel.MessageType.ImageMessage:
    //            curCon.lastMsg = '[图片]';
    //            break;
    //        case webimmodel.MessageType.RichContentMessage:
    //            curCon.lastMsg = '[富文本]';
    //            break;
    //        case webimmodel.MessageType.ContactNotificationMessage:
    //            break;
    //        case webimmodel.MessageType.DiscussionNotificationMessage:
    //            curCon.lastMsg = msg.content;
    //            break;
    //        case webimmodel.MessageType.UnknownMessage:
    //            if (msg.objectName == "RC:GrpNtf"){
    //                curCon.lastMsg = msg.content;
    //            }
    //            break;
    //        case webimmodel.MessageType.ReadReceiptMessage:
    //        case webimmodel.MessageType.TypingStatusMessage:
    //            break;
    //        case webimmodel.MessageType.InformationNotificationMessage:
    //           //  curCon.lastMsg = msg.content;
    //            curCon.lastMsg = "[通知消息]";
    //            break;
    //        default:
    //            curCon.lastMsg = '未解析';
    //      }
    //      if (type == webimmodel.conversationType.Group && msg.messageType!=webimmodel.MessageType.UnknownMessage && msg.messageType!=webimmodel.MessageType.InformationNotificationMessage){
    //          //  if (conversationitem.lastMsg && list[i].latestMessage.objectName != "RC:GrpNtf") {
    //               var member = mainDataServer.contactsList.getGroupMember(msg.targetId, msg.senderUserId);
    //               if (member) {
    //                   curCon.lastMsg = member.name + "：" + curCon.lastMsg;
    //               }
    //               else {
    //                   (function (id: string, conv: webimmodel.Conversation) {
    //                       mainServer.user.getInfo(id).success(function (user) {
    //                           conv.lastMsg = user.result.nickname + "：" + conv.lastMsg;
    //                       });
    //                   }(msg.senderUserId, curCon));
    //               }
    //          //  }
    //
    //      }
    //      if(isChat && type == mainDataServer.conversation.currentConversation.targetType && id == mainDataServer.conversation.currentConversation.targetId){
    //          RongIMSDKServer.clearUnreadCount(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId);
    //          mainDataServer.conversation.totalUnreadCount = mainDataServer.conversation.totalUnreadCount - curCon.unReadNum;
    //          curCon.unReadNum = 0;
    //      }else{
    //        if(msg.senderUserId == mainDataServer.loginUser.id){}
    //        else{
    //          if(curCon.unReadNum){
    //            curCon.unReadNum++;
    //          }else{
    //            curCon.unReadNum = 1;
    //          }
    //          mainDataServer.conversation.totalUnreadCount++;
    //        }
    //      }
    //      curCon.lastTime = msg.sentTime;
    //      mainDataServer.conversation.conversations.unshift(curCon);
    //
    //     //如果不是当前会话,则会话未读消息增加;总未读消息增加
    //   }else{
    //     for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
    //         if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
    //             var curCon = mainDataServer.conversation.conversations[i];
    //             mainDataServer.conversation.conversations.splice(i, 1);
    //             break;
    //         }
    //     }
    //   }
    // },
    setDraft: function(type: string, id: string, msg: string) {
      for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
        if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
          mainDataServer.conversation.conversations[i].draftMsg = msg;
          return true;
        }
      }
      return false;
    },
    clearMessagesUnreadStatus: function(type: string, targetid: string) {
      for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
        if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == targetid) {
          mainDataServer.conversation.conversations[i].unReadNum = 0;
          return true;
        }
      }
      return false;
    },
    find: function(str: string, arr: webimmodel.Conversation[]) {
      var num = /^[0-9]+$/, abc = /^[a-zA-Z]+$/, reg = /^[0-9a-zA-Z\-]+$/;
      var str = str.trim();
      var newArr = <webimmodel.Conversation[]>[];

      // if (num.test(str)) {
      //
      // } else
      if (reg.test(str)) {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.everychar.toLowerCase().indexOf(str.toLowerCase()) !== -1 || item.pinyin.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
            newArr.push(item);
          }
        }
      } else if (str !== "") {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.title.indexOf(str) !== -1) {
            newArr.push(item);
          }
        }
      }
      return newArr;
    }
  };

  mainDataServer.blackList = {
    list: [],
    add: function(item: webimmodel.Friend) {
      item.firstchar = webimutil.ChineseCharacter.getPortraitChar(item.name);
      this.list.push(item);
    },
    remove: function(id: string) {
      for (var i = 0, len = this.list.length; i < len; i++) {
        if (this.list[i].id == id) {
          this.list.splice(i, 1);
          return true;
        }
      }
      return false;
    },
    getById: function(id: string) {
      for (var i = 0, len = this.list.length; i < len; i++) {
        if (this.list[i].id == id) {
          return this.list[i];
        }
      }
      return null;
    }
  }

  var contactsList = {
    nonFriendList: <webimmodel.Friend[]>[],
    groupList: <webimmodel.Group[]>[],
    subgroupList: <webimmodel.Subgroup[]>[],
    discussionList: <webimmodel.Discussion[]>[],
    getGroupById: function(id: string) {
      for (let i = 0; i < this.groupList.length; i++) {
        let item = this.groupList[i];
        if (item.id == id) {
          return item;
        }
      }
      return null;
    },
    updateGroupInfoById: function(id: string, group: webimmodel.Group) {
      for (let i = 0; i < this.groupList.length; i++) {
        let item = this.groupList[i];
        if (item.id == id) {
          item.name = group.name;
          if (group.imgSrc) {
            item.imgSrc = group.imgSrc;
          }
          var obj = webimutil.ChineseCharacter.convertToABC(group.name);
          var f = webimutil.ChineseCharacter.getPortraitChar(group.name);
          item.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f })
          return true;
        }
      }
      return false;
    },
    getDiscussionById: function(id: string) {
      for (let i = 0; i < this.discussionList.length; i++) {
        let item = this.discussionList[i];
        if (item.id == id) {
          return item;
        }
      }
      return null;
    },
    getFriendById: function(id: string) {
      for (var i = 0, slen = this.subgroupList.length; i < slen; i++) {
        var list = this.subgroupList[i].list;
        for (var j = 0, flen = list.length; j < flen; j++) {
          if (list[j].id == id) {
            return list[j];
          }
        }
      }
      return null;
    },
    quickGetFriend: function(id: string, firstchar: string) {
      for (var i = 0, slen = this.subgroupList.length; i < slen; i++) {
        var list = this.subgroupList[i].list;
        if (this.subgroupList[i].title == firstchar) {
          for (var j = 0, flen = list.length; j < flen; j++) {
            if (list[j].id == id) {
              return list[j];
            }
          }
        }
      }
      return null;
    },
    addFriend: function(friend: webimmodel.Friend) {
      var obj = webimutil.ChineseCharacter.convertToABC(friend.name);
      var f = webimutil.ChineseCharacter.getPortraitChar(friend.name);
      friend.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
      f = webimutil.ChineseCharacter.getPortraitChar2(friend.name);
      if (!this.quickGetFriend(friend.id, f)) {
        for (var i = 0, len = this.subgroupList.length; i < len; i++) {
          if (this.subgroupList[i].title == f) {
            this.subgroupList[i].list.push(friend);
            return friend;
          }
        }
        this.subgroupList.push(new webimmodel.Subgroup(f, [friend]));
        this.subgroupList.sort(function(a: webimmodel.Subgroup, b: webimmodel.Subgroup) { return a.title.charCodeAt(0) - b.title.charCodeAt(0); });
        return friend;
      }
    },
    removeFriend: function(friendId: string) {
      for (var i = 0, slen = this.subgroupList.length; i < slen; i++) {
        var list = this.subgroupList[i].list;
        for (var j = 0, flen = list.length; j < flen; j++) {
          if (list[j].id == friendId) {
            list.splice(j, 1);
            if (list.length === 0) {
              this.subgroupList.splice(i, 1);
            }
            mainDataServer.conversation.updateConversations();
            return true;
          }
        }
      }
      return false;
    },
    removeFriendFromSubgroup: function(friend: webimmodel.Friend) {
      var obj = webimutil.ChineseCharacter.convertToABC(friend.displayName || friend.name);
      var f = webimutil.ChineseCharacter.getPortraitChar(friend.displayName || friend.name);
      friend.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
      f = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
      for (var i = 0, len = this.subgroupList.length; i < len; i++) {
        if (this.subgroupList[i].title == f) {
          for (var j = 0, lenj = this.subgroupList[i].list.length; j < lenj; j++) {
            if (this.subgroupList[i].list[j].id == friend.id) {
              this.subgroupList[i].list.splice(j, 1);
              break;
            }
          }
          if (this.subgroupList[i].list.length)
            break;
          this.subgroupList.splice(i, 1);
          break;
        }
      }

    },
    updateOrAddFriend: function(friend: webimmodel.Friend) {
      var obj = webimutil.ChineseCharacter.convertToABC(friend.displayName || friend.name);
      var f = webimutil.ChineseCharacter.getPortraitChar(friend.displayName || friend.name);
      friend.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
      f = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
      var oldFriend = this.quickGetFriend(friend.id, f);
      if (!oldFriend) {
        for (var i = 0, len = this.subgroupList.length; i < len; i++) {
          if (this.subgroupList[i].title == f) {
            this.subgroupList[i].list.push(friend);
            return friend;
          }
        }
        this.subgroupList.push(new webimmodel.Subgroup(f, [friend]));
        this.subgroupList.sort(function(a: webimmodel.Subgroup, b: webimmodel.Subgroup) { return a.title.charCodeAt(0) - b.title.charCodeAt(0); });
        return friend;
      } else {
        angular.extend(oldFriend, friend);
        return oldFriend;
      }
    },
    addGroup: function(group: webimmodel.Group) {
      if (!contactsList.getGroupById(group.id)) {
        var obj = webimutil.ChineseCharacter.convertToABC(group.name);
        var f = webimutil.ChineseCharacter.getPortraitChar(group.name);
        group.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f })
        this.groupList.push(group);
      }
    },
    removeGroup: function(groupId: string) {
      for (var i = 0, len = this.groupList.length; i < len; i++) {
        if (this.groupList[i].id == groupId) {
          this.groupList.splice(i, 1);
          mainDataServer.conversation.updateConversations();
          return true;
        }
      }
      return false;
    },
    addDiscussion: function(discussion: webimmodel.Discussion) {
      if (!contactsList.getDiscussionById(discussion.id)) {
        var obj = webimutil.ChineseCharacter.convertToABC(discussion.name);
        var f = webimutil.ChineseCharacter.getPortraitChar(discussion.name);
        discussion.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f })
        this.discussionList.push(discussion);
      }
    },
    removeDiscussion: function(discussionId: string) {
      for (var i = 0, len = this.discussionList.length; i < len; i++) {
        if (this.discussionList[i].id == discussionId) {
          this.discussionList.splice(i, 1);
          mainDataServer.conversation.updateConversations();
          return true;
        }
      }
      return false;
    },
    find: function(str: string, arr: webimmodel.Contact[]) {
      var num = /^[0-9]+$/, abc = /^[a-zA-Z]+$/, reg = /^[0-9a-zA-Z\-]+$/;
      var str = str.trim();
      var newArr = <webimmodel.Contact[]>[];

      // if (num.test(str)) {
      //
      // } else
      if (reg.test(str)) {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.everychar.toLowerCase().indexOf(str.toLowerCase()) !== -1 || item.pinyin.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
            newArr.push(item);
          }
        }
      } else if (str !== "") {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.name.indexOf(str) !== -1) {
            newArr.push(item);
          }
        }
      }
      return newArr;
    },
    getGroupMember: function(groupId: string, memberId: string) {
      var item = this.getGroupById(groupId);
      if (item) {
        for (let i = 0, len = item.memberList.length; i < len; i++) {
          if (item.memberList[i].id == memberId) {
            return item.memberList[i];
          }
        }
      } else {

      }

      return null;
    },
    addGroupMember: function(groupId: string, member: webimmodel.Member) {
      var item = this.getGroupById(groupId);
      if (item && !contactsList.getGroupMember(groupId, member.id)) {
        var obj = webimutil.ChineseCharacter.convertToABC(member.name);

        var f = webimutil.ChineseCharacter.getPortraitChar(member.name);

        member.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
        if (member.role == "0") {
          item.memberList.unshift(member);
        } else {
          item.memberList.push(member);
        }
        item.fact = item.memberList.length;
      } else {

      }
    },
    removeGroupMember: function(groupId: string, memberid: string) {
      var item = this.getGroupById(groupId);
      if (!item) {
        throw Error("not found group:" + groupId);
      }

      for (let i = 0, len = item.memberList.length; i < len; i++) {
        var member = item.memberList[i];
        if (member.id == memberid) {
          item.memberList.splice(i, 1);
          item.fact = item.memberList.length;
          return true;
        }
      }
      return false;
    },
    updateGroupMember: function(memberId: string, member: webimmodel.Member) {
      for (let i = 0; i < this.groupList.length; i++) {
        let item = this.groupList[i];
        let _member = this.getGroupMember(item.id, memberId);
        if (_member) {
          _member.name = member.name;
          _member.imgSrc = member.imgSrc;
          var obj = webimutil.ChineseCharacter.convertToABC(_member.name);
          var f = webimutil.ChineseCharacter.getPortraitChar(_member.name);
          _member.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
        }
      }
    },
    getDiscussionMember: function(discussionId: string, memberId: string) {
      var item = this.getDiscussionById(discussionId);
      if (item) {
        for (let i = 0, len = item.memberList.length; i < len; i++) {
          if (item.memberList[i].id == memberId) {
            return item.memberList[i];
          }
        }
      } else {

      }

      return null;
    },
    addDiscussionMember: function(discussionId: string, member: webimmodel.Member) {
      var item = this.getDiscussionById(discussionId);
      if (item && !contactsList.getDiscussionMember(discussionId, member.id)) {
        var obj = webimutil.ChineseCharacter.convertToABC(member.name);

        var f = webimutil.ChineseCharacter.getPortraitChar(member.name);

        member.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
        item.memberList.push(member);
        item.fact = item.memberList.length;
      } else {

      }
    },
    removeDiscussionMember: function(discussionId: string, memberid: string) {
      var item = this.getDiscussionById(discussionId);
      if (!item) {
        throw Error("not found discussion:" + discussionId);
      }

      for (let i = 0, len = item.memberList.length; i < len; i++) {
        var member = item.memberList[i];
        if (member.id == memberid) {
          item.memberList.splice(i, 1);
          item.fact = item.memberList.length;
          return true;
        }
      }
      return false;
    },
    getNonFriendById: function(id: string) {
      for (var i = 0, slen = this.nonFriendList.length; i < slen; i++) {
        if (this.nonFriendList[i].id == id) {
          return this.nonFriendList[i];
        }
      }
      return null;
    },
    addNonFriend: function(person: webimmodel.Friend) {
      if (!contactsList.getNonFriendById(person.id)) {
        var obj = webimutil.ChineseCharacter.convertToABC(person.name);
        var f = webimutil.ChineseCharacter.getPortraitChar(person.name);
        person.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f })
        this.nonFriendList.push(person);
      }
    }
  }
  mainDataServer.contactsList = contactsList;


  mainDataServer.notification = {
    hasNewNotification: false,
    notificationList: [],
    addNotification: function(item: webimmodel.NotificationFriend) {
      if (!this._findFriendApply(item)) {
        if (item.name)
          item.firstchar = webimutil.ChineseCharacter.getPortraitChar(item.name);
        this.notificationList.unshift(item);
      }
    },
    //离线补偿已经排除
    _findFriendApply: function(item: webimmodel.NotificationFriend) {
      if (item.id) {
        for (var i = 0, len = this.notificationList.length; i < len; i++) {
          if (item.id === this.notificationList[i]["id"] && this.notificationList[i]["status"] == webimmodel.FriendStatus.Requested) {
            return true;
          }
        }
      }
      return false;
    },
    _sort: function() {
      mainDataServer.notification.notificationList = mainDataServer.notification.notificationList.sort(function(a, b) {
        return parseInt(a.timestamp) - parseInt(b.timestamp);
      });
    }

  }
  return mainDataServer;
}]);

mainServer.factory("RongIMSDKServer", ["$q", "$http", function($q: angular.IQService, $http: ng.IHttpService) {
  var RongIMSDKServer = <any>{};

  RongIMSDKServer.init = function(appkey: string) {
    // RongIMLib.RongIMClient.init(appkey, new RongIMLib.WebSQLDataProvider());
    if(window.__sealtalk_config.online){
      if(window.Electron){
        RongIMLib.RongIMClient.init(appkey,new RongIMLib.VCDataProvider(window.Electron.addon));
      }else{
        RongIMLib.RongIMClient.init(appkey,null);
      }
    }else{
      if(window.Electron){
        RongIMLib.RongIMClient.init(appkey,new RongIMLib.VCDataProvider(window.Electron.addon),{navi:"119.254.111.49:9100"});
      }else{
        RongIMLib.RongIMClient.init(appkey,null,{navi:"119.254.111.49:9100"});
      }
    }

  }

  RongIMSDKServer.connect = function(token: string,userid?:string) {
    var defer = $q.defer();
    RongIMLib.RongIMClient.connect(token, {
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onTokenIncorrect: function() {
        defer.reject({ tokenError: true });
      },
      onError: function(errorCode) {
        defer.reject({ errorCode: errorCode });
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '连接超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN:
            info = '未知错误';
            break;
          case RongIMLib.ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION:
            info = '不可接受的协议版本';
            break;
          case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
            info = 'appkey不正确';
            break;
          case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
            info = '服务器不可用';
            break;
          case RongIMLib.ConnectionState.NOT_AUTHORIZED:
            info = '未认证';
            break;
          case RongIMLib.ConnectionState.REDIRECT:
            info = '重新获取导航';
            break;
          case RongIMLib.ConnectionState.APP_BLOCK_OR_DELETE:
            info = '应用已被封禁或已被删除';
            break;
          case RongIMLib.ConnectionState.BLOCK:
            info = '用户被封禁';
            break;
        }
        console.log("失败:" + info);
      }
    },userid);

    return defer.promise;
  }

  RongIMSDKServer.getInstance = function() {
    return RongIMLib.RongIMClient.getInstance();
  }

  RongIMSDKServer.setOnReceiveMessageListener = function(option: any) {
    RongIMLib.RongIMClient.setOnReceiveMessageListener(option);
  }

  RongIMSDKServer.setConnectionStatusListener = function(option: any) {
    RongIMLib.RongIMClient.setConnectionStatusListener(option);
  }

  RongIMSDKServer.sendMessage = function(conver: number, targetId: string, content: any, isAt: boolean) {
    var defer = $q.defer();
    var isAtMsg = isAt || false;

    RongIMLib.RongIMClient.getInstance().sendMessage(+conver, targetId, content, {
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onError: function(errorCode, message) {
        defer.reject({ errorCode: errorCode, message: message });
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN:
            info = '未知错误';
            break;
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息';
            //TODO:addmessage() 您的消息已经发出,但被对方拒收
            break;
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中';
            break;
          default:
            info = "";
            break;
        }
        console.log('发送失败:' + info);
      }
    }, isAtMsg);

    return defer.promise;
  }

  RongIMSDKServer.sendReceiptResponse = function(conver: number, targetId: string) {
    var defer = $q.defer();

    RongIMLib.RongIMClient.getInstance().sendReceiptResponse(+conver, targetId, {
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onError: function(errorCode, message) {
        defer.reject({ errorCode: errorCode, message: message });
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN:
            info = '未知错误';
            break;
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息';
            //TODO:addmessage() 您的消息已经发出,但被对方拒收
            break;
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中';
            break;
          default:
            info = "";
            break;
        }
        console.log('发送失败:' + info);
      }
    });

    return defer.promise;
  }

  RongIMSDKServer.reconnect = function(callback: any) {
    RongIMLib.RongIMClient.reconnect(callback);
  }

  RongIMSDKServer.clearUnreadCount = function(type: number, targetid: string) {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().clearUnreadCount(type, targetid, {
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onError: function(error) {
        defer.reject(error);
      }
    });
    return defer.promise;
  }


  RongIMSDKServer.getTotalUnreadCount = function() {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().getTotalUnreadCount({
      onSuccess: function(num) {
        defer.resolve(num);
      },
      onError: function() {
        defer.reject();
      }
    },[1,3]);
    return defer.promise;
  }

  RongIMSDKServer.getConversationList = function() {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().getConversationList({
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onError: function(error) {
        defer.reject(error);
      }
    }, null, 0, true);
    return defer.promise;
  }

  RongIMSDKServer.setConversationHidden = function(targetType:number,targetId:string,isHidden:boolean){
    RongIMLib.RongIMClient.getInstance().setConversationHidden(targetType,targetId,isHidden);
  }

  RongIMSDKServer.setConversationToTop = function(conversationType:number, targetId:string, isTop:boolean){
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().setConversationToTop(conversationType,targetId,isTop,{
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onError: function(error) {
        defer.reject(error);
      }
    });
    return defer.promise;
  }

  // RongIMSDKServer.conversationList = function() {
  //     return RongIMLib.RongIMClient._memoryStore.conversationList;
  //     // return RongIMLib.RongIMClient.conversationMap.conversationList;
  // }

  RongIMSDKServer.removeConversation = function(type: number, targetId: string) {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().removeConversation(type, targetId, {
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onError: function(error) {
        defer.reject(error);
      }
    });
    return defer.promise;
  }

  RongIMSDKServer.createConversation = function(type: number, targetId: string, title: string) {
    RongIMLib.RongIMClient.getInstance().createConversation(type, targetId, title);
  }

  RongIMSDKServer.getConversation = function(type: number, targetId: string) {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().getConversation(type, targetId, {
      onSuccess: function(data) {
        defer.resolve(data);
      },
      onError: function() {
        defer.reject();
      }
    });
    return defer.promise;
  }

  RongIMSDKServer.getDraft = function(type: number, targetId: string) {
    return RongIMLib.RongIMClient.getInstance().getTextMessageDraft(type, targetId) || "";
  }

  RongIMSDKServer.setDraft = function(type: number, targetId: string, value: string) {
    return RongIMLib.RongIMClient.getInstance().saveTextMessageDraft(type, targetId, value);
  }

  RongIMSDKServer.clearDraft = function(type: number, targetId: string) {
    return RongIMLib.RongIMClient.getInstance().clearTextMessageDraft(type, targetId);
  }

  RongIMSDKServer.getHistoryMessages = function(type: number, targetId: string, lastTime: number, num: number) {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().getHistoryMessages(type, targetId, lastTime, num, {
      onSuccess: function(data, has) {
        defer.resolve({
          data: data,
          has: has
        });
      },
      onError: function(error) {
        defer.reject(error);
      }
    })
    return defer.promise;
  }

  RongIMSDKServer.disconnect = function() {
    RongIMLib.RongIMClient.getInstance().disconnect();
  }

  RongIMSDKServer.logout = function() {
    if (RongIMLib && RongIMLib.RongIMClient) {
      RongIMLib.RongIMClient.getInstance().logout();
    }
  }

  RongIMSDKServer.createDiscussion = function(name: string, userIdList: string[]) {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().createDiscussion(name, userIdList, {
      onSuccess: function(data) {
        defer.resolve({
          data: data
        });
      },
      onError: function(error) {
        defer.reject(error);
      }
    })
    return defer.promise;
  }

  RongIMSDKServer.addMemberToDiscussion = function(discussionId: string, userIdList: string[], callback: any) {
    return RongIMLib.RongIMClient.getInstance().addMemberToDiscussion(discussionId, userIdList, callback);
  }

  RongIMSDKServer.removeMemberFromDiscussion = function(discussionId: string, userId: string, callback: any) {
    return RongIMLib.RongIMClient.getInstance().removeMemberFromDiscussion(discussionId, userId, callback);
  }

  RongIMSDKServer.setDiscussionName = function(discussionId: string, name: string, callback: any) {
    return RongIMLib.RongIMClient.getInstance().setDiscussionName(discussionId, name, callback);
  }

  RongIMSDKServer.getDiscussion = function(discussionId: string, callback: any) {
    var defer = $q.defer();
    RongIMLib.RongIMClient.getInstance().getDiscussion(discussionId, {
      onSuccess: function(data) {
        defer.resolve({
          data: data
        });
      },
      onError: function(error) {
        defer.reject(error);
      }
    })
    return defer.promise;
  }

  RongIMSDKServer.quitDiscussion = function(discussionId: string, callback: any) {
    return RongIMLib.RongIMClient.getInstance().quitDiscussion(discussionId, callback);
  }

  // RongIMSDKServer.sortConversationList = function(list: RongIMLib.Conversation[]) {
  //     return RongIMLib.RongIMClient.getInstance().sortConversationList(list);
  // }
  RongIMSDKServer.registerMessageType = function(messageType: string, objectName: string, messageTag: any, messageContent: any) {
    return RongIMLib.RongIMClient.registerMessageType(messageType, objectName, messageTag, messageContent);
  }

  RongIMSDKServer.RegisterMessage = function() {
    return RongIMLib.RongIMClient.RegisterMessage;
  }

  RongIMSDKServer.getAllConversations = function() {
      var defer = $q.defer();
      RongIMLib.RongIMClient.getInstance().getConversationList({
        onSuccess:function(list){
          defer.resolve(list)
        },
        onError:function(error){
          defer.reject(error)
        }
      },null,0,false);

      return defer.promise;
  }

  RongIMSDKServer.getConversationByContent=function(str:string){
    console.log(arguments);
    //此处替换为SDK的实际接口
    var defer = $q.defer();
    // $http({
    //   url: './assets/js/exampledata.json',
    //   method:'get',
    // }).success(function(rep:any){
    //   defer.resolve(rep.conversation)
    // })

    RongIMLib.RongIMClient.getInstance().searchConversationByContent(str,{
      onSuccess:function(data:any){
          console.log(data);
          defer.resolve(data);

      },
      onError:function(error:any){
          console.log(error);
          defer.reject(error)
      }
    })

    return defer.promise;
  }

  RongIMSDKServer.getMessagesFromConversation = function(targetId:string,targetType:any,str:string,timestamp:any,count:number){
    console.log(arguments);
    //此处替换为SDK的实际接口
    var defer = $q.defer();
    // $http({
    //   url: './assets/js/exampledata.json',
    //   method:'get',
    // }).success(function(rep:any){
    //   defer.resolve(rep.messagelist)
    // })
    RongIMLib.RongIMClient.getInstance().searchMessageByContent(+targetType,targetId,str,timestamp,count,1,{
      onSuccess:function(data:any,count:any){
        // console.log(data,count);
        defer.resolve({
          message:data,
          count:count
        })
      },
      onError:function(error:any){
        console.log(error);
        defer.reject(error);
      }
    })

    return defer.promise;
  }


  return RongIMSDKServer;
}]);

interface RongIMSDKServer {
  init(appkey: string): void
  connect(token: string,userid?:string): angular.IPromise<string>
  setConnectionStatusListener(listener: any): void
  setOnReceiveMessageListener(listener: any): void
  removeConversation(type: number, targetId: string): angular.IPromise<boolean>
  clearUnreadCount(type: number, targetid: string): angular.IPromise<boolean>
  getTotalUnreadCount(): angular.IPromise<number>
  sendMessage(conver: number, targetId: string, content: any, isAt?: boolean): angular.IPromise<RongIMLib.Message>
  sendReceiptResponse(conver: number, targetId: string): angular.IPromise<RongIMLib.Message>
  // conversationList(): any
  getConversationList(): angular.IPromise<RongIMLib.Conversation[]>
  getConversation(type: number, targetId: string): angular.IPromise<RongIMLib.Conversation>
  createConversation(type: number, targetId: string, title: string): RongIMLib.Conversation
  getDraft(type: number, targetId: string): string
  setDraft(type: number, targetId: string, valur: string): boolean
  clearDraft(type: number, targetId: string): boolean
  getHistoryMessages(type: number, targetId: string, lastTime: number, num: number): angular.IPromise<{ data: RongIMLib.Message[], has: boolean }>
  disconnect(): void
  logout(): void
  reconnect(callback?: any): void
  createDiscussion(name: string, userIdList: string[]): angular.IPromise<{ data: string }>
  addMemberToDiscussion(discussionId: string, userIdList: string[], callback?: any): void
  removeMemberFromDiscussion(discussionId: string, userId: string, callback?: any): void
  setDiscussionName(discussionId: string, name: string, callback?: any): void
  getDiscussion(discussionId: string): angular.IPromise<{ data: RongIMLib.Discussion }>
  quitDiscussion(discussionId: string, callback?: any): void
  registerMessageType(messageType: string, objectName: string, messageTag: any, messageContent: any): void
  RegisterMessage(): any
  getAllConversations():ng.IPromise<any>
  getConversationByContent(str:string):ng.IPromise<any>
  getMessagesFromConversation(targetId:string,targetType:any,str:string,timestamp:any,count:number):ng.IPromise<any>
  // sortConversationList(list: RongIMLib.Conversation[]): void
}

interface mainDataServer {
  scopeCache:any
  loginUser: webimmodel.UserInfo
  isConnected: boolean
  isTyping: boolean
  conversation: {
    totalUnreadCount: number
    lastOfflineMsg: any,
    conversations: webimmodel.Conversation[]
    currentConversation: webimmodel.Conversation,
    parseConversation(item: RongIMLib.Conversation): any,
    updateConversations(): angular.IPromise<any>
    createConversation(targetType: number, targetId: string): webimmodel.Conversation
    getConversation(type: number, id: string): webimmodel.Conversation
    updateConversationTitle(type: number, targetId: string, title: string): boolean
    updateConversationDetail(type: number, targetId: string, title: string, portrait: string): boolean
    updateConStatic(msg: webimmodel.Message, add: boolean, isChat: boolean): void
    setDraft(type: string, id: string, msg: string): boolean
    clearMessagesUnreadStatus(type: string, id: string): boolean
    find(str: string, arr: webimmodel.Conversation[]): webimmodel.Conversation[]
    updateConStaticBeforeSend(msg: webimmodel.Message, add: boolean): void
  }
  contactsList: {
    groupList: webimmodel.Group[],
    // friendList: webimmodel.Friend[],
    subgroupList: webimmodel.Subgroup[],
    discussionList: webimmodel.Discussion[],
    getGroupById(id: string): webimmodel.Group
    updateGroupInfoById(id: string, group: webimmodel.Group): boolean
    getDiscussionById(id: string): webimmodel.Discussion
    getFriendById(id: string): webimmodel.Friend
    // getSubgroupFriendById(id: string): webimmodel.Friend
    addFriend(friend: webimmodel.Friend): webimmodel.Friend
    removeFriend(id: string): boolean
    updateOrAddFriend(friend: webimmodel.Friend): webimmodel.Friend
    removeFriendFromSubgroup(friend: webimmodel.Friend): void
    addGroup(group: webimmodel.Group): void
    removeGroup(id: string): boolean;
    addDiscussion(group: webimmodel.Discussion): void
    removeDiscussion(id: string): boolean;
    find(str: string, arr: webimmodel.Contact[]): webimmodel.Contact[]
    getGroupMember(groupId: string, memberId: string): webimmodel.Member
    addGroupMember(groupId: string, member: webimmodel.Member): any
    removeGroupMember(groupId: string, memberid: string): boolean
    getDiscussionMember(discussionId: string, memberId: string): webimmodel.Member
    addDiscussionMember(discussionId: string, member: webimmodel.Member): any
    removeDiscussionMember(discussionId: string, memberid: string): boolean
    addNonFriend(group: webimmodel.Friend): void
    getNonFriendById(id: string): webimmodel.Friend
    updateGroupMember(groupId: string, member: webimmodel.Member): any
  }
  notification: {
    hasNewNotification: boolean
    notificationList: any[]
    addNotification(item: any): void
    _findFriendApply(item: any): boolean
    _sort(): void
  }
  blackList: {
    list: any[]
    add(item: webimmodel.Friend): void
    remove(id: string): boolean
    getById(id: string): webimmodel.Friend
  }
}

interface mainServer {
  user: {
    sendCode(phone: string, region: string): angular.IHttpPromise<any>
    verifyCode(phone: string, region: string, code: string): angular.IHttpPromise<any>
    checkUsernameAvailable(username: string): angular.IHttpPromise<any>
    checkPhoneAvailable(phone: string, region: string): angular.IHttpPromise<any>
    signup(nickname: string, password: string, token: string): angular.IHttpPromise<any>
    signin(phone: string, region: string, password: string): angular.IHttpPromise<any>
    logout(): angular.IHttpPromise<any>
    getInfo(id: string): angular.IHttpPromise<{ result: { id: string, nickname: string, portraitUri: string, displayName: string }, code: number }>
    getBatchInfo(id: string[]): angular.IHttpPromise<{ result: [{ id: string, nickname: string, portraitUri: string, displayName: string }], code: number }>
    getUserByPhone(region: string, phone: string): angular.IHttpPromise<any>
    setNickName(nickname: string): angular.IHttpPromise<any>
    resetPassword(password: string, token: string): angular.IHttpPromise<any>
    modefiyPassword(newPassword: string, oldPassword: string): angular.IHttpPromise<any>
    getToken(): angular.IHttpPromise<any>
    getBlackList(): angular.IHttpPromise<any>
    addToBlackList(userId: string): angular.IHttpPromise<any>
    removeFromBlackList(userId: string): angular.IHttpPromise<any>
    sync(version: number): angular.IHttpPromise<any>
    getMyGroups(): angular.IHttpPromise<any>
    getImageToken(): angular.IHttpPromise<{ code: string, result: { target: string, token: string } }>
    setPortraitUri(uri: string): angular.IHttpPromise<any>
  }
  friend: {
    getAll(): angular.IHttpPromise<any>
    agree(friendId: string): angular.IHttpPromise<any>
    invite(friendId: number, message: string): angular.IHttpPromise<any>
    ignore(friendId: string): angular.IHttpPromise<any>
    getProfile(id: string): angular.IHttpPromise<any>
    delete(friendId: string): angular.IHttpPromise<any>
    setDisplayName(friendId: string, displayName: string): angular.IHttpPromise<any>
  }
  group: {
    create(name: string, memberIds: string[]): angular.IHttpPromise<any>
    rename(groupId: string, name: string): angular.IHttpPromise<any>
    getById(id: string): angular.IHttpPromise<{ result: { id: string, name: string, portraitUri: string, memberCount: string, creatorId: string }, code: number }>
    getGroupMember(id: string): angular.IHttpPromise<any>
    addMember(groupId: string, memberIds: string[]): angular.IHttpPromise<{ result: { displayName: string, role: string, createdAt: string, user: { id: string, nickname: string, portraitUri: string } }[], code: number }>
    kickMember(groupId: string, membersId: string[]): angular.IHttpPromise<any>
    dismissGroup(groupId: string): angular.IHttpPromise<any>
    quit(groupId: string): angular.IHttpPromise<any>
  }
}
