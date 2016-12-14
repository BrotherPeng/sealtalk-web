/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-file-upload/angular-file-upload.d.ts"/>

var groupAddMember = angular.module("webim.groupaddmember", []);

groupAddMember.controller("groupaddmemberController", ["$scope", "$state", "$stateParams", "mainDataServer", "mainServer",
    function($scope: any, $state: angular.ui.IStateService, $stateParams: any, mainDataServer: mainDataServer, mainServer: mainServer) {
        $scope.save = function() {
            throw new Error("Not implemented yet");
        }

        $scope.idorname = $stateParams["idorname"];

        $scope.isLoading = false;

        if ($stateParams["iscreate"] == "true") {
            //创建群组

            var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function(item) { return item.list }));
            //排除自己，自己可以和自己是好友
            friendList = friendList.filter(function(item: webimmodel.Friend, index: number, arr: webimmodel.Friend[]) {
                return item.id != mainDataServer.loginUser.id;
            })
            var rawFriendList = webimutil.Helper.cloneObject(friendList);
            $scope.friendList = webimutil.Helper.cloneObject(friendList);

            console.log('$scope.friendList~~~~~~~~~~~~~~~~~~~~~~~~~');
            console.log($scope.friendList);

            $scope.searchfriend = function(str: string) {
                console.log('搜索好友~~~~~~~~~~~~~~~');
                console.log(str);
                if (str == "") {
                    $scope.friendList.length = 0;
                    $scope.friendList = webimutil.Helper.cloneObject(rawFriendList);
                } else {
                    var list = mainDataServer.contactsList.find(str, rawFriendList);
                    $scope.friendList.length = 0;
                    $scope.friendList = webimutil.Helper.cloneObject(list);
                }
            }
            $scope.save = function() {
                if ($scope.isLoading) {
                    return;
                }
                var membersid = <string[]>[];
                var members = <webimmodel.Friend[]>[];
                $scope.friendList.forEach(function(item: any) {
                    if (item.isSelected) {
                        membersid.push(item.id + "");
                        members.push(item);
                    }
                });

                console.log('==========================');
                console.log(members);
                console.log('==========================');
                if (membersid.length < 1) {
                    webimutil.Helper.alertMessage.error("至少要有1个群成员", 2);
                    return;
                }

                $scope.isLoading = true;

                //请求服务创建群组 将自己加入
                membersid.push(mainDataServer.loginUser.id);
                mainServer.group.create($scope.idorname, membersid).success(function(rep) {
                    if (rep.code == 200) {
                        var group = new webimmodel.Group({
                            id: rep.result.id,
                            name: $scope.idorname,
                            imgSrc: "",
                            upperlimit: 500,
                            fact: 1,
                            creater: mainDataServer.loginUser.id
                        });
                        mainDataServer.contactsList.addGroup(group);
                        //1.添加群成员2.添加自己
                        mainDataServer.contactsList.addGroupMember(group.id, new webimmodel.Member({
                            id: mainDataServer.loginUser.id,
                            name: mainDataServer.loginUser.nickName,
                            imgSrc: mainDataServer.loginUser.portraitUri,
                            role: "0"
                        }));
                        for (var j = 0, len = members.length; j < len; j++) {
                            var member = new webimmodel.Member({
                                id: members[j].id,
                                name: members[j].name,
                                imgSrc: members[j].imgSrc,
                                role: "1"
                            });
                            mainDataServer.contactsList.addGroupMember(group.id, member);
                        }

                        console.log('create group 》》》》》》》》');
                        console.log(members);
                        members = undefined;
                        membersid = undefined;
                        webimutil.Helper.alertMessage.success("创建成功！", 2);
                        $state.go("main.chat", { targetId: group.id, targetType: webimmodel.conversationType.Group });


                    } else if (rep.code == 1000) {
                        //群组超过上限
                        webimutil.Helper.alertMessage.error("群组超过上限", 2);
                    }


                    $scope.isLoading = false;
                }).error(function(err) {
                    $scope.isLoading = false;
                    webimutil.Helper.alertMessage.error("失败", 2);
                });

                console.log($scope.friendList.filter(function(item: any) { return item.isSelected }));

            }
            $scope.back = function() {
                // $state.go("main.creategroup")
                window.history.back();
            }
            $scope.syncState = function (id: string, state: boolean) {
              rawFriendList.forEach(function (item: any) {
                  if (item.id == id) {
                      item.isSelected = state;
                  }
              });
            };
        } else {
            //修改群组

            var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function(item) { return item.list }));
            // console.log(friendList);
            var memberList = mainDataServer.contactsList.getGroupById($scope.idorname).memberList;

            //排除已经在群里的用户
            var membersObj = <any>{};
            for (var i = 0, len = memberList.length; i < len; i++) {
                membersObj[memberList[i].id] = true;
            }
            friendList = friendList.filter(function(item: webimmodel.Friend, index: number, arr: webimmodel.Friend[]) {
                return !membersObj[item.id];
            })

            var rawFriendList = webimutil.Helper.cloneObject(friendList);
            // $scope.friendList = webimutil.Helper.cloneObject(friendList);

            $scope.searchfriend = function(str: string) {
                console.log('searchfriend~~~~~~~~~~~~~~~');
                console.log(str);
                if (str == "") { //通讯录用户太多不显示
                    $scope.friendList = [];
                    // $scope.friendList = webimutil.Helper.cloneObject(rawFriendList);
                } else {
                    var searchList = mainDataServer.contactsList.find(str, rawFriendList);
                    $scope.friendList = webimutil.Helper.cloneObject(searchList);
                }
            }
            $scope.save = function() {
                //向每个用户发送 邀请加入群的通知
                if ($scope.isLoading) {
                    return;
                }
                $scope.isLoading = true;
                var membersid = <string[]>[];
                var members = <webimmodel.Friend[]>[];
                $scope.friendList.forEach(function(item: any) {
                    if (item.isSelected) {
                        membersid.push(item.id + "");
                        members.push(item);
                    }
                });
                if (membersid.length < 1) {
                    webimutil.Helper.alertMessage.error("至少要选择1个成员", 2);
                    return;
                }

                mainServer.group.addMember($scope.idorname, membersid).success(function(rep) {
                    if (rep.code == 200) {
                        for (var j = 0, len = members.length; j < len; j++) {
                            var member = new webimmodel.Member({
                                id: members[j].id,
                                name: members[j].name,
                                imgSrc: members[j].imgSrc,
                                role: "1"
                            });
                            mainDataServer.contactsList.addGroupMember($scope.idorname, member);
                        }
                        members = undefined;
                        membersid = undefined;
                        $state.go("main.groupinfo", { groupid: $scope.idorname });
                        webimutil.Helper.alertMessage.success("添加成功！", 2);
                    }

                    $scope.isLoading = false;
                }).error(function(err) {
                    $scope.isLoading = false;
                    webimutil.Helper.alertMessage.error("失败", 2);
                });

            }

            $scope.back = function() {
                $state.go("main.groupinfo", { groupid: $stateParams["idorname"] });
            }
            $scope.syncState = function (id: string, state: boolean) {
              rawFriendList.forEach(function (item: any) {
                  if (item.id == id) {
                      item.isSelected = state;
                  }
              });
            };
        }
    }]);

groupAddMember.directive("searchitem", function() {
    return {
        restrict: "E",
        scope: { item: "=" },
        template: '<li class="chat_item joinGroup_item addFriends_item">' +
        '<div class="select">' +
        '<input type="checkbox" class="hide" id="{{item.id}}" ng-change="syncState()" ng-model="item.isSelected" value="136" data-count="" name="">' +
        '<label for="{{item.id}}"></label>' +
        '</div>' +
        '<div class="photo">' +
        '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'assets/img/barBg.png\'}}" alt="">' +
        '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
        '</div>' +
        '<div class="info">' +
        '<h3 class="nickname">' +
        '<span class="nickname_text">{{item.name}}</span>' +
        '</h3>' +
        '</div>' +
        '</li>',
        link: function(scope: any, ele: any, attr: any) {
            angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            scope.syncState = function(){
              scope.$parent.syncState(scope.item.id, scope.item.isSelected);
            }
        }
    }
})
