/// <reference path="../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="./main/controller.ts"/>

var webimApp = angular.module("webim", ["ui.router", "ui.event", "uiSwitch", "ng.shims.placeholder",
    "webim.main.directive", "webim.main.controller", "webim.main.server",
    "webim.conversation.controller", "webim.conversation.directive",
    "webim.addfirend", "webim.friendinfo",
    "webim.creategroup", "webim.addgroup", "webim.groupaddmember", "webim.goupinfo",
    "webim.userinfo", "webim.blacklist", "webim.notification", "webim.usermodifypassword",
    "webim.account", "webim.groupdelmember","treeControl","webim.organization"], function() {
    });

webimApp.config(["$provide", "$stateProvider", "$urlRouterProvider", "$httpProvider",
    function($provide: angular.auto.IProvideService, $stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $httpProvider: angular.IHttpProvider) {
        var baseUrl = window["__sealtalk_config"]["serverUrl"];
        var appkey = window["__sealtalk_config"]["appkey"];

        $provide.provider("appconfig", function() {
            this.$get = function() {
                return {
                    getBaseUrl: function() {
                        return baseUrl;
                    },
                    getAppKey: function() {
                        return appkey;
                    }
                }
            }
        });

        $httpProvider.defaults.withCredentials = true;
        var timeout:any = null;


        $urlRouterProvider.when("/main", ["$state", "mainDataServer", "mainServer", function($state: angular.ui.IStateService, mainDataServer: mainDataServer, mainServer: mainServer) {
            var userid = webimutil.CookieHelper.getCookie("loginuserid");
            if (userid) {
                if (!$state.is("main")) {
                    $state.go("main")
                }
                return;
            } else {
                $state.go("account.signin");
                // mainServer.user.logout().success(function () {
                //     webimutil.CookieHelper.removeCookie("loginuserid");
                //     mainDataServer.loginUser = new webimmodel.UserInfo();
                //     if (window.Electron) {
                //         window.Electron.webQuit();
                //     }
                //     $state.go("account.signin");
                // });
                return;
            }
        }]).when("/main/chat/:targetId/:targetType", ["$state", "$match", "mainDataServer",
            function($state: angular.ui.IStateService, $match: any, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                } else {
                    $state.transitionTo("main.chat", $match);
                }
            }]).when("/main/friendinfo/:userid/:groupid/:targetid/:conversationtype", ["$state", "$match", "mainDataServer", function($state: angular.ui.IStateService, $match: any, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                } else {
                    $state.transitionTo("main.friendinfo", $match);
                }
            }]).when("/main/editfriendinfo/:userid/:groupid/:targetid/:conversationtype", ["$state", "$match", "mainDataServer", function ($state: angular.ui.IStateService, $match: any, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
                else {
                    $state.transitionTo("main.editfriendinfo", $match);
                }
            }]).when("/main/groupinfo/:groupid/:conversationtype", ["$state", "$match", "mainDataServer", function($state: angular.ui.IStateService, $match: any, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                } else {
                    // $state.go("main.groupinfo", { groupid: $state.params["groupid"] });
                    $state.transitionTo("main.groupinfo", $match);
                }
            }]).when("/main/groupaddmember/:iscreate/:idorname", ["$state", "mainDataServer", function($state: angular.ui.IStateService, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
            }]).when("/main/groupdelmember/:idorname", ["$state", "mainDataServer", function($state: angular.ui.IStateService, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
            }]).when("/main/discussioninfo/:discussionid/:conversationtype", ["$state", "$match", "mainDataServer", function($state: angular.ui.IStateService, $match: any, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                } else {
                    // $state.go("main.groupinfo", { groupid: $state.params["groupid"] });
                    $state.transitionTo("main.discussioninfo", $match);
                }
            }]).when("/main/discussionaddmember/:iscreate/:idorname", ["$state", "mainDataServer", function($state: angular.ui.IStateService, mainDataServer: mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
            }]).when("/account", ["$state", function($state: angular.ui.IStateService) {
                $state.go("account.signin");
            }]).otherwise('main');


        $stateProvider.state("forgetPassword", {
            url: "/forgetPassword",
            templateUrl: "assets/views/forgetPassword.html"
        }).state("main", {
            url: '/main',
            templateUrl: 'assets/views/main.html',
            controller: 'mainController'
        }).state("main.chat", {
            url: '/chat/:targetId/:targetType',
            templateUrl: 'assets/views/chatBox.html',
            controller: 'conversationController'
        }).state("main.none", {
            url: "/none",
            template: '<div class="emptyBox"></div>'
        }).state("main.searchgroup", {
            url: "/searchgroup",
            templateUrl: 'assets/views/searchgroup.html',
            controller: 'searchgroupController'
        }).state("main.applygroup", {
            url: "/applygroup/:groupId/:groupName",
            templateUrl: "assets/views/applygroup.html",
            controller: "applygroupController"
        }).state("main.searchfriend", {
            url: '/searchfriend',
            templateUrl: "assets/views/searchfriend.html",
            controller: "searchfriendController"
        }).state("main.applyfriend", {
            url: "/applyfriend/:userId/:userName/:groupid/:targetid/:conversationtype",
            templateUrl: "assets/views/applyfriend.html",
            controller: "applyfriendController"
        }).state("main.creategroup", {
            url: "/creategroup",
            templateUrl: "assets/views/creategroup.html",
            controller: "creategroupController"
        }).state("main.groupaddmember", {
            url: "/groupaddmember/:iscreate/:idorname",
            templateUrl: "assets/views/groupaddmember.html",
            controller: "groupaddmemberController"
        }).state("main.groupdelmember", {
            url: "/groupdelmember/:idorname",
            templateUrl: "assets/views/groupdelmember.html",
            controller: "groupdelmemberController"
        }).state("main.groupinfo", {
            url: "/groupinfo/:groupid/:conversationtype",
            templateUrl: "assets/views/groupinfo.html",
            controller: "groupinfoController"
        }).state("main.groupbulletin", {
            url: "/groupbulletin/:groupid",
            templateUrl: "assets/views/groupbulletin.html",
            controller: "groupbulletinController"
        }).state("main.userinfo", {
            url: "/userinfo",
            templateUrl: "assets/views/userinfo.html",
            controller: "userinfoController"
        }).state("main.blacklist", {
            url: "/blacklist",
            templateUrl: "assets/views/blacklist.html",
            controller: "blacklistController"
        }).state("main.friendinfo", {
            url: "/friendinfo/:userid/:groupid/:targetid/:conversationtype",
            templateUrl: "assets/views/friendinfo.html",
            controller: "friendinfoController"
        }).state("main.editfriendinfo", {
            url: "/editfriendinfo/:userid/:groupid/:targetid/:conversationtype",
            templateUrl: "assets/views/editfriendinfo.html",
            controller: "editfriendinfoController"
        }).state("main.modifypassword", {
            url: '/modifypassword',
            templateUrl: "assets/views/modifypassword.html",
            controller: "modifypasswordController"
        }).state("main.notification", {
            url: "/notification",
            templateUrl: "assets/views/notification.html",
            controller: "notificationController"
        }).state('account', {
            url: '/account',
            templateUrl: 'assets/views/account.html',
            controller: ''
        }).state('account.signin', {
            url: '/signin',
            templateUrl: 'assets/views/signin.html',
            controller: 'signinController'
        }).state('account.signup', {
            url: '/signup',
            templateUrl: 'assets/views/signup.html',
            controller: 'signupController'
        }).state('account.forgotpassword', {
            url: '/forgotpassword',
            templateUrl: 'assets/views/forgotpassword.html',
            controller: 'forgotpasswordController'
        }).state('account.resetpassword', {
            url: '/resetpassword/:token',
            templateUrl: 'assets/views/resetpassword.html',
            controller: 'resetpasswordController'
        }).state("main.creatediscussion", {
            url: "/creatediscussion",
            templateUrl: "assets/views/creatediscussion.html",
            controller: "creatediscussionController"
        }).state("main.discussionaddmember", {
            url: "/discussionaddmember/:iscreate/:idorname",
            templateUrl: "assets/views/discussionaddmember.html",
            controller: "discussionaddmemberController"
        }).state("main.discussioninfo", {
            url: "/discussioninfo/:discussionid/:conversationtype",
            templateUrl: "assets/views/discussioninfo.html",
            controller: "discussioninfoController"
        })
        .state('main.searchmessage',{
           url:"/searchmessage/:targetid/:conversationtype/:searchstr",
           templateUrl:'assets/views/searchmessage.html',
           controller:'searchmessageController'
        })

    }]);
    // .run(function($rootScope: any, $state: angular.ui.IStateService, $stateParams: any) {
    //        $rootScope.$state = $state;
    //        $rootScope.$stateParams = $stateParams;
    //        $rootScope.$on("$stateChangeSuccess",  function(event: any, toState: any, toParams: any, fromState: any, fromParams: any) {
    //            // to be used for back button //won't work when page is reloaded.
    //            $rootScope.previousState_name = fromState.name;
    //            $rootScope.previousState_params = fromParams;
    //        });
    //        //back button function called from back button's ng-click="back()"
    //        $rootScope.back = function() {//实现返回的函数
    //            $state.go($rootScope.previousState_name,$rootScope.previousState_params);
    //        };
    //    });


