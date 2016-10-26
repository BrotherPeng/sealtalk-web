/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="server.ts"/>
/// <reference path="../model/webimModel.ts"/>


var mainCtr = angular.module("webim.main.controller", ["webim.main.server", "webim.conversation.server"]);
var IMGDOMAIN = "http://7xogjk.com1.z0.glb.clouddn.com/";
var FILEDOMAIN = "http://o83059m7d.bkt.clouddn.com/";

mainCtr.controller("mainController", ["$scope", "$state", "$window", "$timeout", "$http",
    "mainDataServer", "conversationServer", "mainServer", "RongIMSDKServer", "appconfig", 'searchData', 'organizationgroup',
    function($scope: any, $state: angular.ui.IStateService, $window: angular.IWindowService, $timeout: angular.ITimeoutService,
        $http: angular.IHttpService,
        mainDataServer: mainDataServer, conversationServer: conversationServer,
        mainServer: mainServer, RongIMSDKServer: RongIMSDKServer, appconfig: any, searchData: any, organizationgroup: any) {
        var isConnecting = false
        if (!mainDataServer.loginUser.id) {
            var userid = webimutil.CookieHelper.getCookie("loginuserid"), usertoken = webimutil.CookieHelper.getCookie("loginusertoken");
            if (userid) {
                mainDataServer.loginUser.id = userid;
                mainDataServer.loginUser.token = usertoken;
            } else {
                // $state.go("account.signin");
                mainServer.user.logout().success(function() {
                    webimutil.CookieHelper.removeCookie("loginuserid");
                    mainDataServer.loginUser = new webimmodel.UserInfo();
                    conversationServer.historyMessagesCache.length = 0;
                    if (window.Electron) {
                        window.Electron.webQuit();
                    }
                    $state.go("account.signin");
                });
                return;
            }
        }

        mainServer.user.getInfo(mainDataServer.loginUser.id).success(function(rep) {
            if (rep.code == 200) {
                mainDataServer.loginUser.nickName = rep.result.nickname
                mainDataServer.loginUser.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                mainDataServer.loginUser.portraitUri = rep.result.portraitUri
                // mainDataServer.loginUser.phone = rep.result.moblie;
                angular.element(document.getElementById("loginuser")).css("background-color", webimutil.Helper.portraitColors[mainDataServer.loginUser.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            } else {
                console.log("get user info error")
            }
        }).error(function() {

        })

        function preloadimages(arr: string[]) {
            var newimages: any[] = [];
            for (var i = 0; i < arr.length; i++) {
                newimages[i] = new Image()
                newimages[i].src = arr[i]
            }
        }
        preloadimages(['../assets/img/message_state.png ']);

        $scope.mainData = <mainDataServer>mainDataServer;
        // 已优化 58同城
        // $scope.$on('refreshSelectCon', function(event: any, data: string) {
        //     $scope.unSelect(data);
        // });
        //按钮、面板显示控制
        // $scope.showState = {
        //     isPhone: false,
        //     isChat: false
        // }
        var isPhone = false;
        var isChat = false;
        $scope.isShowChat = !isPhone || isChat;

        $scope.switchbtn = {
            isFriendList: false,
            issearchList: false
        }
        $scope.showChat = function(){
            $scope.switchbtn.isFriendList=false;
            $scope.switchbtn.issearchList=false;
            $scope.switchbtn.searchMessage=false;
        };
        $scope.showContact = function(){
            $scope.switchbtn.isFriendList=true;
            $scope.switchbtn.issearchList=false;
            $scope.switchbtn.searchMessage=false;
        }
        $scope.curCon = "";

        $scope.unSelectContact = function() {
            $('div.communicateList').find('div.members_item').removeClass("selected");
            $('div.communicateList').find('div.notice_item').removeClass("selected");
        };
        // for 58同城
        // $scope.unSelect = function(curConVal: string) {
        //     if ($scope.curCon) {
        //         $('#' + $scope.curCon).removeClass("selected");
        //     }
        //     $('#' + curConVal).addClass("selected");
        //     $scope.curCon = curConVal;
        // };

        $scope.selectGo = function(id: string, type: webimmodel.conversationType) {
            if ($scope.switchbtn.isFriendList) {
                $state.go("main.friendinfo", { userid: id, groupid: "0", targetid: "0", conversationtype: "0" });
            } else {
                $state.go("main.chat", { targetId: id, targetType: type }, { location: "replace" });
            }
        }
        $scope.selectGoGroup = function(id: string, type: webimmodel.conversationType) {
            if ($scope.switchbtn.isFriendList) {
                $state.go("main.groupinfo", { groupid: id, conversationtype: "0" });
            } else {
                $state.go("main.chat", { targetId: id, targetType: type }, { location: "replace" });
            }
        }
        $scope.selectMember = function(item: webimmodel.Member) {
            $scope.atShow = false;
        }

        //查找好友
        //
        $scope.searchControl = {};

        $scope.$watch('switchbtn.isFriendList', function(newVal: boolean, oldVal: boolean) {
            if (newVal === oldVal)
                return;
            $scope.searchControl.clear();
        });
        $scope.search = function(content: string) {
            if (content.trim()) {
                // var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function(item) { return item.list }));
                // $scope.searchList.friendList = mainDataServer.contactsList.find(content, friendList) || [];
                // $scope.searchList.groupList = mainDataServer.contactsList.find(content, mainDataServer.contactsList.groupList) || [];

                $scope.searchList = <any>{};

                if ($scope.switchbtn.searchMessage) {
                    $scope.showsearchconversation = true;
                    searchData.getConversationByContent(content).then(function(data: any) {
                        $scope.searchList.conversations = [];
                        for (var i = 0, len = data.length; i < len; i++) {
                            //TODO:web 暂不处理其他类型会话
                            var type = data[i].conversationType;
                            if (type == 1 || type == 3) {
                                var result = mainDataServer.conversation.parseConversation(data[i]);
                                result.imgSrc = result.imgSrc || 'assets/css/images/user.png';
                                $scope.searchList.conversations.push(result.item);
                            }
                        }
                    })
                } else {
                    $scope.switchbtn.issearchList = true;
                    searchData.searchContact(content).then(function(search: any) {
                        $scope.searchList = search;
                    })
                }

            } else {
                $scope.switchbtn.issearchList = false;

                $scope.showsearchconversation = false;
                $scope.searchList.conversations = [];
            }
        }

        $scope.tonotification = function() {
            mainDataServer.notification.hasNewNotification = false;
            $state.go("main.notification");
        }

        $scope.showPasteDiv = function(visible: boolean) {
            $scope.$broadcast('showPasteDiv', visible);
        }

        $scope.uploadPasteImage = function() {
            $scope.$broadcast('uploadPasteImage');
        }

        $scope.checkSend = function(e: any) {
            var pic = <any>document.getElementsByClassName("previewPic")[0];
            if (e.keyCode === 13 && pic.style.visibility == 'visible') {
                $scope.uploadPasteImage();
                e.preventDefault();
            }
        };

        function refreshconversationList() {
            $scope.mainData.conversation.updateConversations();
        }

        $scope.$on("conversationChange", function() {
            refreshconversationList();
        })

        $scope.$watch("mainData.conversation.totalUnreadCount", function(newVal: any, oldVal: any) {
            if (newVal == oldVal) {
                return;
            }
            if (window.Electron) {
                window.Electron.updateBadgeNumber(newVal);
            }
        });

        //窗口获得焦点时清除当前未读消息
        // window.onfocus = function() {
        //     // if ($state.is("main.chat")) {
        //     //     RongIMSDKServer.clearUnreadCount(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId);
        //     //     mainDataServer.conversation.updateConversations();
        //     // }
        // }


        //页面加载时、控制页面的一些样式
        $scope.$on("$viewContentLoaded", function() {
            if ($state.is("main")) {
                isChat = false;
                $scope.isShowChat = !isPhone || isChat;
                $scope.isShowLeft = !isPhone || !isChat;
            } else {
                isChat = true;
                $scope.isShowChat = !isPhone || isChat;
                $scope.isShowLeft = !isPhone || !isChat;
            }

            function pageLayout() {
                if (document.documentElement.clientWidth < 600) {
                    isPhone = true;
                    $scope.isShowChat = !isPhone || isChat;
                    $scope.isShowLeft = !isPhone || !isChat;
                    var ele = <any>document.querySelector(".mainBox");
                    if (ele) {
                        ele.style.width = document.documentElement.clientWidth - parseFloat(getComputedStyle(document.querySelector(".toolbar")).width) + "px";
                    }
                } else {
                  isPhone = false;
                  $scope.isShowChat = !isPhone || isChat;
                  $scope.isShowLeft = !isPhone || !isChat;
                    // var ele = <any>document.querySelector(".mainBox");
                    // if (ele) {
                    //     ele.style.width = '314px';
                    // }
                }
                var chat = document.getElementById("chatArea");
                if (chat) {
                    chat.style.height = document.documentElement.clientHeight - 54 + "px";
                }
                var arr = <any>document.getElementsByClassName("communicateList");
                for (let i = 0, len = arr.length; i < len; i++) {
                    arr[i].style.height = document.documentElement.clientHeight - 54 + "px";
                }
                if (document.getElementById("Messages")) {
                    document.getElementById("Messages").style.height = document.documentElement.clientHeight -
                        parseFloat(getComputedStyle(document.querySelector('.inputBox')).height) -
                        parseFloat(getComputedStyle(document.querySelector('.box_hd')).height) + "px";
                }
                if (document.getElementById("functionBox")) {
                    document.getElementById("functionBox").style.height = document.documentElement.clientHeight -
                        parseFloat(getComputedStyle(document.querySelector('.box_hd')).height) + "px";
                }
            }

            function adjustNoNet() {
                var ele = document.getElementById("Messages");
                var err = <any>document.getElementsByClassName("no_network");
                if (!ele || !err[0])
                    return;
                err[0].style.width = getComputedStyle(document.querySelector('#Messages')).width;
            }

            pageLayout();
            adjustNoNet();

            $window.onresize = function() {
                pageLayout();
                adjustNoNet();
                $scope.$apply();
            }

        });
        $scope.$on('reconnect', function() {
            reconnectServer();
        });


        //初始化好友数据   邀请通知一起通过好友关系表获取解析
        mainDataServer.notification.notificationList = [];
        mainDataServer.contactsList.subgroupList = [];
        mainServer.friend.getAll().success(function(rep) {
            var arr = rep.result;
            for (let i = 0, len = arr.length; i < len; i++) {
                switch (arr[i].status) {
                    case webimmodel.FriendStatus.Agreed:
                        mainDataServer.contactsList.addFriend(new webimmodel.Friend({
                            id: arr[i].user.id,
                            name: arr[i].displayName || arr[i].user.nickname,
                            imgSrc: arr[i].user.portraitUri,
                        }));
                        break;
                    case webimmodel.FriendStatus.Requested:
                        mainDataServer.notification.addNotification(new webimmodel.NotificationFriend({
                            id: arr[i].user.id,
                            name: arr[i].user.nickname,
                            portraitUri: arr[i].user.portraitUri,
                            status: arr[i].status,
                            content: arr[i].message,
                            timestamp: (new Date(arr[i].updatedAt)).getTime()
                        }));
                        break;
                }
            }

            mainDataServer.notification._sort();
        }).error(function(e) {
            console.log(e);
        })

        //初始化黑名单数据
        mainDataServer.blackList.list = [];
        mainServer.user.getBlackList().success(function(rep) {
            var blist = rep.result;
            for (var i = 0, len = blist.length; i < len; i++) {
                mainDataServer.blackList.add(new webimmodel.Friend({
                    id: blist[i].user.id,
                    name: blist[i].user.nickname,
                    imgSrc: blist[i].user.portraitUri
                }));
            }
        }).error(function() {

        });

        //初始化群组数据
        mainDataServer.contactsList.groupList = [];
        mainServer.user.getMyGroups().success(function(rep) {
            var groups = rep.result;
            for (var i = 0, len = groups.length; i < len; i++) {
                var group = new webimmodel.Group({
                    id: groups[i].group.id,
                    name: groups[i].group.name,
                    imgSrc: groups[i].group.portraitUri,
                    upperlimit: 500,
                    fact: 1,
                    creater: groups[i].group.creatorId
                });
                mainDataServer.contactsList.addGroup(group);
                //获取群成员
                !function(groupid: string) {
                    mainServer.group.getGroupMember(group.id).success(function(rep) {
                        var members = rep.result;
                        for (var j = 0, len = members.length; j < len; j++) {
                            var member = new webimmodel.Member({
                                id: members[j].user.id,
                                name: members[j].user.nickname,
                                imgSrc: members[j].user.portraitUri,
                                role: members[j].role,
                                displayName: members[j].displayName
                            });
                            mainDataServer.contactsList.addGroupMember(groupid, member);
                        }
                    });
                } (group.id);
            }
        }).error(function(err) {

        })

        RongIMSDKServer.init(appconfig.getAppKey());

        if (mainDataServer.loginUser.token) {
            console.log(mainDataServer.loginUser.id)
            RongIMSDKServer.connect(<string>mainDataServer.loginUser.token, mainDataServer.loginUser.id).then(function(userId) {
                console.log("connect success1:" + userId);
                RongIMSDKServer.getConversationList().then(function(list) {
                    mainDataServer.conversation.updateConversations();
                });
                RongIMLib.RongUploadLib.init(
                    // {domain:IMGDOMAIN,drop_element:'',container:'functionBox',browse_button:'myPortrait' },
                    { domain: IMGDOMAIN, drop_element: '', container: 'MessageForm', browse_button: 'upload-image' },
                    { domain: FILEDOMAIN, drop_element: 'chatMain', container: 'MessageForm', browse_button: 'upload-file' }
                );
            }, function(error) {
                if (error.tokenError) {
                    //token 错误。
                    mainServer.user.getToken().success(function(data: any) {
                        if (data.code == "200") {
                            RongIMSDKServer.connect(<string>data.result.token, mainDataServer.loginUser.id).then(function(userId) {
                                console.log("connect success2:" + userId);
                                RongIMSDKServer.getConversationList().then(function(list) {
                                    mainDataServer.conversation.updateConversations();
                                });
                                RongIMLib.RongUploadLib.init(
                                    { domain: IMGDOMAIN, drop_element: '', container: 'MessageForm', browse_button: 'upload-image' },
                                    { domain: FILEDOMAIN, drop_element: 'chatMain', container: 'MessageForm', browse_button: 'upload-file' }
                                );
                            }, function(error) {
                                if (error.tokenError) {
                                    //token 错误。
                                    console.log('token error');
                                }
                                //其他错误
                                //TODO:逻辑未处理
                            });
                        } else {
                            $state.go("account.signin");
                        }
                    }).error(function(e) {
                        $state.go("account.signin");
                    });
                }
                //其他错误
                //TODO:逻辑未处理
            });
        } else {
            mainServer.user.getToken().success(function(data: any) {
                if (data.code == "200") {
                    RongIMSDKServer.connect(<string>data.result.token, mainDataServer.loginUser.id).then(function(userId) {
                        console.log("connect success3:" + userId);
                        RongIMSDKServer.getConversationList().then(function(list) {
                            mainDataServer.conversation.updateConversations();
                        });
                        RongIMLib.RongUploadLib.init(
                            { domain: IMGDOMAIN, drop_element: '', container: 'MessageForm', browse_button: 'upload-image' },
                            { domain: FILEDOMAIN, drop_element: 'chatMain', container: 'MessageForm', browse_button: 'upload-file' }
                        );
                    }, function(error) {
                        if (error.tokenError) {
                            //token 错误。
                        }
                        //其他错误
                        //TODO:逻辑未处理
                    });
                } else {
                    $state.go("account.signin");
                }
            }).error(function(e) {
                $state.go("account.signin");
            });
        }



        var isReconnect = true;
        RongIMSDKServer.setConnectionStatusListener({
            onChanged: function(status: number) {
                var myDate = new Date();
                switch (status) {
                    //链接成功
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功', myDate.toLocaleString());
                        mainDataServer.isConnected = true;
                        showDisconnectErr(false);
                        isConnecting = false;
                        break;
                    //正在链接
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    //重新链接
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        if (!$state.is("account.signin")) {
                            $state.go("account.signin");
                        }
                        break;
                    //其他设备登陆
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        if (!$state.is("account.signin")) {
                            $state.go("account.signin");
                            webimutil.Helper.alertMessage.error("您的账号在其他地方登录!");
                            webimutil.NotificationHelper.showNotification({
                                title: "SealTalk",
                                icon: "assets/img/SealTalk.ico",
                                body: "您的账号在其他地方登录!"
                            })
                            if (window.Electron) {
                                window.Electron.kickedOff();
                            }
                        }
                        break;
                    //网络不可用
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用', myDate.toLocaleString(), 'isConnecting:' + isConnecting);
                        mainDataServer.isConnected = false;
                        showDisconnectErr(true);
                        // if(!isConnecting){
                        isConnecting = true;
                        checkNetwork({
                            onSuccess: function() {
                                reconnectServer();
                            }
                        })
                        // }
                        break;
                }
            }
        })

        webimutil.NotificationHelper.onclick = function(n) {
            if (n.data)
                $state.go("main.chat", { targetId: n.data.targetId, targetType: n.data.targetType });
        }

        var typingTimeID: any;
        var timeOfflineMsg: any;
        RongIMSDKServer.setOnReceiveMessageListener({
            onReceived: function(data: RongIMLib.Message) {
                if ($scope.mainData.loginUser.hasSound) {
                    var eleplay = <any>document.getElementById("playsound");
                    eleplay.play();
                }

                var msg = <any>webimmodel.Message.convertMsg(data);

                //同自己会话删除targetid为空
                // if (msg.targetId == "") {
                //     msg.targetId = mainDataServer.loginUser.id;
                //     RongIMSDKServer.removeConversation(webimmodel.conversationType.Private, "").then(function() {
                //         refreshconversationList();
                //     });
                //     return;
                // }
                //TODO 未来待修改
                if (msg.targetId == "") {
                    msg.targetId = mainDataServer.loginUser.id;
                }

                // if ($state.is("main.chat") && !document.hidden) {
                if ($state.is("main.chat")) {
                    RongIMSDKServer.clearUnreadCount(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId);
                }

                switch (data.messageType) {
                    case webimmodel.MessageType.ContactNotificationMessage:
                        RongIMSDKServer.clearUnreadCount(data.conversationType, data.targetId);
                        if (data.hasReceivedByOtherClient) {
                            //已在其他端接收过，不做处理。
                            break;
                        }
                        var contact = <webimmodel.ContactNotificationMessage>msg.content;
                        RongIMSDKServer.removeConversation(msg.conversationType, msg.targetId).then(function() {
                            refreshconversationList();
                        });

                        if (contact.operation == "Request") {
                            //好友请求
                            //添加到通知
                            //TODO:判断是否已经是好友防止离线消息补偿造成错误数据
                            var friend = mainDataServer.contactsList.getFriendById(contact.sourceUserId);
                            if (friend) {
                                return;
                            }
                            if (!$state.is("main.notification")) {
                                $scope.mainData.notification.hasNewNotification = true;
                            }
                            var item = new webimmodel.NotificationFriend({
                                id: contact.sourceUserId,
                                name: contact.senderUserName,
                                portraitUri: contact.senderUserImgSrc,
                                content: contact.content,
                                status: webimmodel.FriendStatus.Requested + "",
                                timestamp: (msg.sentTime && msg.sentTime.getTime())
                            });
                            if (!item.name) {
                                //没获取到名称去服务器获取
                                mainServer.user.getInfo(contact.sourceUserId).success(function(rep) {
                                    item.name = rep.result.nickname;
                                    item.portraitUri = rep.result.portraitUri;
                                    item.firstchar = webimutil.ChineseCharacter.getPortraitChar(item.name);
                                    mainDataServer.notification.addNotification(item);
                                }).error(function() {
                                })
                            } else {
                                mainDataServer.notification.addNotification(item);
                            }
                        } else if (contact.operation == "AcceptResponse") {
                            //对方已同意
                            //好友列表里添加好友or同步好友列表
                            var friend = mainDataServer.contactsList.getFriendById(contact.sourceUserId);
                            if (!friend) {
                                mainServer.user.getInfo(contact.sourceUserId).success(function(rep) {
                                    var res = rep.result;
                                    mainDataServer.contactsList.addFriend(new webimmodel.Friend({
                                        id: res.id,
                                        name: res.nickname,
                                        imgSrc: res.portraitUri
                                    }));
                                    refreshconversationList();
                                }).error(function() {
                                    mainDataServer.contactsList.addFriend(new webimmodel.Friend({
                                        id: contact.sourceUserId,
                                        name: "网络原因暂未取到",
                                        imgSrc: ""
                                    }));
                                    refreshconversationList();
                                    // throw new Error("好友信息获取失败");
                                })
                            }
                        }
                        break;
                    case webimmodel.MessageType.DiscussionNotificationMessage:
                        // if (data.objectName == "RC:DizNtf" && !data.hasReceivedByOtherClient) {
                        //     //群组信息更新，已经在其他端接收过不做处理。
                        //     var discussionNotification = <any>data;
                        //     switch (discussionNotification.content.type) {
                        //         case 1:   //join
                        //             var changemembers = discussionNotification.content.extension.split(",");
                        //             var targetid = data.targetId;
                        //             var self = changemembers.indexOf(mainDataServer.loginUser.id + "");
                        //             if (self == -1) {
                        //                 for (var a = 0, len = changemembers.length; a < len; a++) {
                        //                     mainServer.user.getInfo(changemembers[a]).success(function(rep) {
                        //                         mainDataServer.contactsList.addDiscussionMember(targetid, new webimmodel.Member({
                        //                             id: rep.result.id,
                        //                             name: rep.result.nickname,
                        //                             imgSrc: rep.result.portraitUri,
                        //                             role: "1"
                        //                         }));
                        //                     }).error(function() {
                        //
                        //                     });
                        //                 }
                        //             } else {
                        //               RongIMSDKServer.getDiscussion(targetid).then(function (rep) {
                        //                   var discuss = rep.data;
                        //                   var members = discuss.memberIdList;
                        //                   // conv.title = discuss.name;
                        //                   // conv.firstchar = webimutil.ChineseCharacter.getPortraitChar(discuss.name);
                        //
                        //                   var temporarynotifi = new webimmodel.WarningNoticeMessage("邀请进入讨论组" + '"' + discuss.name + '"');
                        //                   mainDataServer.notification.addNotification(temporarynotifi);
                        //                   if (!$state.is("main.notification")) {
                        //                       mainDataServer.notification.hasNewNotification = true;
                        //                   }
                        //
                        //                   mainDataServer.contactsList.addDiscussion(new webimmodel.Discussion({
                        //                       id: discuss.id,
                        //                       name: discuss.name,
                        //                       imgSrc: '',
                        //                       upperlimit: 500,
                        //                       fact: 1,
                        //                       creater: discuss.creatorId,
                        //                       isOpen: true
                        //                   }));
                        //                   for (var j = 0, len = discuss.memberIdList.length; j < len; j++) {
                        //                       mainServer.user.getInfo(discuss.memberIdList[j]).then(function (repmem) {
                        //                           var member = new webimmodel.Member({
                        //                               id: repmem.data.result.id,
                        //                               name: repmem.data.result.nickname,
                        //                               imgSrc: repmem.data.result.portraitUri,
                        //                               role: "1"
                        //                           });
                        //                           mainDataServer.contactsList.addDiscussionMember(discuss.id, member);
                        //                       });
                        //                   }
                        //
                        //                   refreshconversationList();
                        //               }, function () {
                        //                   // conv.title = "未知讨论组";
                        //               });
                        //             }
                        //             break;
                        //         case 2:   //quit
                        //             var changemembers = discussionNotification.content.extension.split(",");
                        //             var targetid = data.targetId;
                        //             var self = changemembers.indexOf(mainDataServer.loginUser.id + "");
                        //             if (self == -1) {
                        //                 mainDataServer.contactsList.removeDiscussionMember(targetid, changemembers[0]);
                        //             } else {
                        //                 mainDataServer.contactsList.removeDiscussion(targetid);
                        //
                        //                 RongIMSDKServer.removeConversation(webimmodel.conversationType.Discussion, targetid).then(function() {
                        //                     refreshconversationList();
                        //                 });
                        //             }
                        //             break;
                        //         case 4:  //kick
                        //             var changemembers = discussionNotification.content.extension.split(",");
                        //             var targetid = data.targetId;
                        //             var self = changemembers.indexOf(mainDataServer.loginUser.id + "");
                        //             if (self == -1) {
                        //                 for (var a = 0, len = changemembers.length; a < len; a++) {
                        //                     mainDataServer.contactsList.removeDiscussionMember(targetid, changemembers[a]);
                        //                 }
                        //             } else {
                        //                 var temporarynotifi = new webimmodel.WarningNoticeMessage("讨论组" + '"' + mainDataServer.contactsList.getDiscussionById(targetid).name + '"' + '已将您踢出');
                        //                 mainDataServer.notification.addNotification(temporarynotifi);
                        //                 if (!$state.is("main.notification")) {
                        //                     mainDataServer.notification.hasNewNotification = true;
                        //                 }
                        //                 mainDataServer.contactsList.removeDiscussion(targetid);
                        //                 RongIMSDKServer.removeConversation(webimmodel.conversationType.Discussion, targetid).then(function() {
                        //                     refreshconversationList();
                        //                 });
                        //                 //退出会话状态
                        //                 if ($state.is("main.chat") && $state.params["targetId"] == targetid && $state.params["targetType"] == webimmodel.conversationType.Discussion) {
                        //                     $state.go("main");
                        //                 }
                        //             }
                        //             break;
                        //         case 3:  // rename
                        //             console.log("TODO:暂不做修改讨论组名称");
                        //             // var temporarynotifi = new webimmodel.WarningNoticeMessage("讨论组已更名为" + '"' + mainDataServer.contactsList.getDiscussionById(targetid).name + '"');
                        //             // mainDataServer.notification.addNotification(temporarynotifi);
                        //             // if (!$state.is("main.notification")) {
                        //             //     mainDataServer.notification.hasNewNotification = true;
                        //             // }
                        //             break;
                        //         default:
                        //             console.log("不支持操作类型" + discussionNotification.content.type);
                        //     }
                        //     conversationServer.asyncConverDiscussionNotifition(data, msg);
                        //     addmessage(msg);
                        // }
                        break;
                    case webimmodel.MessageType.VoiceMessage:
                        msg.isUnReade = true;
                    case webimmodel.MessageType.TextMessage:
                    case webimmodel.MessageType.LocationMessage:
                    case webimmodel.MessageType.ImageMessage:
                    case webimmodel.MessageType.RichContentMessage:
                    case webimmodel.MessageType.FileMessage:
                        //隐藏正在输入状态
                        if ($state.is("main.chat") && !document.hidden && msg.conversationType == webimmodel.conversationType.Private && msg.senderUserId == mainDataServer.conversation.currentConversation.targetId) {
                            mainDataServer.isTyping = false;
                        }
                        if ($state.is("main.chat") && !document.hidden && msg.senderUserId != mainDataServer.loginUser.id && msg.conversationType == webimmodel.conversationType.Private) {
                            if (data.offLineMessage) {
                                mainDataServer.conversation.lastOfflineMsg = data;
                                if (!timeOfflineMsg && mainDataServer.conversation.lastOfflineMsg) {
                                    timeOfflineMsg = setTimeout(function() {
                                        conversationServer.sendReadReceiptMessage(mainDataServer.conversation.currentConversation.targetId, mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.lastOfflineMsg.messageUId, mainDataServer.conversation.lastOfflineMsg.sentTime);
                                        timeOfflineMsg = null;
                                    }, 1000);
                                }
                            }
                            else {
                                conversationServer.sendReadReceiptMessage(mainDataServer.conversation.currentConversation.targetId, mainDataServer.conversation.currentConversation.targetType, data.messageUId, data.sentTime);
                            }
                        }

                        // if ($state.is("main.chat") && !document.hidden && msg.senderUserId != mainDataServer.loginUser.id && msg.conversationType == webimmodel.conversationType.Group){
                        //   conversationServer.sendSyncReadStatusMessage(mainDataServer.conversation.currentConversation.targetId, mainDataServer.conversation.currentConversation.targetType, data.sentTime);
                        // }
                        addmessage(msg);
                        //TODO 判断是@消息时添加
                        if (msg.mentionedInfo) {
                            var isAtMe = false;
                            if (msg.mentionedInfo.type == webimmodel.AtTarget.All) {
                                isAtMe = true;
                            }
                            if (msg.mentionedInfo.type == webimmodel.AtTarget.Part) {
                                for (var j = 0; j < msg.mentionedInfo.userIdList.length; j++) {
                                    if (msg.mentionedInfo.userIdList[j] == mainDataServer.loginUser.id) {
                                        isAtMe = true;
                                    }
                                }
                            }
                            if (isAtMe) {
                                conversationServer.addAtMessage(msg.targetId, msg.conversationType, msg);
                            }
                        }

                        var isself = mainDataServer.loginUser.id == msg.senderUserId;
                        if (isself || $state.is("main.chat") && !document.hidden && msg.conversationType == mainDataServer.conversation.currentConversation.targetType && msg.senderUserId == mainDataServer.conversation.currentConversation.targetId) {
                            RongIMSDKServer.clearUnreadCount(msg.conversationType, msg.targetId);
                            var curCon = mainDataServer.conversation.getConversation(msg.conversationType, msg.targetId);
                            if (curCon) {
                                curCon.atStr = '';
                                mainDataServer.conversation.totalUnreadCount = mainDataServer.conversation.totalUnreadCount - curCon.unReadNum;
                                curCon.unReadNum = 0;
                            }
                        }
                        else {
                            if (msg.senderUserName) {
                                webimutil.NotificationHelper.showNotification({
                                    title: msg.senderUserName,
                                    icon: "assets/img/SealTalk.ico",
                                    body: webimmodel.Message.messageToNotification(data, mainDataServer.loginUser.id, true), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                });
                            }
                            else {
                                mainServer.user.getInfo(msg.senderUserId).then(function(rep) {
                                    msg.senderUserName = rep.data.result.nickname;
                                    webimutil.NotificationHelper.showNotification({
                                        title: msg.senderUserName + "(非好友)",
                                        icon: "assets/img/SealTalk.ico",
                                        body: webimmodel.Message.messageToNotification(data, mainDataServer.loginUser.id, true), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                    });
                                });
                            }
                        }
                        break;
                    case webimmodel.MessageType.GroupNotificationMessage:
                        if (data.objectName == "RC:GrpNtf" && !data.hasReceivedByOtherClient) {
                            //群组信息更新，已经在其他端接收过不做处理。
                            var groupNotification = <any>data.content;
                            var isself = false;
                            if (groupNotification.operatorUserId == mainDataServer.loginUser.id) {
                                isself = true;
                            }
                            switch (groupNotification.operation) {
                                case "Add":
                                    var changemembers = groupNotification.data.data.targetUserIds.join().split(",");
                                    var groupid = data.targetId;
                                    var self = changemembers.indexOf(mainDataServer.loginUser.id + "");
                                    if (self == -1) {
                                        for (var a = 0, len = changemembers.length; a < len; a++) {
                                            mainServer.user.getInfo(changemembers[a]).success(function(rep) {
                                                mainDataServer.contactsList.addGroupMember(groupid, new webimmodel.Member({
                                                    id: rep.result.id,
                                                    name: rep.result.nickname,
                                                    imgSrc: rep.result.portraitUri,
                                                    role: "1"
                                                }));
                                            }).error(function() {

                                            });
                                        }
                                    } else {
                                        mainServer.group.getById(groupid).success(function(rep) {

                                            var temporarynotifi = new webimmodel.WarningNoticeMessage(groupNotification.data.data.operatorNickname + "邀请你加入了群组");
                                            mainDataServer.notification.addNotification(temporarynotifi);
                                            if (!$state.is("main.notification")) {
                                                mainDataServer.notification.hasNewNotification = true;
                                            }

                                            mainDataServer.contactsList.addGroup(new webimmodel.Group({
                                                id: rep.result.id,
                                                name: rep.result.name,
                                                imgSrc: rep.result.portraitUri,
                                                upperlimit: 500,
                                                fact: 1,
                                                creater: rep.result.creatorId
                                            }));
                                            mainServer.group.getGroupMember(groupid).success(function(rep) {
                                                var members = rep.result;
                                                for (var j = 0, len = members.length; j < len; j++) {
                                                    var member = new webimmodel.Member({
                                                        id: members[j].user.id,
                                                        name: members[j].user.nickname,
                                                        imgSrc: members[j].user.portraitUri,
                                                        role: members[j].role,
                                                        displayName: members[j].displayName
                                                    });
                                                    mainDataServer.contactsList.addGroupMember(groupid, member);
                                                }
                                            });
                                            refreshconversationList();
                                        }).error(function() {

                                        })
                                    }
                                    break;
                                case "Quit":
                                    var changemembers = groupNotification.data.data.targetUserIds.join().split(",");
                                    var groupid = data.targetId;
                                    var self = changemembers.indexOf(mainDataServer.loginUser.id + "");
                                    if (self == -1) {
                                        mainDataServer.contactsList.removeGroupMember(groupid, changemembers[0]);
                                    } else {
                                        mainDataServer.contactsList.removeGroup(groupid);

                                        RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function() {
                                            refreshconversationList();
                                        });
                                    }
                                    break;
                                case "Kicked":
                                    var changemembers = groupNotification.data.data.targetUserIds.join().split(",");
                                    var groupid = data.targetId;
                                    var groupname = mainDataServer.contactsList.getGroupById(groupid) ? mainDataServer.contactsList.getGroupById(groupid).name : groupid;
                                    var self = changemembers.indexOf(mainDataServer.loginUser.id + "");
                                    if (self == -1) {
                                        for (var a = 0, len = changemembers.length; a < len; a++) {
                                            mainDataServer.contactsList.removeGroupMember(groupid, changemembers[a]);
                                        }
                                    } else {
                                        var temporarynotifi = new webimmodel.WarningNoticeMessage(groupNotification.data.data.operatorNickname + '将你移出了群组');
                                        mainDataServer.notification.addNotification(temporarynotifi);
                                        if (!$state.is("main.notification")) {
                                            mainDataServer.notification.hasNewNotification = true;
                                        }
                                        mainDataServer.contactsList.removeGroup(groupid);
                                        RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function() {
                                            refreshconversationList();
                                        });
                                        //退出会话状态
                                        if ($state.is("main.chat") && $state.params["targetId"] == groupid && $state.params["targetType"] == webimmodel.conversationType.Group) {
                                            $state.go("main");
                                        }
                                    }
                                    break;
                                case "Rename":
                                    // console.log("TODO:暂不做修改群组名称");

                                    var groupid = data.targetId;
                                    var groupname = mainDataServer.contactsList.getGroupById(groupid) ? mainDataServer.contactsList.getGroupById(groupid).name : groupid;
                                    var operator = isself ? "你" : groupNotification.data.data.operatorNickname;
                                    var temporarynotifi = new webimmodel.WarningNoticeMessage(operator + ' 修改群名称为' + groupNotification.data.data.targetGroupName);
                                    mainDataServer.notification.addNotification(temporarynotifi);
                                    if (!$state.is("main.notification")) {
                                        mainDataServer.notification.hasNewNotification = true;
                                    }
                                    var group = new webimmodel.Group({
                                        id: groupid,
                                        name: groupNotification.data.data.targetGroupName,
                                        imgSrc: undefined,
                                        upperlimit: undefined,
                                        fact: undefined,
                                        creater: mainDataServer.loginUser.id
                                    });

                                    mainDataServer.contactsList.updateGroupInfoById(groupid, group);
                                    mainDataServer.conversation.updateConversationTitle(webimmodel.conversationType.Group, groupid, groupNotification.data.data.targetGroupName);
                                    break;
                                case "Create":
                                    var groupid = data.targetId;
                                    mainServer.group.getById(groupid).success(function(rep) {
                                        var operator = isself ? "你" : groupNotification.data.data.operatorNickname;
                                        var temporarynotifi = new webimmodel.WarningNoticeMessage(operator + "创建了群组");
                                        mainDataServer.notification.addNotification(temporarynotifi);
                                        if (!$state.is("main.notification")) {
                                            mainDataServer.notification.hasNewNotification = true;
                                        }
                                        mainDataServer.contactsList.addGroup(new webimmodel.Group({
                                            id: rep.result.id,
                                            name: rep.result.name,
                                            imgSrc: rep.result.portraitUri,
                                            upperlimit: 500,
                                            fact: 1,
                                            creater: rep.result.creatorId
                                        }));
                                        mainServer.group.getGroupMember(groupid).success(function(rep) {
                                            var members = rep.result;
                                            for (var j = 0, len = members.length; j < len; j++) {
                                                var member = new webimmodel.Member({
                                                    id: members[j].user.id,
                                                    name: members[j].user.nickname,
                                                    imgSrc: members[j].user.portraitUri,
                                                    role: members[j].role,
                                                    displayName: members[j].displayName
                                                });
                                                mainDataServer.contactsList.addGroupMember(groupid, member);
                                            }
                                        });
                                        refreshconversationList();
                                    }).error(function() {
                                    });
                                    break;
                                case "Dismiss":
                                    var groupid = data.targetId;
                                    var groupname = mainDataServer.contactsList.getGroupById(groupid) ? mainDataServer.contactsList.getGroupById(groupid).name : groupid;
                                    var operator = isself ? "你" : groupNotification.data.data.operatorNickname;
                                    var temporarynotifi = new webimmodel.WarningNoticeMessage(operator + "解散了群组");
                                    mainDataServer.notification.addNotification(temporarynotifi);
                                    if (!$state.is("main.notification")) {
                                        mainDataServer.notification.hasNewNotification = true;
                                    }
                                    mainDataServer.contactsList.removeGroup(groupid);
                                    if ((window.Electron && isself) || !window.Electron) {
                                        RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function() {
                                            refreshconversationList();
                                        });
                                        //退出会话状态
                                        if ($state.is("main.chat") && $state.params["targetId"] == groupid && $state.params["targetType"] == webimmodel.conversationType.Group) {
                                            $state.go("main");
                                        }
                                    }
                                    break;
                                default:
                                    console.log("不支持操作类型" + groupNotification.operation);
                            }
                            conversationServer.asyncConverGroupNotifition(data, msg);
                            addmessage(msg);
                        }
                        break;
                    case webimmodel.MessageType.InformationNotificationMessage:
                        addmessage(msg);
                        break;
                    case webimmodel.MessageType.ReadReceiptMessage:
                        //清除会话已读状态,改变消息总数
                        if (msg.objectName == 'RC:ReadNtf' && msg.senderUserId == mainDataServer.loginUser.id) {
                            RongIMSDKServer.clearUnreadCount(msg.conversationType, msg.targetId);
                            var curCon = mainDataServer.conversation.getConversation(msg.conversationType, msg.targetId);
                            if (curCon) {
                                curCon.atStr = '';
                                mainDataServer.conversation.totalUnreadCount = mainDataServer.conversation.totalUnreadCount - curCon.unReadNum;
                                curCon.unReadNum = 0;
                            }
                            //去除消息的未读状态
                        }
                        break;
                    case webimmodel.MessageType.RecallCommandMessage:
                        if (msg.objectName == 'RC:RcCmd') {
                            // var withDrawMsg = <any>data.content;
                            // conversationServer.addWithDrawMessageCache(msg.senderUserId, msg.conversationType, withDrawMsg.messageUId);
                            // conversationServer.delWithDrawMessage(msg.senderUserId, msg.conversationType, withDrawMsg.messageUId);
                            // if(msg.senderUserId == mainDataServer.loginUser.id){
                            //   msg.content = '你' + msg.content;
                            // }
                            // else{
                            //   conversationServer.messageAddUserInfo(msg);
                            //   msg.content = msg.senderUserName + msg.content;
                            // }
                            // addmessage(msg);
                        }
                        break;
                    case webimmodel.MessageType.TypingStatusMessage:
                        //判断如果为当前输入页面用户
                        if ($state.is("main.chat") && !document.hidden && msg.conversationType == webimmodel.conversationType.Private && msg.senderUserId == mainDataServer.conversation.currentConversation.targetId) {
                            mainDataServer.isTyping = true;
                            if (typingTimeID) { clearTimeout(typingTimeID); }
                            typingTimeID = setTimeout(function() {
                                mainDataServer.isTyping = false;
                                $scope.$apply();
                            }, 6000);
                        }

                        break;
                    case webimmodel.MessageType.InviteMessage:
                    case webimmodel.MessageType.HungupMessage:
                        //判断如果为当前输入页面用户
                        // msg.content = msg.senderUserName + msg.content;
                        addmessage(msg);
                        break;
                    case webimmodel.MessageType.ReadReceiptRequestMessage:
                        if ($state.is("main.chat") && !document.hidden && msg.conversationType == webimmodel.conversationType.Group && msg.targetId == mainDataServer.conversation.currentConversation.targetId) {
                            RongIMSDKServer.sendReceiptResponse(msg.conversationType, msg.targetId).then(function() {
                                console.log('sendReadReceiptResponseMessage success');
                            }, function(error) {
                                console.log('sendReadReceiptResponseMessage error', error.errorCode);
                            });
                        }
                        break;
                    case webimmodel.MessageType.ReadReceiptResponseMessage:
                        // var ids = msg.content.receiptMessageDic[RongIMLib.Bridge._client.userId];
                        var receiptResponseItem = <any>data.content;
                        var ids = receiptResponseItem.receiptMessageDic[mainDataServer.loginUser.id];
                        if (!ids) {
                            return;
                        }
                        for (var i = 0, len = ids.length; i < len; i++) {
                            // console.log(ids[i], msg.receiptResponse[ids[i]]);
                            var itemById = conversationServer.getMessageById(msg.targetId, msg.conversationType, ids[i]);
                            if (itemById && msg.receiptResponse && msg.receiptResponse[ids[i]]) {
                                itemById.receiptResponse = msg.receiptResponse;
                                // $('#' + ids[i]).find('span.receiptResponse').text(msg.receiptResponse[ids[i]] + '人已读');
                            }

                            //遍历,更新缓存中消息的receiptResponse
                        }
                        break;
                    case webimmodel.MessageType.SyncReadStatusMessage:
                        conversationServer.clearAtMessage(msg.targetId, msg.conversationType);
                        RongIMSDKServer.clearUnreadCount(msg.conversationType, msg.targetId);
                        var curCon = mainDataServer.conversation.getConversation(msg.conversationType, msg.targetId);
                        if (curCon) {
                            curCon.atStr = '';
                            mainDataServer.conversation.totalUnreadCount = mainDataServer.conversation.totalUnreadCount - curCon.unReadNum;
                            curCon.unReadNum = 0;
                        }
                        break;
                    default:
                        console.log(data.messageType + "：未处理")
                        break;
                }

                // $scope.mainData.conversation.updateConversations();
                $scope.mainData.conversation.updateConStatic(msg, true, $state.is("main.chat") && !document.hidden);
                $scope.$apply();

            }
        })

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


        function showDisconnectErr(flag: boolean) {
            var ele = <any>document.querySelector(".no_network");
            if (ele) {
                ele.style.visibility = flag ? 'visible' : 'hidden';
            }
            var sendBtn = document.querySelector(".sendBtn");
            if (sendBtn) {
                sendBtn.className = flag ? 'sendBtn disabled' : 'sendBtn';
            }
        }

        var reconnectTimes = 0, timeInterval = 20, timeID: any, reconnectTimeID: any;
        function reconnectServer() {
            if (reconnectTimeID) {
                clearTimeout(reconnectTimeID);
            }
            reconnectTimeID = setTimeout(function() {
                RongIMSDKServer.reconnect({
                    onSuccess: function() {
                        var myDate = new Date();
                        reconnectTimes = 0;

                        console.log("reconnectSuccess", myDate.toLocaleString());
                        if (reconnectTimeID) {
                            clearTimeout(reconnectTimeID);
                        }
                        showDisconnectErr(false);
                        isConnecting = false;
                        mainDataServer.isConnected = true;
                        RongIMSDKServer.getConversationList().then(function() {
                            mainDataServer.conversation.updateConversations();
                        });
                    },
                    onError: function() {
                        mainDataServer.isConnected = false;
                        isConnecting = false;
                        if (reconnectTimes <= 5) {
                            reconnectServer();
                            reconnectTimes += 1;
                        } else {
                            reconnectTimes = 0;
                            var myDate = new Date();
                            console.log("网络正常重连失败！！！", myDate.toLocaleString());
                        }
                    }
                });
            }, timeInterval * reconnectTimes * 1000);
        }

        function checkNetwork(callback: any) {
            var myDate = new Date();
            console.log('begin checkNetwork', myDate.toLocaleString());
            $http.get("index.html", {
                params: { t: Math.random() }
            }).success(function() {
                if (timeID) {
                    clearTimeout(timeID);
                }
                callback && callback.onSuccess && callback.onSuccess();
            }).error(function() {
                showDisconnectErr(true);
                if (timeID) {
                    clearTimeout(timeID);
                }
                timeID = setTimeout(function() {
                    checkNetwork(callback);
                }, 5000);
            });
        }

        $scope.showgroup = function() {
            organizationgroup.showPanle()
        }

        $scope.showMessageManage = function() {
            $scope.switchbtn.searchMessage = true;
            $scope.showsearchconversation = false;
            RongIMSDKServer.getAllConversations().then(function(data: any) {
                $scope.allconversations = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].conversationType == 1 || data[i].conversationType == 3) {
                        var result = mainDataServer.conversation.parseConversation(data[i]);
                        result.imgSrc = result.imgSrc || 'assets/css/images/user.png';
                        $scope.allconversations.push(result.item);
                    }
                }
            })
        }


    }]);
