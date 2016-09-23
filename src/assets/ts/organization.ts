module webim {
  var webim = angular.module('webim');

  webim.controller('organizationController', ["$scope", "organizationServer", "$state", function($scope: any, organizationServer: any, $state: ng.ui.IStateService) {

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

    organizationServer.getList().then(function(data: any) {
      $scope.organizationList = data.department
    });


    $scope.toggleNode = function(node: any) {
      if (!node.children) {
        organizationServer.getList().then(function(data: any) {
          node.children = data.person;
          node.children = angular.copy(node.children.concat(data.department));
        });
      }
    }

    $scope.onSelection = function(node: any) {
      $state.go("main.friendinfo", { userid: node.id, groupid: 0, targetid: 0, conversationtype: 0 });
    }

  }]);

  webim.directive('organization', [function() {
    return {
      restrict: 'E',
      template: '<treecontrol class="tree-classic"' +
      ' tree-model="organizationList"' +
      ' options="treeOptions"' +
      ' on-node-toggle="toggleNode(node)"' +
      ' on-selection="onSelection(node)">' +
      '{{node.deptName||node.realName}}' +
      '</treecontrol>',
      controller: 'organizationController'
    }
  }]);

  webim.service('organizationServer', ["$q", function($q: ng.IQService) {

    this.getList = function(id: string) {
      var rep = {
        "data": {
          "person": [
            {
              "id": "人员ID0",
              "oaName": "OA用户名0",
              "realName": "真实姓名0",
              "mobilePhone": "手机号0",
              "chat": "是否能通信 1：是， 2：否"
            },
            {
              "id": "人员ID1",
              "oaName": "OA用户名1",
              "realName": "真实姓名1",
              "mobilePhone": "手机号1",
              "chat": "是否能通信 1：是， 2：否"
            },
            {
              "id": "人员ID2",
              "oaName": "OA用户名2",
              "realName": "真实姓名2",
              "mobilePhone": "手机号2",
              "chat": "是否能通信 1：是， 2：否"
            }
          ],
          "department": [
            {
              "id": "部门ID0",
              "deptName": "部门名称0"
            },
            {
              "id": "部门ID1",
              "deptName": "部门名称1"
            },
            {
              "id": "部门ID2",
              "deptName": "部门名称2"
            }
          ]
        },
        "code": "1",
        "msg": "操作成功",
        "ctime": 1473842272273
      }

      var defer = $q.defer();

      //模拟服务器异步请求
      setTimeout(function() {
        defer.resolve(rep.data);
      }, 100);


      return defer.promise;

    }

  }])

}
