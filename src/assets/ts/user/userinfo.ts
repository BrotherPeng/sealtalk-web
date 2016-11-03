/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-file-upload/angular-file-upload.d.ts"/>

var userinfo = angular.module("webim.userinfo", []);

userinfo.controller("userinfoController", ["$scope", "$state", "mainServer", "mainDataServer", "conversationServer",
    function($scope: any, $state: angular.ui.IStateService, mainServer: mainServer, mainDataServer: mainDataServer, conversationServer:conversationServer) {

        $scope.$on("$viewContentLoaded", function() {
            angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[mainDataServer.loginUser.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
        });

        $scope.loginUser = mainDataServer.loginUser;

        $scope.editable = false;
        $scope.newName = mainDataServer.loginUser.nickName;

        $scope.edit = function() {
            $scope.editable = true;
            $scope.newName = mainDataServer.loginUser.nickName;
            setTimeout(function() {
                var ele = <any>document.getElementById("editName");
                ele.focus();
                ele.select();
            }, 0);
        }

        $scope.save = function() {
            if ($scope.modifyName.$valid) {
                mainServer.user.setNickName($scope.newName).success(function() {
                    mainDataServer.loginUser.nickName = $scope.newName;
                    mainDataServer.loginUser.firstchar = webimutil.ChineseCharacter.getPortraitChar($scope.newName);
                })
                $scope.editable = false;
            }

        }

        $scope.logout = function() {
            mainServer.user.logout().success(function() {
                webimutil.CookieHelper.removeCookie("loginuserid");//清除登录状态
                mainDataServer.loginUser = new webimmodel.UserInfo();//清除用户信息
                conversationServer.historyMessagesCache.length = 0;
                mainDataServer.conversation.totalUnreadCount = 0;
                if (window.Electron) {
                    window.Electron.webQuit();
                }
                $state.go("account.signin");
            })
        }

        $scope.back = function() {
            // $state.go("main");
            if($scope.editable){
              $scope.editable = false;
            }else{
              window.history.back();
            }
        }

    }])