function cancelScollStyle() {
    //取消滚动条弹性
    function getDirection(ev: any) {
        return ev.originalEvent.detail ? ev.originalEvent.detail > 0 : ev.originalEvent.wheelDelta < 0;
    }
    function bindScroll(ev: any) {
        var _top = $(this).scrollTop();
        var direction = getDirection(ev);
        var viewHeight = $(this).outerHeight();
        var height = $(this)[0].scrollHeight;

        if (_top == 0) {
            if (!direction) {
                ev.preventDefault();
            } else if ((viewHeight + _top) < height) {
                ev.stopPropagation();
            } else {
                ev.preventDefault();
            }
        } else {
            if ((viewHeight + _top) < height) {
                ev.stopPropagation();
            } else {
                if (direction) {
                    ev.preventDefault();
                } else {
                    ev.stopPropagation();
                }
            }
        }
    }
    var listScroll = ["body", "#functionBox", "#chatArea", "#Messages", ".main", ".chatArea", ".communicateList", ".arobase",".r-member-selected",".r-msg-list",".r-member-search",".r-group-info"];
    var len = listScroll.length;


    for (var i = 0; i < len; i++) {
        if (listScroll[i] == 'body') {
            $("body").on('mousewheel', bindScroll);
        }
        $(document.body).on('mousewheel', listScroll[i], bindScroll);
    }
}

