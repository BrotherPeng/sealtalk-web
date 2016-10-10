module webim {
    var webim = angular.module('webim');
    webim.controller('searchmessageController', ["$scope", "$state", "RongIMSDKServer", "conversationServer", "mainDataServer",
        function($scope: any, $state: ng.ui.IStateService, RongIMSDKServer: RongIMSDKServer, conversationServer: conversationServer, mainDataServer: mainDataServer) {

            if (!mainDataServer.loginUser.nickName) {
                $state.go("main");
                return;
            }


            var conversationType = $state.params['conversationtype'];
            var targetId = $state.params['targetid'];
            var searchStr = $state.params['searchstr'];

            $scope.searchStr = searchStr;

            var messageList: any[] = [];
            var messageListCache: any[] = [];

            var lastTime: any = 0;
            var hasmore: boolean = true;

            $scope.pagesize = 20;
            $scope.currentPage = 1;
            $scope.pageCount = 0;

            getMoreMessage();

            function convertHistoryList(list: any[]) {
                var msglen = list.length;
                var arr: any[] = [];
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
                        case webimmodel.MessageType.InformationNotificationMessage:
                        case webimmodel.MessageType.FileMessage:
                            var item = webimmodel.Message.convertMsg(msgsdk);
                            if (item) {
                                unshiftHistoryMessages(item);
                                arr.unshift(item);
                            }
                            break;
                        case webimmodel.MessageType.GroupNotificationMessage:
                            if (msgsdk.objectName == "RC:GrpNtf") {
                                var item = webimmodel.Message.convertMsg(msgsdk);
                                if (item) {
                                    conversationServer.asyncConverGroupNotifition(msgsdk, item);
                                    unshiftHistoryMessages(item);
                                    arr.unshift(item);
                                }
                            }
                            break;
                        case webimmodel.MessageType.UnknownMessage:
                            if (msgsdk.objectName == "RC:GrpNtf") {
                                var item = webimmodel.Message.convertMsg(msgsdk);
                                if (item) {
                                    conversationServer.asyncConverGroupNotifition(msgsdk, item);
                                    unshiftHistoryMessages(item);
                                    arr.unshift(item);
                                }
                            }
                            break;
                        // case webimmodel.MessageType.RecallCommandMessage:
                        //
                        //     break;
                        // case webimmodel.MessageType.InformationNotificationMessage:
                        //     var item = webimmodel.Message.convertMsg(msgsdk);
                        //     if (item) {
                        //         unshiftHistoryMessages(item);
                        //     }
                        //     break;
                        default:
                            console.log("此消息类型未处理：" + msgsdk.messageType);
                            break;
                    }

                }
                return arr;
            }

            function unshiftHistoryMessages(item: any) {
                var arr = messageListCache;
                if (arr[0] && item.messageUId && item.messageUId === arr[0].messageUId) {
                    return;
                }
                conversationServer.messageAddUserInfo(item);
                arr.unshift(item);
            }



            function getMoreMessage() {
                if (searchStr) {
                    RongIMSDKServer.getMessagesFromConversation(targetId, conversationType, searchStr, lastTime, $scope.pagesize).then(function(data) {
                        $scope.pageCount = 0;//根据返回总数计算；

                        $scope.messageList = convertHistoryList(data);
                    })
                } else {
                    RongIMSDKServer.getHistoryMessages(+conversationType, targetId, lastTime, $scope.pagesize).then(function(data) {
                        $scope.pageCount = 0;//根据返回总数计算；

                        hasmore = data.has;
                        var list = data.data;
                        var end = list.length - $scope.pagesize;
                        list.splice(0, end < 0 ? 0 : end);
                        $scope.messageList = convertHistoryList(list);
                        lastTime = (list[0] || <RongIMLib.Message>{}).sentTime || 0;

                    }, function(err: any) {
                        console.log('获取历史消息失败');
                    });
                }
            }

            $scope.pre = function() {
                var currentPage = $scope.currentPage;
                var pageCount = $scope.pageCount;
                var pagesize = $scope.pagesize;

                if (currentPage > 1) {
                    $scope.messageList = [];
                    currentPage--;
                    $scope.currentPage--;

                    $scope.messageList = messageListCache.slice(messageListCache.length - (currentPage * pagesize), messageListCache.length - ((currentPage - 1) * pagesize));
                }
            }

            $scope.next = function() {
                var currentPage = $scope.currentPage;
                var pageCount = $scope.pageCount;
                var pagesize = $scope.pagesize;

                // if (currentPage < pageCount ) {
                if(currentPage*pagesize<messageListCache.length||hasmore){
                    currentPage++;
                    $scope.currentPage++;

                    $scope.messageList = [];
                    if ((currentPage - 1) * pagesize < messageListCache.length) { //有缓存消息
                        var start = messageListCache.length - (currentPage * pagesize);
                        $scope.messageList = messageListCache.slice(start < 0 ? 0 : start, messageListCache.length - ((currentPage - 1) * pagesize));
                    } else  { //无缓存消息
                        getMoreMessage();
                    }

                }
            }

        }]);


    webim.directive('searchTextMessage', [function() {
        return {
            restrict: 'E',
            scope: {
                message: "=",
                searchstr: '='
            },
            template: '<pre>content<pre>',
            link: function(scope: any, element: ng.IRootElementService) {
                var content = '';
                if (scope.searchstr) {
                    content = scope.message.content.replace(new RegExp(scope.searchstr,'g'), '<em class="r-msg-keyword">$&</em>');
                } else {
                    content = scope.message.content;
                }
                element.find('pre').html(content);
            }
        }
    }]);

    webim.directive('searchImageMessage', [function() {
        return {
            restrict: 'E',
            scope: {
                message: '='
            },
            template: '<img ng-src="{{message.content}}"></img>',
            link: function(scope: any) {
            }
        }
    }])

}
