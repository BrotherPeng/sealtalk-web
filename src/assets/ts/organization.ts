module webim {
    var webim = angular.module('webim');

    webim.controller('organizationController', ["$scope", "organizationServer", "$state", function($scope: any, organizationServer: any, $state: ng.ui.IStateService) {

        $scope.treeOptions = {
            isLeaf: function(node: any) {
                return !node.departname;
            },
            isSelectable: function(node: any) {
                return !node.departname;
            },
            equality: function(node1: any, node2: any) {
                return node1 === node2;
            }
        }

        organizationServer.getList().then(function(data: any) {
            // $scope.organizationList = data.department;
            $scope.organizationList = data;
        });


        $scope.toggleNode = function(node: any) {
            if (!node.children) {
                organizationServer.getList().then(function(data: any) {
                    node.children = data;
                    // node.children = data.person;
                    // node.children = angular.copy(node.children.concat(data.department));
                });
                organizationServer.getUserList(node.id).then(function(data: any) {
                    node.children = angular.copy(node.children.concat(data));
                })
            }
        }

        $scope.onSelection = function(node: any) {
            if (angular.isFunction($scope.selection)) {
                $scope.selection(node);
            } else {
                $state.go("main.friendinfo", { userid: node.id, groupid: 0, targetid: 0, conversationtype: 0 });
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
            '{{node.departname||node.nickname}}' +
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
            '<span class="nickname_text">{{::item.oaName||item.realName}}</span>' +
            '</h3>' +
            '</div>' +
            '<div class="botDivider"></div>' +
            // '<i class="Presence Presence--members online"></i>' +
            '</div>',
            link: function(scope: any, ele: any, attr: any) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);

                ele.on("click", function() {
                    scope.$parent.selectGo(scope.item.id, webimmodel.conversationType.Private);
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


    webim.service('organizationServer', ["$q", "$http", function($q: ng.IQService, $http: ng.IHttpService) {

        this.getList = function(id: string) {

            var defer = $q.defer();

            //此处请求示例数据，正式请修改 url 和返回数据。--获取组织结构
            $http({
                method: 'get',
                url: 'http://192.168.156.8:8080/org-web/restapi/departs',
                data: {
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

        this.getUserList = function(departid: string) {
            var defer = $q.defer();

            //此处请求示例数据，正式请修改 url 和返回数据。--获取组织结构
            $http({
                method: 'get',
                url: 'http://192.168.156.8:8080/org-web/restapi/departs/' + departid + '/members',
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
