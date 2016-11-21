module webim {
    var webim = angular.module('webim');

    webim.controller('organizationController', ["$scope", "organizationServer", "$state","organizationData", "mainDataServer",
     function($scope: any, organizationServer: any, $state: ng.ui.IStateService,organizationData: any,mainDataServer: any) {

        $scope.treeOptions = {
            isLeaf: function(node: any) {
                return !node.deptName;
            },
            isSelectable: function(node: any) {
                return !node.deptName;
            },
            equality: function(node1: any, node2: any) {
                return node1 === node2;
            }
        }

        organizationServer.getList('').then(function(data: any) {
            // $scope.organizationList = data.department;
            $scope.organizationList = data;
            organizationData.departmentList = data;
        });


        $scope.toggleNode = function(node: any) {
            if (!node.children) {
                organizationServer.getListOfParent(node.id).then(function(data: any) {
                    node.children = node.children || [];
                    // node.children = angular.copy(data.concat(node.children));
                    // organizationData.departmentList = organizationData.departmentList.concat(data);
                    node.children = angular.copy(node.children.concat(data));
                    organizationData.departmentList = data.concat(organizationData.departmentList);
                    // node.children = data.person;
                    // node.children = angular.copy(node.children.concat(data.department));
                });
                organizationServer.getUserList(node.id).then(function(data: any) {
                    node.children = node.children || [];
                    // node.children = angular.copy(node.children.concat(organizationData.userList));
                    // organizationData.userList = organizationData.userList.concat(data);
                    node.children = angular.copy(data.concat(node.children));
                    organizationData.userList = data.concat(organizationData.userList);
                })
            }
        }

        $scope.onSelection = function(node: any) {
            if (angular.isFunction($scope.selection)) {
                if(node.userId == mainDataServer.loginUser.id){
                    return;
                }
                $scope.selection(node);
            } else {
                // $state.go("main.friendinfo", { userid: node.id, groupid: 0, targetid: 0, conversationtype: 0 });
                // $state.go("main.friendinfo", { userid: node.userId, groupid: 0, targetid: 0, conversationtype: 0 });
                $state.go("main.companyuserinfo", { userid: node.userId});
            }
        }


    }]);

    webim.directive('organization', [function() {
        return {
            restrict: 'E',
            scope: {
                selection: "="
            },
            template: '<treecontrol class="tree-classic"' +
            ' tree-model="organizationList"' +
            ' options="treeOptions"' +
            ' on-node-toggle="toggleNode(node)"' +
            ' on-selection="onSelection(node)">' +
            '<span ng-show="node.deptName">{{node.deptName}}</span>' +
            '<span ng-hide="node.deptName"><img class="r-organ-user-head-img" ng-src="{{node.user.portraitUri||\'assets/css/images/user.png\'}}"><span>{{node.displayName}}</span></span>'+
            '</treecontrol>',
            controller: 'organizationController'
        }
    }]);

    webim.directive("staffitem", ["$state", function($state: angular.ui.IStateService) {
        return {
            restrict: "E",
            scope: { item: "=" },
            replace: true,
            template: '<div class="members_item " >' +
            '<div class="photo">' +
            '<img class="img" ng-show="::item.imgSrc" ng-src="{{::item.imgSrc}}" alt="">' +
            '<div class="portrait" ng-hide="::item.imgSrc">{{::item.firstchar}}</div>' +
            '</div>' +
            '<div class="info">' +
            '<h3 class="nickname">' +
            '<span class="nickname_text">{{::item.displayName||item.realName}}</span>' +
            '</h3>' +
            '</div>' +
            '<div class="botDivider"></div>' +
            // '<i class="Presence Presence--members online"></i>' +
            '</div>',
            link: function(scope: any, ele: any, attr: any) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);

                ele.on("click", function() {
                    scope.$parent.selectGo(scope.item.id, webimmodel.conversationType.Private);
                    // scope.$parent.selectGo(scope.item.userId, webimmodel.conversationType.Private);
                });
            }
        }
    }]);


    webim.directive("incloudmember", ["$state", function($state: angular.ui.IStateService) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template:
            // '<div class="noticeBarList">' +
            '<div class="notice_item ">' +
            '<div class="photo">' +
            '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'assets/img/barBg.png\'}}" alt="" style="margin-top: 10px;">' +
            '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
            '</div>' +
            '<div class="info">' +
            '<h3 class="nickname">' +
            '<span class="nickname_text">{{item.groupName}}</span><br>' +
            '<span class="nickname_text containuser" style="">包含：{{item.include}}</span>' +
            '</h3>' +
            '</div>' +

            '<div class="botDivider"></div>' +

            // '</div>' +
            // '</div>' +
            '</div>',
            replace: true,
            link: function(scope: any, ele: any, attr: any) {

                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);

                ele.on("click", function() {
                    // $state.go("main.groupinfo", { groupid: scope.item.id, conversationtype: "0" });
                    // scope.$parent.unSelectContact();
                    // angular.element(ele[0]).addClass('selected');
                    scope.$parent.selectGoGroup(scope.item.id, webimmodel.conversationType.Group);
                });
            }
        }
    }]);

    webim.service('organizationData',[function(){


        this.departmentList = [];
        this.userList = [];

        this.getDepartmentById = function(id: string){
            var arr=this.departmentList;
            for(var i=0,len=arr.length;i<len;i++){
                if(arr[i].id == id){
                    return arr[i];
                }
            }
        }

        this.getUserById = function(id: string){
            var arr=this.userList;
            for(var i=0,len=arr.length;i<len;i++){
                if(arr[i].userId == id){
                    return arr[i];
                }
            }
        }

    }])


    webim.service('organizationServer', ["$q", "$http", "appconfig", function($q: ng.IQService, $http: ng.IHttpService, appconfig: any) {

        // var serverUrl = "http://api.sealtalk.im";
        // var serverUrl = "http://127.0.0.1:8586";
        // var serverUrl = "http://localhost/sgai/i3";
        // var serverUrl = "http://220.194.33.92/sgai/i3";
        var serverUrl = appconfig.getDeptUrl();

        this.getList = function(id: string) {

            var defer = $q.defer();

            //此处请求示例数据，正式请修改 url 和返回数据。--获取组织结构
            // $http({
            //     method: 'get',
            //     url: './assets/js/exampledata.json',
            // }).success(function(rep: any) {
            //     //此处根据具体返回结构处理
            //     defer.resolve(rep.organizationlist.data.department);
            // }).error(function(error) {
            //     defer.reject(error);
            // })
            // id= id||'';
            $http({
                method: 'get',
                url: serverUrl + '/departs',
                params: {
                    parentid: id
                }
            }).success(function(rep: any) {
                //此处根据具体返回结构处理
                defer.resolve(rep.result);
            }).error(function(error) {
                defer.reject(error);
            })

            return defer.promise;
        }

        this.getListOfParent = function(id: string) {

            var defer = $q.defer();

            //此处请求示例数据，正式请修改 url 和返回数据。--获取组织结构
            // $http({
            //     method: 'get',
            //     url: './assets/js/exampledata.json',
            // }).success(function(rep: any) {
            //     //此处根据具体返回结构处理
            //     defer.resolve(rep.organizationlist.data.department);
            // }).error(function(error) {
            //     defer.reject(error);
            // })
            // id= id||'';
            $http({
                method: 'get',
                url: serverUrl + '/departs/' + id + '/department',
            }).success(function(rep: any) {
                //此处根据具体返回结构处理
                defer.resolve(rep.result);
            }).error(function(error) {
                defer.reject(error);
            })

            return defer.promise;
        }

        this.getUserList = function(departid: string) {
            var defer = $q.defer();

            //此处请求示例数据，正式请修改 url 和返回数据。--获取组织结构

            // $http({
            //     method: 'get',
            //     url: './assets/js/exampledata.json',
            // }).success(function(rep: any) {
            //     //此处根据具体返回结构处理
            //     defer.resolve(rep.organizationlist.data.person);
            // }).error(function(error) {
            //     defer.reject(error);
            // })

            $http({
                method: 'get',
                url: serverUrl+'/user/' + departid + '/department',
            }).success(function(rep: any) {
                //此处根据具体返回结构处理
                defer.resolve(rep.result);
            }).error(function(error) {
                defer.reject(error);
            })

            return defer.promise;
        }

        this.search = function(str: string) {
            var defer = $q.defer();
            //此处请求示例数据，正式请修改 url 和返回数据。--获取组织结构
            $http({
                method: 'get',
                url: './assets/js/exampledata.json',
                data: {
                    str: str
                }
            }).success(function(rep: any) {
                //此处根据具体返回结构处理
                defer.resolve(rep.searchorganization.data);
            }).error(function(error) {
                defer.reject(error);
            })


            return defer.promise;
        }


    }])

}
