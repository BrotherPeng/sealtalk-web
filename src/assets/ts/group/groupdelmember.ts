/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-file-upload/angular-file-upload.d.ts"/>

var groupDelMember = angular.module("webim.groupdelmember", []);

groupDelMember.controller("groupdelmemberController", ["$scope", "$state", "$stateParams", "mainDataServer", "mainServer",
    function($scope: any, $state: angular.ui.IStateService, $stateParams: any, mainDataServer: mainDataServer, mainServer: mainServer) {
        $scope.save = function() {
            throw new Error("Not implemented yet");
        }

        $scope.idorname = $stateParams["idorname"];
        $scope.loginuserid = mainDataServer.loginUser.id;
        $scope.isLoading = false;

        // var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function(item) { return item.list }));
        // var memberList = mainDataServer.contactsList.getGroupById($scope.idorname).memberList;
        var friendList = mainDataServer.contactsList.getGroupById($scope.idorname).memberList;

        //排除已经在群里的用户
        // var membersObj = <any>{};
        // for (var i = 0, len = memberList.length; i < len; i++) {
        //     membersObj[memberList[i].id] = true;
        // }
        // friendList = friendList.filter(function(item: webimmodel.Friend, index: number, arr: webimmodel.Friend[]) {
        //     return !membersObj[item.id];
        // })

        var rawFriendList = webimutil.Helper.cloneObject(friendList);
        $scope.friendList = webimutil.Helper.cloneObject(friendList);

        $scope.searchfriend = function(str: string) {
            console.log('查询要删除的用户~~~~~~~~~~~~');
            console.log(str);
            if (str == "") {
                $scope.friendList = webimutil.Helper.cloneObject(rawFriendList);
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
            $scope.friendList.forEach(function(item: any) {
                if (item.isSelected) {
                    membersid.push(item.id + "");
                }
            });
            if (membersid.length < 1) {
                webimutil.Helper.alertMessage.error("至少要选择1个成员", 2);
                return;
            }

            mainServer.group.kickMember($scope.idorname, membersid).success(function(rep) {
                if (rep.code == 200) {
                    for (var j = 0, len = membersid.length; j < len; j++) {
                        mainDataServer.contactsList.removeGroupMember($scope.idorname, membersid[j]);
                    }
                    membersid = undefined;
                    $state.go("main.groupinfo", { groupid: $scope.idorname });
                    webimutil.Helper.alertMessage.success("删除成功！", 2);
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

    }]);

groupDelMember.directive("searchdelitem", function() {
    return {
        restrict: "E",
        scope: { item: "=", loginuserid: "=" },
        template: '<li class="chat_item joinGroup_item addFriends_item">' +
        '<div class="select" ng-hide="isself">' +
        '<input type="checkbox" class="hide" id="{{item.id}}" ng-change="syncState()" ng-model="item.isSelected" value="136" data-count="" name="">' +
        '<label for="{{item.id}}"></label>' +
        '</div>' +
        '<div class="select" ng-show="isself">' +
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
            scope.isself = scope.loginuserid == scope.item.id;
        }
    }
})
