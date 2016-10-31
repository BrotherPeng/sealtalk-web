module webim {

    var organization = angular.module('webim.organization', ['ngDialog']);

    organization.service('organizationgroup', ['ngDialog', function(ngDialog: any) {

        var group = {
            showPanle: function(groupid: string) {
                ngDialog.open({
                    templateUrl: 'assets/template/organizatioingroup.tpl.html',
                    controller: 'organizationgroupController',
                    className: 'ngdialog-organizationgroup',
                    showClose: false,
                    data: {
                        groupid: groupid
                    }
                })
            }
        }

        return group;

    }]);

    organization.controller('organizationgroupController', ["$scope", '$state', 'ngDialog', 'mainServer', 'mainDataServer', 'searchData', '$q',
        function($scope: any, $state: ng.ui.IStateService, ngDialog: any, mainServer: mainServer, mainDataServer: mainDataServer, searchData: any, $q: ng.IQService) {

            var groupid = $scope.ngDialogData.groupid;

            $scope.organizationList = [];
            $scope.groupMember = [];
            var oldGroupMember: any[];//原始成员值 差量查找
            $scope.searchList = [];
            $scope.showCreateGroup = false;//是否显示 创建群组
            $scope.searchControl = {};//删除搜索内容
            $scope.isCreater = false;
            $scope.disableRemove = [];//非群组创建者不可以删除人员
            $scope.friendList = [];

            $scope.loginuserid = mainDataServer.loginUser.id;//不可以删除自己

            mainDataServer.contactsList.subgroupList.forEach(function(item) {
                $scope.friendList = $scope.friendList.concat(item.list);
            })

            $scope.clear = function() {
                $scope.searchControl.clear();
            }

            if (groupid) {
                var group = mainDataServer.contactsList.getGroupById(groupid);

                oldGroupMember = group.memberList.map(function(item: any) {
                    return item.id;
                });
                $scope.isCreater = group.creater === mainDataServer.loginUser.id;
                if ($scope.isCreater) {
                    $scope.groupMember = angular.copy(group.memberList);
                } else {
                    $scope.disableRemove = angular.copy(group.memberList);
                }
            }



            $scope.search = function(str: string) {
                if (str) {
                    if(!$scope.showfriend){
                        searchData.searchOrganization(str).then(function(result: any) {
                            $scope.searchList = result;
                        })
                    }else{
                        searchData.searchContact(str).then(function(rep: any){
                            $scope.searchList = rep.friendList;
                            console.log($scope.searchList );
                        })
                    }
                    
                } else {
                    $scope.searchList = [];
                }
            }

            $scope.addMemberFromFriend = function(friend: webimmodel.Friend) {
              if(!existMemberList(friend.id)){
                $scope.groupMember.unshift({
                    id: friend.id,
                    name: friend.name,
                    imgSrc: friend.imgSrc
                });
              }
            }

            function existMemberList(id: any) {
                var a = $scope.groupMember;
                var b = $scope.disableRemove;
                var c = a.concat(b);
                for (var i = 0, len = c.length; i < len; i++) {
                    if (id === c[i].id) {
                        return true;
                    }
                }
                return false;
            }

            $scope.addMember = function(member: any) {
                if (!existMemberList(member.userId)) {
                    $scope.groupMember.unshift({
                        id: member.userId,
                        name: member.displayName,
                        imgSrc: member.imgSrc
                    });
                }
            }

            $scope.removeMember = function(id: string) {
                var arr = $scope.groupMember;
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].id === id) {
                        arr.splice(i, 1);
                        return true;
                    }
                }
                return false;
            }

            $scope.selection = function(node: any) {
                console.log(node);
            }

            $scope.updateMember = function() {
                if (groupid) {
                    var removeids: any[] = [];
                    var addids: any[] = [];
                    var memberIds = $scope.groupMember.map(function(item: any) {
                        if (oldGroupMember.indexOf(item.id) == -1) {
                            addids.push(item.id);
                        }
                        return item.id;
                    });
                    oldGroupMember.forEach(function(item: string) {
                        if (memberIds.indexOf(item) == -1) {
                            removeids.push(item);
                        }
                    });
                    if (!$scope.isCreater) {
                        mainServer.group.addMember(groupid, memberIds).then(function() {

                        })
                    } else {
                        if (addids.length > 0) {
                            mainServer.group.addMember(groupid, addids).then(function() {

                            })
                        }
                        if (removeids.length > 0) {
                            mainServer.group.kickMember(groupid, removeids).then(function() {

                            })
                        }
                    }

                    $scope.closeThisDialog();

                }
            }

            $scope.enterMember = function() {
                $scope.groupform.$setPristine();
                $scope.groupform.$setUntouched();
                $scope.showCreateGroup = true;
            }

            $scope.cancelCreate = function() {
                $scope.showCreateGroup = false;
            }

            $scope.createGroup = function() {
                var memberIds = $scope.groupMember.map(function(item: any) {
                    return item.id;
                });
                var members = $scope.groupMember;
                var index = memberIds.indexOf(mainDataServer.loginUser.id);
                if (index == -1) {
                    memberIds.push(mainDataServer.loginUser.id);
                }
                if (memberIds.length <= 1) {
                    webimutil.Helper.alertMessage.error('至少包含一个群成员');
                    return;
                }

                mainServer.group.create($scope.groupname, memberIds).then(function(rep: any) {
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

                        webimutil.Helper.alertMessage.success("创建成功！", 2);
                        $state.go("main.chat", { targetId: group.id, targetType: webimmodel.conversationType.Group });

                    } else if (rep.code == 1000) {
                        //群组超过上限
                        webimutil.Helper.alertMessage.error("群组超过上限", 2);
                    }
                    $scope.closeThisDialog();
                });

            }

        }])

}