webimApp.run(["RongIMSDKServer", "$state", "$rootScope", function(RongIMSDKServer: RongIMSDKServer, $state: angular.ui.IStateService, $rootScope: angular.IRootScopeService) {


    webimutil.NotificationHelper.requestPermission();

    RongIMLib.RongIMVoice.init();
    RongIMLib.RongIMEmoji.init();

    window._open_account_settings = function() {
        $state.go("main.userinfo");
    }

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            cancelScollStyle();
        });
}])

webimApp.filter('trustHtml', ["$sce", function($sce: angular.ISCEService) {
    return function(str: any) {
        return $sce.trustAsHtml(str);
    }
}]);

webimApp.filter("showTime", ["$filter", function($filter: angular.IFilterService) {
    return function(time: Date) {
        if(!time){
          return;
        }
        var today = new Date();
        if (time.toDateString() === today.toDateString()) {
            return $filter("date")(time, "HH:mm");
        } else {
            return $filter("date")(time, "MM-dd");
        }
    };
}]);

webimApp.filter("selectedNum", [function() {
    return function(arr: any[]) {
        var tmp = <any>{};
        tmp = arr.filter(function(item: any) { return item.isSelected; });
        return tmp.length;
    };

}]);

webimApp.filter("historyTime", ["$filter", function($filter: angular.IFilterService) {
    return function(time: Date) {
        if(!time){
          return;
        }
        var today = new Date();
        if (time.toDateString() === today.toDateString()) {
            return $filter("date")(time, "HH:mm");
        } else if (time.toDateString() === new Date(today.setTime(today.getTime() - 1)).toDateString()) {
            return "昨天" + $filter("date")(time, "HH:mm");
        } else {
            return $filter("date")(time, "yyyy-MM-dd HH:mm");
        }
    };
}]);
