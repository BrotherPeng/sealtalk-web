/// <reference path="../typings/tsd.d.ts"/>
var webimApp = angular.module("webim", ["ui.router", "ui.event", "uiSwitch", "ng.shims.placeholder",
    "webim.main.directive", "webim.main.controller", "webim.main.server",
    "webim.conversation.controller", "webim.conversation.directive",
    "webim.addfirend", "webim.friendinfo",
    "webim.creategroup", "webim.addgroup", "webim.groupaddmember", "webim.goupinfo",
    "webim.userinfo", "webim.blacklist", "webim.notification", "webim.usermodifypassword",
    "webim.account", "webim.groupdelmember", "treeControl", "webim.organization"], function () {
});
webimApp.config(["$provide", "$stateProvider", "$urlRouterProvider", "$httpProvider",
    function ($provide, $stateProvider, $urlRouterProvider, $httpProvider) {
        var baseUrl = window["__sealtalk_config"]["serverUrl"];
        var appkey = window["__sealtalk_config"]["appkey"];
        var navi = window["__sealtalk_config"]["navi"];
        var upload_image = window["__sealtalk_config"]["upload"]["image"];
        var upload_file = window["__sealtalk_config"]["upload"]["file"];
        var upload_fileServer = window["__sealtalk_config"]["upload"]["fileServer"];
        $provide.provider("appconfig", function () {
            this.$get = function () {
                return {
                    getBaseUrl: function () {
                        return baseUrl;
                    },
                    getAppKey: function () {
                        return appkey;
                    },
                    getNavi: function () {
                        return navi;
                    },
                    getUploadImage: function () {
                        return upload_image;
                    },
                    getUploadFile: function () {
                        return upload_file;
                    },
                    getUploadFileServer: function () {
                        return upload_fileServer;
                    }
                };
            };
        });
        $httpProvider.defaults.withCredentials = true;
        var timeout = null;
        $urlRouterProvider.when("/main", ["$state", "mainDataServer", "mainServer", function ($state, mainDataServer, mainServer) {
                var userid = webimutil.CookieHelper.getCookie("loginuserid");
                if (userid) {
                    if (!$state.is("main")) {
                        $state.go("main");
                    }
                    return;
                }
                else {
                    $state.go("account.signin");
                    return;
                }
            }]).when("/main/chat/:targetId/:targetType", ["$state", "$match", "mainDataServer",
            function ($state, $match, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
                else {
                    $state.transitionTo("main.chat", $match);
                }
            }]).when("/main/friendinfo/:userid/:groupid/:targetid/:conversationtype", ["$state", "$match", "mainDataServer", function ($state, $match, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
                else {
                    $state.transitionTo("main.friendinfo", $match);
                }
            }]).when("/main/editfriendinfo/:userid/:groupid/:targetid/:conversationtype", ["$state", "$match", "mainDataServer", function ($state, $match, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
                else {
                    $state.transitionTo("main.editfriendinfo", $match);
                }
            }]).when("/main/groupinfo/:groupid/:conversationtype", ["$state", "$match", "mainDataServer", function ($state, $match, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
                else {
                    $state.transitionTo("main.groupinfo", $match);
                }
            }]).when("/main/groupaddmember/:iscreate/:idorname", ["$state", "mainDataServer", function ($state, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
            }]).when("/main/groupdelmember/:idorname", ["$state", "mainDataServer", function ($state, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
            }]).when("/main/discussioninfo/:discussionid/:conversationtype", ["$state", "$match", "mainDataServer", function ($state, $match, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
                else {
                    $state.transitionTo("main.discussioninfo", $match);
                }
            }]).when("/main/discussionaddmember/:iscreate/:idorname", ["$state", "mainDataServer", function ($state, mainDataServer) {
                if (!mainDataServer.loginUser.nickName) {
                    $state.go("main");
                    return;
                }
            }]).when("/account", ["$state", function ($state) {
                $state.go("account.signin");
            }]).otherwise('main');
        $stateProvider.state("forgetPassword", {
            url: "/forgetPassword",
            templateUrl: "views/forgetPassword.html"
        }).state("main", {
            url: '/main',
            templateUrl: 'views/main.html',
            controller: 'mainController'
        }).state("main.chat", {
            url: '/chat/:targetId/:targetType',
            templateUrl: 'views/chatBox.html',
            controller: 'conversationController'
        }).state("main.none", {
            url: "/none",
            template: '<div class="emptyBox"></div>'
        }).state("main.searchgroup", {
            url: "/searchgroup",
            templateUrl: 'views/searchgroup.html',
            controller: 'searchgroupController'
        }).state("main.applygroup", {
            url: "/applygroup/:groupId/:groupName",
            templateUrl: "views/applygroup.html",
            controller: "applygroupController"
        }).state("main.searchfriend", {
            url: '/searchfriend',
            templateUrl: "views/searchfriend.html",
            controller: "searchfriendController"
        }).state("main.applyfriend", {
            url: "/applyfriend/:userId/:userName/:groupid/:targetid/:conversationtype",
            templateUrl: "views/applyfriend.html",
            controller: "applyfriendController"
        }).state("main.creategroup", {
            url: "/creategroup",
            templateUrl: "views/creategroup.html",
            controller: "creategroupController"
        }).state("main.groupaddmember", {
            url: "/groupaddmember/:iscreate/:idorname",
            templateUrl: "views/groupaddmember.html",
            controller: "groupaddmemberController"
        }).state("main.groupdelmember", {
            url: "/groupdelmember/:idorname",
            templateUrl: "views/groupdelmember.html",
            controller: "groupdelmemberController"
        }).state("main.groupinfo", {
            url: "/groupinfo/:groupid/:conversationtype",
            templateUrl: "views/groupinfo.html",
            controller: "groupinfoController"
        }).state("main.groupbulletin", {
            url: "/groupbulletin/:groupid",
            templateUrl: "views/groupbulletin.html",
            controller: "groupbulletinController"
        }).state("main.userinfo", {
            url: "/userinfo",
            templateUrl: "views/userinfo.html",
            controller: "userinfoController"
        }).state("main.blacklist", {
            url: "/blacklist",
            templateUrl: "views/blacklist.html",
            controller: "blacklistController"
        }).state("main.friendinfo", {
            url: "/friendinfo/:userid/:groupid/:targetid/:conversationtype",
            templateUrl: "views/friendinfo.html",
            controller: "friendinfoController"
        }).state("main.editfriendinfo", {
            url: "/editfriendinfo/:userid/:groupid/:targetid/:conversationtype",
            templateUrl: "views/editfriendinfo.html",
            controller: "editfriendinfoController"
        }).state("main.modifypassword", {
            url: '/modifypassword',
            templateUrl: "views/modifypassword.html",
            controller: "modifypasswordController"
        }).state("main.notification", {
            url: "/notification",
            templateUrl: "views/notification.html",
            controller: "notificationController"
        }).state('account', {
            url: '/account',
            templateUrl: 'views/account.html',
            controller: ''
        }).state('account.signin', {
            url: '/signin',
            templateUrl: 'views/signin.html',
            controller: 'signinController'
        }).state('account.signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'signupController'
        }).state('account.forgotpassword', {
            url: '/forgotpassword',
            templateUrl: 'views/forgotpassword.html',
            controller: 'forgotpasswordController'
        }).state('account.resetpassword', {
            url: '/resetpassword/:token',
            templateUrl: 'views/resetpassword.html',
            controller: 'resetpasswordController'
        }).state("main.creatediscussion", {
            url: "/creatediscussion",
            templateUrl: "views/creatediscussion.html",
            controller: "creatediscussionController"
        }).state("main.discussionaddmember", {
            url: "/discussionaddmember/:iscreate/:idorname",
            templateUrl: "views/discussionaddmember.html",
            controller: "discussionaddmemberController"
        }).state("main.discussioninfo", {
            url: "/discussioninfo/:discussionid/:conversationtype",
            templateUrl: "views/discussioninfo.html",
            controller: "discussioninfoController"
        })
            .state('main.searchmessage', {
            url: "/searchmessage/:targetid/:conversationtype/:searchstr",
            templateUrl: 'views/searchmessage.html',
            controller: 'searchmessageController'
        })
            .state('main.companyuserinfo', {
            url: "/companyuserinfo/:userid",
            templateUrl: "views/companyuserinfo.html",
            controller: "companyuserinfoController"
        });
    }]);
function cancelScollStyle() {
    function getDirection(ev) {
        return ev.originalEvent.detail ? ev.originalEvent.detail > 0 : ev.originalEvent.wheelDelta < 0;
    }
    function bindScroll(ev) {
        var _top = $(this).scrollTop();
        var direction = getDirection(ev);
        var viewHeight = $(this).outerHeight();
        var height = $(this)[0].scrollHeight;
        if (_top == 0) {
            if (!direction) {
                ev.preventDefault();
            }
            else if ((viewHeight + _top) < height) {
                ev.stopPropagation();
            }
            else {
                ev.preventDefault();
            }
        }
        else {
            if ((viewHeight + _top) < height) {
                ev.stopPropagation();
            }
            else {
                if (direction) {
                    ev.preventDefault();
                }
                else {
                    ev.stopPropagation();
                }
            }
        }
    }
    var listScroll = ["body", "#functionBox", "#chatArea", "#Messages", ".main", ".chatArea", ".communicateList", ".arobase", ".r-member-selected", ".r-msg-list", ".r-member-search", ".r-group-info"];
    var len = listScroll.length;
    for (var i = 0; i < len; i++) {
        if (listScroll[i] == 'body') {
            $("body").on('mousewheel', bindScroll);
        }
        $(document.body).on('mousewheel', listScroll[i], bindScroll);
    }
}
webimApp.run(["RongIMSDKServer", "$state", "$rootScope", function (RongIMSDKServer, $state, $rootScope) {
        webimutil.NotificationHelper.requestPermission();
        RongIMLib.RongIMVoice.init();
        RongIMLib.RongIMEmoji.init();
        window._open_account_settings = function () {
            $state.go("main.userinfo");
        };
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            cancelScollStyle();
        });
        window.BalloonClick = function (n) {
            if (n.data)
                $state.go("main.chat", { targetId: n.data.targetId, targetType: n.data.targetType });
        };
        window.logout = function () {
            RongIMLib.RongIMClient.getInstance().logout();
        };
    }]);
webimApp.filter('trustHtml', ["$sce", function ($sce) {
        return function (str) {
            return $sce.trustAsHtml(str);
        };
    }]);
webimApp.filter("showTime", ["$filter", function ($filter) {
        return function (time) {
            if (!time) {
                return;
            }
            var today = new Date();
            if (time.toDateString() === today.toDateString()) {
                return $filter("date")(time, "HH:mm");
            }
            else {
                return $filter("date")(time, "MM-dd");
            }
        };
    }]);
webimApp.filter("selectedNum", [function () {
        return function (arr) {
            var tmp = {};
            tmp = arr.filter(function (item) { return item.isSelected; });
            return tmp.length;
        };
    }]);
webimApp.filter("historyTime", ["$filter", function ($filter) {
        return function (time) {
            if (!time) {
                return;
            }
            var today = new Date();
            if (time.toDateString() === today.toDateString()) {
                return $filter("date")(time, "HH:mm");
            }
            else if (time.toDateString() === new Date(today.setTime(today.getTime() - 1)).toDateString()) {
                return "昨天" + $filter("date")(time, "HH:mm");
            }
            else {
                return $filter("date")(time, "yyyy-MM-dd HH:mm");
            }
        };
    }]);
var account = angular.module("webim.account", ["webim.main.server"]);
account.controller("signinController", ["$scope", "$state", "mainServer", "mainDataServer", "conversationServer", "RongIMSDKServer",
    function ($scope, $state, mainServer, mainDataServer, conversationServer, RongIMSDKServer) {
        $scope.user = {
            accountNumber: "",
            passWord: ""
        };
        $scope.userorpwdIsError = false;
        $scope.$watch("user.passWord", function (newVal, oldVal) {
            if (newVal == oldVal) {
                return;
            }
            else {
                $scope.userorpwdIsError = false;
            }
        });
        conversationServer.historyMessagesCache = {};
        mainDataServer.conversation.conversations = [];
        if (window.Electron) {
            window.Electron.updateBadgeNumber(0);
        }
        if (RongIMLib.RongIMClient && RongIMLib.RongIMClient.getInstance) {
            try {
                RongIMSDKServer.logout();
            }
            catch (e) {
            }
        }
        $scope.signin = function () {
            $scope.formSignin.submitted = true;
            webimutil.CookieHelper.removeCookie("loginuserid");
            mainDataServer.loginUser = new webimmodel.UserInfo();
            if ($scope.formSignin.$valid) {
                mainServer.user.signin($scope.user.accountNumber, "86", $scope.user.passWord).success(function (rep) {
                    if (rep.code === 200) {
                        mainDataServer.loginUser.id = rep.result.id;
                        mainDataServer.loginUser.token = rep.result.token;
                        mainDataServer.loginUser.phone = $scope.user.accountNumber;
                        var exdate = new Date();
                        exdate.setDate(exdate.getDate() + 30);
                        webimutil.CookieHelper.setCookie("loginuserid", rep.result.id, exdate.toGMTString());
                        webimutil.CookieHelper.setCookie("loginusertoken", rep.result.token, exdate.toGMTString());
                        webimutil.CookieHelper.setCookie("loginusermobile", $scope.user.accountNumber, exdate.toGMTString());
                        $state.go("main");
                    }
                    else if (rep.code === 1000) {
                        $scope.userorpwdIsError = true;
                    }
                    else {
                    }
                }).error(function (error, code) {
                    if (code == 400) {
                        webimutil.Helper.alertMessage.error("无效的手机号", 2);
                    }
                });
            }
        };
    }]);
account.controller("signupController", ["$scope", "$interval", "$state", "mainServer",
    function ($scope, $interval, $state, mainServer) {
        $scope.user = {
            nickname: "",
            phone: "",
            code: "",
            passWord: ""
        };
        $scope.$watch("user.code", function () {
            $scope.codeIsError = false;
        });
        $scope.signup = function () {
            $scope.formSignup.submitted = true;
            if ($scope.formSignup.$valid) {
                mainServer.user.verifyCode($scope.user.phone, "86", $scope.user.code).success(function (data) {
                    if (data.code == 200 && data.result.verification_token) {
                        mainServer.user.signup($scope.user.nickname, $scope.user.passWord, data.result.verification_token).
                            success(function (e) {
                            webimutil.Helper.alertMessage.success("注册成功", 2);
                            $state.go("account.signin");
                        }).error(function (e) {
                            webimutil.Helper.alertMessage.error("注册失败", 2);
                        });
                    }
                    else {
                        $scope.codeIsError = true;
                    }
                }).error(function (error, code) {
                    if (code == 403) {
                        webimutil.Helper.alertMessage.error("手机号已被注册过", 2);
                    }
                    else if (code == 404) {
                        $scope.codeIsError = true;
                    }
                    else {
                        $scope.codeIsError = true;
                    }
                });
            }
        };
    }]);
account.controller("forgotpasswordController", ["$scope", "$state", "mainServer",
    function ($scope, $state, mainServer) {
        $scope.user = {
            phone: "",
            code: ""
        };
        $scope.codeIsError = false;
        $scope.$watch("user.code", function () {
            $scope.codeIsError = false;
        });
        $scope.nextfun = function () {
            $scope.formFogot.submitted = true;
            if ($scope.formFogot.$valid) {
                mainServer.user.verifyCode($scope.user.phone, "86", $scope.user.code).success(function (res) {
                    if (res.code == 200 && res.result.verification_token) {
                        $state.go("account.resetpassword", { token: res.result.verification_token });
                    }
                    else {
                        $scope.codeIsError = true;
                    }
                }).error(function (e) {
                });
            }
        };
    }]);
account.controller("resetpasswordController", ["$scope", "$state", "$stateParams", "mainServer",
    function ($scope, $state, $stateParams, mainServer) {
        var token = $stateParams["token"];
        $scope.user = {
            newpassword: "",
            repassword: ""
        };
        $scope.submit = function () {
            $scope.formResetPwd.submitted = true;
            if ($scope.formResetPwd.$valid) {
                mainServer.user.resetPassword($scope.user.newpassword, token).success(function (req) {
                    if (req.code == 200) {
                        $state.go("account.signin");
                        webimutil.Helper.alertMessage.success("重置成功", 2);
                    }
                    else {
                        webimutil.Helper.alertMessage.error("重置失败", 2);
                    }
                }).error(function (error, code) {
                    if (code == 400) {
                        webimutil.Helper.alertMessage.error("重置失败", 2);
                    }
                    else if (code == 404) {
                        webimutil.Helper.alertMessage.error("重置失败", 2);
                    }
                });
            }
        };
    }]);
account.directive("usernameAvailable", ["$http", "$q", "mainServer",
    function ($http, $q, mainServer) {
        return {
            require: "ngModel",
            link: function (scope, ele, attr, ngModel) {
                if (ngModel) {
                    var usernameRegexp = /^[a-z0-9A-Z_]{4,64}$/;
                }
                var customValidator = function (value) {
                    var validity = ngModel.$isEmpty(value) || usernameRegexp.test(value);
                    ngModel.$setValidity("userformat", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);
                ngModel.$asyncValidators['uniqueUsername'] = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    return mainServer.user.checkUsernameAvailable(value).then(function resolved(res) {
                        if (res.data && res.data.result) {
                            return true;
                        }
                        else {
                            return $q.reject(res.data);
                        }
                    }, function rejected() {
                    });
                };
            }
        };
    }]);
account.directive("phoneAvailable", ["$http", "$q", "mainServer",
    function ($http, $q, mainServer) {
        return {
            require: "ngModel",
            link: function (scope, ele, attr, ngModel) {
                if (ngModel) {
                    var phoneRegexp = /^1[3-9][0-9]{9,9}$/;
                }
                var customValidator = function (value) {
                    var validity = ngModel.$isEmpty(value) || phoneRegexp.test(value);
                    ngModel.$setValidity("phoneformat", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);
                ngModel.$asyncValidators['uniquephone'] = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    return mainServer.user.checkPhoneAvailable(value, "86").then(function resolved(res) {
                        if (res.data && res.data.result) {
                            return true;
                        }
                        else {
                            return $q.reject(res.data);
                        }
                    }, function rejected() {
                    });
                };
            }
        };
    }]);
account.directive("phoneRegistered", ["$http", "$q", "mainServer",
    function ($http, $q, mainServer) {
        return {
            require: "ngModel",
            link: function (scope, ele, attr, ngModel) {
                if (ngModel) {
                    var phoneRegexp = /^1[3-9][0-9]{9,9}$/;
                }
                var customValidator = function (value) {
                    var validity = ngModel.$isEmpty(value) || phoneRegexp.test(value);
                    ngModel.$setValidity("phoneformat", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);
                ngModel.$asyncValidators['uniquephone'] = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    return mainServer.user.checkPhoneAvailable(value, "86").then(function resolved(res) {
                        if (res.data && res.data.result) {
                            return $q.reject(res.data);
                        }
                        else {
                            return true;
                        }
                    }, function rejected() {
                    });
                };
            }
        };
    }]);
account.directive("sendCodeButton", ["$interval", "mainServer", function ($interval, mainServer) {
        return {
            restrict: "E",
            scope: {
                phone: "=",
                region: "=",
                available: "=",
                startTime: "@timespan",
                loading: "="
            },
            template: '<span class="sendCode" ng-show="codeTime==0"  ng-click="sendCode()">' +
                '<a href="javascript:void 0">发送验证码</a>' +
                '</span>' +
                '<span class="sec" ng-show="codeTime>0">{{codeTime}} s</span>',
            link: function (scope, ele, attr) {
                scope.codeTime = 0;
                scope.startTime = scope.startTime || 60;
                scope.region = scope.region || "86";
                scope.sendCode = function () {
                    if (scope.codeTime == 0 && scope.available) {
                        mainServer.user.sendCode(scope.phone, "86").success(function (rep) {
                            if (rep.code == 200) {
                                scope.loading = true;
                                scope.codeTime = scope.startTime;
                                scope.interval = $interval(function () {
                                    if (scope.codeTime > 0) {
                                        scope.codeTime = scope.codeTime - 1;
                                    }
                                    else {
                                        scope.loading = false;
                                        $interval.cancel(scope.interval);
                                    }
                                }, 1000);
                            }
                            else if (rep.code == 5000) {
                                webimutil.Helper.alertMessage.error("发送频率过快，请稍后再发", 2);
                            }
                        }).error(function (error, code) {
                            if (code == 400) {
                                webimutil.Helper.alertMessage.error("无效手机号", 2);
                            }
                        });
                    }
                };
            }
        };
    }]);
/// <reference path="../typings/tsd.d.ts"/>
var webim;
(function (webim) {
    angular.module('webim').service('searchData', ["$q", "$http", "mainDataServer", "RongIMSDKServer", "organizationServer",
        function ($q, $http, mainDataServer, RongIMSDKServer, organizationServer) {
            var cacheData = {
                organization: {},
                contact: {},
                conversationByContent: {}
            };
            this.enableCache = false;
            this.searchContact = function (str) {
                var defer = $q.defer();
                if (this.enableCache && cacheData.contact[str]) {
                    defer.resolve(cacheData.contact[str]);
                }
                else {
                    organizationServer.search(str).then(function (data) {
                        var search = {};
                        search.includeMember = [];
                        mainDataServer.contactsList.groupList.forEach(function (item) {
                            var re = mainDataServer.contactsList.find(str, item.memberList) || [];
                            if (re.length > 0) {
                                search.includeMember.push({
                                    include: re[0].name,
                                    groupName: item.name,
                                    imgSrc: item.imgSrc,
                                    firstchar: item.firstchar,
                                    id: item.id
                                });
                            }
                        });
                        search.groupList = mainDataServer.contactsList.find(str, mainDataServer.contactsList.groupList) || [];
                        search.friendList = mainDataServer.contactsList.find(str, [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function (item) { return item.list; })));
                        this.enableCache && (cacheData.contact[str] = search);
                        defer.resolve(search);
                    });
                }
                return defer.promise;
            };
            this.searchOrganization = function (str) {
                var defer = $q.defer();
                if (this.enableCache && cacheData.organization[str]) {
                    defer.resolve(cacheData.organization[str]);
                }
                else {
                    organizationServer.search(str).then(function (data) {
                        var search;
                        search = data;
                        this.enableCache && (cacheData.organization[str] = search);
                        defer.resolve(search);
                    });
                }
                return defer.promise;
            };
            this.getConversationByContent = function (str) {
                var defer = $q.defer();
                if (this.enableCache && cacheData.conversationByContent[str]) {
                    defer.resolve(cacheData.conversationByContent[str]);
                }
                else {
                    RongIMSDKServer.getConversationByContent(str).then(function (data) {
                        this.enableCache && (cacheData.conversationByContent[str] = data);
                        defer.resolve(data);
                    });
                }
                return defer.promise;
            };
        }]);
})(webim || (webim = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var companyuserinfo = angular.module('webim');
companyuserinfo.controller('companyuserinfoController', ["$scope", "$state", "organizationData", "mainServer", "mainDataServer",
    function ($scope, $state, organizationData, mainServer, mainDataServer) {
        if (!mainDataServer.loginUser.nickName) {
            $state.go("main");
            return;
        }
        var userid = $state.params['userid'];
        $scope.user = {};
        angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[userid.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
        var user = organizationData.getUserById(userid);
        var dep = organizationData.getDepartmentById(user.deptId);
        user.deptName = dep.deptName;
        mainServer.user.getInfo(user.managerId).then(function (rep) {
            user.managerName = rep.data.result.nickname;
        });
        user.firstchar = user.displayName.charAt(0);
        $scope.user = user;
        $scope.back = function () {
            window.history.back();
        };
        $scope.toConversation = function () {
            $state.go("main.chat", { targetId: userid, targetType: 1 });
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var conversationCtr = angular.module("webim.conversation.controller", ["webim.main.server", "webim.conversation.server"]);
var IMGDOMAIN = window.__sealtalk_config.upload.image;
var FILEDOMAIN = window.__sealtalk_config.upload.file;
function adjustScrollbars() {
    var ele = document.getElementById("Messages");
    if (!ele)
        return;
    ele.style.height = document.documentElement.clientHeight -
        parseFloat(getComputedStyle(document.querySelector('.inputBox')).height) -
        parseFloat(getComputedStyle(document.querySelector('.box_hd')).height) + "px";
    ele.scrollTop = ele.scrollHeight;
}
conversationCtr.controller("conversationController", ["$scope", "$state", "mainDataServer", "conversationServer", "mainServer", "RongIMSDKServer", "$http", "$timeout", "$location", "$anchorScroll", "appconfig",
    function ($scope, $state, mainDataServer, conversationServer, mainServer, RongIMSDKServer, $http, $timeout, $location, $anchorScroll, appconfig) {
        // if (mainDataServer.scopeCache){
        //
        //     mainDataServer.scopeCache.$destroy();
        // }
        // console.log(mainDataServer.scopeCache);
        // mainDataServer.scopeCache = $scope;
        // mainDataServer.scopeCache=$scope;
        var targetId = $state.params["targetId"];
        var targetType = Number($state.params["targetType"]);
        var currentCon = new webimmodel.Conversation();
        mainDataServer.isTyping = false;
        currentCon.targetId = targetId;
        currentCon.targetType = targetType;
        $scope.currentConversation = currentCon;
        $scope.mainData = mainDataServer;
        var conversation = {};
        var pasteImgFile = null;
        var groupid = targetType == webimmodel.conversationType.Private ? "0" : targetId;
        var atArray = [];
        var isAtScroll = false;
        var rawGroutList;
        var lastMsgUid = null;
        $scope.cursorPos = -1;
        $scope.searchStr = '';
        $scope.lastSearchStr = '';
        $scope.defaultSearch = false;
        function initAtList() {
            if ($scope.groupInfo) {
                $scope.groupInfo = null;
            }
            $scope.groupInfo = mainDataServer.contactsList.getGroupById(groupid);
            if ($scope.groupInfo) {
                if (rawGroutList) {
                    rawGroutList = null;
                }
                rawGroutList = webimutil.Helper.cloneObject($scope.groupInfo.memberList);
                for (var i = rawGroutList.length - 1; i >= 0; i--) {
                    if (rawGroutList[i].id === mainDataServer.loginUser.id) {
                        rawGroutList.splice(i, 1);
                    }
                }
            }
            $scope.showGroupList = webimutil.Helper.cloneObject(rawGroutList);
        }
        $timeout(function () {
            if (groupid != "0") {
                initAtList();
                $scope.$watch('searchStr', function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    $scope.searchfriend(newVal);
                });
            }
        }, 300);
        $scope.initAtDiv = function () {
            var _atObj = $("#atList");
            if (_atObj) {
                var selItem = _atObj.find('.selected');
                if (selItem) {
                    selItem.removeClass('selected');
                }
                _atObj.scrollTop(0);
            }
            var objAtList = $('div.arobase').find('ul>li:first-child');
            objAtList.addClass('selected');
        };
        $scope.moveToItem = function (target) {
            if (target && target.$index) {
                var obj = $('div.arobase').find('ul');
                var selItem = obj.find('.selected');
                var nextItem = obj.find('li:nth-child(' + (target.$index + 1) + ')');
                if (nextItem.length) {
                    selItem.removeClass('selected');
                    nextItem.addClass('selected');
                }
            }
        };
        $scope.selectMember = function (item) {
            var obj = document.getElementById("message-content");
            var curPos = $scope.cursorPos;
            $scope.atShow = false;
            if ($scope.cursorPos == -1 || obj.textContent.length <= curPos) {
                $scope.currentConversation.draftMsg = obj.innerHTML + item.name + ' ';
            }
            else {
                var regS = new RegExp($scope.searchStr, "i");
                $scope.currentConversation.draftMsg = obj.textContent.slice(0, curPos) + item.name + ' ' + obj.textContent.slice(curPos).replace(regS, '');
            }
            var exitFlag = false;
            for (var i = 0; i < atArray.length; i++) {
                if (atArray[i].id == item.id) {
                    exitFlag = true;
                    break;
                }
            }
            if (!exitFlag) {
                atArray.push({ "id": item.id, "name": item.name, "everychar": item.everychar });
            }
            setTimeout(function () {
                $scope.setFocus(obj, curPos + item.name.length + 1);
            }, 0);
            $scope.cursorPos = -1;
            $scope.lastSearchStr = $scope.searchStr;
            $scope.defaultSearch = false;
            var _atObj = $("#atList");
            if (_atObj) {
                var selItem = _atObj.find('.selected');
                if (selItem) {
                    selItem.removeClass('selected');
                }
                _atObj.scrollTop(0);
            }
        };
        $scope.getCaretPosition = function (editableDiv) {
            var caretPos = 0, containerEl = null, sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    if (range.commonAncestorContainer.parentNode == editableDiv) {
                        caretPos = range.endOffset;
                    }
                }
            }
            else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                if (range.parentElement() == editableDiv) {
                    var tempEl = document.createElement("span");
                    editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                    var tempRange = range.duplicate();
                    tempRange.moveToElementText(tempEl);
                    tempRange.setEndPoint("EndToEnd", range);
                    caretPos = tempRange.text.length;
                }
            }
            return caretPos;
        };
        $scope.searchfriend = function (str) {
            if (!$scope.groupInfo.memberList) {
                return;
            }
            if (str == "") {
                $scope.showGroupList = webimutil.Helper.cloneObject(rawGroutList);
            }
            else {
                var list = mainDataServer.contactsList.find(str, rawGroutList);
                $scope.showGroupList = webimutil.Helper.cloneObject(list);
            }
            setTimeout(function () {
                var obj = $('div.arobase').find('ul>li:first-child');
                obj.addClass('selected');
            });
        };
        $scope.setFocus = function (el, pos) {
            el.focus();
            var range;
            var textNode = el.firstChild;
            if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
                range = document.createRange();
                if (pos == -1) {
                    range.selectNodeContents(el);
                }
                else {
                    range.setStart(textNode, pos);
                    range.setEnd(textNode, pos);
                }
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            else if (typeof document.body.createTextRange != "undefined") {
                range = document.selection.createRange();
                this.last = range;
                range.moveToElementText(el);
                range.select();
            }
        };
        if (webimutil.Helper.os.mac) {
            if (webimutil.Helper.browser.safari) {
                angular.element(document.getElementsByClassName("expressionWrap")).css("top", "-230px");
            }
        }
        else {
            angular.element(document.getElementsByClassName("expressionWrap")).css("top", "-250px");
            angular.element(document.getElementsByClassName("expressionWrap")).css("padding", "5px 18px");
        }
        $scope.messagesloading = true;
        $scope.showCutScreen = false;
        if (window.Electron && window.Electron.appInfo) {
            if (window.Electron.appInfo.version > '1.0.1') {
                $scope.showCutScreen = true;
            }
        }
        $scope.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        };
        RongIMSDKServer.getConversation(targetType, targetId).then(function (data) {
            if (!data) {
                var conv = mainDataServer.conversation.createConversation(targetType, targetId);
                mainDataServer.conversation.currentConversation = conv;
                $scope.currentConversation = conv;
            }
            else {
                mainDataServer.conversation.currentConversation = mainDataServer.conversation.getConversation(targetType, targetId) || mainDataServer.conversation.createConversation(targetType, targetId);
                $scope.currentConversation = mainDataServer.conversation.currentConversation;
            }
            $scope.currentConversation.draftMsg = RongIMSDKServer.getDraft(targetType, targetId) || '';
        }, function () {
            var conv = mainDataServer.conversation.createConversation(targetType, targetId);
            mainDataServer.conversation.currentConversation = conv;
            $scope.currentConversation = conv;
            $scope.currentConversation.draftMsg = RongIMSDKServer.getDraft(targetType, targetId) || '';
        });
        RongIMSDKServer.clearUnreadCount(targetType, targetId);
        conversationServer.historyMessagesCache[targetType + "_" + targetId] = conversationServer.historyMessagesCache[targetType + "_" + targetId] || [];
        $scope.conversationServer = conversationServer;
        var currenthis = conversationServer.historyMessagesCache[targetType + "_" + targetId];
        if (currenthis.length == 0) {
            conversationServer.getHistory(targetId, targetType, 0, 5).then(function (has) {
                if (has) {
                    conversationServer.unshiftHistoryMessages(targetId, targetType, new webimmodel.GetMoreMessagePanel());
                }
                conversationServer.conversationMessageList = currenthis;
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(currenthis);
                setTimeout(function () {
                    adjustScrollbars();
                    $scope.messagesloading = false;
                }, 0);
                var lastItem = conversationServer.conversationMessageListShow[conversationServer.conversationMessageListShow.length - 1];
                if (lastItem && lastItem.messageUId && lastItem.sentTime) {
                    conversationServer.sendReadReceiptMessage(targetId, targetType, lastItem.messageUId, lastItem.sentTime.getTime());
                    conversationServer.sendSyncReadStatusMessage(targetId, targetType, lastItem.sentTime.getTime());
                    lastMsgUid = lastItem.messageUId;
                }
            }, function (err) {
                conversationServer.conversationMessageList = currenthis;
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(currenthis);
                setTimeout(function () {
                    adjustScrollbars();
                }, 0);
            });
        }
        else {
            conversationServer.conversationMessageList = currenthis;
            conversationServer.conversationMessageListShow.length = 0;
            conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(currenthis);
            var lastItem = conversationServer.conversationMessageListShow[conversationServer.conversationMessageListShow.length - 1];
            if (lastItem && lastItem.messageUId && lastItem.sentTime) {
                conversationServer.sendReadReceiptMessage(targetId, targetType, lastItem.messageUId, lastItem.sentTime.getTime());
                conversationServer.sendSyncReadStatusMessage(targetId, targetType, lastItem.sentTime.getTime());
                lastMsgUid = lastItem.messageUId;
            }
            setTimeout(function () {
                adjustScrollbars();
                $scope.messagesloading = false;
            }, 0);
        }
        var atmsgs = conversationServer.atMessagesCache[targetType + "_" + targetId];
        if (atmsgs && atmsgs.length > 0) {
            var msgid = atmsgs[0].messageUId;
            setTimeout(function () {
                $scope.scrollTo(msgid);
            }, 0);
            atmsgs.length = 0;
        }
        $scope.tofriendinfo = function () {
            if ($scope.currentConversation.targetType == webimmodel.conversationType.Private) {
                $state.go("main.friendinfo", { userid: targetId, groupid: groupid, targetid: targetId, conversationtype: targetType });
            }
            else {
                $state.go("main.groupinfo", { groupid: targetId, conversationtype: targetType });
            }
        };
        $scope.touserinfo = function (userid) {
            $state.go("main.friendinfo", { userid: userid, groupid: groupid, targetid: targetId, conversationtype: targetType });
        };
        $scope.sendReadReceiptRequestMessage = function (uid) {
            if (targetType != webimmodel.conversationType.Group) {
                return;
            }
            var reqMsg = new RongIMLib.ReadReceiptRequestMessage({ messageUId: uid });
            RongIMSDKServer.sendMessage(targetType, targetId, reqMsg).then(function () {
            }, function (error) {
                console.log('sendReadReceiptRequestMessage error', error.errorCode);
            });
        };
        function sendReadReceiptResponseMessage() {
            if (targetType != webimmodel.conversationType.Group) {
                return;
            }
            RongIMSDKServer.sendReceiptResponse(targetType, targetId).then(function () {
            }, function (error) {
                console.log('sendReadReceiptResponseMessage error', error.errorCode);
            });
        }
        $scope.sendTypingStatusMessage = function () {
            if (targetType != webimmodel.conversationType.Private) {
                return;
            }
            var msg = RongIMLib.TypingStatusMessage.obtain('RC:TxtMsg', null);
            RongIMSDKServer.sendMessage(targetType, targetId, msg).then(function () {
            }, function (error) {
                console.log('sendTypingStatusMessage error', error.errorCode);
            });
        };
        $scope.sendRecallCommandMessage = function (uid) {
            if (targetType != webimmodel.conversationType.Private && targetType != webimmodel.conversationType.Group) {
                return;
            }
            var msg = new RongIMLib.RecallCommandMessage({ messageUId: uid });
            RongIMSDKServer.sendMessage(targetType, targetId, msg).then(function () {
            }, function (error) {
                console.log('sendRecallCommandMessage error', error.errorCode);
            });
        };
        function updateTargetDetail() {
            if (targetType == webimmodel.conversationType.Private) {
                var friend = mainDataServer.contactsList.getFriendById(targetId);
                var isself = friend ? null : mainDataServer.loginUser.id == targetId;
                if (friend) {
                    mainServer.friend.getProfile(targetId).success(function (data) {
                        var f = new webimmodel.Friend({ id: data.result.user.id, name: data.result.user.nickname, imgSrc: data.result.user.portraitUri });
                        f.displayName = data.result.user.displayName;
                        f.mobile = data.result.user.phone;
                        var fold = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
                        var fnew = webimutil.ChineseCharacter.getPortraitChar2(f.displayName || f.name);
                        if (fold != fnew) {
                            mainDataServer.contactsList.removeFriendFromSubgroup(friend);
                            f = mainDataServer.contactsList.updateOrAddFriend(f);
                            mainDataServer.conversation.updateConversationDetail(targetType, targetId, data.result.displayName || data.result.user.nickname, data.result.user.portraitUri);
                            conversationServer.updateHistoryMessagesCache(targetId, targetType, data.result.displayName || data.result.user.nickname, data.result.user.portraitUri);
                            var _member = new webimmodel.Member({
                                id: data.result.user.id,
                                name: data.result.user.nickname,
                                imgSrc: data.result.user.portraitUri
                            });
                            mainDataServer.contactsList.updateGroupMember(_member.id, _member);
                        }
                    });
                }
                else if (isself) {
                }
                else {
                    mainServer.user.getInfo(targetId).then(function (rep) {
                        var f = new webimmodel.Friend({ id: rep.data.result.id, name: rep.data.result.nickname, imgSrc: rep.data.result.portraitUri });
                        mainDataServer.conversation.updateConversationDetail(webimmodel.conversationType.Private, targetId, rep.data.result.displayName || rep.data.result.nickname, rep.data.result.portraitUri);
                        var _member = new webimmodel.Member({
                            id: rep.data.result.id,
                            name: rep.data.result.nickname,
                            imgSrc: rep.data.result.portraitUri
                        });
                        mainDataServer.contactsList.updateGroupMember(_member.id, _member);
                    });
                }
            }
            else if (targetType == webimmodel.conversationType.Group) {
                mainServer.group.getById(targetId).success(function (rep) {
                    mainDataServer.contactsList.updateGroupInfoById(targetId, new webimmodel.Group({
                        id: rep.result.id,
                        name: rep.result.name,
                        imgSrc: rep.result.portraitUri,
                        upperlimit: undefined,
                        fact: undefined,
                        creater: undefined
                    }));
                    mainDataServer.conversation.updateConversationDetail(webimmodel.conversationType.Group, targetId, rep.result.name, rep.result.portraitUri);
                    mainServer.group.getGroupMember(targetId).success(function (rep2) {
                        var members = rep2.result;
                        if (members) {
                            var item = mainDataServer.contactsList.getGroupById(targetId);
                            if (item) {
                                item.memberList.length = 0;
                            }
                        }
                        for (var j = 0, len = members.length; j < len; j++) {
                            var member = new webimmodel.Member({
                                id: members[j].user.id,
                                name: members[j].user.nickname,
                                imgSrc: members[j].user.portraitUri,
                                role: members[j].role,
                                displayName: members[j].displayName
                            });
                            mainDataServer.contactsList.addGroupMember(targetId, member);
                        }
                        initAtList();
                    });
                }).error(function () {
                });
            }
        }
        function addmessage(msg) {
            var hislist = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] || [];
            if (hislist.length == 0) {
                hislist.push(new webimmodel.GetHistoryPanel());
                if (msg.sentTime.toLocaleDateString() != (new Date()).toLocaleDateString())
                    hislist.push(new webimmodel.TimePanl(msg.sentTime));
            }
            conversationServer.addHistoryMessages(msg.targetId, msg.conversationType, msg);
            if (msg.messageType == webimmodel.MessageType.ImageMessage) {
                setTimeout(function () {
                    $scope.$broadcast("msglistchange");
                }, 200);
            }
            else {
                $scope.$broadcast("msglistchange");
            }
        }
        function packmysend(msg, msgType) {
            var msgouter = new RongIMLib.Message();
            msgouter.content = msg;
            msgouter.conversationType = targetType;
            msgouter.targetId = targetId;
            msgouter.sentTime = (new Date()).getTime() - RongIMLib.RongIMClient.getInstance().getDeltaTime();
            msgouter.messageDirection = RongIMLib.MessageDirection.SEND;
            msgouter.messageType = msgType;
            msgouter.senderUserId = mainDataServer.loginUser.id;
            msgouter.messageId = (RongIMLib.MessageIdHandler.messageId + 1).toString();
            return msgouter;
        }
        function appendmessage(msg) {
            var hislist = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] || [];
            if (hislist.length == 0) {
                hislist.push(new webimmodel.GetHistoryPanel());
                if (msg.sentTime.toLocaleDateString() != (new Date()).toLocaleDateString())
                    hislist.push(new webimmodel.TimePanl(msg.sentTime));
            }
            conversationServer.addHistoryMessages(msg.targetId, msg.conversationType, msg);
            if (msg.messageType == webimmodel.MessageType.ImageMessage) {
                setTimeout(function () {
                    $scope.$broadcast("msglistchange");
                }, 200);
            }
            else {
                $scope.$broadcast("msglistchange");
            }
        }
        function findInSelArr(name, arr, isdel) {
            var result = { 'exist': false, 'id': '0', 'name': '', 'everychar': '' };
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name == name) {
                    result.exist = true;
                    result.id = arr[i].id;
                    result.name = arr[i].name;
                    result.everychar = arr[i].everychar;
                    if (isdel) {
                        arr.splice(i, 1);
                    }
                    break;
                }
            }
            return result;
        }
        function getAtArray(item) {
            var strTmp = item.split('@');
            var atUserList = [];
            if (strTmp.length > 1) {
                for (var i = 1; i < strTmp.length; i++) {
                    var name = strTmp[i];
                    if (name.indexOf(' ') > -1) {
                        name = name.slice(0, name.indexOf(' '));
                    }
                    var result = findInSelArr(name, atArray, false);
                    if (result.exist) {
                        if (atUserList.indexOf(result.id) === -1) {
                            atUserList.push(result.id);
                        }
                    }
                }
            }
            return atUserList;
        }
        $scope.delAtContent = function (pos) {
            var item = $scope.currentConversation.draftMsg.slice(0, pos);
            var obj = document.getElementById("message-content");
            var strTmp = item.split('@');
            if (strTmp.length > 1) {
                var name = strTmp[strTmp.length - 1];
                var result = findInSelArr(name, atArray, true);
                if (result.exist) {
                    if (pos >= obj.textContent.length) {
                        obj.textContent = item.slice(0, item.lastIndexOf('@')) + $scope.currentConversation.draftMsg.slice(pos);
                        $scope.setFocus(obj, -1);
                    }
                    else {
                        obj.textContent = item.slice(0, item.lastIndexOf('@')) + $scope.currentConversation.draftMsg.slice(pos);
                        $scope.setFocus(obj, pos - strTmp[strTmp.length - 1].length - 1);
                    }
                    $scope.defaultSearch = true;
                }
            }
        };
        $scope.sendBtn = function () {
            var ele = document.querySelector(".no_network");
            if (ele && ele.style.visibility == 'visible') {
                return;
            }
            if ($('div.arobase').is(":visible")) {
                var _index = $('div.arobase').find('.selected').index();
                var curItem = $scope.showGroupList[_index];
                $scope.selectMember(curItem);
                return;
            }
            var _message = $scope.currentConversation.draftMsg;
            _message = _message.replace(/(^\s*)|(\s*$)/g, '');
            if (_message == '') {
                webimutil.Helper.alertMessage.error("消息内容不能为空", 2);
                return;
            }
            _message = _message.replace(/&lt;div&gt;/gi, '<br>').replace(/&lt;\/div&gt;/gi, '');
            _message = _message.replace(/^<br>$/i, "");
            _message = _message.replace(/<br>/gi, "\n");
            _message = _message.replace(/&amp;/gi, "&");
            _message = _message.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
            $scope.showemoji = false;
            if (!targetType && !targetId) {
                webimutil.Helper.alertMessage.error("请选择一个会话对象", 2);
                return;
            }
            var con = RongIMLib.RongIMEmoji.symbolToEmoji(_message);
            if (con == "") {
                return;
            }
            var msg = RongIMLib.TextMessage.obtain(con);
            var atFlag = false;
            var atUserList = getAtArray(con);
            if (atUserList && atUserList.length > 0) {
                atFlag = true;
            }
            if (atFlag) {
                var mentioneds = new RongIMLib.MentionedInfo();
                mentioneds.type = webimmodel.AtTarget.Part;
                mentioneds.userIdList = atUserList;
                msg.mentionedInfo = mentioneds;
            }
            var msgouter = packmysend(msg, webimmodel.MessageType.TextMessage);
            var appendMsg = webimmodel.Message.convertMsg(msgouter);
            appendMsg.sentStatus = webimmodel.SentStatus.SENDING;
            conversationServer.addHistoryMessages(targetId, targetType, appendMsg);
            $scope.$emit("msglistchange");
            $scope.currentConversation.draftMsg = "";
            var obj = document.getElementById("message-content");
            webimutil.Helper.getFocus(obj);
            $scope.mainData.conversation.updateConStaticBeforeSend(appendMsg, true);
            RongIMSDKServer.sendMessage(targetType, targetId, msg, atFlag && (targetType == webimmodel.conversationType.Group || targetType == webimmodel.conversationType.Discussion)).then(function (msg) {
                atArray = [];
                conversationServer.updateSendStatus(targetId, targetType, appendMsg.messageId, webimmodel.SentStatus.FAILED);
                var _message = webimmodel.Message.convertMsg(msg);
                conversationServer.messageAddUserInfo(_message);
                $scope.mainData.conversation.updateConStatic(_message, true, true);
                conversationServer.updateSendMessage(targetId, targetType, _message);
            }, function (error) {
                var content = '';
                conversationServer.updateSendStatus(targetId, targetType, appendMsg.messageId, webimmodel.SentStatus.FAILED);
                switch (error.errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        break;
                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                        content = "您的消息已经发出，但被对方拒收";
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                        content = "你不在该群组中";
                        break;
                    default:
                }
                console.log('消息发送失败,错误代码:' + error.errorCode);
                if (content) {
                    var msg = webimutil.Helper.cloneObject(error.message);
                    msg.content = content;
                    msg.panelType = webimmodel.PanelType.InformationNotification;
                    appendmessage(msg);
                }
            });
        };
        $scope.back = function () {
            $state.go("main");
        };
        $scope.sendImg = function () {
        };
        $scope.showPasteDiv = function (visible) {
            var pic = document.getElementsByClassName("previewPic")[0];
            var picBackground = document.getElementsByClassName("previewPicLayer")[0];
            if (visible) {
                pic.style.visibility = "visible";
                picBackground.style.visibility = "visible";
                pic.focus();
            }
            else {
                pic.style.visibility = "hidden";
                picBackground.style.visibility = "hidden";
                showLoading(false);
            }
        };
        $scope.uploadPasteImage = function () {
            var reg = new RegExp('^data:image/[^;]+;base64,');
            var picContent = document.getElementsByClassName("picContent")[0];
            var base64Code = picContent.src;
            base64Code = base64Code.replace(reg, '');
            showLoading(true);
            uploadBase64(base64Code, pasteImgFile);
        };
        $scope.takeScreenShot = function () {
            if (window.Electron) {
                if (typeof window.Electron.screenShot === "undefined") {
                    console.log('您的app版本过低,不支持截图功能');
                    return;
                }
                window.Electron.screenShot();
            }
        };
        $scope.$on('showPasteDiv', function (event, visible) {
            $scope.showPasteDiv(visible);
        });
        $scope.$on('uploadPasteImage', function (event) {
            $scope.uploadPasteImage();
        });
        function showLoading(visible) {
            var loading = document.getElementsByClassName("load-container")[0];
            if (visible) {
                loading.style.visibility = "visible";
            }
            else {
                loading.style.visibility = "hidden";
            }
        }
        $scope.getHistoryMessage = function () {
            conversationServer.historyMessagesCache[targetType + "_" + targetId] = [];
            var _pullMessageTime = conversationServer.getLastMessageTime(targetId, targetType);
            conversationServer.getHistory(targetId, targetType, _pullMessageTime, 10).then(function (has) {
                conversationServer.conversationMessageList = conversationServer.historyMessagesCache[targetType + "_" + targetId];
                if (has) {
                    conversationServer.unshiftHistoryMessages(targetId, targetType, new webimmodel.GetMoreMessagePanel());
                }
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(conversationServer.conversationMessageList);
            });
        };
        $scope.getMoreMessage = function () {
            conversationServer.historyMessagesCache[targetType + "_" + targetId].shift();
            var _pullMessageTime = conversationServer.getLastMessageTime(targetId, targetType);
            conversationServer.getHistory(targetId, targetType, _pullMessageTime, 10).then(function (has) {
                if (has) {
                    conversationServer.unshiftHistoryMessages(targetId, targetType, new webimmodel.GetMoreMessagePanel());
                }
                var ele = document.getElementById("Messages");
                if (!ele)
                    return;
                var scrollRemaining = ele.scrollHeight - ele.scrollTop;
                conversationServer.conversationMessageListShow.length = 0;
                conversationServer.conversationMessageListShow = webimutil.Helper.cloneObject(conversationServer.conversationMessageList);
                $timeout(function () {
                    ele.scrollTop = ele.scrollHeight - scrollRemaining;
                }, 0);
            });
        };
        $scope.$on("msglistchange", function () {
            setTimeout(function () {
                adjustScrollbars();
            }, 0);
        });
        $scope.showemoji = false;
        document.addEventListener("click", function (e) {
            if ($scope.showemoji && e.target.className != "iconfont-smile") {
                $scope.$apply(function () {
                    $scope.showemoji = false;
                });
            }
            if ($scope.atShow) {
                $scope.$apply(function () {
                    $scope.atShow = false;
                    $scope.initAtDiv();
                });
            }
        });
        $scope.emojiList = RongIMLib.RongIMEmoji.emojis.slice(0, 60);
        $scope.uploadStatus = {
            show: false,
            progress: 0,
            cancle: function () {
                $scope.uploadStatus.show = false;
                $scope.uploadStatus.progress = 0;
            }
        };
        RongIMLib.RongUploadLib.getFileUrl = function (info, callback) {
            var str = info.rc_url.path;
            var url = appconfig.getUploadFile() + str;
            callback.onSuccess(url);
        };
        RongIMLib.RongUploadLib.uploadAjax = function (base64, callback) {
            var url = appconfig.getUploadImage() + "base64.php";
            var xhr = new XMLHttpRequest();
            xhr.open("post", url, true);
            xhr.onload = function (data, ret) {
                callback(JSON.parse(xhr.responseText));
            };
            xhr.send(encodeURIComponent(base64));
        };
        RongIMLib.RongUploadLib.getInstance().setListeners({
            onFileAdded: function (file) {
                RongIMLib.RongUploadLib.getInstance().start($scope.currentConversation.targetType, $scope.currentConversation.targetId);
                if (file.uploadType == 'IMAGE') {
                    return;
                }
                var msg = new webimmodel.Message();
                msg.conversationType = $scope.currentConversation.targetType;
                msg.objectName = 'RC:FileMsg';
                msg.messageDirection = webimmodel.MessageDirection.SEND;
                msg.messageId = file.id;
                msg.messageUId = file.id;
                msg.senderUserId = mainDataServer.loginUser.id;
                msg.sentTime = new Date();
                msg.targetId = $scope.currentConversation.targetId;
                msg.messageType = webimmodel.MessageType.FileMessage;
                var filemsg = new webimmodel.FileMessage();
                filemsg.name = file.oldName || file.name;
                filemsg.size = file.size;
                filemsg.type = file.name.replace(/.+\./, "").toLowerCase();
                filemsg.state = webimmodel.FileState.Uploading;
                msg.content = filemsg;
                addmessage(msg);
                $scope.$apply();
            },
            onBeforeUpload: function (file) {
                if (file.uploadType == 'IMAGE') {
                    $scope.uploadStatus.show = true;
                    $scope.$apply();
                }
            },
            onUploadProgress: function (file) {
                if (file.uploadType == 'IMAGE') {
                    $scope.uploadStatus.progress = file.percent + "%";
                }
                else if (file.percent > 0) {
                    var item = conversationServer.getMessageById($scope.currentConversation.targetId, $scope.currentConversation.targetType, file.id);
                    item.content.extra = file.percent + "%";
                    item.content.state = item.content.state == webimmodel.FileState.Uploading ? -1 : webimmodel.FileState.Uploading;
                }
                if (item && file.percent == 100) {
                    $scope.mainData.conversation.updateConStaticBeforeSend(item, true);
                    item.sentStatus = webimmodel.SentStatus.SENDING;
                    $('#' + item.conversationType + '_' + item.targetId).find('.no-remind').siblings('span').removeClass().addClass("message_statue_sending");
                    setTimeout(function () {
                        $('#' + item.messageId).find('.message_statue_position').removeClass().addClass("message_statue_position").addClass("message_statue_sending");
                    }, 0);
                }
                setTimeout(function () {
                    $scope.$apply();
                });
            },
            onFileUploaded: function (file, message, err) {
                if (file.uploadType == 'IMAGE') {
                    $scope.uploadStatus.show = false;
                    $scope.uploadStatus.progress = 0;
                }
                else {
                    var item = conversationServer.getMessageById($scope.currentConversation.targetId, $scope.currentConversation.targetType, file.id);
                    item.content.fileUrl = message.content.fileUrl;
                    item.content.state = webimmodel.FileState.Success;
                    $scope.mainData.conversation.updateConStatic(webimmodel.Message.convertMsg(message), true, true);
                }
                if (message.messageType == webimmodel.MessageType.ImageMessage) {
                    conversationServer.addHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType, webimmodel.Message.convertMsg(message));
                    setTimeout(function () {
                        $scope.$emit("msglistchange");
                        $scope.$emit("conversationChange");
                    }, 200);
                }
                if (err && item) {
                    item.sentStatus = webimmodel.SentStatus.FAILED;
                    $('#' + item.conversationType + '_' + item.targetId).find('.no-remind').siblings('span').removeClass().addClass("message_statue_unsend");
                    setTimeout(function () {
                        $('#' + item.messageId).find('.message_statue_position').removeClass().addClass("message_statue_position").addClass("message_statue_unsend");
                    }, 0);
                }
                else if (message && item) {
                    item.sentStatus = webimmodel.SentStatus.SENT;
                    $('#' + item.conversationType + '_' + item.targetId).find('.no-remind').siblings('span').removeClass();
                    setTimeout(function () {
                        $('#' + item.messageId).find('.message_statue_position').removeClass().addClass("message_statue_position");
                    }, 0);
                }
                $scope.$apply();
            },
            onError: function (up, err, errTip) {
                if (up.files[0].uploadType == 'IMAGE') {
                    $scope.uploadStatus.show = false;
                    webimutil.Helper.alertMessage.error("上传图片出错！", 2);
                }
                else {
                    for (var i = 0; i < up.files.length; i++) {
                        var item = conversationServer.getMessageById($scope.currentConversation.targetId, $scope.currentConversation.targetType, up.files[i].id);
                        if (item) {
                            item.content.state = webimmodel.FileState.Failed;
                        }
                    }
                }
            },
            onUploadComplete: function () {
            }
        });
        RongIMLib.RongUploadLib.getInstance().reload('IMAGE', 'FILE');
        function uploadBase64(strBase64, file) {
            RongIMLib.RongUploadLib.getInstance().postImage(strBase64, file, $scope.currentConversation.targetType, $scope.currentConversation.targetId, function (ret, msg, err) {
                showLoading(false);
                if (err) {
                    webimutil.Helper.alertMessage.error("上传图片出错！", 2);
                    return;
                }
                $scope.showPasteDiv(false);
                conversationServer.addHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType, webimmodel.Message.convertMsg(msg));
                setTimeout(function () {
                    $scope.$emit("msglistchange");
                    $scope.$emit("conversationChange");
                }, 200);
                $scope.$apply();
            });
        }
        window.upload_base64 = function () {
            var obj = document.getElementById("message-content");
            if (obj) {
                obj.focus();
                document.execCommand("Paste");
            }
        };
        setTimeout(function () {
            var obj = document.getElementById("message-content");
            webimutil.Helper.getFocus(obj);
        });
        function handlePaste(e) {
            var reg = new RegExp('^data:image/[^;]+;base64,');
            var hasImg = false;
            if (!e.clipboardData.items) {
                return;
            }
            for (var i = 0; i < e.clipboardData.items.length; i++) {
                var item = e.clipboardData.items[i];
                if (item.type.indexOf("image") > -1) {
                    var fr = new FileReader;
                    var data = item.getAsFile();
                    fr.onloadend = function () {
                        var base64Code = fr.result;
                        var picContent = document.getElementsByClassName("picContent")[0];
                        picContent.src = base64Code;
                        $scope.showPasteDiv(true);
                    };
                    fr.readAsDataURL(data);
                    pasteImgFile = data;
                    e.preventDefault();
                    hasImg = true;
                    break;
                }
            }
        }
        document.getElementById("message-content").addEventListener("paste", handlePaste);
        $scope.$on("$destroy", function () {
            conversationServer.clearHistoryMessages($scope.currentConversation.targetId, $scope.currentConversation.targetType);
            if (targetType == webimmodel.conversationType.Group) {
                var lastItem = conversationServer.conversationMessageListShow[conversationServer.conversationMessageListShow.length - 1];
                var haNew = (lastItem && lastMsgUid != lastItem.messageUId);
                if (lastItem && lastItem.messageUId && lastItem.sentTime && haNew) {
                    conversationServer.sendSyncReadStatusMessage(targetId, targetType, lastItem.sentTime.getTime());
                }
            }
        });
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var conversationDire = angular.module("webim.conversation.directive", ["webim.main.server", "webim.conversation.server"]);
conversationDire.directive('onFinishRenderFilters', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }]);
conversationDire.directive('atshowDire', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            scope.atShow = false;
            scope.initAtDiv();
            element.bind("click", function (e) {
                scope.cursorPos = document.getSelection().focusOffset;
            });
            var _scrollTop = 0;
            element.bind("keydown", function (e) {
                if (scope.atShow && (e.keyCode == 38 || e.keyCode == 40)) {
                    var obj = $(e.target).parent().find('div.arobase>ul');
                    var selItem = obj.find('.selected');
                    var nextItem;
                    if (selItem.length == 0) {
                        selItem = obj.find('li:first-child');
                    }
                    if (selItem.length) {
                        if (e.keyCode == 38) {
                            nextItem = selItem.prev();
                        }
                        else if (e.keyCode == 40) {
                            nextItem = selItem.next();
                        }
                        if (nextItem.length) {
                            selItem.removeClass('selected');
                            nextItem.addClass('selected');
                        }
                        if (nextItem && nextItem.position()) {
                            var _target = $("#atList"), _offsetTop = nextItem.position().top;
                            if (nextItem.index() == 1) {
                                _scrollTop = 0;
                            }
                            if (_offsetTop >= _target.height()) {
                                _scrollTop += 36;
                                _target.scrollTop(_scrollTop);
                            }
                            else if (_offsetTop < 0) {
                                _scrollTop -= 36;
                                _target.scrollTop(_scrollTop);
                            }
                        }
                    }
                    e.preventDefault();
                    return;
                }
            });
            element.bind("keyup", function (e) {
                var keyCode = e.keyCode;
                var obj = document.getElementById("message-content");
                var caretPos = scope.getCaretPosition(obj);
                if (!scope.showGroupList) {
                    return;
                }
                if (obj.textContent.length > 500 && keyCode != 8) {
                    e.preventDefault();
                    return;
                }
                if (e.keyCode == 38 || e.keyCode == 40) {
                    e.preventDefault();
                    return;
                }
                if (obj.textContent.substr(caretPos - 1, 1) == '@') {
                    var lastChar = '';
                    if (caretPos > 1) {
                        lastChar = obj.textContent.substr(caretPos - 2, 1);
                        var regExp = /^[A-Za-z0-9]+$/;
                        if (regExp.test(lastChar)) {
                            return;
                        }
                    }
                    scope.atShow = true;
                    var _atObj = $(e.target).parent().find('div.arobase>ul');
                    var selItem = _atObj.find('.selected');
                    if (selItem.length == 0) {
                        $("#atList").scrollTop(0);
                        var objAtList = $('div.arobase').find('ul>li:first-child');
                        objAtList.addClass('selected');
                    }
                    scope.searchStr = scope.defaultSearch ? scope.lastSearchStr : '';
                    scope.cursorPos = caretPos;
                    scope.$apply();
                    var obj = document.getElementById("message-content");
                    var hidInput = document.getElementById("TestInput");
                    var styleObj = window.getComputedStyle(obj, null);
                    var lineWidth = obj.clientWidth - 80;
                    var sel = document.getSelection(), text = obj.textContent.slice(0, sel.focusOffset);
                    hidInput.style.visibility = 'visible';
                    hidInput.innerText = text;
                    hidInput.style.fontSize = styleObj.getPropertyValue('font-size');
                    hidInput.style.fontFamily = styleObj.getPropertyValue('font-family');
                    hidInput.style.visibility = 'hidden';
                    var actWidth = (hidInput.clientWidth + 1) % lineWidth;
                    var lineNum = (hidInput.clientWidth + 1) / lineWidth;
                    var atDivHeight = scope.showGroupList.length > 6 ? 36 * 6 : 36 * scope.showGroupList.length;
                    $('div.arobase').css('bottom', obj.clientHeight - lineNum * hidInput.clientHeight);
                    $('div.arobase').css('left', actWidth);
                }
                else {
                    if (!scope.atShow) {
                        var obj = document.getElementById("message-content");
                        var text = obj.textContent.slice(0, caretPos);
                        if (keyCode == 8 && text.indexOf('@') > -1) {
                            scope.delAtContent(caretPos);
                        }
                        else if (keyCode !== 16) {
                            scope.defaultSearch = false;
                        }
                        scope.$apply();
                        return;
                    }
                    if (keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode == 32 || keyCode == 13) {
                        var text = obj.textContent.slice(0, caretPos);
                        var strTmp = text.split('@');
                        if (strTmp.length > 1) {
                            var name = strTmp[strTmp.length - 1];
                            scope.searchStr = name;
                            scope.$apply();
                        }
                    }
                    else if (keyCode == 8 && scope.searchStr) {
                        if (scope.searchStr.length > 0) {
                            scope.searchStr = scope.searchStr.substr(0, scope.searchStr.length - 1);
                            scope.$apply();
                        }
                    }
                    else if (keyCode != 16) {
                        scope.atShow = false;
                        scope.initAtDiv();
                    }
                }
            });
        }
    };
});
conversationDire.directive("tagInput", function () {
    return {
        restrict: "E",
        template: '<div class="input-tag" data-ng-repeat=\"tag in tagArray()\">{{tag}}</div>',
        scope: {
            inputTags: '=taglist',
            autocomplete: '=autocomplete'
        }, link: function ($scope, ele, attrs) {
            $scope.defaultWidth = 200;
            if ($scope.autocomplete) {
            }
            $scope.tagArray = function () {
                if ($scope.inputTags === undefined) {
                    return [];
                }
                return $scope.inputTags.split(',').filter(function (tag) {
                    return tag !== "";
                });
            };
            $scope.addTag = function () {
                var tagArray;
                if ($scope.tagText.length === 0) {
                    return;
                }
                tagArray = $scope.tagArray();
                tagArray.push($scope.tagText);
                $scope.inputTags = tagArray.join(',');
                return $scope.tagText = "";
            };
            $scope.deleteTag = function (key) {
                var tagArray;
                tagArray = $scope.tagArray();
                if (tagArray.length > 0 && $scope.tagText.length === 0 && key === undefined) {
                    tagArray.pop();
                }
                else {
                    if (key !== undefined) {
                        tagArray.splice(key, 1);
                    }
                }
                return $scope.inputTags = tagArray.join(',');
            };
            ele.bind("keydown", function (e) {
                var key;
                key = e.which;
                if (key === 9 || key === 13) {
                    e.preventDefault();
                }
                if (key === 8) {
                    return $scope.$apply('deleteTag()');
                }
            });
        }
    };
});
conversationDire.directive("conversationItem", ["$timeout", function ($timeout) {
        return {
            restrict: "EA",
            templateUrl: 'views/messagetemplate.html',
            scope: {
                item: "="
            }, link: function (scope, ele, attrs) {
                if (scope.item.senderUserId) {
                    $timeout(function () {
                        angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.senderUserId.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                    }, 50);
                }
                scope.sendReadReceiptRequestMessage = function (uid) {
                    scope.$parent.sendReadReceiptRequestMessage(uid);
                };
            }
        };
    }]);
conversationDire.directive('contenteditableDire', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            function replacemy(e) {
                return e.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            var domElement = element[0];
            var lastSendTime, counter = 0;
            element.bind('input propertychange keydown', function () {
                //发送正在输入消息
                if (lastSendTime && (new Date()).getTime() - lastSendTime > 6000) {
                    scope.sendTypingStatusMessage();
                    lastSendTime = (new Date()).getTime();
                }
                else if (!lastSendTime) {
                    lastSendTime = (new Date()).getTime();
                    scope.sendTypingStatusMessage();
                }
                if (domElement.innerHTML == attrs["placeholder"] || domElement.innerHTML === '' || domElement.innerHTML == '<br>') {
                    element.empty();
                }
                else {
                    domElement.style.color = "";
                }
            });
            if (!ngModel)
                return;
            element.bind("paste", function (e) {
                var content = '', hasImg = false, items = (e.clipboardData || e.originalEvent.clipboardData).items;
                if (items) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (item.type.indexOf("image") > -1) {
                            hasImg = true;
                            break;
                        }
                    }
                }
                e.preventDefault();
                if (!hasImg) {
                    if ((e.originalEvent || e).clipboardData) {
                        content = (e.originalEvent || e).clipboardData.getData('text/plain');
                        document.execCommand('insertText', false, content);
                    }
                    else if (window.clipboardData) {
                        content = window.clipboardData.getData('Text');
                        document.selection.createRange().pasteHTML(content);
                    }
                }
            });
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            webimutil.Helper.browser.msie ? element.bind("keyup paste", read) : element.bind("input", read);
            function read() {
                var html = element.html();
                html = html.replace(/^<br>$/i, "");
                html = html.replace(/<br>/gi, "\n");
                html = replacemy(html);
                if (attrs["stripBr"] && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});
conversationDire.directive("preplaceholderasdfrs", [function () {
        return {};
    }]);
conversationDire.directive("ctrlEnterKeys", ["$timeout", "mainDataServer", "conversationServer", function ($timeout, mainDataServer, conversationServer) {
        return {
            restrict: "A",
            require: '?ngModel',
            scope: {
                fun: "&",
                ctrlenter: "=",
                content: "="
            },
            link: function (scope, element, attrs, ngModel) {
                scope.ctrlenter = scope.ctrlenter || false;
                element.bind("keypress", function (e) {
                    if (scope.ctrlenter) {
                        if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                            scope.fun();
                            scope.$parent.$apply();
                            e.preventDefault();
                        }
                    }
                    else {
                        if (e.ctrlKey === false && e.shiftKey === false && (e.keyCode === 13 || e.keyCode === 10)) {
                            scope.fun();
                            scope.$parent.$apply();
                            e.preventDefault();
                        }
                        else if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        }
                    }
                });
            }
        };
    }]);
conversationDire.directive("emoji", [function () {
        return {
            restrict: "E",
            scope: {
                item: "="
            },
            template: '<div style="display:inline-block"></div>',
            replace: true,
            link: function (scope, ele, attr) {
                ele.append(scope.item);
                ele.on("click", function () {
                    scope.$parent.currentConversation.draftMsg = scope.$parent.currentConversation.draftMsg.replace(/\n$/, "");
                    scope.$parent.currentConversation.draftMsg = scope.$parent.currentConversation.draftMsg + scope.item.children[0].getAttribute("name");
                    scope.$parent.$apply();
                    var obj = document.getElementById("message-content");
                    webimutil.Helper.getFocus(obj);
                });
                if (webimutil.Helper.os.mac) {
                    if (webimutil.Helper.browser.safari) {
                        angular.element(ele[0]).css("padding-top", "5px");
                    }
                }
                else {
                    angular.element(ele[0]).css("padding-bottom", "5px");
                    angular.element(ele[0]).css("padding-right", "4px");
                }
            }
        };
    }]);
conversationDire.directive("voiceMessage", ["$timeout", function ($timeout) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<div class="">' +
                '<div class="Message-audio">' +
                '<span class="Message-entry" style="">' +
                '<span class="audioBox clearfix"  ng-class="{\'animate\':isplaying}" ng-click="play()"><i></i><i></i><i></i><i></i></span>' +
                '<span class="audioTimer">{{item.duration}}”</span><span class="audioState" ng-show="item.isUnReade"></span>' +
                '</span>' +
                '</div>' +
                '</div>',
            link: function (scope, ele, attr) {
                scope.item.duration = parseInt(scope.item.duration || scope.item.content.length / 1024);
                RongIMLib.RongIMVoice.preLoaded(scope.item.content);
                scope.play = function () {
                    RongIMLib.RongIMVoice.stop();
                    if (!scope.isplaying) {
                        scope.item.isUnReade = false;
                        RongIMLib.RongIMVoice.play(scope.item.content, scope.item.duration);
                        scope.isplaying = true;
                        if (scope.timeoutid) {
                            $timeout.cancel(scope.timeoutid);
                        }
                        scope.timeoutid = $timeout(function () {
                            scope.isplaying = false;
                        }, scope.item.duration * 1000);
                    }
                    else {
                        scope.isplaying = false;
                        $timeout.cancel(scope.timeoutid);
                    }
                };
            }
        };
    }]);
conversationDire.directive("textMessage", [function () {
        return {
            restrict: "E",
            scope: {
                item: "=",
                message: "="
            },
            template: '<div class="" id="{{::message.messageUId || message.messageId}}">' +
                '<div class="Message-text">' +
                '<pre class="Message-entry" ng-bind-html="::content|trustHtml">' +
                '</pre>' +
                '<br></span></div>' +
                '</div>',
            replace: true,
            link: function (scope, ele, attr) {
                var EMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi;
                var EMailArr = [];
                var requestShow = false;
                scope.isAtAll = false;
                scope.isAtPart = false;
                if (scope.$parent.item.mentionedInfo && scope.$parent.item.mentionedInfo.type == webimmodel.AtTarget.All) {
                    scope.isAtAll = true;
                }
                if (scope.$parent.item.mentionedInfo && scope.$parent.item.mentionedInfo.type == webimmodel.AtTarget.Part) {
                    scope.isAtPart = true;
                }
                scope.itemid = scope.$parent.item.messageUId;
                scope.content = scope.item.content.replace(EMailReg, function (str) {
                    EMailArr.push(str);
                    return '[email`' + (EMailArr.length - 1) + ']';
                });
                var URLReg = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
                scope.content = scope.content.replace(URLReg, function (str, $1) {
                    if ($1) {
                        return '<a target="_blank" href="' + str + '">' + str + '</a>';
                    }
                    else {
                        return '<a target="_blank" href="//' + str + '">' + str + '</a>';
                    }
                });
                for (var i = 0, len = EMailArr.length; i < len; i++) {
                    scope.content = scope.content.replace('[email`' + i + ']', '<a target="_blank" href="mailto:' + EMailArr[i] + '">' + EMailArr[i] + '<a>');
                }
                scope.sendReadReceiptRequestMessage = function () {
                    scope.$parent.sendReadReceiptRequestMessage(scope.message.messageUId);
                };
                if (!scope.message.receiptResponse
                    && scope.message.conversationType == webimmodel.conversationType.Group
                    && scope.message.messageDirection == webimmodel.MessageDirection.SEND) {
                    requestShow = true;
                }
                scope.requestShow = requestShow;
                $(ele).contextmenu(function (e) {
                    console.log('显示右键菜单', e.which, e.currentTarget.id, e);
                    return false;
                });
                switch (scope.message.sentStatus) {
                    case webimmodel.SentStatus.SENDING:
                        scope.msgStyle = 'message_statue_sending';
                        break;
                    case webimmodel.SentStatus.FAILED:
                        scope.msgStyle = 'message_statue_unsend';
                        break;
                    case webimmodel.SentStatus.SENT:
                        scope.msgStyle = '';
                        break;
                    default:
                        scope.msgStyle = '';
                        break;
                }
            }
        };
    }]);
conversationDire.directive("imageMessage", [function () {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<div class="" id={{itemid}}>' +
                '<div class="Message-img">' +
                '<span id="{{\'rebox_\'+$id}}" class="Message-entry gallery" style="max-height:240px;max-width:240px;border-radius:5px;">' +
                '<a href="{{item.imageUri}}" style="max-height:240px;max-width:240px;display:inline-block;"></a>' +
                '</span>' +
                '</div>' +
                '</div>',
            link: function (scope, ele, attr) {
                var base64img = new Image();
                base64img.src = scope.item.content;
                var abox = ele.find('a')[0];
                base64img.onload = function () {
                    var box = document.getElementById('rebox_' + scope.$id);
                    var pos = getBackgrund(base64img.width, base64img.height);
                    box.style.backgroundImage = 'url(' + scope.item.content + ')';
                    box.style.backgroundSize = pos.w + 'px ' + pos.h + 'px';
                    box.style.backgroundPosition = pos.x + 'px ' + pos.y + 'px';
                    box.style.height = pos.h + 'px';
                    box.style.width = pos.w + 'px';
                    abox.style.height = pos.h + 'px';
                    abox.style.width = pos.w + 'px';
                };
                function getBackgrund(width, height) {
                    var isheight = width < height;
                    var scale = isheight ? height / width : width / height;
                    var zoom, x = 0, y = 0, w, h;
                    if (scale > 2.4) {
                        if (isheight) {
                            zoom = width / 100;
                            w = 100;
                            h = height / zoom;
                            y = (h - 240) / 2;
                        }
                        else {
                            zoom = height / 100;
                            h = 100;
                            w = width / zoom;
                            x = (w - 240) / 2;
                        }
                    }
                    else {
                        if (isheight) {
                            zoom = height / 240;
                            h = 240;
                            w = width / zoom;
                        }
                        else {
                            zoom = width / 240;
                            w = 240;
                            h = height / zoom;
                        }
                    }
                    return {
                        w: w,
                        h: h,
                        x: -x,
                        y: -y
                    };
                }
                var img = new Image();
                scope.itemid = scope.$parent.item.messageUId;
                img.src = scope.item.imageUri;
                setTimeout(function () {
                    $('#rebox_' + scope.$id).rebox({ selector: 'a' }).bind("rebox:open", function () {
                        var rebox = document.getElementsByClassName("rebox")[0];
                        rebox.onclick = function (e) {
                            if (e.target.tagName.toLowerCase() != "img") {
                                var rebox_close = document.getElementsByClassName("rebox-close")[0];
                                rebox_close.click();
                                rebox = null;
                                rebox_close = null;
                            }
                        };
                    });
                });
                img.onload = function () {
                    var box = document.getElementById('rebox_' + scope.$id);
                    var pos = getBackgrund(img.width, img.height);
                    box.style.backgroundImage = 'url(' + scope.item.imageUri + ')';
                    box.style.backgroundSize = pos.w + 'px ' + pos.h + 'px';
                    box.style.backgroundPosition = pos.x + 'px ' + pos.y + 'px';
                    var h = pos.h > 240 ? 240 : pos.h;
                    var w = pos.w > 240 ? 240 : pos.w;
                    box.style.height = h + 'px';
                    box.style.width = w + 'px';
                    abox.style.height = h + 'px';
                    abox.style.width = w + 'px';
                };
                $(ele).contextmenu(function (e) {
                    console.log('显示右键菜单', e.which, e.currentTarget.firstChild.id, e);
                    return false;
                });
            }
        };
    }]);
conversationDire.directive("bigImage", [function () {
        return {
            restrict: "E",
            scope: { show: "=", imagesrc: "=" },
            template: '<div class="bigimage-background">' +
                '<div class="bigimage">' +
                '<img src="imagesrc"></img>' +
                '</div>' +
                '</div>',
            link: function (scope, ele, attr) {
            }
        };
    }]);
conversationDire.directive("richcontentMessage", [function () {
        return {
            restrict: "E",
            scope: {
                item: "="
            },
            template: '    <a href="{{item.url}}" target="_blank">' +
                '<div class="" >' +
                '<div class="Message-image-text">' +
                '<span class="Message-entry" style="">' +
                '<div class="image-textBox">' +
                '<h4>{{item.title}}</h4>' +
                '<div class="cont clearfix">' +
                '<img ng-src="{{item.imageUri||\'css/img/imageText.png\'}}" alt=""/>' +
                '<div>{{item.content}}</div>' +
                '</div>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</a>'
        };
    }]);
conversationDire.directive("locationMessage", [function () {
        return {
            restrict: "E",
            scope: {
                item: "="
            },
            template: ' <div class="">' +
                '<div class="Message-map">' +
                '<span class="Message-entry" style="">' +
                '<div class="mapBox">' +
                '<img ng-src="{{item.content||\'css/img/barBg.png\'}}" alt=""/>' +
                '<span>{{item.poi}}</span>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '</div>'
        };
    }]);
conversationDire.directive("fileMessage", ["$q", function ($q) {
        return {
            restrict: "E",
            scope: {
                item: "=",
                message: "="
            },
            template: '<div class="" id="{{message.messageUId || message.messageId}}">' +
                '<div class="{{msgStyle}} message_statue_position"></div>' +
                '<div class="upload_file">' +
                '<div class="out_border">' +
                '<div class="file_type fl">' +
                '<img ng-src="{{imgType}}">' +
                '</div>' +
                '<div class="file_name fl">' +
                '<p class="p1">{{showName}}</p>' +
                '<p class="p2">{{showSize}}</p>' +
                '<div class="up_process"><div></div></div>' +
                '</div>' +
                '<a ng-show="isover" href="{{item.fileUrl}}" download>' +
                '<div class="file_btn fr">' +
                '</div>' +
                '</a>' +
                '<div ng-show="isuploading" class="file_btn_close fr" ng-click="Cancel()">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            link: function (scope, ele, attr) {
                var imgType = 'undefined', showSize = '', showName = '', maxSize = 20;
                showName = scope.item.name;
                function getBLen(str) {
                    if (str == null)
                        return 0;
                    if (typeof str != "string") {
                        str += "";
                    }
                    return str.replace(/[^\x00-\xff]/g, "01").length;
                }
                function getStr(str, cutLen, fromHead) {
                    var result = "";
                    var len = 0;
                    if (fromHead) {
                        for (var i = 0; i < str.length && len < cutLen; i++) {
                            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                                len += 2;
                            }
                            else {
                                len++;
                            }
                            result += str[i];
                        }
                    }
                    else {
                        for (var i = str.length - 1; i > -1 && len < cutLen; i--) {
                            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                                len += 2;
                            }
                            else {
                                len++;
                            }
                            result = str[i] + result;
                        }
                    }
                    return result;
                }
                var showNameLen = getBLen(showName), suffix = scope.item.name.replace(/.+\./, "");
                if (showNameLen > maxSize) {
                    var _filename = scope.item.name.substr(0, scope.item.name.lastIndexOf('.'));
                    var backLen = maxSize - 10 - 3 - suffix.length - 1;
                    showName = getStr(_filename, 10, true);
                    showName = showName + '...';
                    showName += getStr(_filename, backLen, false);
                    showName = showName + '.' + suffix;
                }
                scope.showName = showName;
                scope.itemid = scope.$parent.item.messageUId;
                scope.Cancel = function () {
                    RongIMLib.RongUploadLib.getInstance().cancel(scope.itemid);
                    scope.item.state = 1;
                    if (scope.item.sentStatus == webimmodel.SentStatus.SENDING) {
                        scope.item.sentStatus = webimmodel.SentStatus.FAILED;
                    }
                };
                scope.Open = function () {
                    if (window.Electron) {
                        window.Electron.openFile(scope.item.name);
                    }
                };
                scope.OpenInFolder = function () {
                    if (window.Electron) {
                        window.Electron.openFileDir(scope.item.name);
                    }
                };
                function fomate(num) {
                    var result = Math.ceil(num * 100);
                    return result / 100;
                }
                if (scope.item.type) {
                    switch (scope.item.type.toLowerCase()) {
                        case 'doc':
                        case 'mp3':
                        case 'mp4':
                        case 'txt':
                        case 'xlsx':
                        case 'pdf':
                            imgType = scope.item.type.toLowerCase();
                            break;
                        case 'bmp':
                        case 'cod':
                        case 'gif':
                        case 'ief':
                        case 'jpe':
                        case 'jpeg':
                        case 'jpg':
                        case 'jfif':
                        case 'svg':
                        case 'tif':
                        case 'tiff':
                        case 'ras':
                        case 'ico':
                        case 'pbm':
                        case 'pgm':
                        case 'png':
                        case 'pnm':
                        case 'xbm':
                        case 'xpm':
                        case 'xwd':
                        case 'rgb':
                            imgType = 'pic';
                            break;
                        case 'docx':
                        case 'dot':
                            imgType = 'doc';
                            break;
                        case 'xls':
                        case 'xla':
                        case 'xlc':
                        case 'xlm':
                        case 'xlt':
                        case 'xlw':
                            imgType = 'xlsx';
                            break;
                        case 'wav':
                        case 'wma':
                        case 'au':
                        case 'snd':
                        case 'mid':
                        case 'rmi':
                        case 'aif':
                        case 'aifc':
                        case 'aiff':
                        case 'm3u':
                        case 'ra':
                        case 'ram':
                            imgType = 'mp3';
                            break;
                        case 'avi':
                        case 'rmvb':
                        case 'mp2':
                        case 'mpa':
                        case 'mpe':
                        case 'mpeg':
                        case 'mpg':
                        case 'mpv2':
                        case 'mov':
                        case 'qt':
                        case 'lsf':
                        case 'lsx':
                        case 'asf':
                        case 'asr':
                        case 'asx':
                        case 'avi':
                        case 'movie':
                        case 'wmv':
                            imgType = 'mp4';
                            break;
                        case 'log':
                        case 'html':
                        case 'stm':
                        case 'uls':
                        case 'bas':
                        case 'c':
                        case 'h':
                        case 'rtx':
                        case 'sct':
                        case 'tsv':
                        case 'htt':
                        case 'htc':
                        case 'etx':
                        case 'vcf':
                            imgType = 'txt';
                            break;
                    }
                }
                imgType = 'css/img/' + imgType + '.png';
                scope.imgType = imgType;
                updateState();
                function updateState() {
                    scope.isover = scope.item.state == webimmodel.FileState.Success, scope.isuploading = scope.item.state == webimmodel.FileState.Uploading || scope.item.state == -1;
                    switch (scope.item.state) {
                        case webimmodel.FileState.Canceled:
                            showSize = '已取消';
                            angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                            break;
                        case webimmodel.FileState.Failed:
                            showSize = '上传失败';
                            angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                            break;
                        case -1:
                        case webimmodel.FileState.Uploading:
                            var kbSize = scope.item.size / 1024;
                            showSize = kbSize >= 1024 ? fomate(kbSize / 1024) + ' M' : fomate(kbSize) + ' K';
                            angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'block');
                            angular.element(ele[0].getElementsByClassName("up_process")[0].children[0]).css('width', scope.item.extra);
                            break;
                        case webimmodel.FileState.Success:
                            var kbSize = scope.item.size / 1024;
                            showSize = kbSize >= 1024 ? fomate(kbSize / 1024) + ' M' : fomate(kbSize) + ' K';
                            angular.element(ele[0].getElementsByClassName("up_process")[0].children[0]).css('width', '100%');
                            angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                            if (typeof unbingWatch === 'function' || typeof unbingWatch === "object") {
                                unbingWatch();
                            }
                            ele[0].getElementsByClassName("file_btn")[0].parentElement.href = scope.item.fileUrl;
                            break;
                    }
                    scope.showSize = showSize;
                }
                var unbingWatch = scope.$watch("item.state", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    updateState();
                });
                $(ele).contextmenu(function (e) {
                    console.log('显示右键菜单', e.which, e.currentTarget.firstChild.id, e);
                    return false;
                });
            }
        };
    }]);
conversationDire.directive("dateMessage", [function () {
        return {
            restrict: "E",
            scope: { date: "=" },
            template: '<div class="Messages-date"><b style="cursor: default;">{{date|historyTime}}</b></div>',
            link: function (scope, ele, attr) {
            }
        };
    }]);
conversationDire.directive("getHistoryMessage", [function () {
        return {
            restrict: "E",
            scope: { myclick: "&" },
            template: '<div class="Messages-getHistory"><b ng-click="myclick()" class="" style="cursor: pointer;">查看历史消息</b></div>',
            link: function (scope, ele, attr) {
            }
        };
    }]);
conversationDire.directive("getMoreMessage", [function () {
        return {
            restrict: "E",
            scope: { myclick: "&" },
            template: '<div class="Messages-getHistory"><b ng-click="myclick()" class="" style="cursor: pointer;">获取更多历史消息</b></div>'
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var conversationServer = angular.module("webim.conversation.server", []);
conversationServer.factory("conversationServer", ["$q", "mainDataServer", "mainServer", "RongIMSDKServer",
    function ($q, mainDataServer, mainServer, RongIMSDKServer) {
        var conversationServer = {};
        conversationServer.atMessagesCache = {};
        conversationServer.historyMessagesCache = {};
        conversationServer.conversationMessageList = [];
        conversationServer.conversationMessageListShow = [];
        conversationServer.pullMessageTime = null;
        conversationServer.remainMessageCount = 5;
        conversationServer.withDrawMessagesCache = {};
        function asyncConverGroupNotifition(msgsdk, item) {
            var detail = msgsdk.content;
            var comment = "", members = [];
            var isself = detail.operatorUserId == mainDataServer.loginUser.id ? true : false;
            switch (detail.operation) {
                case "Add":
                    if (isself) {
                        comment = '你邀请' + detail.data.data.targetUserDisplayNames.join('、') + "加入了群组";
                    }
                    else {
                        comment = detail.data.data.operatorNickname + '邀请' + detail.data.data.targetUserDisplayNames.join('、') + "加入了群组";
                    }
                    members = detail.data.data.targetUserIds;
                    break;
                case "Quit":
                    comment = detail.data.data.targetUserDisplayNames.join('、') + "退出了群组";
                    members = detail.data.data.targetUserIds;
                    break;
                case "Kicked":
                    if (isself) {
                        comment = '你将' + detail.data.data.targetUserDisplayNames.join('、') + " 移出了群组";
                    }
                    else {
                        comment = detail.data.data.operatorNickname + '将' + detail.data.data.targetUserDisplayNames.join('、') + " 移出了群组";
                    }
                    members = detail.data.data.targetUserIds;
                    break;
                case "Rename":
                    detail.data.data.targetGroupName = RongIMLib.RongIMEmoji.symbolToEmoji(RongIMLib.RongIMEmoji.emojiToSymbol(RongIMLib.RongIMEmoji.calculateUTF(detail.data.data.targetGroupName)));
                    if (isself) {
                        comment = "你修改名称为" + detail.data.data.targetGroupName;
                    }
                    else {
                        comment = detail.data.data.operatorNickname + "修改群名称为" + detail.data.data.targetGroupName;
                    }
                    break;
                case "Create":
                    if (detail.operatorUserId == mainDataServer.loginUser.id) {
                        comment = "你创建了群组";
                    }
                    else {
                        comment = detail.data.data.operatorNickname + "创建了群组";
                    }
                    break;
                case "Dismiss":
                    comment = detail.data.data.operatorNickname + "解散了群组";
                    break;
                default:
                    console.log("未知群组通知");
            }
            item.content = comment;
        }
        function asyncConverDiscussionNotifition(msgsdk, item) {
            var detail = msgsdk;
            var comment = "", members = [];
            switch (detail.content.type) {
                case 1:
                    comment = " 加入讨论组";
                    members = detail.content.extension.split(',');
                    break;
                case 2:
                    comment = " 退出讨论组";
                    members = detail.content.extension.split(',');
                    break;
                case 4:
                    comment = " 被踢出讨论组";
                    members = detail.content.extension.split(',');
                    break;
                case 3:
                    comment = " 讨论组更名";
                    break;
                default:
                    console.log("未知讨论组通知");
            }
            item.content = comment;
            mainServer.user.getBatchInfo(members).then(function (repmem) {
                var lists = repmem.data.result;
                var membersName = [];
                for (var j = 0, len = lists.length; j < len; j++) {
                    membersName.push(lists[j].nickname);
                }
                if (membersName) {
                    item.content = membersName.join('、') + item.content;
                }
            });
        }
        function getHistory(id, type, lastTime, count) {
            var d = $q.defer();
            var conver = type;
            var currentConversationTargetId = id;
            if (!conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId]) {
                conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId] = [];
            }
            try {
                RongIMSDKServer.getHistoryMessages(+conver, currentConversationTargetId, lastTime, count).then(function (data) {
                    var has = data.has, list = data.data;
                    var msglen = list.length;
                    if (msglen > 0) {
                        conversationServer.pullMessageTime = list[msglen - 1].sentTime;
                    }
                    var _withDrawMsg = conversationServer.withDrawMessagesCache[conver + "_" + currentConversationTargetId];
                    while (msglen--) {
                        var msgsdk = list[msglen];
                        if (_withDrawMsg && _withDrawMsg.indexOf(msgsdk.messageUId) > -1) {
                            continue;
                        }
                        switch (msgsdk.messageType) {
                            case webimmodel.MessageType.ContactNotificationMessage:
                                break;
                            case webimmodel.MessageType.TextMessage:
                            case webimmodel.MessageType.VoiceMessage:
                            case webimmodel.MessageType.LocationMessage:
                            case webimmodel.MessageType.ImageMessage:
                            case webimmodel.MessageType.RichContentMessage:
                            case webimmodel.MessageType.FileMessage:
                                var item = webimmodel.Message.convertMsg(msgsdk);
                                if (item) {
                                    unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                }
                                break;
                            case webimmodel.MessageType.GroupNotificationMessage:
                                if (msgsdk.objectName == "RC:GrpNtf") {
                                    var item = webimmodel.Message.convertMsg(msgsdk);
                                    if (item) {
                                        conversationServer.asyncConverGroupNotifition(msgsdk, item);
                                        unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                    }
                                }
                                break;
                            case webimmodel.MessageType.UnknownMessage:
                                if (msgsdk.objectName == "RC:GrpNtf") {
                                    var item = webimmodel.Message.convertMsg(msgsdk);
                                    if (item) {
                                        conversationServer.asyncConverGroupNotifition(msgsdk, item);
                                        unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                    }
                                }
                                break;
                            case webimmodel.MessageType.RecallCommandMessage:
                                if (msgsdk.objectName == "RC:RcCmd") {
                                }
                                break;
                            case webimmodel.MessageType.InformationNotificationMessage:
                                var item = webimmodel.Message.convertMsg(msgsdk);
                                if (item) {
                                    unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                }
                                break;
                            case webimmodel.MessageType.DiscussionNotificationMessage:
                                if (msgsdk.objectName == "RC:DizNtf") {
                                }
                                break;
                            case webimmodel.MessageType.JrmfReadPacketMessage:
                            case webimmodel.MessageType.JrmfReadPacketOpenedMessage:
                                var item = webimmodel.Message.convertMsg(msgsdk);
                                if (item) {
                                    unshiftHistoryMessages(currentConversationTargetId, conver, item);
                                }
                                break;
                            default:
                                console.log("此消息类型未处理：" + msgsdk.messageType);
                                break;
                        }
                    }
                    var addtime = conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId][0];
                    if (addtime && addtime.panelType != webimmodel.PanelType.Time) {
                        unshiftHistoryMessages(currentConversationTargetId, conver, new webimmodel.TimePanl(conversationServer.historyMessagesCache[conver + "_" + currentConversationTargetId][0].sentTime));
                    }
                    d.resolve(has);
                }, function (err) {
                    d.reject(err);
                    console.log('获取历史消息失败');
                });
            }
            catch (err) {
                console.log("SDK error" + err);
            }
            return d.promise;
        }
        function unshiftHistoryMessages(id, type, item) {
            var arr = conversationServer.historyMessagesCache[type + "_" + id] || [];
            if (arr[0] && item.messageUId && checkMessageExist(id, type, item.messageUId)) {
                return;
            }
            if (arr[0] && arr[0].sentTime && arr[0].panelType != webimmodel.PanelType.Time && item.sentTime) {
                if (compareDateIsAddSpan(arr[0].sentTime, item.sentTime)) {
                    arr.unshift(new webimmodel.TimePanl(arr[0].sentTime));
                }
            }
            messageAddUserInfo(item);
            arr.unshift(item);
        }
        function clearHistoryMessages(id, type) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            var counter = 0, counterAll = 0;
            for (var i = currenthis.length - 1; i > -1; i--) {
                if (currenthis[i].panelType == webimmodel.PanelType.Message) {
                    counter++;
                }
                if (counter >= conversationServer.remainMessageCount && currenthis[i].panelType == webimmodel.PanelType.Time) {
                    currenthis.splice(0, i);
                    conversationServer.unshiftHistoryMessages(id, type, new webimmodel.GetMoreMessagePanel());
                    break;
                }
            }
        }
        function getLastMessageTime(id, type) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            var sentTime = 0;
            for (var i = 0; i < currenthis.length; i++) {
                if (currenthis[i].panelType == webimmodel.PanelType.Message) {
                    sentTime = (new Date(currenthis[i].sentTime)).getTime();
                    break;
                }
            }
            return sentTime;
        }
        function delWithDrawMessage(id, type, uid) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            if (currenthis) {
                for (var i = 0; i < currenthis.length; i++) {
                    if (currenthis[i].panelType == webimmodel.PanelType.Message && currenthis[i].messageUId == uid) {
                        if (i > 0 && i < currenthis.length - 1 && currenthis[i - 1].panelType == webimmodel.PanelType.Time && currenthis[i + 1].panelType == webimmodel.PanelType.Time
                            || i == currenthis.length - 1 && currenthis[i - 1].panelType == webimmodel.PanelType.Time) {
                            currenthis.splice(i - 1, 2);
                        }
                        else {
                            currenthis.splice(i, 1);
                        }
                        break;
                    }
                }
            }
            currenthis = conversationServer.conversationMessageList;
            if (currenthis) {
                for (var i = 0; i < currenthis.length; i++) {
                    if (currenthis[i].panelType == webimmodel.PanelType.Message && currenthis[i].messageUId == uid) {
                        if (i > 0 && i < currenthis.length - 1 && currenthis[i - 1].panelType == webimmodel.PanelType.Time && currenthis[i + 1].panelType == webimmodel.PanelType.Time
                            || i == currenthis.length - 1 && currenthis[i - 1].panelType == webimmodel.PanelType.Time) {
                            currenthis.splice(i - 1, 2);
                        }
                        else {
                            currenthis.splice(i, 1);
                        }
                        break;
                    }
                }
            }
            currenthis = conversationServer.conversationMessageListShow;
            if (currenthis) {
                for (var i = 0; i < currenthis.length; i++) {
                    if (currenthis[i].panelType == webimmodel.PanelType.Message && currenthis[i].messageUId == uid) {
                        if (i > 0 && i < currenthis.length - 1 && currenthis[i - 1].panelType == webimmodel.PanelType.Time && currenthis[i + 1].panelType == webimmodel.PanelType.Time
                            || i == currenthis.length - 1 && currenthis[i - 1].panelType == webimmodel.PanelType.Time) {
                            currenthis.splice(i - 1, 2);
                        }
                        else {
                            currenthis.splice(i, 1);
                        }
                        break;
                    }
                }
            }
        }
        function compareDateIsAddSpan(first, second) {
            if (Object.prototype.toString.call(first) == "[object Date]" && Object.prototype.toString.call(second) == "[object Date]") {
                var pre = first.toString();
                var cur = second.toString();
                return pre.substring(0, pre.lastIndexOf(":")) != cur.substring(0, cur.lastIndexOf(":"));
            }
            else {
                return false;
            }
        }
        function addHistoryMessages(id, type, item) {
            var arr = conversationServer.historyMessagesCache[type + "_" + id] || [];
            var exist = false;
            exist = checkMessageExist(id, type, item.messageUId);
            if (exist) {
                console.log('exist离线消息有重复');
                return;
            }
            if (arr[arr.length - 1] && arr[arr.length - 1].panelType != webimmodel.PanelType.Time && arr[arr.length - 1].sentTime && item.sentTime) {
                if (compareDateIsAddSpan(arr[arr.length - 1].sentTime, item.sentTime)) {
                    arr.push(new webimmodel.TimePanl(item.sentTime));
                    if (type == mainDataServer.conversation.currentConversation.targetType && id == mainDataServer.conversation.currentConversation.targetId) {
                        conversationServer.conversationMessageListShow.push(new webimmodel.TimePanl(item.sentTime));
                    }
                }
            }
            messageAddUserInfo(item);
            arr.push(item);
            if (type == mainDataServer.conversation.currentConversation.targetType && id == mainDataServer.conversation.currentConversation.targetId) {
                conversationServer.conversationMessageListShow.push(item);
            }
        }
        function addAtMessage(id, type, item) {
            if (!conversationServer.atMessagesCache[type + "_" + id]) {
                conversationServer.atMessagesCache[type + "_" + id] = [];
            }
            var atMsg = { "messageUId": item.messageUId, "mentionedInfo": item.mentionedInfo };
            conversationServer.atMessagesCache[type + "_" + id].push(atMsg);
        }
        function clearAtMessage(id, type) {
            if (!conversationServer.atMessagesCache[type + "_" + id]) {
                conversationServer.atMessagesCache[type + "_" + id] = [];
            }
            conversationServer.atMessagesCache[type + "_" + id].length = 0;
        }
        function addWithDrawMessageCache(id, type, msgUid) {
            if (!conversationServer.withDrawMessagesCache[type + "_" + id]) {
                conversationServer.withDrawMessagesCache[type + "_" + id] = [];
            }
            conversationServer.withDrawMessagesCache[type + "_" + id].push(msgUid);
        }
        function messageAddUserInfo(item) {
            if (!item.senderUserId) {
                return item;
            }
            var user;
            if (item.messageDirection == 1) {
                item.senderUserName = mainDataServer.loginUser.nickName;
                item.imgSrc = mainDataServer.loginUser.portraitUri;
                item.senderUserImgSrc = mainDataServer.loginUser.firstchar;
            }
            else {
                switch (item.conversationType) {
                    case webimmodel.conversationType.Private:
                        user = mainDataServer.contactsList.getFriendById(item.senderUserId);
                        if (!user) {
                            user = mainDataServer.contactsList.getNonFriendById(item.senderUserId);
                        }
                        break;
                    case webimmodel.conversationType.Group:
                        user = mainDataServer.contactsList.getGroupMember(item.targetId, item.senderUserId);
                        break;
                    case webimmodel.conversationType.Discussion:
                        user = mainDataServer.contactsList.getDiscussionMember(item.targetId, item.senderUserId);
                        break;
                    case webimmodel.conversationType.System:
                        user = new webimmodel.Contact({});
                        user.name = "系统消息";
                        break;
                    default:
                        console.log("暂不支持此会话类型");
                }
                if (user) {
                    item.senderUserName = user.displayName || user.name;
                    item.senderUserImgSrc = user.firstchar;
                    item.imgSrc = user.imgSrc;
                }
                else {
                    if (item.senderUserId == '__system__') {
                        return;
                    }
                    mainServer.user.getInfo(item.senderUserId).success(function (rep) {
                        if (rep.code == 200) {
                            item.senderUserName = rep.result.nickname;
                            item.senderUserImgSrc = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                            item.imgSrc = rep.result.portraitUri;
                            var _friend = new webimmodel.Friend({
                                id: item.senderUserId,
                                name: item.senderUserName + '(非好友)',
                                imgSrc: item.imgSrc
                            });
                            _friend.firstchar = item.senderUserImgSrc;
                            mainDataServer.contactsList.addNonFriend(_friend);
                        }
                    }).error(function () {
                        console.log("无此用户:" + item.senderUserId);
                    });
                }
            }
            return item;
        }
        function updateHistoryMessagesCache(id, type, name, portrait) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            angular.forEach(currenthis, function (value, key) {
                if (value.panelType == webimmodel.PanelType.Message && value.senderUserId == id) {
                    value.senderUserName = name;
                    value.imgSrc = portrait;
                }
            });
        }
        function checkMessageExist(id, type, messageuid) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            var keepGoing = true;
            if (!messageuid) {
                return false;
            }
            angular.forEach(currenthis, function (value, key) {
                if (keepGoing) {
                    if ((value.panelType == webimmodel.PanelType.Message || value.panelType == webimmodel.PanelType.InformationNotification) && value.messageUId == messageuid) {
                        keepGoing = false;
                    }
                }
            });
            return !keepGoing;
        }
        function updateSendMessage(id, type, msg) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            for (var i = currenthis.length - 1; i > -1; i--) {
                if (currenthis[i].panelType == webimmodel.PanelType.Message
                    && currenthis[i].messageUId == undefined
                    && currenthis[i].messageDirection == webimmodel.MessageDirection.SEND
                    && currenthis[i].messageId == msg.messageId) {
                    currenthis[i].messageUId = msg.messageUId;
                    currenthis[i].sentStatus = webimmodel.SentStatus.SENT;
                    currenthis.splice(i, 1, msg);
                    break;
                }
            }
        }
        function updateSendStatus(id, type, messageid, status) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            for (var i = currenthis.length - 1; i > -1; i--) {
                if (currenthis[i].panelType == webimmodel.PanelType.Message
                    && currenthis[i].messageUId == undefined
                    && currenthis[i].messageDirection == webimmodel.MessageDirection.SEND
                    && currenthis[i].messageId == messageid) {
                    currenthis[i].sentStatus = status;
                    break;
                }
            }
        }
        function getMessageById(id, type, messageuid) {
            var currenthis = conversationServer.historyMessagesCache[type + "_" + id];
            var keepGoing = true;
            var msg = null;
            angular.forEach(currenthis, function (value, key) {
                if (keepGoing) {
                    if (value.panelType == webimmodel.PanelType.Message && value.messageUId == messageuid) {
                        keepGoing = false;
                        msg = value;
                    }
                }
            });
            return msg;
        }
        function sendReadReceiptMessage(id, type, messageuid, sendtime) {
            var messageUId = messageuid;
            var lastMessageSendTime = sendtime;
            if (type != webimmodel.conversationType.Private) {
                return;
            }
            var msg = RongIMLib.ReadReceiptMessage.obtain(messageUId, lastMessageSendTime, 1);
            RongIMSDKServer.sendMessage(type, id, msg).then(function () {
            }, function (error) {
                console.log('sendReadReceiptMessage error', error.errorCode);
            });
        }
        function sendSyncReadStatusMessage(id, type, sendtime) {
            var lastMessageSendTime = sendtime;
            if (type != webimmodel.conversationType.Group) {
                return;
            }
            var msg = new RongIMLib.SyncReadStatusMessage({ lastMessageSendTime: sendtime });
            RongIMSDKServer.sendMessage(type, id, msg).then(function () {
            }, function (error) {
                console.log('sendSyncReadStatusMessage error', error.errorCode);
            });
        }
        conversationServer.getHistory = getHistory;
        conversationServer.addHistoryMessages = addHistoryMessages;
        conversationServer.messageAddUserInfo = messageAddUserInfo;
        conversationServer.unshiftHistoryMessages = unshiftHistoryMessages;
        conversationServer.asyncConverGroupNotifition = asyncConverGroupNotifition;
        conversationServer.asyncConverDiscussionNotifition = asyncConverDiscussionNotifition;
        conversationServer.updateHistoryMessagesCache = updateHistoryMessagesCache;
        conversationServer.checkMessageExist = checkMessageExist;
        conversationServer.addAtMessage = addAtMessage;
        conversationServer.clearAtMessage = clearAtMessage;
        conversationServer.clearHistoryMessages = clearHistoryMessages;
        conversationServer.getLastMessageTime = getLastMessageTime;
        conversationServer.getMessageById = getMessageById;
        conversationServer.updateSendMessage = updateSendMessage;
        conversationServer.delWithDrawMessage = delWithDrawMessage;
        conversationServer.addWithDrawMessageCache = addWithDrawMessageCache;
        conversationServer.sendReadReceiptMessage = sendReadReceiptMessage;
        conversationServer.sendSyncReadStatusMessage = sendSyncReadStatusMessage;
        conversationServer.updateSendStatus = updateSendStatus;
        return conversationServer;
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var createDiscussion = angular.module("webim.creatediscussion", []);
createDiscussion.controller("creatediscussionController", ["$scope", "$state",
    function ($scope, $state) {
        $scope.discussionName = "";
        $scope.submite = function () {
            var name = ($scope.discussionName || "").trim();
            if (name.length >= 2 && name.length <= 32) {
                $state.go("main.discussionaddmember", { iscreate: "true", idorname: $scope.discussionName });
            }
            else {
                webimutil.Helper.alertMessage.error("名称长度2-32", 2);
            }
        };
        document.getElementById("discussionName").onkeydown = function (e) {
            if (e.keyCode == 13 || e.keyCode == 10) {
                $scope.submite();
            }
        };
        $scope.back = function () {
            $state.go("main");
        };
    }]);
var discussionAddMember = angular.module("webim.discussionaddmember", []);
discussionAddMember.controller("discussionaddmemberController", ["$scope", "$state", "$stateParams", "mainDataServer", "mainServer", "RongIMSDKServer",
    function ($scope, $state, $stateParams, mainDataServer, mainServer, RongIMSDKServer) {
        $scope.save = function () {
            throw new Error("Not implemented yet");
        };
        $scope.idorname = $stateParams["idorname"];
        $scope.isLoading = false;
        if ($stateParams["iscreate"] == "true") {
            var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function (item) { return item.list; }));
            friendList = friendList.filter(function (item, index, arr) {
                return item.id != mainDataServer.loginUser.id;
            });
            $scope.friendList = webimutil.Helper.cloneObject(friendList);
            $scope.searchfriend = function (str) {
                if (str == "") {
                    $scope.friendList = webimutil.Helper.cloneObject(friendList);
                }
                else {
                    var list = mainDataServer.contactsList.find(str, friendList);
                    $scope.friendList = webimutil.Helper.cloneObject(list);
                }
            };
            $scope.save = function () {
                if ($scope.isLoading) {
                    return;
                }
                var membersid = [];
                var membersname = [];
                var members = [];
                var tempname = '';
                $scope.friendList.forEach(function (item) {
                    if (item.isSelected) {
                        membersid.push(item.id + "");
                        members.push(item);
                        membersname.push(item.name + "");
                    }
                });
                if (membersid.length < 1) {
                    webimutil.Helper.alertMessage.error("至少要有1个组成员", 2);
                    return;
                }
                tempname = membersname.join(',');
                if (tempname && tempname.length > 40) {
                    tempname = tempname.substring(0, 40);
                }
                $scope.isLoading = true;
                membersid.push(mainDataServer.loginUser.id);
                RongIMSDKServer.createDiscussion(tempname, membersid).then(function (rep) {
                    var discussion = new webimmodel.Discussion({
                        id: rep.data,
                        name: tempname,
                        imgSrc: "",
                        upperlimit: 500,
                        fact: 1,
                        creater: mainDataServer.loginUser.id,
                        isOpen: true
                    });
                    mainDataServer.contactsList.addDiscussion(discussion);
                    mainDataServer.contactsList.addDiscussionMember(discussion.id, new webimmodel.Member({
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
                        mainDataServer.contactsList.addDiscussionMember(discussion.id, member);
                    }
                    members = undefined;
                    membersid = undefined;
                    webimutil.Helper.alertMessage.success("创建成功！", 2);
                    $state.go("main.chat", { targetId: discussion.id, targetType: webimmodel.conversationType.Discussion });
                    $scope.isLoading = false;
                }, function () {
                    $scope.isLoading = false;
                    webimutil.Helper.alertMessage.error("失败", 2);
                });
                console.log($scope.friendList.filter(function (item) { return item.isSelected; }));
            };
            $scope.back = function () {
                $state.go("main.creatediscussion");
            };
        }
        else {
            var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function (item) { return item.list; }));
            var memberList = mainDataServer.contactsList.getDiscussionById($scope.idorname).memberList;
            var membersObj = {};
            for (var i = 0, len = memberList.length; i < len; i++) {
                membersObj[memberList[i].id] = true;
            }
            friendList = friendList.filter(function (item, index, arr) {
                return !membersObj[item.id];
            });
            $scope.friendList = webimutil.Helper.cloneObject(friendList);
            $scope.searchfriend = function (str) {
                if (str == "") {
                    $scope.friendList = webimutil.Helper.cloneObject(friendList);
                }
                else {
                    var searchList = mainDataServer.contactsList.find(str, friendList);
                    $scope.friendList = webimutil.Helper.cloneObject(searchList);
                }
            };
            $scope.save = function () {
                if ($scope.isLoading) {
                    return;
                }
                $scope.isLoading = true;
                var membersid = [];
                var members = [];
                $scope.friendList.forEach(function (item) {
                    if (item.isSelected) {
                        membersid.push(item.id + "");
                        members.push(item);
                    }
                });
                if (membersid.length < 1) {
                    webimutil.Helper.alertMessage.error("至少要选择1个成员", 2);
                    return;
                }
                RongIMSDKServer.addMemberToDiscussion($scope.idorname, membersid, {
                    onSuccess: function () {
                        for (var j = 0, len = members.length; j < len; j++) {
                            var member = new webimmodel.Member({
                                id: members[j].id,
                                name: members[j].name,
                                imgSrc: members[j].imgSrc,
                                role: "1"
                            });
                            mainDataServer.contactsList.addDiscussionMember($scope.idorname, member);
                        }
                        members = undefined;
                        membersid = undefined;
                        $state.go("main.discussioninfo", { discussionid: $scope.idorname });
                        webimutil.Helper.alertMessage.success("添加成功！", 2);
                    },
                    onError: function () {
                        $scope.isLoading = false;
                        webimutil.Helper.alertMessage.error("失败", 2);
                    }
                });
            };
            $scope.back = function () {
                $state.go("main.discussioninfo", { discussionid: $stateParams["idorname"] });
            };
        }
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var discussionInfo = angular.module("webim.discussioninfo", []);
discussionInfo.controller("discussioninfoController", ["$scope", "$state", "$stateParams", "mainDataServer", "mainServer", "RongIMSDKServer",
    function ($scope, $state, $stateParams, mainDataServer, mainServer, RongIMSDKServer) {
        $scope.$on("$viewContentLoaded", function () {
            angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[$scope.discussionInfo.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
        });
        $scope.isEditable = true;
        function back() {
            if (conversationtype && conversationtype != "0") {
                $state.go("main.chat", { targetId: discussionid, targetType: conversationtype });
            }
            else {
                $state.go("main");
            }
        }
        $scope.back = function () {
            back();
        };
        var discussionid = $stateParams["discussionid"];
        var conversationtype = $stateParams["conversationtype"];
        $scope.discussionInfo = mainDataServer.contactsList.getDiscussionById(discussionid);
        if (!$scope.discussionInfo) {
            webimutil.Helper.alertMessage.error("您不在此讨论组中", 2);
            back();
        }
        if ($scope.discussionInfo.creater == mainDataServer.loginUser.id) {
            $scope.discussionInfo.isCreater = true;
        }
        $scope.quitDiscussion = function () {
            RongIMSDKServer.quitDiscussion(discussionid, {
                onSuccess: function () {
                    mainDataServer.contactsList.removeDiscussion(discussionid);
                    RongIMSDKServer.removeConversation(webimmodel.conversationType.Discussion, discussionid).then(function () {
                        setTimeout(function () {
                            $scope.$emit("conversationChange");
                        }, 200);
                        $state.go("main");
                        webimutil.Helper.alertMessage.success("退出成功", 2);
                    }, function () {
                        setTimeout(function () {
                            $scope.$emit("conversationChange");
                        }, 200);
                        $state.go("main");
                        webimutil.Helper.alertMessage.success("退出成功删除会话失败", 2);
                    });
                },
                onError: function () {
                    webimutil.Helper.alertMessage.error("退出失败", 2);
                }
            });
        };
        $scope.kickMember = function () {
            var selMember = $scope.selMember;
            if (!selMember) {
                return;
            }
            RongIMSDKServer.removeMemberFromDiscussion(discussionid, selMember, {
                onSuccess: function () {
                    mainDataServer.contactsList.removeDiscussionMember(discussionid, selMember);
                    $scope.isEditable = true;
                },
                onError: function () {
                    webimutil.Helper.alertMessage.error("删除失败", 2);
                }
            });
        };
        $scope.toChat = function () {
            $state.go("main.chat", { targetId: $scope.discussionInfo.id, targetType: webimmodel.conversationType.Discussion }, { location: "replace" });
        };
        $scope.addmember = function () {
            $state.go("main.discussionaddmember", { iscreate: "false", idorname: $scope.discussionInfo.id });
        };
        $scope.dismiss = function () {
        };
        $scope.getSelect = function (val) {
            $scope.selMember = val;
        };
    }]);
discussionInfo.directive("discussionMember", ["$state", "mainDataServer", function ($state, mainDataServer) {
        return {
            restrict: "E",
            scope: { item: "=", isshow: "=", updateSelect: "&" },
            template: '<li class="chat_item groupUser_item">' +
                '<div class="select"  ng-show="isshow">' +
                '<input type="radio" class="hide" ng-disabled="item.id==loginUserid" id="{{item.id}}" value="{{item.id}}" ng-model="selMember" data-count="" name="rdMember" ng-click="updateSelect({val: selMember})">' +
                '<label for="{{item.id}}"></label>' +
                '</div>' +
                '<div ng-click="showinfo()">' +
                '<div class="photo">' +
                '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'css/img/barBg.png\'}}" alt="">' +
                '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.name}}</span>' +
                '</h3>' +
                '</div>' +
                '</div>' +
                '</li>',
            link: function (scope, ele, attr) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                scope.showinfo = function () {
                    $state.go("main.friendinfo", { userid: scope.item.id, discussionid: scope.$parent.discussionInfo.id, targetid: scope.$parent.discussionInfo.id, conversationtype: $state.params["conversationtype"] });
                };
                scope.loginUserid = mainDataServer.loginUser.id;
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var addfirendCtr = angular.module("webim.addfirend", ["webim.main.server"]);
addfirendCtr.controller("searchfriendController", ["$scope", "$state", "mainServer",
    function ($scope, $state, mainServer) {
        $scope.friendlist = [];
        $scope.searchfriend = function (content) {
            $scope.friendlist = [];
            var reg = /^1[3-9][0-9]{9,9}$/;
            if (reg.test(content)) {
                $scope.getresultnull = false;
                mainServer.user.getUserByPhone("86", content).success(function (rep) {
                    if (rep.code == 200) {
                        var user = new webimmodel.UserInfo();
                        user.id = rep.result.id;
                        user.nickName = rep.result.nickname;
                        user.portraitUri = rep.result.portraitUri;
                        user.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                        user.phone = "";
                        user.region = "";
                        $scope.friendlist.push(user);
                    }
                }).error(function (err) {
                    console.log(err);
                    $scope.getresultnull = true;
                });
            }
        };
        $scope.back = function () {
            window.history.back();
        };
    }]);
addfirendCtr.controller("applyfriendController", ["$scope", "$state", "$stateParams", "mainServer", "mainDataServer",
    function ($scope, $state, $stateParams, mainServer, mainDataServer) {
        var userId = $stateParams["userId"];
        var userName = $stateParams["userName"];
        var groupid = $stateParams["groupid"];
        var targetid = $stateParams["targetid"];
        var conversationtype = $stateParams["conversationtype"];
        var addfriendinfo = "我是" + mainDataServer.loginUser.nickName;
        $scope.title = userName;
        $scope.applyfriendbtn = function () {
            var id = userId;
            if (!$scope.message) {
                webimutil.Helper.alertMessage.error("消息不可为空！", 2);
                return;
            }
            if (!id) {
                webimutil.Helper.alertMessage.error("添加用户为空！", 2);
                return;
            }
            mainServer.friend.invite(id, $scope.message).success(function (rep) {
                $state.go("main.friendinfo", { userid: userId, groupid: groupid, targetid: targetid, conversationtype: conversationtype });
                var action = rep.result.action;
                if (action == "Added") {
                    var addfriend = new webimmodel.Friend({
                        id: id,
                        name: userName,
                        imgSrc: ""
                    });
                    mainServer.user.getInfo(id).success(function (rep) {
                        addfriend.imgSrc = rep.result.portraitUri;
                    });
                    mainDataServer.contactsList.addFriend(addfriend);
                    webimutil.Helper.alertMessage.success("已成为好友！", 2);
                }
                else if (action == "Sent") {
                    webimutil.Helper.alertMessage.success("发送成功！", 2);
                }
                else {
                    console.log(rep);
                }
            }).error(function (err, code) {
                if (code == 400) {
                    webimutil.Helper.alertMessage.error("已经是好友！", 2);
                }
                else {
                    console.log(err);
                }
            });
        };
        $scope.back = function () {
            if (conversationtype) {
                $state.go("main.friendinfo", { userid: userId, groupid: groupid, targetid: targetid, conversationtype: conversationtype });
            }
            else {
                $state.go("main.searchfriend");
            }
        };
        if (groupid != '0' && groupid != '') {
            var groupname = mainDataServer.contactsList.getGroupById(groupid) ? mainDataServer.contactsList.getGroupById(groupid).name : groupid;
            addfriendinfo = "我是“" + groupname + "群”的" + mainDataServer.loginUser.nickName;
        }
        $scope.getInfo = function () {
            return addfriendinfo;
        };
    }]);
addfirendCtr.directive("addfirenditem", ["$state", "mainDataServer",
    function ($state, mainDataServer) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<li class="chat_item joinGroup_item addFriends_item">' +
                '<div class="photo">' +
                '<img class="img" ng-show="item.portraitUri" ng-src="{{item.portraitUri||\'css/img/barBg.png\'}}" alt="">' +
                '<div class="portrait" ng-show="!item.portraitUri">{{item.firstchar}}</div>' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.nickName}}</span>' +
                '</h3>' +
                '<button class="functionBoxBtn" ng-click="applyfriendsrc()" ng-show="!isself">加好友</button>' +
                '</div>' +
                '</li>',
            link: function (scope, ele, attr) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                scope.applyfriendsrc = function () {
                    var friend = mainDataServer.contactsList.getFriendById(scope.item.id);
                    if (friend) {
                        webimutil.Helper.alertMessage.error("此人已经是您的好友！", 2);
                        return;
                    }
                    $state.go("main.applyfriend", { userId: scope.item.id, userName: scope.item.nickName });
                };
                scope.isself = mainDataServer.loginUser.id == scope.item.id;
                if (scope.isself) {
                    angular.element(ele[0].getElementsByClassName("info")[0]).css("border", "none");
                }
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var friendinfo = angular.module("webim.editfriendinfo", ["webim.main.server"]);
friendinfo.controller("editfriendinfoController", ["$scope", "$state", "$stateParams", "$window", "mainDataServer", "mainServer", "RongIMSDKServer",
    function ($scope, $state, $stateParams, $window, mainDataServer, mainServer, RongIMSDKServer) {
        $scope.$on("$viewContentLoaded", function () {
            setPortrait();
        });
        function setPortrait() {
            if ($scope.user.id) {
                angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[$scope.user.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            }
        }
        var userid = $stateParams["userid"];
        var groupid = $stateParams["groupid"];
        var targetid = $stateParams["targetid"];
        var conversationtype = $stateParams["conversationtype"];
        var friend = mainDataServer.contactsList.getFriendById(userid);
        var member = friend ? null : mainDataServer.contactsList.getGroupMember(conversationtype ? targetid : groupid, userid);
        var isself = mainDataServer.loginUser.id == userid;
        $scope.user = new webimmodel.UserInfo();
        $scope.isself = isself;
        $scope.isfriend = friend ? true : false;
        if (friend) {
            $scope.user.id = friend.id;
            $scope.user.nickName = friend.name;
            $scope.user.portraitUri = friend.imgSrc;
            $scope.user.firstchar = friend.firstchar;
            $scope.user.displayName = friend.displayName;
        }
        else if (member) {
            $scope.user.id = member.id;
            $scope.user.nickName = member.name;
            $scope.user.portraitUri = member.imgSrc;
            $scope.user.firstchar = member.firstchar;
        }
        else if (isself) {
            $scope.user.id = mainDataServer.loginUser.id;
            $scope.user.nickName = mainDataServer.loginUser.nickName;
            $scope.user.portraitUri = mainDataServer.loginUser.portraitUri;
            $scope.user.firstchar = mainDataServer.loginUser.firstchar;
        }
        else {
            mainServer.user.getInfo(userid).then(function (rep) {
                $scope.user.id = rep.data.result.id;
                $scope.user.nickName = rep.data.result.nickname;
                $scope.user.portraitUri = rep.data.result.portraitUri;
                $scope.user.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.data.result.nickname);
                $scope.user.displayName = rep.data.result.displayName;
                setPortrait();
            });
        }
        var addBlackList = function (id) {
            mainServer.user.addToBlackList(id).success(function () {
                mainDataServer.blackList.add(new webimmodel.Friend({
                    id: $scope.user.id,
                    name: $scope.user.nickName,
                    imgSrc: $scope.user.portraitUri
                }));
            });
        };
        var removeBlackList = function (id) {
            mainServer.user.removeFromBlackList(id).success(function () {
                mainDataServer.blackList.remove(id);
            });
        };
        $scope.user.inBlackList = mainDataServer.blackList.getById(userid) ? true : false;
        var loading = false;
        $scope.removeFriend = function () {
            if (loading)
                return;
            loading = true;
            mainServer.friend.setDisplayName($scope.user.id, "").success(function () {
            }).error(function () {
                console.log("删除好友昵称失败");
            });
            mainServer.friend.delete($scope.user.id).success(function () {
                RongIMSDKServer.removeConversation(webimmodel.conversationType.Private, $scope.user.id).then(function () {
                    loading = false;
                    var bo = mainDataServer.contactsList.removeFriend($scope.user.id);
                    bo ? "" : console.log("删除好友失败");
                    $state.go("main");
                }, function () {
                    console.log("删除失败");
                });
            }).error(function () {
                loading = false;
                webimutil.Helper.alertMessage.error("删除失败", 2);
            });
        };
        $scope.switchchange = function () {
            if ($scope.user.inBlackList) {
                addBlackList($scope.user.id);
            }
            else {
                removeBlackList($scope.user.id);
            }
        };
        $scope.back = function () {
            window.history.back();
        };
        $scope.save = function () {
            if ($scope.modifyName.$valid) {
                mainServer.friend.setDisplayName($scope.user.id, $scope.user.displayName).success(function () {
                    var friend = mainDataServer.contactsList.getFriendById($scope.user.id);
                    var friendOld = webimutil.Helper.cloneObject(friend);
                    var curCon = mainDataServer.conversation.getConversation(1, $scope.user.id);
                    if (curCon) {
                        curCon.title = $scope.user.displayName;
                    }
                    if (friend) {
                        friend.displayName = $scope.user.displayName;
                        mainDataServer.contactsList.updateOrAddFriend(friend);
                        var fold = webimutil.ChineseCharacter.getPortraitChar2(friendOld.displayName || friendOld.name);
                        var fnew = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
                        if (fold != fnew) {
                            mainDataServer.contactsList.removeFriendFromSubgroup(friendOld);
                        }
                    }
                    $scope.back();
                });
                $scope.editable = false;
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var friendinfo = angular.module("webim.friendinfo", ["webim.main.server"]);
friendinfo.controller("friendinfoController", ["$scope", "$rootScope", "$state", "$stateParams", "$window", "mainDataServer", "mainServer", "RongIMSDKServer", '$http',
    function ($scope, $rootScope, $state, $stateParams, $window, mainDataServer, mainServer, RongIMSDKServer, $http) {
        $scope.$on("$viewContentLoaded", function () {
            setPortrait();
        });
        function setPortrait() {
            if (userid) {
                angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[userid.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            }
        }
        $("#__selPortrait").css('opacity', '0');
        $('#__selPortrait').change(function (e) {
            if (e.target.files.length == 0) {
                return;
            }
            var _file = e.target.files[0];
            mainServer.user.getImageToken().success(function (rep) {
                var fd = new FormData();
                fd.append("file", _file);
                fd.append("token", rep.result.token);
                var req = {
                    method: 'POST',
                    url: 'http://up.qiniu.com?',
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    withCredentials: false,
                    data: fd
                };
                $http(req).success(function (res) {
                    mainServer.user.setPortraitUri(IMGDOMAIN + res.key).success(function (rep) {
                        if (rep.code == 200) {
                            $scope.user.portraitUri = IMGDOMAIN + res.key;
                            mainDataServer.loginUser.portraitUri = IMGDOMAIN + res.key;
                        }
                    });
                }).error(function (err) {
                    webimutil.Helper.alertMessage.error("头像上传出错！", 2);
                });
            }).error(function () {
                webimutil.Helper.alertMessage.error("头像上传初始化失败", 2);
            });
        });
        $("#__myPortrait").click(function (e) {
            e.preventDefault();
            if (!$scope.isself || $scope.isself && $scope.conversationtype != 0) {
                return;
            }
            $("#__selPortrait").trigger('click');
        });
        var userid = $stateParams["userid"];
        var groupid = $stateParams["groupid"];
        var targetid = $stateParams["targetid"];
        var conversationtype = $stateParams["conversationtype"];
        var friend = mainDataServer.contactsList.getFriendById(userid);
        var member = friend ? null : mainDataServer.contactsList.getGroupMember(conversationtype ? targetid : groupid, userid);
        var isself = friend ? null : mainDataServer.loginUser.id == userid;
        $scope.conversationtype = conversationtype;
        $scope.isfriend = !!friend;
        $scope.isself = !!isself;
        $scope.user = new webimmodel.UserInfo();
        if ($scope.isself && $scope.conversationtype == 0) {
            $("#__myPortrait").css('cursor', 'pointer');
        }
        if (friend) {
            mainServer.friend.getProfile(userid).success(function (data) {
                var f = new webimmodel.Friend({ id: data.result.user.id, name: data.result.user.nickname, imgSrc: data.result.user.portraitUri });
                f.displayName = data.result.displayName;
                f.mobile = data.result.user.phone;
                var fold = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
                var fnew = webimutil.ChineseCharacter.getPortraitChar2(f.displayName || f.name);
                f.firstchar = webimutil.ChineseCharacter.getPortraitChar(f.displayName || f.name);
                ;
                if (fold != fnew) {
                    mainDataServer.contactsList.removeFriendFromSubgroup(friend);
                    f = mainDataServer.contactsList.updateOrAddFriend(f);
                    mainDataServer.conversation.updateConversationDetail(webimmodel.conversationType.Private, userid, data.result.displayName || data.result.user.nickname, data.result.user.portraitUri);
                    var _member = new webimmodel.Member({
                        id: data.result.user.id,
                        name: data.result.user.nickname,
                        imgSrc: data.result.user.portraitUri
                    });
                    mainDataServer.contactsList.updateGroupMember(_member.id, _member);
                }
                $scope.user.id = f.id;
                $scope.user.nickName = f.name;
                $scope.user.portraitUri = f.imgSrc;
                $scope.user.firstchar = f.firstchar;
                $scope.user.displayName = f.displayName;
                $scope.user.mobile = f.mobile;
                $scope.newName = $scope.user.displayName || $scope.user.nickName;
            });
        }
        else if (isself) {
            $scope.user.id = mainDataServer.loginUser.id;
            $scope.user.nickName = mainDataServer.loginUser.nickName;
            $scope.user.portraitUri = mainDataServer.loginUser.portraitUri;
            $scope.user.firstchar = mainDataServer.loginUser.firstchar;
            $scope.user.mobile = mainDataServer.loginUser.phone;
        }
        else {
            mainServer.user.getInfo(userid).then(function (rep) {
                var f = new webimmodel.Friend({ id: rep.data.result.id, name: rep.data.result.nickname, imgSrc: rep.data.result.portraitUri });
                mainDataServer.conversation.updateConversationDetail(webimmodel.conversationType.Private, userid, rep.data.result.displayName || rep.data.result.nickname, rep.data.result.portraitUri);
                var _member = new webimmodel.Member({
                    id: rep.data.result.id,
                    name: rep.data.result.nickname,
                    imgSrc: rep.data.result.portraitUri
                });
                mainDataServer.contactsList.updateGroupMember(_member.id, _member);
                $scope.user.id = rep.data.result.id;
                $scope.user.nickName = rep.data.result.nickname;
                $scope.user.portraitUri = rep.data.result.portraitUri;
                $scope.user.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.data.result.nickname);
                setPortrait();
            });
        }
        $scope.isEditable = false;
        $scope.newName = $scope.user.displayName || $scope.user.nickName;
        $scope.edit = function () {
            $scope.isEditable = true;
            setTimeout(function () {
                $('#editName').focus();
            }, 0);
        };
        $scope.editSave = function () {
            if ($scope.newName == $scope.user.displayName) {
                $scope.isEditable = false;
                return;
            }
            if ($scope.modifyName.$valid) {
                if (isself) {
                    mainServer.user.setNickName($scope.newName).success(function () {
                        mainDataServer.loginUser.nickName = $scope.newName;
                        mainDataServer.loginUser.firstchar = webimutil.ChineseCharacter.getPortraitChar($scope.newName);
                        $scope.user.nickName = $scope.newName;
                        $scope.isEditable = false;
                    });
                }
                else {
                    mainServer.friend.setDisplayName(userid, $scope.newName).success(function (rep) {
                        if (rep.code == 200) {
                            if (friend) {
                                friend.name = $scope.newName;
                            }
                            mainDataServer.conversation.updateConversationTitle(webimmodel.conversationType.Private, userid, $scope.newName);
                            $scope.user.displayName = $scope.newName;
                            $scope.isEditable = false;
                        }
                    }).error(function () {
                        webimutil.Helper.alertMessage.error("修改用户名失败", 2);
                    });
                }
            }
        };
        $scope.toAddFriend = function () {
            $state.go("main.applyfriend", { userId: $scope.user.id, userName: $scope.user.nickName, groupid: groupid, targetid: targetid, conversationtype: conversationtype });
        };
        $scope.toConversation = function () {
            $state.go("main.chat", { targetId: $scope.user.id, targetType: webimmodel.conversationType.Private }, { location: "replace" });
        };
        var addBlackList = function (id) {
            mainServer.user.addToBlackList(id).success(function () {
                mainDataServer.blackList.add(new webimmodel.Friend({
                    id: $scope.user.id,
                    name: $scope.user.nickName,
                    imgSrc: $scope.user.portraitUri
                }));
            });
        };
        var removeBlackList = function (id) {
            mainServer.user.removeFromBlackList(id).success(function () {
                mainDataServer.blackList.remove(id);
            });
        };
        $scope.user.inBlackList = mainDataServer.blackList.getById(userid) ? true : false;
        var loading = false;
        $scope.removeFriend = function () {
            if (loading)
                return;
            loading = true;
            mainServer.friend.setDisplayName($scope.user.id, "").success(function () {
            }).error(function () {
                console.log("删除好友昵称失败");
            });
            mainServer.friend.delete($scope.user.id).success(function () {
                RongIMSDKServer.removeConversation(webimmodel.conversationType.Private, $scope.user.id).then(function () {
                    loading = false;
                    var bo = mainDataServer.contactsList.removeFriend($scope.user.id);
                    bo ? "" : console.log("删除好友失败");
                    $state.go("main");
                }, function () {
                    console.log("删除失败");
                });
            }).error(function () {
                loading = false;
                webimutil.Helper.alertMessage.error("删除失败", 2);
            });
        };
        $scope.switchchange = function () {
            if ($scope.user.inBlackList) {
                addBlackList($scope.user.id);
            }
            else {
                removeBlackList($scope.user.id);
            }
        };
        function goback() {
            if (groupid && groupid != "0") {
                $state.go("main.groupinfo", { groupid: groupid, conversationtype: conversationtype });
            }
            else {
                if (conversationtype && conversationtype != 0) {
                    $state.go("main.chat", { targetId: targetid, targetType: conversationtype });
                }
                else {
                    $state.go("main");
                }
            }
        }
        $scope.back = function () {
            if ($scope.isEditable) {
                $scope.editSave();
            }
            else {
                window.history.back();
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var addgroup = angular.module("webim.addgroup", []);
addgroup.controller("searchgroupController", ["$scope", "$state",
    function ($scope, $state) {
        $scope.grouplist = [];
        $scope.searchgroup = function (content) {
            $scope.grouplist = [{ groupName: "群组一（静态数据）", groupId: "group1" },
                { groupName: "群组二（静态数据）", groupId: "group2" }];
        };
        $scope.back = function () {
            window.history.back();
        };
    }]);
addgroup.controller("applygroupController", ["$scope", "$state", "$stateParams", "mainServer", "mainDataServer",
    function ($scope, $state, $stateParams, mainServer, mainDataServer) {
        // $scope.applygroupbtn = function() {
        //     var groupId = $stateParams["groupId"];
        //     var groupName = $stateParams["groupName"];
        //
        //     $scope.title = groupName;
        //     //申请加群  给群组创建者发送通知消息
        //
        //     console.log("未实现：加入群组" + groupId)
        // }
        $scope.back = function () {
            $state.go("main.searchgroup");
        };
    }]);
addgroup.directive("addgroupitem", ["$state", "mainDataServer",
    function ($state, mainDataServer) {
        return {
            restrict: "E",
            scope: {
                item: "="
            },
            template: '<li class="chat_item joinGroup_item">' +
                '<div class="photo">' +
                '<img class="img" src="css/img/barBg.png" alt="">' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.groupName}}</span>' +
                '</h3>' +
                '<p class="msg ng-scope">' +
                '<span>( 28/500 )</span>' +
                '</p>' +
                '<button class="functionBoxBtn" ng-click="applygroupsrc()">申请</button>' +
                '</div>' +
                '</li>',
            link: function (scope, ele, attr) {
                scope.applygroupsrc = function () {
                    if (mainDataServer.contactsList.getGroupById(scope.item.groupId)) {
                        alert("您已经在群组里");
                        return;
                    }
                    $state.go("main.applygroup", { groupId: scope.item.groupId });
                };
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var createGroup = angular.module("webim.creategroup", []);
createGroup.controller("creategroupController", ["$scope", "$state",
    function ($scope, $state) {
        $scope.groupName = "";
        $scope.submite = function () {
            var name = ($scope.groupName || "").trim();
            if (name.length >= 2 && name.length <= 10) {
                $state.go("main.groupaddmember", { iscreate: "true", idorname: $scope.groupName });
            }
            else {
                webimutil.Helper.alertMessage.error("名称长度2-10", 2);
            }
        };
        document.getElementById("groupName").onkeydown = function (e) {
            if (e.keyCode == 13 || e.keyCode == 10) {
                $scope.submite();
            }
        };
        $scope.back = function () {
            window.history.back();
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var groupAddMember = angular.module("webim.groupaddmember", []);
groupAddMember.controller("groupaddmemberController", ["$scope", "$state", "$stateParams", "mainDataServer", "mainServer",
    function ($scope, $state, $stateParams, mainDataServer, mainServer) {
        $scope.save = function () {
            throw new Error("Not implemented yet");
        };
        $scope.idorname = $stateParams["idorname"];
        $scope.isLoading = false;
        if ($stateParams["iscreate"] == "true") {
            var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function (item) { return item.list; }));
            friendList = friendList.filter(function (item, index, arr) {
                return item.id != mainDataServer.loginUser.id;
            });
            var rawFriendList = webimutil.Helper.cloneObject(friendList);
            $scope.friendList = webimutil.Helper.cloneObject(friendList);
            $scope.searchfriend = function (str) {
                if (str == "") {
                    $scope.friendList.length = 0;
                    $scope.friendList = webimutil.Helper.cloneObject(rawFriendList);
                }
                else {
                    var list = mainDataServer.contactsList.find(str, rawFriendList);
                    $scope.friendList.length = 0;
                    $scope.friendList = webimutil.Helper.cloneObject(list);
                }
            };
            $scope.save = function () {
                if ($scope.isLoading) {
                    return;
                }
                var membersid = [];
                var members = [];
                $scope.friendList.forEach(function (item) {
                    if (item.isSelected) {
                        membersid.push(item.id + "");
                        members.push(item);
                    }
                });
                if (membersid.length < 1) {
                    webimutil.Helper.alertMessage.error("至少要有1个群成员", 2);
                    return;
                }
                $scope.isLoading = true;
                membersid.push(mainDataServer.loginUser.id);
                mainServer.group.create($scope.idorname, membersid).success(function (rep) {
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
                        members = undefined;
                        membersid = undefined;
                        webimutil.Helper.alertMessage.success("创建成功！", 2);
                        $state.go("main.chat", { targetId: group.id, targetType: webimmodel.conversationType.Group });
                    }
                    else if (rep.code == 1000) {
                        webimutil.Helper.alertMessage.error("群组超过上限", 2);
                    }
                    $scope.isLoading = false;
                }).error(function (err) {
                    $scope.isLoading = false;
                    webimutil.Helper.alertMessage.error("失败", 2);
                });
                console.log($scope.friendList.filter(function (item) { return item.isSelected; }));
            };
            $scope.back = function () {
                window.history.back();
            };
            $scope.syncState = function (id, state) {
                rawFriendList.forEach(function (item) {
                    if (item.id == id) {
                        item.isSelected = state;
                    }
                });
            };
        }
        else {
            var friendList = [].concat.apply([], mainDataServer.contactsList.subgroupList.map(function (item) { return item.list; }));
            var memberList = mainDataServer.contactsList.getGroupById($scope.idorname).memberList;
            var membersObj = {};
            for (var i = 0, len = memberList.length; i < len; i++) {
                membersObj[memberList[i].id] = true;
            }
            friendList = friendList.filter(function (item, index, arr) {
                return !membersObj[item.id];
            });
            var rawFriendList = webimutil.Helper.cloneObject(friendList);
            $scope.friendList = webimutil.Helper.cloneObject(friendList);
            $scope.searchfriend = function (str) {
                if (str == "") {
                    $scope.friendList = webimutil.Helper.cloneObject(rawFriendList);
                }
                else {
                    var searchList = mainDataServer.contactsList.find(str, rawFriendList);
                    $scope.friendList = webimutil.Helper.cloneObject(searchList);
                }
            };
            $scope.save = function () {
                if ($scope.isLoading) {
                    return;
                }
                $scope.isLoading = true;
                var membersid = [];
                var members = [];
                $scope.friendList.forEach(function (item) {
                    if (item.isSelected) {
                        membersid.push(item.id + "");
                        members.push(item);
                    }
                });
                if (membersid.length < 1) {
                    webimutil.Helper.alertMessage.error("至少要选择1个成员", 2);
                    return;
                }
                mainServer.group.addMember($scope.idorname, membersid).success(function (rep) {
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
                }).error(function (err) {
                    $scope.isLoading = false;
                    webimutil.Helper.alertMessage.error("失败", 2);
                });
            };
            $scope.back = function () {
                $state.go("main.groupinfo", { groupid: $stateParams["idorname"] });
            };
            $scope.syncState = function (id, state) {
                rawFriendList.forEach(function (item) {
                    if (item.id == id) {
                        item.isSelected = state;
                    }
                });
            };
        }
    }]);
groupAddMember.directive("searchitem", function () {
    return {
        restrict: "E",
        scope: { item: "=" },
        template: '<li class="chat_item joinGroup_item addFriends_item">' +
            '<div class="select">' +
            '<input type="checkbox" class="hide" id="{{item.id}}" ng-change="syncState()" ng-model="item.isSelected" value="136" data-count="" name="">' +
            '<label for="{{item.id}}"></label>' +
            '</div>' +
            '<div class="photo">' +
            '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'css/img/barBg.png\'}}" alt="">' +
            '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
            '</div>' +
            '<div class="info">' +
            '<h3 class="nickname">' +
            '<span class="nickname_text">{{item.name}}</span>' +
            '</h3>' +
            '</div>' +
            '</li>',
        link: function (scope, ele, attr) {
            angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            scope.syncState = function () {
                scope.$parent.syncState(scope.item.id, scope.item.isSelected);
            };
        }
    };
});
/// <reference path="../../typings/tsd.d.ts"/>
var groupDelMember = angular.module("webim.groupdelmember", []);
groupDelMember.controller("groupdelmemberController", ["$scope", "$state", "$stateParams", "mainDataServer", "mainServer",
    function ($scope, $state, $stateParams, mainDataServer, mainServer) {
        $scope.save = function () {
            throw new Error("Not implemented yet");
        };
        $scope.idorname = $stateParams["idorname"];
        $scope.loginuserid = mainDataServer.loginUser.id;
        $scope.isLoading = false;
        var friendList = mainDataServer.contactsList.getGroupById($scope.idorname).memberList;
        var rawFriendList = webimutil.Helper.cloneObject(friendList);
        $scope.friendList = webimutil.Helper.cloneObject(friendList);
        $scope.searchfriend = function (str) {
            if (str == "") {
                $scope.friendList = webimutil.Helper.cloneObject(rawFriendList);
            }
            else {
                var searchList = mainDataServer.contactsList.find(str, rawFriendList);
                $scope.friendList = webimutil.Helper.cloneObject(searchList);
            }
        };
        $scope.save = function () {
            if ($scope.isLoading) {
                return;
            }
            $scope.isLoading = true;
            var membersid = [];
            $scope.friendList.forEach(function (item) {
                if (item.isSelected) {
                    membersid.push(item.id + "");
                }
            });
            if (membersid.length < 1) {
                webimutil.Helper.alertMessage.error("至少要选择1个成员", 2);
                return;
            }
            mainServer.group.kickMember($scope.idorname, membersid).success(function (rep) {
                if (rep.code == 200) {
                    for (var j = 0, len = membersid.length; j < len; j++) {
                        mainDataServer.contactsList.removeGroupMember($scope.idorname, membersid[j]);
                    }
                    membersid = undefined;
                    $state.go("main.groupinfo", { groupid: $scope.idorname });
                    webimutil.Helper.alertMessage.success("删除成功！", 2);
                }
                $scope.isLoading = false;
            }).error(function (err) {
                $scope.isLoading = false;
                webimutil.Helper.alertMessage.error("失败", 2);
            });
        };
        $scope.back = function () {
            $state.go("main.groupinfo", { groupid: $stateParams["idorname"] });
        };
        $scope.syncState = function (id, state) {
            rawFriendList.forEach(function (item) {
                if (item.id == id) {
                    item.isSelected = state;
                }
            });
        };
    }]);
groupDelMember.directive("searchdelitem", function () {
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
            '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'css/img/barBg.png\'}}" alt="">' +
            '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
            '</div>' +
            '<div class="info">' +
            '<h3 class="nickname">' +
            '<span class="nickname_text">{{item.name}}</span>' +
            '</h3>' +
            '</div>' +
            '</li>',
        link: function (scope, ele, attr) {
            angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            scope.syncState = function () {
                scope.$parent.syncState(scope.item.id, scope.item.isSelected);
            };
            scope.isself = scope.loginuserid == scope.item.id;
        }
    };
});
/// <reference path="../../typings/tsd.d.ts"/>
var groupInfo = angular.module("webim.goupinfo", []);
groupInfo.controller("groupinfoController", ["$scope", "$rootScope", "$state", "$stateParams", "mainDataServer", "mainServer", "RongIMSDKServer",
    function ($scope, $rootScope, $state, $stateParams, mainDataServer, mainServer, RongIMSDKServer) {
        $scope.$on("$viewContentLoaded", function () {
            angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[$scope.groupInfo.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
        });
        $scope.isEditable = false;
        var groupid = $stateParams["groupid"];
        var conversationtype = $stateParams["conversationtype"];
        mainServer.group.getById(groupid).success(function (rep) {
            mainDataServer.contactsList.updateGroupInfoById(groupid, new webimmodel.Group({
                id: rep.result.id,
                name: rep.result.name,
                imgSrc: rep.result.portraitUri,
                upperlimit: undefined,
                fact: undefined,
                creater: undefined
            }));
            mainDataServer.conversation.updateConversationDetail(webimmodel.conversationType.Group, groupid, rep.result.name, rep.result.portraitUri);
        }).error(function () {
        });
        $scope.groupInfo = mainDataServer.contactsList.getGroupById(groupid);
        if (!$scope.groupInfo) {
            webimutil.Helper.alertMessage.error("您不在此群组中", 2);
            window.history.back();
        }
        if ($scope.groupInfo.creater == mainDataServer.loginUser.id) {
            $scope.groupInfo.isCreater = true;
        }
        $scope.edit = function () {
            $scope.isEditable = true;
            $scope.newName = $scope.groupInfo.name || '';
            setTimeout(function () {
                var ele = document.getElementById("editName");
                ele.focus();
                ele.select();
            }, 0);
        };
        $scope.editSave = function () {
            if ($scope.newName == $scope.groupInfo.name) {
                $scope.isEditable = false;
                return;
            }
            if ($scope.modifyName.$valid) {
                mainServer.group.rename(groupid, $scope.newName).success(function (rep) {
                    if (rep.code == 200) {
                        if ($scope.groupInfo) {
                            $scope.groupInfo.name = $scope.newName;
                        }
                        mainDataServer.conversation.updateConversationTitle(webimmodel.conversationType.Group, groupid, $scope.newName);
                        $scope.isEditable = false;
                    }
                }).error(function () {
                    webimutil.Helper.alertMessage.error("修改群组名称失败", 2);
                });
            }
        };
        $scope.back = function () {
            if ($scope.isEditable) {
                $scope.editSave();
            }
            else {
                window.history.back();
            }
        };
        var lineNum = 5, memPerLine = 3, _showWidth, _memWidth;
        _showWidth = $('div.groupDataList>div.line').width();
        _memWidth = $('div.line>div.li').width();
        if (_showWidth && _memWidth) {
            memPerLine = Math.floor(_showWidth / _memWidth);
        }
        $scope.isShowMore = false;
        if ($scope.groupInfo.memberList.length > lineNum * memPerLine - 2) {
            $scope.isShowMore = true;
        }
        $scope.showMember = function (num) {
            if (num > 0) {
                $('div.groupDataList>div.line').find('div.li:lt(' + num + ')').show();
            }
            else if (num == 0) {
                $('div.groupDataList>div.line').find('div.li').show();
                $scope.isShowMore = false;
            }
        };
        setTimeout(function () {
            $scope.showMember(lineNum * memPerLine + 1);
        }, 200);
        $scope.quitGroup = function () {
            mainServer.group.quit(groupid).success(function (rep) {
                if (rep.code == 200) {
                    mainDataServer.contactsList.removeGroup(groupid);
                    RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function () {
                        setTimeout(function () {
                            $scope.$emit("conversationChange");
                        }, 200);
                        $state.go("main");
                        webimutil.Helper.alertMessage.success("退出成功", 2);
                    }, function () {
                        setTimeout(function () {
                            $scope.$emit("conversationChange");
                        }, 200);
                        $state.go("main");
                        webimutil.Helper.alertMessage.success("退出成功删除会话失败", 2);
                    });
                }
            }).error(function () {
                webimutil.Helper.alertMessage.error("退出失败", 2);
            });
        };
        $scope.kickMember = function () {
            $state.go("main.groupdelmember", { idorname: $scope.groupInfo.id });
        };
        $scope.toChat = function () {
            $state.go("main.chat", { targetId: $scope.groupInfo.id, targetType: webimmodel.conversationType.Group }, { location: "replace" });
        };
        $scope.toBulletin = function () {
            $state.go("main.groupbulletin", { groupid: groupid });
        };
        $scope.addmember = function () {
            $state.go("main.groupaddmember", { iscreate: "false", idorname: $scope.groupInfo.id });
        };
        $scope.dismiss = function () {
            mainServer.group.dismissGroup(groupid).success(function (rep) {
                if (rep.code == 200) {
                    mainDataServer.contactsList.removeGroup(groupid);
                    RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function () {
                        setTimeout(function () {
                            $scope.$emit("conversationChange");
                        }, 200);
                        $state.go("main");
                        webimutil.Helper.alertMessage.success("解散成功", 2);
                    }, function () {
                        setTimeout(function () {
                            $scope.$emit("conversationChange");
                        }, 200);
                        $state.go("main");
                        webimutil.Helper.alertMessage.success("解散成功删除会话失败", 2);
                    });
                }
            }).error(function () {
            });
        };
    }]);
groupInfo.controller("groupbulletinController", ["$scope", "$state", "$stateParams", "mainServer", "mainDataServer", "RongIMSDKServer", "conversationServer",
    function ($scope, $state, $stateParams, mainServer, mainDataServer, RongIMSDKServer, conversationServer) {
        var groupid = $stateParams["groupid"], targettype = RongIMLib.ConversationType.GROUP;
        var picBackground = $('div.previewPicLayer');
        $scope.isActive = false;
        $scope.showDialog1 = false;
        $scope.showDialog2 = false;
        $scope.groupbulletinbtn = function () {
            if (!$scope.message) {
                webimutil.Helper.alertMessage.error("消息不可为空！", 2);
                return;
            }
            if (!groupid) {
                webimutil.Helper.alertMessage.error("群信息不可为空！", 2);
                return;
            }
            picBackground.css('visibility', 'visible');
            $scope.showDialog1 = true;
        };
        $scope.back = function () {
            $state.go("main.groupinfo", { groupid: groupid, conversationtype: targettype });
        };
        $scope.cancelbtn = function () {
            $scope.showDialog1 = false;
            $scope.showDialog2 = true;
        };
        $scope.cancelbtn2 = function () {
            $scope.showDialog1 = false;
            $scope.showDialog2 = false;
            picBackground.css('visibility', 'hidden');
        };
        $scope.quitbtn = function () {
            $scope.showDialog1 = false;
            $scope.showDialog2 = false;
            picBackground.css('visibility', 'hidden');
            $state.go("main.groupinfo", { groupid: groupid, conversationtype: targettype });
        };
        $scope.publicbtn = function () {
            $scope.showDialog1 = false;
            picBackground.css('visibility', 'hidden');
            var msg = RongIMLib.TextMessage.obtain('@所有人\n' + $scope.message);
            var mentioneds = new RongIMLib.MentionedInfo();
            mentioneds.type = webimmodel.AtTarget.All;
            mentioneds.userIdList = [""];
            msg.mentionedInfo = mentioneds;
            RongIMSDKServer.sendMessage(targettype, groupid, msg, true).then(function (data) {
                webimutil.Helper.alertMessage.success("发布成功", 2);
                $state.go("main.groupinfo", { groupid: groupid, conversationtype: targettype });
            }, function (error) {
                var content = '';
                switch (error.errorCode) {
                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                        content = "您的消息已经发出，但被对方拒收";
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                        content = "你不在该群组中";
                        break;
                    default:
                }
                if (content) {
                    var msg = webimutil.Helper.cloneObject(error.message);
                    msg.content = content;
                    msg.panelType = webimmodel.PanelType.InformationNotification;
                }
            });
            var msgouter = packmysend(msg, webimmodel.MessageType.TextMessage);
            conversationServer.addHistoryMessages(groupid, targettype, webimmodel.Message.convertMsg(msgouter));
            $scope.mainData.conversation.updateConStatic(webimmodel.Message.convertMsg(msgouter), true, true);
        };
        $scope.$watch('message', function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            if (newValue.length > 0) {
                $scope.isActive = true;
            }
            else {
                $scope.isActive = false;
            }
        });
        function packmysend(msg, msgType) {
            var msgouter = new RongIMLib.Message();
            msgouter.content = msg;
            msgouter.conversationType = targettype;
            msgouter.targetId = groupid;
            msgouter.sentTime = (new Date()).getTime() - RongIMLib.RongIMClient.getInstance().getDeltaTime();
            msgouter.messageDirection = RongIMLib.MessageDirection.SEND;
            msgouter.messageType = msgType;
            msgouter.senderUserId = mainDataServer.loginUser.id;
            return msgouter;
        }
    }]);
groupInfo.directive("member", ["$state", "mainDataServer", function ($state, mainDataServer) {
        return {
            restrict: "E",
            scope: { item: "=", isshow: "=" },
            template: '<div class="clearfix li" style="display:none" ng-click="showinfo()">' +
                '<img class="portrait img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'css/img/barBg.png\'}}" alt="">' +
                '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
                '<span>{{showName}}</span>' +
                '</div>',
            link: function (scope, ele, attr) {
                angular.element(ele[0].getElementsByClassName("portrait")[1]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                var user = mainDataServer.contactsList.getFriendById(scope.item.id);
                if (user) {
                    scope.showName = user.displayName || user.name;
                }
                scope.showName = scope.item.displayName || scope.showName || scope.item.name;
                scope.showinfo = function () {
                    $state.go("main.friendinfo", { userid: scope.item.id, groupid: scope.$parent.groupInfo.id, targetid: scope.$parent.groupInfo.id, conversationtype: $state.params["conversationtype"] });
                };
                scope.loginUserid = mainDataServer.loginUser.id;
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var webim;
(function (webim) {
    var organization = angular.module('webim.organization', ['ngDialog']);
    organization.service('organizationgroup', ['ngDialog', function (ngDialog) {
            var group = {
                showPanle: function (groupid) {
                    ngDialog.open({
                        templateUrl: 'views/organizatioingroup.tpl.html',
                        controller: 'organizationgroupController',
                        className: 'ngdialog-organizationgroup',
                        showClose: false,
                        data: {
                            groupid: groupid
                        }
                    });
                }
            };
            return group;
        }]);
    organization.controller('organizationgroupController', ["$scope", '$state', 'ngDialog', 'mainServer', 'mainDataServer', 'searchData', '$q',
        function ($scope, $state, ngDialog, mainServer, mainDataServer, searchData, $q) {
            var groupid = $scope.ngDialogData.groupid;
            $scope.organizationList = [];
            $scope.groupMember = [];
            var oldGroupMember;
            $scope.searchList = [];
            $scope.showCreateGroup = false;
            $scope.searchControl = {};
            $scope.isCreater = false;
            $scope.disableRemove = [];
            $scope.friendList = [];
            $scope.loginuserid = mainDataServer.loginUser.id;
            mainDataServer.contactsList.subgroupList.forEach(function (item) {
                $scope.friendList = $scope.friendList.concat(item.list);
            });
            $scope.clear = function () {
                $scope.searchControl.clear();
            };
            if (groupid) {
                var group = mainDataServer.contactsList.getGroupById(groupid);
                oldGroupMember = group.memberList.map(function (item) {
                    return item.id;
                });
                $scope.isCreater = group.creater === mainDataServer.loginUser.id;
                if ($scope.isCreater) {
                    $scope.groupMember = angular.copy(group.memberList);
                }
                else {
                    $scope.disableRemove = angular.copy(group.memberList);
                }
            }
            $scope.search = function (str) {
                if (str) {
                    if (!$scope.showfriend) {
                        searchData.searchOrganization(str).then(function (result) {
                            $scope.searchList = result;
                        });
                    }
                    else {
                        searchData.searchContact(str).then(function (rep) {
                            $scope.searchList = rep.friendList;
                            console.log($scope.searchList);
                        });
                    }
                }
                else {
                    $scope.searchList = [];
                }
            };
            $scope.addMemberFromFriend = function (friend) {
                if (!existMemberList(friend.id)) {
                    $scope.groupMember.unshift({
                        id: friend.id,
                        name: friend.name,
                        imgSrc: friend.imgSrc
                    });
                }
            };
            function existMemberList(id) {
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
            $scope.addMember = function (member) {
                if (!existMemberList(member.userId)) {
                    $scope.groupMember.unshift({
                        id: member.userId,
                        name: member.displayName,
                        imgSrc: member.imgSrc
                    });
                }
            };
            $scope.removeMember = function (id) {
                var arr = $scope.groupMember;
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].id === id) {
                        arr.splice(i, 1);
                        return true;
                    }
                }
                return false;
            };
            $scope.selection = function (node) {
                console.log(node);
            };
            $scope.updateMember = function () {
                if (groupid) {
                    var removeids = [];
                    var addids = [];
                    var memberIds = $scope.groupMember.map(function (item) {
                        if (oldGroupMember.indexOf(item.id) == -1) {
                            addids.push(item.id);
                        }
                        return item.id;
                    });
                    oldGroupMember.forEach(function (item) {
                        if (memberIds.indexOf(item) == -1) {
                            removeids.push(item);
                        }
                    });
                    if (!$scope.isCreater) {
                        mainServer.group.addMember(groupid, memberIds).then(function () {
                        });
                    }
                    else {
                        if (addids.length > 0) {
                            mainServer.group.addMember(groupid, addids).then(function () {
                            });
                        }
                        if (removeids.length > 0) {
                            mainServer.group.kickMember(groupid, removeids).then(function () {
                            });
                        }
                    }
                    $scope.closeThisDialog();
                }
            };
            $scope.enterMember = function () {
                $scope.groupform.$setPristine();
                $scope.groupform.$setUntouched();
                $scope.showCreateGroup = true;
            };
            $scope.cancelCreate = function () {
                $scope.showCreateGroup = false;
            };
            $scope.createGroup = function () {
                var memberIds = $scope.groupMember.map(function (item) {
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
                mainServer.group.create($scope.groupname, memberIds).then(function (rep) {
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
                    }
                    else if (rep.code == 1000) {
                        webimutil.Helper.alertMessage.error("群组超过上限", 2);
                    }
                    $scope.closeThisDialog();
                });
            };
        }]);
})(webim || (webim = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var mainCtr = angular.module("webim.main.controller", ["webim.main.server", "webim.conversation.server"]);
var IMGDOMAIN = window.__sealtalk_config.upload.image;
var FILEDOMAIN = window.__sealtalk_config.upload.file;
mainCtr.controller("mainController", ["$scope", "$state", "$window", "$timeout", "$http",
    "mainDataServer", "conversationServer", "mainServer", "RongIMSDKServer", "appconfig", 'searchData', 'organizationgroup',
    function ($scope, $state, $window, $timeout, $http, mainDataServer, conversationServer, mainServer, RongIMSDKServer, appconfig, searchData, organizationgroup) {
        var isConnecting = false;
        if (!mainDataServer.loginUser.id) {
            var userid = webimutil.CookieHelper.getCookie("loginuserid"), usertoken = webimutil.CookieHelper.getCookie("loginusertoken"), usermobile = webimutil.CookieHelper.getCookie("loginusermobile");
            if (userid) {
                mainDataServer.loginUser.id = userid;
                mainDataServer.loginUser.token = usertoken;
                mainDataServer.loginUser.phone = usermobile;
            }
            else {
                mainServer.user.logout().success(function () {
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
        mainServer.user.getInfo(mainDataServer.loginUser.id).success(function (rep) {
            if (rep.code == 200) {
                mainDataServer.loginUser.nickName = rep.result.nickname;
                mainDataServer.loginUser.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                mainDataServer.loginUser.portraitUri = rep.result.portraitUri;
                angular.element(document.getElementById("loginuser")).css("background-color", webimutil.Helper.portraitColors[mainDataServer.loginUser.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            }
            else {
                console.log("get user info error");
            }
        }).error(function () {
        });
        function preloadimages(arr) {
            var newimages = [];
            for (var i = 0; i < arr.length; i++) {
                newimages[i] = new Image();
                newimages[i].src = arr[i];
            }
        }
        preloadimages(['./css/img/message_state.png']);
        $scope.mainData = mainDataServer;
        var isPhone = false;
        var isChat = false;
        $scope.isShowChat = !isPhone || isChat;
        $scope.switchbtn = {
            isFriendList: false,
            issearchList: false
        };
        $scope.showChat = function () {
            $scope.switchbtn.isFriendList = false;
            $scope.switchbtn.issearchList = false;
            $scope.switchbtn.searchMessage = false;
        };
        $scope.showContact = function () {
            $scope.switchbtn.isFriendList = true;
            $scope.switchbtn.issearchList = false;
            $scope.switchbtn.searchMessage = false;
        };
        $scope.curCon = "";
        $scope.unSelectContact = function () {
            $('div.communicateList').find('div.members_item').removeClass("selected");
            $('div.communicateList').find('div.notice_item').removeClass("selected");
        };
        $scope.selectGo = function (id, type) {
            if ($scope.switchbtn.isFriendList) {
                $state.go("main.friendinfo", { userid: id, groupid: "0", targetid: "0", conversationtype: "0" });
            }
            else {
                $state.go("main.chat", { targetId: id, targetType: type }, { location: "replace" });
            }
        };
        $scope.selectGoGroup = function (id, type) {
            if ($scope.switchbtn.isFriendList) {
                $state.go("main.groupinfo", { groupid: id, conversationtype: "0" });
            }
            else {
                $state.go("main.chat", { targetId: id, targetType: type }, { location: "replace" });
            }
        };
        $scope.selectMember = function (item) {
            $scope.atShow = false;
        };
        $scope.searchControl = {};
        $scope.$watch('switchbtn.isFriendList', function (newVal, oldVal) {
            if (newVal === oldVal)
                return;
            $scope.searchControl.clear();
        });
        $scope.search = function (content) {
            if (content.trim()) {
                $scope.searchList = {};
                if ($scope.switchbtn.searchMessage) {
                    $scope.showsearchconversation = true;
                    searchData.getConversationByContent(content).then(function (data) {
                        $scope.searchList.conversations = [];
                        for (var i = 0, len = data.length; i < len; i++) {
                            var type = data[i].conversationType;
                            if (type == 1 || type == 3) {
                                var result = mainDataServer.conversation.parseConversation(data[i]);
                                result.imgSrc = result.imgSrc || './css/img/user.png';
                                $scope.searchList.conversations.push(result.item);
                            }
                        }
                    });
                }
                else {
                    $scope.switchbtn.issearchList = true;
                    searchData.searchContact(content).then(function (search) {
                        $scope.searchList = search;
                    });
                }
            }
            else {
                $scope.switchbtn.issearchList = false;
                $scope.showsearchconversation = false;
                $scope.searchList.conversations = [];
            }
        };
        $scope.tonotification = function () {
            mainDataServer.notification.hasNewNotification = false;
            $state.go("main.notification");
        };
        $scope.showPasteDiv = function (visible) {
            $scope.$broadcast('showPasteDiv', visible);
        };
        $scope.uploadPasteImage = function () {
            $scope.$broadcast('uploadPasteImage');
        };
        $scope.checkSend = function (e) {
            var pic = document.getElementsByClassName("previewPic")[0];
            if (e.keyCode === 13 && pic.style.visibility == 'visible') {
                $scope.uploadPasteImage();
                e.preventDefault();
            }
        };
        function refreshconversationList() {
            $scope.mainData.conversation.updateConversations();
        }
        $scope.$on("conversationChange", function () {
            refreshconversationList();
        });
        $scope.$watch("mainData.conversation.totalUnreadCount", function (newVal, oldVal) {
            if (newVal == oldVal) {
                return;
            }
            if (window.Electron) {
                window.Electron.updateBadgeNumber(newVal);
            }
        });
        $scope.$on("$viewContentLoaded", function () {
            if ($state.is("main")) {
                isChat = false;
                $scope.isShowChat = !isPhone || isChat;
                $scope.isShowLeft = !isPhone || !isChat;
            }
            else {
                isChat = true;
                $scope.isShowChat = !isPhone || isChat;
                $scope.isShowLeft = !isPhone || !isChat;
            }
            function pageLayout() {
                if (document.documentElement.clientWidth < 600) {
                    isPhone = true;
                    $scope.isShowChat = !isPhone || isChat;
                    $scope.isShowLeft = !isPhone || !isChat;
                    var ele = document.querySelector(".mainBox");
                    if (ele) {
                        ele.style.width = document.documentElement.clientWidth - parseFloat(getComputedStyle(document.querySelector(".toolbar")).width) + "px";
                    }
                }
                else {
                    isPhone = false;
                    $scope.isShowChat = !isPhone || isChat;
                    $scope.isShowLeft = !isPhone || !isChat;
                }
                var chat = document.getElementById("chatArea");
                if (chat) {
                    chat.style.height = document.documentElement.clientHeight - 54 + "px";
                }
                var arr = document.getElementsByClassName("communicateList");
                for (var i = 0, len = arr.length; i < len; i++) {
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
                var err = document.getElementsByClassName("no_network");
                if (!ele || !err[0])
                    return;
                err[0].style.width = getComputedStyle(document.querySelector('#Messages')).width;
            }
            pageLayout();
            adjustNoNet();
            $window.onresize = function () {
                pageLayout();
                adjustNoNet();
                $scope.$apply();
            };
        });
        $scope.$on('reconnect', function () {
            reconnectServer();
        });
        mainDataServer.notification.notificationList = [];
        mainDataServer.contactsList.subgroupList = [];
        mainServer.friend.getAll().success(function (rep) {
            var arr = rep.result;
            for (var i = 0, len = arr.length; i < len; i++) {
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
        }).error(function (e) {
            console.log(e);
        });
        mainDataServer.blackList.list = [];
        mainServer.user.getBlackList().success(function (rep) {
            var blist = rep.result;
            for (var i = 0, len = blist.length; i < len; i++) {
                mainDataServer.blackList.add(new webimmodel.Friend({
                    id: blist[i].user.id,
                    name: blist[i].user.nickname,
                    imgSrc: blist[i].user.portraitUri
                }));
            }
        }).error(function () {
        });
        mainDataServer.contactsList.groupList = [];
        mainServer.user.getMyGroups().success(function (rep) {
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
                !function (groupid) {
                    mainServer.group.getGroupMember(group.id).success(function (rep) {
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
                }(group.id);
            }
        }).error(function (err) {
        });
        RongIMSDKServer.init(appconfig.getAppKey());
        var isReconnect = true;
        var isOtherLogin = false;
        RongIMSDKServer.setConnectionStatusListener({
            onChanged: function (status) {
                var myDate = new Date();
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功', myDate.toLocaleString());
                        mainDataServer.isConnected = true;
                        showDisconnectErr(false);
                        isConnecting = false;
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        if (window.Electron) {
                            mainDataServer.isConnected = false;
                            showDisconnectErr(true);
                            isConnecting = true;
                        }
                        else {
                            if (!$state.is("account.signin")) {
                                $state.go("account.signin");
                            }
                        }
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        if (!$state.is("account.signin") && !isOtherLogin) {
                            isOtherLogin = true;
                            $state.go("account.signin");
                            webimutil.Helper.alertMessage.error("您的账号在其他地方登录!");
                            webimutil.NotificationHelper.showNotification({
                                title: "SealTalk",
                                icon: "css/img/SealTalk.ico",
                                body: "您的账号在其他地方登录!"
                            });
                            if (window.Electron) {
                                window.Electron.kickedOff();
                            }
                        }
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用', myDate.toLocaleString(), 'isConnecting:' + isConnecting);
                        mainDataServer.isConnected = false;
                        showDisconnectErr(true);
                        isConnecting = true;
                        checkNetwork({
                            onSuccess: function () {
                                reconnectServer();
                            }
                        });
                        break;
                }
            }
        });
        var typingTimeID;
        var timeOfflineMsg;
        RongIMSDKServer.setOnReceiveMessageListener({
            onReceived: function (data, left) {
                if ($scope.mainData.loginUser.hasSound) {
                    var eleplay = document.getElementById("playsound");
                    eleplay.play();
                }
                var msg = webimmodel.Message.convertMsg(data);
                if (msg.targetId == "") {
                    msg.targetId = mainDataServer.loginUser.id;
                }
                if ($state.is("main.chat")) {
                    RongIMSDKServer.clearMsgUnreadStatus(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId, data.sentTime);
                }
                switch (data.messageType) {
                    case webimmodel.MessageType.ContactNotificationMessage:
                        RongIMSDKServer.clearUnreadCount(data.conversationType, data.targetId);
                        if (data.hasReceivedByOtherClient) {
                            break;
                        }
                        var contact = msg.content;
                        RongIMSDKServer.removeConversation(msg.conversationType, msg.targetId).then(function () {
                            refreshconversationList();
                        });
                        if (contact.operation == "Request") {
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
                                mainServer.user.getInfo(contact.sourceUserId).success(function (rep) {
                                    item.name = rep.result.nickname;
                                    item.portraitUri = rep.result.portraitUri;
                                    item.firstchar = webimutil.ChineseCharacter.getPortraitChar(item.name);
                                    mainDataServer.notification.addNotification(item);
                                }).error(function () {
                                });
                            }
                            else {
                                mainDataServer.notification.addNotification(item);
                            }
                        }
                        else if (contact.operation == "AcceptResponse") {
                            var friend = mainDataServer.contactsList.getFriendById(contact.sourceUserId);
                            if (!friend) {
                                mainServer.user.getInfo(contact.sourceUserId).success(function (rep) {
                                    var res = rep.result;
                                    mainDataServer.contactsList.addFriend(new webimmodel.Friend({
                                        id: res.id,
                                        name: res.nickname,
                                        imgSrc: res.portraitUri
                                    }));
                                    refreshconversationList();
                                }).error(function () {
                                    mainDataServer.contactsList.addFriend(new webimmodel.Friend({
                                        id: contact.sourceUserId,
                                        name: "网络原因暂未取到",
                                        imgSrc: ""
                                    }));
                                    refreshconversationList();
                                });
                            }
                        }
                        break;
                    case webimmodel.MessageType.DiscussionNotificationMessage:
                        break;
                    case webimmodel.MessageType.VoiceMessage:
                        msg.isUnReade = true;
                    case webimmodel.MessageType.TextMessage:
                    case webimmodel.MessageType.LocationMessage:
                    case webimmodel.MessageType.ImageMessage:
                    case webimmodel.MessageType.RichContentMessage:
                    case webimmodel.MessageType.FileMessage:
                        if ($state.is("main.chat") && !document.hidden && msg.conversationType == webimmodel.conversationType.Private && msg.senderUserId == mainDataServer.conversation.currentConversation.targetId) {
                            mainDataServer.isTyping = false;
                        }
                        if ($state.is("main.chat") && !document.hidden && msg.senderUserId != mainDataServer.loginUser.id && msg.conversationType == webimmodel.conversationType.Private) {
                            if (data.offLineMessage) {
                                mainDataServer.conversation.lastOfflineMsg = data;
                                if (!timeOfflineMsg && mainDataServer.conversation.lastOfflineMsg) {
                                    timeOfflineMsg = setTimeout(function () {
                                        conversationServer.sendReadReceiptMessage(mainDataServer.conversation.currentConversation.targetId, mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.lastOfflineMsg.messageUId, mainDataServer.conversation.lastOfflineMsg.sentTime);
                                        timeOfflineMsg = null;
                                    }, 1000);
                                }
                            }
                            else {
                                conversationServer.sendReadReceiptMessage(mainDataServer.conversation.currentConversation.targetId, mainDataServer.conversation.currentConversation.targetType, data.messageUId, data.sentTime);
                            }
                        }
                        addmessage(msg);
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
                            RongIMSDKServer.clearMsgUnreadStatus(msg.conversationType, msg.targetId, data.sentTime);
                            var curCon = mainDataServer.conversation.getConversation(msg.conversationType, msg.targetId);
                            if (curCon) {
                                curCon.atStr = '';
                                mainDataServer.conversation.updateTotalUnreadCount();
                                curCon.unReadNum = 0;
                            }
                        }
                        else if (!data.offLineMessage) {
                            if (msg.senderUserName) {
                                webimutil.NotificationHelper.showNotification({
                                    title: msg.senderUserName,
                                    icon: "css/img/SealTalk.ico",
                                    body: webimmodel.Message.messageToNotification(data, mainDataServer.loginUser.id, true), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                });
                            }
                            else {
                                mainServer.user.getInfo(msg.senderUserId).then(function (rep) {
                                    msg.senderUserName = rep.data.result.nickname;
                                    webimutil.NotificationHelper.showNotification({
                                        title: msg.senderUserName + "(非好友)",
                                        icon: "css/img/SealTalk.ico",
                                        body: webimmodel.Message.messageToNotification(data, mainDataServer.loginUser.id, true), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                    });
                                });
                            }
                        }
                        break;
                    case webimmodel.MessageType.GroupNotificationMessage:
                        if (data.objectName == "RC:GrpNtf" && !data.hasReceivedByOtherClient) {
                            var groupNotification = data.content;
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
                                            mainServer.user.getInfo(changemembers[a]).success(function (rep) {
                                                mainDataServer.contactsList.addGroupMember(groupid, new webimmodel.Member({
                                                    id: rep.result.id,
                                                    name: rep.result.nickname,
                                                    imgSrc: rep.result.portraitUri,
                                                    role: "1"
                                                }));
                                            }).error(function () {
                                            });
                                        }
                                    }
                                    else {
                                        mainServer.group.getById(groupid).success(function (rep) {
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
                                            mainServer.group.getGroupMember(groupid).success(function (rep) {
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
                                        }).error(function () {
                                        });
                                    }
                                    break;
                                case "Quit":
                                    var changemembers = groupNotification.data.data.targetUserIds.join().split(",");
                                    var groupid = data.targetId;
                                    var self = changemembers.indexOf(mainDataServer.loginUser.id + "");
                                    if (self == -1) {
                                        mainDataServer.contactsList.removeGroupMember(groupid, changemembers[0]);
                                    }
                                    else {
                                        mainDataServer.contactsList.removeGroup(groupid);
                                        RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function () {
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
                                    }
                                    else {
                                        var temporarynotifi = new webimmodel.WarningNoticeMessage(groupNotification.data.data.operatorNickname + '将你移出了群组');
                                        mainDataServer.notification.addNotification(temporarynotifi);
                                        if (!$state.is("main.notification")) {
                                            mainDataServer.notification.hasNewNotification = true;
                                        }
                                        mainDataServer.contactsList.removeGroup(groupid);
                                        RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function () {
                                            refreshconversationList();
                                        });
                                        if ($state.is("main.chat") && $state.params["targetId"] == groupid && $state.params["targetType"] == webimmodel.conversationType.Group) {
                                            $state.go("main");
                                        }
                                    }
                                    break;
                                case "Rename":
                                    var groupid = data.targetId;
                                    var groupname = mainDataServer.contactsList.getGroupById(groupid) ? mainDataServer.contactsList.getGroupById(groupid).name : groupid;
                                    var operator = isself ? "你" : groupNotification.data.data.operatorNickname;
                                    groupNotification.data.data.targetGroupName = RongIMLib.RongIMEmoji.calculateUTF(groupNotification.data.data.targetGroupName);
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
                                    mainServer.group.getById(groupid).success(function (rep) {
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
                                        mainServer.group.getGroupMember(groupid).success(function (rep) {
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
                                    }).error(function () {
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
                                        RongIMSDKServer.removeConversation(webimmodel.conversationType.Group, groupid).then(function () {
                                            refreshconversationList();
                                        });
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
                        if (msg.objectName == 'RC:ReadNtf' && msg.senderUserId == mainDataServer.loginUser.id) {
                            var _readReceiptMessage = data.content;
                            RongIMSDKServer.clearMsgUnreadStatus(msg.conversationType, msg.targetId, data.sentTime);
                            var curCon = mainDataServer.conversation.getConversation(msg.conversationType, msg.targetId);
                            if (curCon) {
                                curCon.atStr = '';
                                mainDataServer.conversation.updateTotalUnreadCount();
                                curCon.unReadNum = 0;
                            }
                        }
                        break;
                    case webimmodel.MessageType.RecallCommandMessage:
                        if (msg.objectName == 'RC:RcCmd') {
                        }
                        break;
                    case webimmodel.MessageType.TypingStatusMessage:
                        if ($state.is("main.chat") && !document.hidden && msg.conversationType == webimmodel.conversationType.Private && msg.senderUserId == mainDataServer.conversation.currentConversation.targetId) {
                            mainDataServer.isTyping = true;
                            if (typingTimeID) {
                                clearTimeout(typingTimeID);
                            }
                            typingTimeID = setTimeout(function () {
                                mainDataServer.isTyping = false;
                                $scope.$apply();
                            }, 6000);
                        }
                        break;
                    case webimmodel.MessageType.InviteMessage:
                    case webimmodel.MessageType.HungupMessage:
                        addmessage(msg);
                        break;
                    case webimmodel.MessageType.ReadReceiptRequestMessage:
                        if ($state.is("main.chat") && !document.hidden && msg.conversationType == webimmodel.conversationType.Group && msg.targetId == mainDataServer.conversation.currentConversation.targetId) {
                            RongIMSDKServer.sendReceiptResponse(msg.conversationType, msg.targetId).then(function () {
                                console.log('sendReadReceiptResponseMessage success');
                            }, function (error) {
                                console.log('sendReadReceiptResponseMessage error', error.errorCode);
                            });
                        }
                        break;
                    case webimmodel.MessageType.ReadReceiptResponseMessage:
                        var receiptResponseItem = data.content;
                        var ids = receiptResponseItem.receiptMessageDic[mainDataServer.loginUser.id];
                        if (!ids) {
                            return;
                        }
                        for (var i = 0, len = ids.length; i < len; i++) {
                            var itemById = conversationServer.getMessageById(msg.targetId, msg.conversationType, ids[i]);
                            if (itemById && msg.receiptResponse && msg.receiptResponse[ids[i]]) {
                                itemById.receiptResponse = msg.receiptResponse;
                            }
                        }
                        break;
                    case webimmodel.MessageType.SyncReadStatusMessage:
                        conversationServer.clearAtMessage(msg.targetId, msg.conversationType);
                        var _syncReadStatusMessage = data.content;
                        RongIMSDKServer.clearMsgUnreadStatus(msg.conversationType, msg.targetId, data.sentTime);
                        var curCon = mainDataServer.conversation.getConversation(msg.conversationType, msg.targetId);
                        if (curCon) {
                            curCon.atStr = '';
                            mainDataServer.conversation.updateTotalUnreadCount();
                            curCon.unReadNum = 0;
                        }
                        break;
                    default:
                        console.log(data.messageType + "：未处理");
                        break;
                }
                if (data.offLineMessage && left == 0) {
                    RongIMSDKServer.getConversationList().then(function (list) {
                        mainDataServer.conversation.updateConversations();
                    });
                }
                else if (data.offLineMessage) { }
                else {
                    $scope.mainData.conversation.updateConStatic(msg, true, $state.is("main.chat") && !document.hidden);
                    $scope.$apply();
                }
            }
        });
        if (mainDataServer.loginUser.token) {
            console.log(mainDataServer.loginUser.id);
            RongIMSDKServer.connect(mainDataServer.loginUser.token, mainDataServer.loginUser.id).then(function (userId) {
                console.log("connect success1:" + userId);
                RongIMSDKServer.getConversationList().then(function (list) {
                    mainDataServer.conversation.updateConversations();
                });
                RongIMLib.RongUploadLib.init({ domain: IMGDOMAIN, drop_element: '', container: 'MessageForm', browse_button: 'upload-image' }, { domain: FILEDOMAIN, drop_element: 'chatMain', container: 'MessageForm', browse_button: 'upload-file' });
            }, function (error) {
                if (error.tokenError) {
                    mainServer.user.getToken().success(function (data) {
                        if (data.code == "200") {
                            RongIMSDKServer.connect(data.result.token, mainDataServer.loginUser.id).then(function (userId) {
                                console.log("connect success2:" + userId);
                                RongIMSDKServer.getConversationList().then(function (list) {
                                    mainDataServer.conversation.updateConversations();
                                });
                                RongIMLib.RongUploadLib.init({ domain: IMGDOMAIN, drop_element: '', container: 'MessageForm', browse_button: 'upload-image' }, { domain: FILEDOMAIN, drop_element: 'chatMain', container: 'MessageForm', browse_button: 'upload-file' });
                            }, function (error) {
                                if (error.tokenError) {
                                    console.log('token error');
                                }
                            });
                        }
                        else {
                            $state.go("account.signin");
                        }
                    }).error(function (e) {
                        $state.go("account.signin");
                    });
                }
            });
        }
        else {
            mainServer.user.getToken().success(function (data) {
                if (data.code == "200") {
                    RongIMSDKServer.connect(data.result.token, mainDataServer.loginUser.id).then(function (userId) {
                        console.log("connect success3:" + userId);
                        RongIMSDKServer.getConversationList().then(function (list) {
                            mainDataServer.conversation.updateConversations();
                        });
                        RongIMLib.RongUploadLib.init({ domain: IMGDOMAIN, drop_element: '', container: 'MessageForm', browse_button: 'upload-image' }, { domain: FILEDOMAIN, drop_element: 'chatMain', container: 'MessageForm', browse_button: 'upload-file' });
                    }, function (error) {
                        if (error.tokenError) {
                        }
                    });
                }
                else {
                    $state.go("account.signin");
                }
            }).error(function (e) {
                $state.go("account.signin");
            });
        }
        webimutil.NotificationHelper.onclick = function (n) {
            if (n.data)
                $state.go("main.chat", { targetId: n.data.targetId, targetType: n.data.targetType });
        };
        function addmessage(msg) {
            var hislist = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] = conversationServer.historyMessagesCache[msg.conversationType + "_" + msg.targetId] || [];
            if (hislist.length == 0) {
                hislist.push(new webimmodel.GetHistoryPanel());
                if (msg.sentTime.toLocaleDateString() != (new Date()).toLocaleDateString())
                    hislist.push(new webimmodel.TimePanl(msg.sentTime));
            }
            conversationServer.addHistoryMessages(msg.targetId, msg.conversationType, msg);
            if (msg.messageType == webimmodel.MessageType.ImageMessage) {
                setTimeout(function () {
                    $scope.$broadcast("msglistchange");
                }, 200);
            }
            else {
                $scope.$broadcast("msglistchange");
            }
        }
        function showDisconnectErr(flag) {
            var ele = document.querySelector(".no_network");
            if (ele) {
                ele.style.visibility = flag ? 'visible' : 'hidden';
            }
            var sendBtn = document.querySelector(".sendBtn");
            if (sendBtn) {
                sendBtn.className = flag ? 'sendBtn disabled' : 'sendBtn';
            }
        }
        var reconnectTimes = 0, timeInterval = 20, timeID, reconnectTimeID;
        function reconnectServer() {
            if (reconnectTimeID) {
                clearTimeout(reconnectTimeID);
            }
            reconnectTimeID = setTimeout(function () {
                RongIMSDKServer.reconnect({
                    onSuccess: function () {
                        var myDate = new Date();
                        reconnectTimes = 0;
                        console.log("reconnectSuccess", myDate.toLocaleString());
                        if (reconnectTimeID) {
                            clearTimeout(reconnectTimeID);
                        }
                        showDisconnectErr(false);
                        isConnecting = false;
                        mainDataServer.isConnected = true;
                        RongIMSDKServer.getConversationList().then(function () {
                            mainDataServer.conversation.updateConversations();
                        });
                    },
                    onError: function () {
                        mainDataServer.isConnected = false;
                        isConnecting = false;
                        if (reconnectTimes <= 5) {
                            reconnectServer();
                            reconnectTimes += 1;
                        }
                        else {
                            reconnectTimes = 0;
                            var myDate = new Date();
                            console.log("网络正常重连失败！！！", myDate.toLocaleString());
                        }
                    }
                });
            }, timeInterval * reconnectTimes * 1000);
        }
        function checkNetwork(callback) {
            var myDate = new Date();
            console.log('begin checkNetwork', myDate.toLocaleString());
            $http.get("index.html", {
                params: { t: Math.random() }
            }).success(function () {
                if (timeID) {
                    clearTimeout(timeID);
                }
                callback && callback.onSuccess && callback.onSuccess();
            }).error(function () {
                showDisconnectErr(true);
                if (timeID) {
                    clearTimeout(timeID);
                }
                timeID = setTimeout(function () {
                    checkNetwork(callback);
                }, 5000);
            });
        }
        $scope.showgroup = function () {
            organizationgroup.showPanle();
        };
        $scope.showMessageManage = function () {
            $scope.switchbtn.searchMessage = true;
            $scope.showsearchconversation = false;
            RongIMSDKServer.getAllConversations().then(function (data) {
                $scope.allconversations = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].conversationType == 1 || data[i].conversationType == 3) {
                        var result = mainDataServer.conversation.parseConversation(data[i]);
                        $scope.allconversations.push(result.item);
                    }
                }
            });
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var mainDire = angular.module("webim.main.directive", ["webim.main.server"]);
mainDire.directive("conversation", ["$state", "mainDataServer", function ($state, mainDataServer) {
        var timeout = null;
        return {
            restrict: "E",
            scope: {
                item: "="
            },
            template: '<div class="chatList" ng-class="{selected:isCurrentConversation}" id="{{::item.targetType}}_{{::item.targetId}}">' +
                '<div class="chat_item online slide-left">' +
                '<div class="photo">' +
                '<img class="img" ng-show="::item.imgSrc" ng-src="{{::item.imgSrc}}" alt="">' +
                '<div class="portrait" ng-hide="::item.imgSrc">{{::item.firstchar}}</div>' +
                '<i class="Presence Presence--stacked Presence--mainBox" ng-show="{{::item.targetType==4}}"></i>' +
                '</div>' +
                '<div class="ext_info">' +
                '<div class="ext">' +
                '<p class="attr clearfix timer">' +
                '<span class="pull-left">{{::item.lastTime|showTime}}</span>' +
                '</p>' +
                '<p class="attr clearfix">' +
                '<span class="badge" ng-if="item.unReadNum">{{item.unReadNum>99?"99+":item.unReadNum}}</span>' +
                '<span></span>' +
                '</p>' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.title}}</span>' +
                '</h3>' +
                '<p class="msg ng-scope" >' +
                '<span class="at_show" ng-show="item.atStr">{{item.atStr}}</span>' +
                '<span ng-bind-html="item.lastMsg|trustHtml" class="ng-binding"></span>' +
                '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            link: function (scope, ele, attrs, ngModel) {
                if (!scope.item.targetId) {
                    scope.item.imgSrc = 'css/img/barBg.png';
                }
                else if (scope.item.targetType == webimmodel.conversationType.Discussion) {
                    scope.item.imgSrc = 'css/img/room_icon.png';
                }
                else {
                    angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.targetId.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                }
                ele.bind("click", function () {
                    var conversationItems = document.querySelectorAll('#chatArea .chatList');
                    $(conversationItems).each(function (index, conversaiton) {
                        angular.element(conversaiton).removeClass('selected');
                    });
                    angular.element(ele[0]).children().addClass('selected');
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(function () {
                        // 由于性能需要取消双向绑定
                        // scope.$parent.unSelect(scope.item.targetType + '_' + scope.item.targetId);
                        // scope.$parent.$apply();
                        mainDataServer.conversation.totalUnreadCount = mainDataServer.conversation.totalUnreadCount > scope.item.unReadNum ? mainDataServer.conversation.totalUnreadCount - scope.item.unReadNum : 0;
                        scope.item.unReadNum = 0;
                        scope.item.atStr = '';
                        if ($state.is("main") || $state.is("main.none")) {
                            $state.go("main.chat", { targetId: scope.item.targetId, targetType: scope.item.targetType });
                        }
                        else {
                            $state.go("main.chat", { targetId: scope.item.targetId, targetType: scope.item.targetType }, { location: "replace" });
                        }
                    }, 50);
                });
            }
        };
    }]);
mainDire.directive("addbtn", [function () {
        return {
            restrict: "EA",
            link: function (scope, ele, attr) {
                var CLOSE;
                function closeAddbtn() {
                    this.style.display = "none";
                    document.removeEventListener("click", CLOSE, false);
                }
                ele.bind("click", function () {
                    var ul = ele.find("ul")[0];
                    var status = getComputedStyle(ul, null)["display"];
                    if (!status || status == "none") {
                        ul.style.display = "block";
                        CLOSE = function () { closeAddbtn.call(ul); };
                        setTimeout(function () {
                            document.addEventListener("click", CLOSE, false);
                        }, 0);
                    }
                    else {
                        ul.style.display = "none";
                    }
                });
            }
        };
    }]);
mainDire.directive("groupitem", ["$state", "organizationgroup", function ($state, organizationgroup) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<div class="notice_item ">' +
                '<div class="photo">' +
                '<img class="img" ng-show="item.imgSrc" ng-src="{{::item.imgSrc}}" alt="">' +
                '<div class="portrait" ng-hide="::item.imgSrc">{{::item.firstchar}}</div>' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{::item.name}}</span>' +
                '</h3>' +
                '</div>' +
                '<div class="botDivider"></div>' +
                '</div>',
            replace: true,
            link: function (scope, ele, attr) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                ele.on("click", function () {
                    $state.go("main.groupinfo", { groupid: scope.item.id, conversationtype: "0" });
                    scope.$parent.unSelectContact();
                    angular.element(ele[0]).addClass('selected');
                    scope.$parent.selectGoGroup(scope.item.id, webimmodel.conversationType.Group);
                });
            }
        };
    }]);
mainDire.directive("frienditem", ["$state", function ($state) {
        return {
            restrict: "E",
            scope: { item: "=" },
            replace: true,
            template: '<div class="members_item " >' +
                '<div class="photo">' +
                '<img class="img" ng-show="item.imgSrc" ng-src="{{::item.imgSrc}}" alt="">' +
                '<div class="portrait" ng-hide="::item.imgSrc">{{::item.firstchar}}</div>' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{::item.displayName||item.name}}</span>' +
                '</h3>' +
                '</div>' +
                '<div class="botDivider"></div>' +
                '</div>',
            link: function (scope, ele, attr) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                ele.on("click", function () {
                    scope.$parent.selectGo(scope.item.id, webimmodel.conversationType.Private);
                });
            }
        };
    }]);
mainDire.directive("searchInput", ["$timeout", function ($timeout) {
        return {
            restrict: "E",
            scope: {
                search: "&",
                showText: "@",
                delayTime: "@",
                focus: "&",
                control: '=',
                content: '='
            },
            template: '<form class="searchArea clearfix">' +
                '<div class="form-group">' +
                '<input type="text" class="form-control" id="{{::id}}" ng-model="content" placeholder="{{::showText||\'搜索\'}}">' +
                '<label class="" for="{{::id}}"></label>' +
                '</div>' +
                '</form>',
            link: function (scope, ele, attr) {
                scope.id = "groupSearch" + scope.$id;
                scope.clear = function () {
                    scope.content = "";
                    document.getElementById(scope.id).focus();
                };
                scope.delayTime = parseInt(scope.delayTime) || 800;
                var input = ele.find("input");
                scope.content = "";
                input.on("blur", function (e) {
                    angular.element(this).val().trim() ? void (0) : angular.element(this).parent().removeClass("isfocus");
                });
                input.on("focus", function (e) {
                    angular.element(this).parent().addClass("isfocus");
                });
                var _timeout;
                scope.$watch("content", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    $timeout.cancel(_timeout);
                    _timeout = $timeout(function () {
                        scope.search({ content: scope.content });
                    }, scope.delayTime);
                });
                scope.internalControl = scope.control || {};
                scope.internalControl.clear = function () {
                    scope.content = "";
                };
            }
        };
    }]);
mainDire.directive("inputWrap", [function () {
        return {
            restrict: "E",
            scope: { message: "=", maxlength: "=", loadedfocus: "@" },
            template: '<div class="input-wrap">' +
                '<div class="textarea-wrap" style="height: 140px;">' +
                '<div class="textarea-bg" style="display: block;" ng-show="showplaceholder">' +
                '<span class="prompt-text">请输入验证消息</span>' +
                '</div>' +
                '<textarea class="joinGroupInfo textarea" ng-model="message"></textarea>' +
                '</div>' +
                '<div class="wordsLen"><span class="word_start">{{message.length}}</span>/{{maxlength}}</div>' +
                '</div>',
            link: function (scope, ele, attrs) {
                scope.showplaceholder = true;
                scope.maxlength = scope.maxlength || 64;
                var info = scope.$parent.getInfo();
                if (info) {
                    scope.message = info;
                }
                if (scope.loadedfocus) {
                    angular.element(ele).find("textarea")[0].focus();
                    scope.showplaceholder = true;
                }
                ele.find("textarea").bind("focus", function () {
                });
                ele.find("textarea").bind("blur", function () {
                    if (!scope.message || !scope.message.length) {
                        scope.showplaceholder = true;
                    }
                    scope.$apply();
                });
                ele.find("textarea").bind('input propertychange', function () {
                    if (!scope.message || !scope.message.length) {
                        scope.showplaceholder = true;
                    }
                    else {
                        scope.showplaceholder = false;
                    }
                    scope.$apply();
                });
                scope.message = scope.message || "";
                if (scope.message) {
                    scope.showplaceholder = false;
                }
                scope.$watch("message", function (newVal, oldVal) {
                    if (newVal.length > scope.maxlength) {
                        scope.message = newVal.substring(0, scope.maxlength);
                    }
                });
            }
        };
    }]);
mainDire.directive("pwMatch", [function () {
        return {
            require: "ngModel",
            link: function (scope, ele, attrs, ngModel) {
                var inputNames = attrs["pwMatch"].trim().split(".");
                var validfun = function (input) {
                    var form = document.forms[inputNames[0]];
                    var password = form[inputNames[1]].value;
                    var valid = input == password;
                    ngModel.$setValidity("pwmatch", valid);
                    return valid ? password : undefined;
                };
                ngModel.$parsers.push(validfun);
                ngModel.$formatters.push(validfun);
            }
        };
    }]);
mainDire.directive("myFocus", [function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ctrl) {
                ctrl.$focused = false;
                element.on('focus', function () {
                    scope.$apply(function () { ctrl.$focused = true; });
                }).on('blur', function () {
                    scope.$apply(function () { ctrl.$focused = false; });
                });
                element.on("keydown", function (e) {
                    if (e.keyCode === 13 || e.keyCode === 10) {
                        setTimeout(function () {
                            element[0].blur();
                        });
                    }
                });
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var mainServer = angular.module("webim.main.server", []);
mainServer.factory("mainServer", ["$http", "$q", "appconfig", function ($http, $q, appconfig) {
        var serverBaseUrl = appconfig.getBaseUrl();
        var mainServer = {
            user: {
                sendCode: function (phone, region) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/send_code",
                        data: {
                            phone: phone,
                            region: region
                        }
                    });
                },
                verifyCode: function (phone, region, code) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/verify_code",
                        data: {
                            phone: phone,
                            region: region,
                            code: code
                        }
                    });
                },
                checkUsernameAvailable: function (userName) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/check_username_available",
                        data: {
                            username: userName
                        }
                    });
                },
                checkPhoneAvailable: function (phone, region) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/check_phone_available",
                        data: {
                            phone: phone,
                            region: region
                        }
                    });
                },
                signup: function (nickname, password, token) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/register",
                        data: {
                            nickname: nickname,
                            password: password,
                            verification_token: token
                        }
                    });
                },
                signin: function (phone, region, password) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/login",
                        data: {
                            phone: phone,
                            region: region,
                            password: password
                        }
                    });
                },
                logout: function () {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/logout"
                    });
                },
                getInfo: function (id) {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/" + id
                    });
                },
                getBatchInfo: function (ids) {
                    var param = ids.join("&id=");
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/batch?id=" + param
                    });
                },
                setNickName: function (nickname) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/set_nickname",
                        data: {
                            nickname: nickname
                        }
                    });
                },
                getUserByPhone: function (region, phone) {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/find/" + region + "/" + phone
                    });
                },
                resetPassword: function (password, token) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/reset_password",
                        data: {
                            password: password,
                            verification_token: token
                        }
                    });
                },
                modefiyPassword: function (newPassword, oldPassword) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/change_password",
                        data: {
                            newPassword: newPassword,
                            oldPassword: oldPassword
                        }
                    });
                },
                getToken: function () {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/get_token"
                    });
                },
                getBlackList: function () {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/blacklist"
                    });
                },
                addToBlackList: function (userId) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/add_to_blacklist",
                        data: {
                            friendId: userId
                        }
                    });
                },
                removeFromBlackList: function (userId) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/remove_from_blacklist",
                        data: {
                            friendId: userId
                        }
                    });
                },
                sync: function (version) {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/sync/" + version
                    });
                },
                getMyGroups: function () {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/groups"
                    });
                },
                getImageToken: function () {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/user/get_image_token"
                    });
                },
                setPortraitUri: function (uri) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/user/set_portrait_uri",
                        data: {
                            portraitUri: uri
                        }
                    });
                }
            },
            friend: {
                invite: function (friendId, message) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/friendship/invite",
                        data: {
                            friendId: friendId,
                            message: message
                        }
                    });
                },
                getAll: function () {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/friendship/all",
                    });
                },
                agree: function (friendId) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/friendship/agree",
                        data: {
                            friendId: friendId
                        }
                    });
                },
                ignore: function (friendId) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/friendship/ignore",
                        data: {
                            friendId: friendId
                        }
                    });
                },
                delete: function (friendId) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/friendship/delete",
                        data: {
                            friendId: friendId
                        }
                    });
                },
                getProfile: function (id) {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/friendship/" + id + "/profile",
                    });
                },
                setDisplayName: function (friendId, displayName) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/friendship/set_display_name",
                        data: {
                            friendId: friendId,
                            displayName: displayName
                        }
                    });
                }
            },
            group: {
                create: function (name, memberIds) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/group/create",
                        data: {
                            name: name,
                            memberIds: memberIds
                        }
                    });
                },
                rename: function (groupId, name) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/group/rename",
                        data: {
                            name: name,
                            groupId: groupId
                        }
                    });
                },
                getById: function (id) {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/group/" + id
                    });
                },
                getGroupMember: function (id) {
                    return $http({
                        method: "get",
                        url: serverBaseUrl + "/group/" + id + "/members"
                    });
                },
                addMember: function (groupId, memberIds) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/group/add",
                        data: {
                            groupId: groupId,
                            memberIds: memberIds
                        }
                    });
                },
                kickMember: function (groupId, memberIds) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/group/kick",
                        data: {
                            groupId: groupId,
                            memberIds: memberIds
                        }
                    });
                },
                dismissGroup: function (groupId) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/group/dismiss",
                        data: {
                            groupId: groupId
                        }
                    });
                },
                quit: function (groupId) {
                    return $http({
                        method: "POST",
                        url: serverBaseUrl + "/group/quit",
                        data: {
                            groupId: groupId
                        }
                    });
                }
            }
        };
        return mainServer;
    }]);
mainServer.factory("mainDataServer", ["$q", "RongIMSDKServer", "mainServer", function ($q, RongIMSDKServer, mainServer) {
        var mainDataServer = {};
        mainDataServer.loginUser = {};
        mainDataServer.isConnected = false;
        mainDataServer.isTyping = false;
        mainDataServer.conversation = {
            totalUnreadCount: 0,
            lastOfflineMsg: null,
            conversations: [],
            updateTotalUnreadCount: function () {
                RongIMSDKServer.getTotalUnreadCount().then(function (data) {
                    mainDataServer.conversation.totalUnreadCount = data;
                });
            },
            currentConversation: {},
            parseConversation: function (item) {
                var conversationitem = webimmodel.Conversation.convertToWebIM(item, mainDataServer.loginUser.id);
                var removeUnreadCount = 0;
                if (item.unreadMessageCount) {
                    removeUnreadCount = item.unreadMessageCount;
                }
                switch (item.conversationType) {
                    case RongIMLib.ConversationType.CHATROOM:
                        conversationitem.title = "聊天室" + item.targetId;
                        break;
                    case RongIMLib.ConversationType.GROUP:
                        var group = mainDataServer.contactsList.getGroupById(item.targetId);
                        removeUnreadCount = 0;
                        if (!group) {
                            if (item.targetId == '__system__') {
                            }
                            else {
                                (function (id, conv, listi) {
                                    mainServer.group.getById(id).success(function (rep) {
                                        listi.conversationTitle = rep.result.name;
                                        conv.title = rep.result.name;
                                        var obj = webimutil.ChineseCharacter.convertToABC(rep.result.name);
                                        var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.name);
                                        conv.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                                        conv.imgSrc = rep.result.portraitUri;
                                    });
                                }(item.targetId, conversationitem, item));
                            }
                        }
                        else {
                            if (conversationitem.lastMsg && item.latestMessage.objectName != "RC:GrpNtf" && item.latestMessage.objectName != "RC:InfoNtf") {
                                var atStr = '';
                                if (item.mentionedMsg && item.unreadMessageCount > 0) {
                                    conversationitem.mentionedInfo = item.mentionedMsg.mentionedInfo;
                                    var atType = conversationitem.mentionedInfo.type;
                                    var atUsers = conversationitem.mentionedInfo.userIdList;
                                    if (atType == webimmodel.AtTarget.All) {
                                        atStr = "[有人@我]";
                                    }
                                    else if (atType == webimmodel.AtTarget.Part) {
                                        for (var i = 0; i < atUsers.length; i++) {
                                            if (atUsers[i] == mainDataServer.loginUser.id) {
                                                atStr = "[有人@我]";
                                                break;
                                            }
                                        }
                                    }
                                    conversationitem.atStr = atStr;
                                }
                                var member = mainDataServer.contactsList.getGroupMember(group.id, item.latestMessage.senderUserId);
                                if (item.latestMessage.senderUserId == mainDataServer.loginUser.id) {
                                    conversationitem.lastMsg = "你：" + conversationitem.lastMsg;
                                }
                                else if (member) {
                                    conversationitem.lastMsg = member.name + "：" + conversationitem.lastMsg;
                                }
                                else {
                                    (function (id, conv) {
                                        mainServer.user.getInfo(id).success(function (user) {
                                            conv.lastMsg = user.result.nickname + "：" + conversationitem.lastMsg;
                                        });
                                    }(item.latestMessage.senderUserId, conversationitem));
                                }
                            }
                            item.conversationTitle = group ? group.name : "未知群组";
                            conversationitem.title = group ? group.name : "未知群组";
                        }
                        if (conversationitem.lastMsg && item.latestMessage.objectName == "RC:GrpNtf" && item.latestMessage.content.operation == "Create" && item.latestMessage.content.operatorUserId == mainDataServer.loginUser.id) {
                            conversationitem.lastMsg = '你 创建了群组';
                        }
                        conversationitem.firstchar = group ? group.firstchar : "";
                        conversationitem.imgSrc = group ? group.imgSrc : "";
                        conversationitem.firstchar = group ? group.firstchar : "";
                        conversationitem.everychar = group ? group.everychar : "";
                        break;
                    case RongIMLib.ConversationType.PRIVATE:
                        if (item.latestMessage.messageType == webimmodel.MessageType.ContactNotificationMessage) {
                            RongIMSDKServer.removeConversation(RongIMLib.ConversationType.PRIVATE, item.targetId).then(function () {
                            });
                            break;
                        }
                        removeUnreadCount = 0;
                        var isself = mainDataServer.loginUser.id == item.targetId;
                        var friendinfo = mainDataServer.contactsList.getFriendById(item.targetId || item.senderUserId);
                        if (friendinfo) {
                            item.conversationTitle = friendinfo.displayName || friendinfo.name;
                            conversationitem.title = friendinfo.displayName || friendinfo.name;
                            conversationitem.firstchar = friendinfo.firstchar;
                            conversationitem.imgSrc = friendinfo.imgSrc;
                            conversationitem.firstchar = friendinfo.firstchar;
                            conversationitem.everychar = friendinfo.everychar;
                        }
                        else if (item.targetId) {
                            var friendinfo = mainDataServer.contactsList.getNonFriendById(item.targetId || item.senderUserId);
                            if (friendinfo) {
                                item.conversationTitle = friendinfo.displayName || friendinfo.name;
                                conversationitem.title = friendinfo.displayName || friendinfo.name;
                                conversationitem.firstchar = friendinfo.firstchar;
                                conversationitem.imgSrc = friendinfo.imgSrc;
                            }
                            else {
                                (function (id, conv) {
                                    mainServer.user.getInfo(id).success(function (rep) {
                                        conv.title = isself ? rep.result.nickname : rep.result.nickname + "(非好友)";
                                        conv.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                                        var obj = webimutil.ChineseCharacter.convertToABC(rep.result.nickname);
                                        var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                                        conv.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                                        conv.imgSrc = rep.result.portraitUri;
                                        var _friend = new webimmodel.Friend({
                                            id: id,
                                            name: conv.title,
                                            imgSrc: conv.imgSrc
                                        });
                                        _friend.firstchar = f;
                                        mainDataServer.contactsList.addNonFriend(_friend);
                                    }).error(function () {
                                        conv.title = "非系统用户";
                                    });
                                })(item.targetId || item.senderUserId, conversationitem);
                            }
                        }
                        break;
                    case RongIMLib.ConversationType.SYSTEM:
                        break;
                    case RongIMLib.ConversationType.DISCUSSION:
                        break;
                    case RongIMLib.ConversationType.CUSTOMER_SERVICE:
                        break;
                }
                return { 'item': conversationitem, 'removeUnreadCount': removeUnreadCount };
            },
            updateConversations: function () {
                var defer = $q.defer();
                var allUnreadCount = 0;
                RongIMSDKServer.getConversationList().then(function (list) {
                    list = RongIMLib.RongIMClient.getInstance().sortConversationList(list);
                    mainDataServer.conversation.conversations = [];
                    for (var i = 0, length = list.length; i < length; i++) {
                        var result = mainDataServer.conversation.parseConversation(list[i]);
                        if (list[i].conversationType == RongIMLib.ConversationType.CUSTOMER_SERVICE || list[i].conversationType == RongIMLib.ConversationType.DISCUSSION || list[i].conversationType == RongIMLib.ConversationType.SYSTEM || list[i].conversationType == RongIMLib.ConversationType.CHATROOM || list[i].conversationType == RongIMLib.ConversationType.PUBLIC_SERVICE || list[i].conversationType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE)
                            continue;
                        mainDataServer.conversation.conversations.push(result.item);
                    }
                    mainDataServer.conversation.updateTotalUnreadCount();
                    defer.resolve();
                }, function () {
                    defer.reject();
                });
                return defer.promise;
            },
            createConversation: function (targetType, targetId) {
                var item = new webimmodel.Conversation();
                item.targetId = targetId;
                item.targetType = targetType;
                switch (targetType) {
                    case webimmodel.conversationType.Private:
                        var friendinfo = mainDataServer.contactsList.getFriendById(targetId);
                        if (friendinfo) {
                            item.title = friendinfo.displayName || friendinfo.name;
                            item.firstchar = friendinfo.firstchar;
                            item.imgSrc = friendinfo.imgSrc;
                        }
                        else {
                            mainServer.user.getInfo(targetId).success(function (rep) {
                                item.title = rep.result.nickname + "(非好友)";
                                item.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.nickname);
                                item.imgSrc = rep.result.portraitUri;
                            }).error(function () {
                            });
                        }
                        break;
                    case webimmodel.conversationType.Group:
                        var groupinfo = mainDataServer.contactsList.getGroupById(targetId);
                        if (groupinfo) {
                            item.title = groupinfo.name;
                            item.firstchar = groupinfo.firstchar;
                        }
                        else {
                            mainServer.group.getById(targetId).success(function (rep) {
                                item.title = rep.result.name;
                                item.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.result.name);
                                var obj = webimutil.ChineseCharacter.convertToABC(rep.result.name);
                                var f = webimutil.ChineseCharacter.getPortraitChar(rep.result.name);
                                item.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                                item.imgSrc = rep.result.portraitUri;
                            }).error(function () {
                            });
                        }
                        break;
                    case webimmodel.conversationType.Discussion:
                        var discussioninfo = mainDataServer.contactsList.getDiscussionById(targetId);
                        if (discussioninfo) {
                            item.title = discussioninfo.name;
                            item.firstchar = discussioninfo.firstchar;
                        }
                        else {
                            RongIMSDKServer.getDiscussion(targetId).then(function (rep) {
                                var discuss = rep.data;
                                item.title = discuss.name;
                                item.firstchar = webimutil.ChineseCharacter.getPortraitChar(discuss.name);
                            }, function () {
                                item.title = "未知讨论组";
                            });
                        }
                        break;
                    default:
                        console.log("暂不支持创建此类型会话");
                }
                return item;
            },
            getConversation: function (type, id) {
                for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
                    if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
                        return mainDataServer.conversation.conversations[i];
                    }
                }
                return null;
            },
            updateConversationTitle: function (type, id, title) {
                for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
                    if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
                        mainDataServer.conversation.conversations[i].title = title;
                        return true;
                    }
                }
                return false;
            },
            updateConversationDetail: function (type, id, title, portrait) {
                for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
                    if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
                        mainDataServer.conversation.conversations[i].title = title;
                        mainDataServer.conversation.conversations[i].imgSrc = portrait;
                        return true;
                    }
                }
                return false;
            },
            updateConStatic: function (msg, add, isChat) {
                var type = msg.conversationType, id = msg.targetId;
                var hasCon = false;
                if (type == webimmodel.conversationType.Discussion || type == webimmodel.conversationType.System && msg.messageType != webimmodel.MessageType.ContactNotificationMessage || type == webimmodel.conversationType.ChartRoom) {
                    return;
                }
                if (msg.messageType == webimmodel.MessageType.ReadReceiptMessage
                    || msg.messageType == webimmodel.MessageType.TypingStatusMessage
                    || msg.messageType == webimmodel.MessageType.SyncReadStatusMessage
                    || msg.messageType == webimmodel.MessageType.ReadReceiptRequestMessage
                    || msg.messageType == webimmodel.MessageType.ReadReceiptResponseMessage) {
                    return;
                }
                RongIMSDKServer.getConversation(type, id).then(function (data) {
                    if (data) {
                        var result = mainDataServer.conversation.parseConversation(data);
                        var oldUnread = 0, totalUnreadCount = mainDataServer.conversation.totalUnreadCount, isfirst = false, conversationItem;
                        for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
                            conversationItem = mainDataServer.conversation.conversations[i];
                            if (conversationItem.targetType == type && conversationItem.targetId == id) {
                                oldUnread = conversationItem.unReadNum;
                                if (i == 0 || conversationItem.isTop || (mainDataServer.conversation.conversations[i - 1] && mainDataServer.conversation.conversations[i - 1].isTop)) {
                                    isfirst = true;
                                    conversationItem.lastMsg = result.item.lastMsg;
                                    conversationItem.unReadNum = result.item.unReadNum;
                                    conversationItem.lastTime = result.item.lastTime;
                                    if (msg.senderUserId == mainDataServer.loginUser.id) {
                                        RongIMSDKServer.clearMsgUnreadStatus(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId, result.item.lastTime);
                                        result.item.unReadNum = 0;
                                        conversationItem.atStr = '';
                                    }
                                    else {
                                        conversationItem.atStr = result.item.atStr;
                                    }
                                }
                                else {
                                    mainDataServer.conversation.conversations.splice(i, 1);
                                }
                                break;
                            }
                        }
                        if (isChat && mainDataServer.conversation.currentConversation && type == mainDataServer.conversation.currentConversation.targetType && id == mainDataServer.conversation.currentConversation.targetId) {
                            RongIMSDKServer.clearMsgUnreadStatus(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId, result.item.lastTime);
                            result.item.unReadNum = 0;
                            result.item.atStr = '';
                        }
                        else {
                            if (msg.senderUserId == mainDataServer.loginUser.id) {
                                RongIMSDKServer.clearMsgUnreadStatus(mainDataServer.conversation.currentConversation.targetType, mainDataServer.conversation.currentConversation.targetId, result.item.lastTime);
                                result.item.unReadNum = 0;
                                result.item.atStr = '';
                            }
                            else {
                            }
                        }
                        mainDataServer.conversation.updateTotalUnreadCount();
                        if (mainDataServer.conversation.conversations.length == 0) {
                            mainDataServer.conversation.conversations.push(result.item);
                            return;
                        }
                        if (add && !isfirst) {
                            var arr = mainDataServer.conversation.conversations;
                            for (var i = 0, len = arr.length; i < len; i++) {
                                if (arr[i].isTop == 1) {
                                    continue;
                                }
                                arr.splice(i, 0, result.item);
                                break;
                            }
                        }
                    }
                    else {
                        console.log('无法获取该会话', type, id);
                    }
                }, function (err) {
                    console.log("RongIMSDKServer.getConversation err:" + err, type, id);
                });
            },
            updateConStaticBeforeSend: function (msg, add) {
                var type = msg.conversationType, id = msg.targetId;
                var hasCon = false;
                var oldUnread = 0, totalUnreadCount = mainDataServer.conversation.totalUnreadCount, isfirst = false, conversationItem;
                for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
                    conversationItem = mainDataServer.conversation.conversations[i];
                    if (conversationItem.targetType == type && conversationItem.targetId == id) {
                        switch (msg.messageType) {
                            case webimmodel.MessageType.TextMessage:
                                conversationItem.lastMsg = msg.content.content;
                                break;
                            case webimmodel.MessageType.ImageMessage:
                                conversationItem.lastMsg = '[图片';
                                break;
                            case webimmodel.MessageType.FileMessage:
                                conversationItem.lastMsg = '[文件] ' + msg.content.name;
                                break;
                        }
                        conversationItem.lastTime = msg.sentTime;
                        conversationItem.unReadNum = 0;
                        conversationItem.atStr = '';
                        if (type == webimmodel.conversationType.Group) {
                            conversationItem.lastMsg = '你: ' + conversationItem.lastMsg;
                        }
                        if (i > 0) {
                            mainDataServer.conversation.conversations.splice(i, 1);
                            mainDataServer.conversation.conversations.unshift(conversationItem);
                        }
                        break;
                    }
                }
            },
            setDraft: function (type, id, msg) {
                for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
                    if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == id) {
                        mainDataServer.conversation.conversations[i].draftMsg = msg;
                        return true;
                    }
                }
                return false;
            },
            clearMessagesUnreadStatus: function (type, targetid) {
                for (var i = 0, len = mainDataServer.conversation.conversations.length; i < len; i++) {
                    if (mainDataServer.conversation.conversations[i].targetType == type && mainDataServer.conversation.conversations[i].targetId == targetid) {
                        mainDataServer.conversation.conversations[i].unReadNum = 0;
                        return true;
                    }
                }
                return false;
            },
            find: function (str, arr) {
                var num = /^[0-9]+$/, abc = /^[a-zA-Z]+$/, reg = /^[0-9a-zA-Z\-]+$/;
                var str = str.trim();
                var newArr = [];
                if (reg.test(str)) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.everychar.toLowerCase().indexOf(str.toLowerCase()) !== -1 || item.pinyin.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
                            newArr.push(item);
                        }
                    }
                }
                else if (str !== "") {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.title.indexOf(str) !== -1) {
                            newArr.push(item);
                        }
                    }
                }
                return newArr;
            }
        };
        mainDataServer.blackList = {
            list: [],
            add: function (item) {
                item.firstchar = webimutil.ChineseCharacter.getPortraitChar(item.name);
                this.list.push(item);
            },
            remove: function (id) {
                for (var i = 0, len = this.list.length; i < len; i++) {
                    if (this.list[i].id == id) {
                        this.list.splice(i, 1);
                        return true;
                    }
                }
                return false;
            },
            getById: function (id) {
                for (var i = 0, len = this.list.length; i < len; i++) {
                    if (this.list[i].id == id) {
                        return this.list[i];
                    }
                }
                return null;
            }
        };
        var contactsList = {
            nonFriendList: [],
            groupList: [],
            subgroupList: [],
            discussionList: [],
            getGroupById: function (id) {
                for (var i = 0; i < this.groupList.length; i++) {
                    var item = this.groupList[i];
                    if (item.id == id) {
                        return item;
                    }
                }
                return null;
            },
            updateGroupInfoById: function (id, group) {
                for (var i = 0; i < this.groupList.length; i++) {
                    var item = this.groupList[i];
                    if (item.id == id) {
                        item.name = group.name;
                        if (group.imgSrc) {
                            item.imgSrc = group.imgSrc;
                        }
                        var obj = webimutil.ChineseCharacter.convertToABC(group.name);
                        var f = webimutil.ChineseCharacter.getPortraitChar(group.name);
                        item.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                        return true;
                    }
                }
                return false;
            },
            getDiscussionById: function (id) {
                for (var i = 0; i < this.discussionList.length; i++) {
                    var item = this.discussionList[i];
                    if (item.id == id) {
                        return item;
                    }
                }
                return null;
            },
            getFriendById: function (id) {
                for (var i = 0, slen = this.subgroupList.length; i < slen; i++) {
                    var list = this.subgroupList[i].list;
                    for (var j = 0, flen = list.length; j < flen; j++) {
                        if (list[j].id == id) {
                            return list[j];
                        }
                    }
                }
                return null;
            },
            quickGetFriend: function (id, firstchar) {
                for (var i = 0, slen = this.subgroupList.length; i < slen; i++) {
                    var list = this.subgroupList[i].list;
                    if (this.subgroupList[i].title == firstchar) {
                        for (var j = 0, flen = list.length; j < flen; j++) {
                            if (list[j].id == id) {
                                return list[j];
                            }
                        }
                    }
                }
                return null;
            },
            addFriend: function (friend) {
                var obj = webimutil.ChineseCharacter.convertToABC(friend.name);
                var f = webimutil.ChineseCharacter.getPortraitChar(friend.name);
                friend.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                f = webimutil.ChineseCharacter.getPortraitChar2(friend.name);
                if (!this.quickGetFriend(friend.id, f)) {
                    for (var i = 0, len = this.subgroupList.length; i < len; i++) {
                        if (this.subgroupList[i].title == f) {
                            this.subgroupList[i].list.push(friend);
                            return friend;
                        }
                    }
                    this.subgroupList.push(new webimmodel.Subgroup(f, [friend]));
                    this.subgroupList.sort(function (a, b) { return a.title.charCodeAt(0) - b.title.charCodeAt(0); });
                    return friend;
                }
            },
            removeFriend: function (friendId) {
                for (var i = 0, slen = this.subgroupList.length; i < slen; i++) {
                    var list = this.subgroupList[i].list;
                    for (var j = 0, flen = list.length; j < flen; j++) {
                        if (list[j].id == friendId) {
                            list.splice(j, 1);
                            if (list.length === 0) {
                                this.subgroupList.splice(i, 1);
                            }
                            mainDataServer.conversation.updateConversations();
                            return true;
                        }
                    }
                }
                return false;
            },
            removeFriendFromSubgroup: function (friend) {
                var obj = webimutil.ChineseCharacter.convertToABC(friend.displayName || friend.name);
                var f = webimutil.ChineseCharacter.getPortraitChar(friend.displayName || friend.name);
                friend.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                f = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
                for (var i = 0, len = this.subgroupList.length; i < len; i++) {
                    if (this.subgroupList[i].title == f) {
                        for (var j = 0, lenj = this.subgroupList[i].list.length; j < lenj; j++) {
                            if (this.subgroupList[i].list[j].id == friend.id) {
                                this.subgroupList[i].list.splice(j, 1);
                                break;
                            }
                        }
                        if (this.subgroupList[i].list.length)
                            break;
                        this.subgroupList.splice(i, 1);
                        break;
                    }
                }
            },
            updateOrAddFriend: function (friend) {
                var obj = webimutil.ChineseCharacter.convertToABC(friend.displayName || friend.name);
                var f = webimutil.ChineseCharacter.getPortraitChar(friend.displayName || friend.name);
                friend.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                f = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
                var oldFriend = this.quickGetFriend(friend.id, f);
                if (!oldFriend) {
                    for (var i = 0, len = this.subgroupList.length; i < len; i++) {
                        if (this.subgroupList[i].title == f) {
                            this.subgroupList[i].list.push(friend);
                            return friend;
                        }
                    }
                    this.subgroupList.push(new webimmodel.Subgroup(f, [friend]));
                    this.subgroupList.sort(function (a, b) { return a.title.charCodeAt(0) - b.title.charCodeAt(0); });
                    return friend;
                }
                else {
                    angular.extend(oldFriend, friend);
                    return oldFriend;
                }
            },
            addGroup: function (group) {
                if (!contactsList.getGroupById(group.id)) {
                    var obj = webimutil.ChineseCharacter.convertToABC(group.name);
                    var f = webimutil.ChineseCharacter.getPortraitChar(group.name);
                    group.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                    this.groupList.push(group);
                }
            },
            removeGroup: function (groupId) {
                for (var i = 0, len = this.groupList.length; i < len; i++) {
                    if (this.groupList[i].id == groupId) {
                        this.groupList.splice(i, 1);
                        mainDataServer.conversation.updateConversations();
                        return true;
                    }
                }
                return false;
            },
            addDiscussion: function (discussion) {
                if (!contactsList.getDiscussionById(discussion.id)) {
                    var obj = webimutil.ChineseCharacter.convertToABC(discussion.name);
                    var f = webimutil.ChineseCharacter.getPortraitChar(discussion.name);
                    discussion.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                    this.discussionList.push(discussion);
                }
            },
            removeDiscussion: function (discussionId) {
                for (var i = 0, len = this.discussionList.length; i < len; i++) {
                    if (this.discussionList[i].id == discussionId) {
                        this.discussionList.splice(i, 1);
                        mainDataServer.conversation.updateConversations();
                        return true;
                    }
                }
                return false;
            },
            find: function (str, arr) {
                var num = /^[0-9]+$/, abc = /^[a-zA-Z]+$/, reg = /^[0-9a-zA-Z\-]+$/;
                var str = str.trim();
                var newArr = [];
                if (reg.test(str)) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.everychar.toLowerCase().indexOf(str.toLowerCase()) !== -1 || item.pinyin.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
                            newArr.push(item);
                        }
                    }
                }
                else if (str !== "") {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.name.indexOf(str) !== -1) {
                            newArr.push(item);
                        }
                    }
                }
                return newArr;
            },
            getGroupMember: function (groupId, memberId) {
                var item = this.getGroupById(groupId);
                if (item) {
                    for (var i = 0, len = item.memberList.length; i < len; i++) {
                        if (item.memberList[i].id == memberId) {
                            return item.memberList[i];
                        }
                    }
                }
                else {
                }
                return null;
            },
            addGroupMember: function (groupId, member) {
                var item = this.getGroupById(groupId);
                if (item && !contactsList.getGroupMember(groupId, member.id)) {
                    var obj = webimutil.ChineseCharacter.convertToABC(member.name);
                    var f = webimutil.ChineseCharacter.getPortraitChar(member.name);
                    member.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                    if (member.role == "0") {
                        item.memberList.unshift(member);
                    }
                    else {
                        item.memberList.push(member);
                    }
                    item.fact = item.memberList.length;
                }
                else {
                }
            },
            removeGroupMember: function (groupId, memberid) {
                var item = this.getGroupById(groupId);
                if (!item) {
                    throw Error("not found group:" + groupId);
                }
                for (var i = 0, len = item.memberList.length; i < len; i++) {
                    var member = item.memberList[i];
                    if (member.id == memberid) {
                        item.memberList.splice(i, 1);
                        item.fact = item.memberList.length;
                        return true;
                    }
                }
                return false;
            },
            updateGroupMember: function (memberId, member) {
                for (var i = 0; i < this.groupList.length; i++) {
                    var item = this.groupList[i];
                    var _member = this.getGroupMember(item.id, memberId);
                    if (_member) {
                        _member.name = member.name;
                        _member.imgSrc = member.imgSrc;
                        var obj = webimutil.ChineseCharacter.convertToABC(_member.name);
                        var f = webimutil.ChineseCharacter.getPortraitChar(_member.name);
                        _member.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                    }
                }
            },
            getDiscussionMember: function (discussionId, memberId) {
                var item = this.getDiscussionById(discussionId);
                if (item) {
                    for (var i = 0, len = item.memberList.length; i < len; i++) {
                        if (item.memberList[i].id == memberId) {
                            return item.memberList[i];
                        }
                    }
                }
                else {
                }
                return null;
            },
            addDiscussionMember: function (discussionId, member) {
                var item = this.getDiscussionById(discussionId);
                if (item && !contactsList.getDiscussionMember(discussionId, member.id)) {
                    var obj = webimutil.ChineseCharacter.convertToABC(member.name);
                    var f = webimutil.ChineseCharacter.getPortraitChar(member.name);
                    member.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                    item.memberList.push(member);
                    item.fact = item.memberList.length;
                }
                else {
                }
            },
            removeDiscussionMember: function (discussionId, memberid) {
                var item = this.getDiscussionById(discussionId);
                if (!item) {
                    throw Error("not found discussion:" + discussionId);
                }
                for (var i = 0, len = item.memberList.length; i < len; i++) {
                    var member = item.memberList[i];
                    if (member.id == memberid) {
                        item.memberList.splice(i, 1);
                        item.fact = item.memberList.length;
                        return true;
                    }
                }
                return false;
            },
            getNonFriendById: function (id) {
                for (var i = 0, slen = this.nonFriendList.length; i < slen; i++) {
                    if (this.nonFriendList[i].id == id) {
                        return this.nonFriendList[i];
                    }
                }
                return null;
            },
            addNonFriend: function (person) {
                if (!contactsList.getNonFriendById(person.id)) {
                    var obj = webimutil.ChineseCharacter.convertToABC(person.name);
                    var f = webimutil.ChineseCharacter.getPortraitChar(person.name);
                    person.setpinying({ pinyin: obj.pinyin, everychar: obj.first, firstchar: f });
                    this.nonFriendList.push(person);
                }
            }
        };
        mainDataServer.contactsList = contactsList;
        mainDataServer.notification = {
            hasNewNotification: false,
            notificationList: [],
            addNotification: function (item) {
                if (!this._findFriendApply(item)) {
                    if (item.name)
                        item.firstchar = webimutil.ChineseCharacter.getPortraitChar(item.name);
                    this.notificationList.unshift(item);
                }
            },
            _findFriendApply: function (item) {
                if (item.id) {
                    for (var i = 0, len = this.notificationList.length; i < len; i++) {
                        if (item.id === this.notificationList[i]["id"] && this.notificationList[i]["status"] == webimmodel.FriendStatus.Requested) {
                            return true;
                        }
                    }
                }
                return false;
            },
            _sort: function () {
                mainDataServer.notification.notificationList = mainDataServer.notification.notificationList.sort(function (a, b) {
                    return parseInt(a.timestamp) - parseInt(b.timestamp);
                });
            }
        };
        return mainDataServer;
    }]);
mainServer.factory("RongIMSDKServer", ["$q", "$http", "appconfig", function ($q, $http, appconfig) {
        var RongIMSDKServer = {};
        RongIMSDKServer.init = function (appkey) {
            if (window.Electron) {
                RongIMLib.RongIMClient.init(appkey, new RongIMLib.VCDataProvider(window.Electron.addon), { navi: appconfig.getNavi(), fileServer: appconfig.getUploadFileServer() });
            }
            else {
                RongIMLib.RongIMClient.init(appkey, null, { navi: appconfig.getNavi(), fileServer: appconfig.getUploadFileServer() });
            }
        };
        RongIMSDKServer.connect = function (token, userid) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.connect(token, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onTokenIncorrect: function () {
                    defer.reject({ tokenError: true });
                },
                onError: function (errorCode) {
                    defer.reject({ errorCode: errorCode });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '连接超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION:
                            info = '不可接受的协议版本';
                            break;
                        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                            info = 'appkey不正确';
                            break;
                        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                            info = '服务器不可用';
                            break;
                        case RongIMLib.ConnectionState.NOT_AUTHORIZED:
                            info = '未认证';
                            break;
                        case RongIMLib.ConnectionState.REDIRECT:
                            info = '重新获取导航';
                            break;
                        case RongIMLib.ConnectionState.APP_BLOCK_OR_DELETE:
                            info = '应用已被封禁或已被删除';
                            break;
                        case RongIMLib.ConnectionState.BLOCK:
                            info = '用户被封禁';
                            break;
                    }
                    console.log("失败:" + info);
                }
            }, userid);
            return defer.promise;
        };
        RongIMSDKServer.getInstance = function () {
            return RongIMLib.RongIMClient.getInstance();
        };
        RongIMSDKServer.setOnReceiveMessageListener = function (option) {
            RongIMLib.RongIMClient.setOnReceiveMessageListener(option);
        };
        RongIMSDKServer.setConnectionStatusListener = function (option) {
            RongIMLib.RongIMClient.setConnectionStatusListener(option);
        };
        RongIMSDKServer.sendMessage = function (conver, targetId, content, isAt) {
            var defer = $q.defer();
            var isAtMsg = isAt || false;
            RongIMLib.RongIMClient.getInstance().sendMessage(+conver, targetId, content, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (errorCode, message) {
                    defer.reject({ errorCode: errorCode, message: message });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = "";
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            }, isAtMsg);
            return defer.promise;
        };
        RongIMSDKServer.sendReceiptResponse = function (conver, targetId) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().sendReceiptResponse(+conver, targetId, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (errorCode, message) {
                    defer.reject({ errorCode: errorCode, message: message });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = "";
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.reconnect = function (callback) {
            RongIMLib.RongIMClient.reconnect(callback);
        };
        RongIMSDKServer.clearUnreadCount = function (type, targetid) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().clearUnreadCount(type, targetid, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.clearUnreadCountByTimestamp = function (type, targetid, timestamp) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().clearUnreadCountByTimestamp(type, targetid, timestamp, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.getTotalUnreadCount = function () {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().getTotalUnreadCount({
                onSuccess: function (num) {
                    defer.resolve(num);
                },
                onError: function () {
                    defer.reject();
                }
            }, [1, 3]);
            return defer.promise;
        };
        RongIMSDKServer.getConversationList = function () {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().getConversationList({
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            }, null, 0, true);
            return defer.promise;
        };
        RongIMSDKServer.setConversationHidden = function (targetType, targetId, isHidden) {
            RongIMLib.RongIMClient.getInstance().setConversationHidden(targetType, targetId, isHidden);
        };
        RongIMSDKServer.setConversationToTop = function (conversationType, targetId, isTop) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().setConversationToTop(conversationType, targetId, isTop, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.removeConversation = function (type, targetId) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().removeConversation(type, targetId, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.createConversation = function (type, targetId, title) {
            RongIMLib.RongIMClient.getInstance().createConversation(type, targetId, title);
        };
        RongIMSDKServer.getConversation = function (type, targetId) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().getConversation(type, targetId, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.getDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance().getTextMessageDraft(type, targetId) || "";
        };
        RongIMSDKServer.setDraft = function (type, targetId, value) {
            return RongIMLib.RongIMClient.getInstance().saveTextMessageDraft(type, targetId, value);
        };
        RongIMSDKServer.clearDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance().clearTextMessageDraft(type, targetId);
        };
        RongIMSDKServer.getHistoryMessages = function (type, targetId, lastTime, num) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(type, targetId, lastTime, num, {
                onSuccess: function (data, has) {
                    defer.resolve({
                        data: data,
                        has: has
                    });
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.disconnect = function () {
            RongIMLib.RongIMClient.getInstance().disconnect();
        };
        RongIMSDKServer.logout = function () {
            if (RongIMLib && RongIMLib.RongIMClient) {
                RongIMLib.RongIMClient.getInstance().logout();
            }
        };
        RongIMSDKServer.createDiscussion = function (name, userIdList) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().createDiscussion(name, userIdList, {
                onSuccess: function (data) {
                    defer.resolve({
                        data: data
                    });
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.addMemberToDiscussion = function (discussionId, userIdList, callback) {
            return RongIMLib.RongIMClient.getInstance().addMemberToDiscussion(discussionId, userIdList, callback);
        };
        RongIMSDKServer.removeMemberFromDiscussion = function (discussionId, userId, callback) {
            return RongIMLib.RongIMClient.getInstance().removeMemberFromDiscussion(discussionId, userId, callback);
        };
        RongIMSDKServer.setDiscussionName = function (discussionId, name, callback) {
            return RongIMLib.RongIMClient.getInstance().setDiscussionName(discussionId, name, callback);
        };
        RongIMSDKServer.getDiscussion = function (discussionId, callback) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().getDiscussion(discussionId, {
                onSuccess: function (data) {
                    defer.resolve({
                        data: data
                    });
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.quitDiscussion = function (discussionId, callback) {
            return RongIMLib.RongIMClient.getInstance().quitDiscussion(discussionId, callback);
        };
        RongIMSDKServer.registerMessageType = function (messageType, objectName, messageTag, messageContent) {
            return RongIMLib.RongIMClient.registerMessageType(messageType, objectName, messageTag, messageContent);
        };
        RongIMSDKServer.RegisterMessage = function () {
            return RongIMLib.RongIMClient.RegisterMessage;
        };
        RongIMSDKServer.getAllConversations = function () {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().getConversationList({
                onSuccess: function (list) {
                    defer.resolve(list);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            }, null, 0, false);
            return defer.promise;
        };
        RongIMSDKServer.getConversationByContent = function (str) {
            console.log(arguments);
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().searchConversationByContent(str, {
                onSuccess: function (data) {
                    console.log(data);
                    defer.resolve(data);
                },
                onError: function (error) {
                    console.log(error);
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.getMessagesFromConversation = function (targetId, targetType, str, timestamp, count) {
            console.log(arguments);
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().searchMessageByContent(+targetType, targetId, str, timestamp, count, 1, {
                onSuccess: function (data, count) {
                    defer.resolve({
                        message: data,
                        count: count
                    });
                },
                onError: function (error) {
                    console.log(error);
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.getUserStatus = function (userid) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().getUserStatus(userid, {
                onSuccess: function (result) {
                    defer.resolve(result);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.subscribeUserStatus = function (userids) {
            var defer = $q.defer();
            RongIMLib.RongIMClient.getInstance().subscribeUserStatus(userids, {
                onSuccess: function (result) {
                    defer.resolve(result);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.clearMsgUnreadStatus = function (targetType, targetId, timestamp) {
            if (window.Electron) {
                RongIMSDKServer.clearUnreadCountByTimestamp(targetType, targetId, timestamp);
            }
            else {
                RongIMSDKServer.clearUnreadCount(targetType, targetId);
            }
        };
        return RongIMSDKServer;
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var webimutil;
(function (webimutil) {
    var CookieHelper = (function () {
        function CookieHelper() {
        }
        CookieHelper.setCookie = function (name, value, exires) {
            if (exires) {
                var date = new Date();
                date.setDate(date.getDate() + exires);
                document.cookie = name + "=" + encodeURI(value) + ";expires=" + date.toUTCString();
            }
            else {
                document.cookie = name + "=" + encodeURI(value) + ";";
            }
        };
        CookieHelper.getCookie = function (name) {
            var start = document.cookie.indexOf(name + "=");
            if (start != -1) {
                var end = document.cookie.indexOf(";", start);
                if (end == -1) {
                    end = document.cookie.length;
                }
                return decodeURI(document.cookie.substring(start + name.length + 1, end));
            }
            else {
                return "";
            }
        };
        CookieHelper.removeCookie = function (name) {
            var con = this.getCookie(name);
            if (con) {
                this.setCookie(name, "con", -1);
            }
        };
        return CookieHelper;
    })();
    webimutil.CookieHelper = CookieHelper;
    var userAgent = window.navigator.userAgent.toLowerCase();
    var Helper = (function () {
        function Helper() {
        }
        Helper.portraitColors = ["#e97ffb", "#00b8d4", "#82b2ff", "#f3db73", "#f0857c"];
        Helper.cloneObject = cloneObject;
        Helper.alertMessage = {
            error: function (message, time) {
                jQuerylayer(message, false, time);
            },
            success: function (message, time) {
                jQuerylayer(message, true, time);
            }
        };
        Helper.escapeSymbol = {
            escapeHtml: function (str) {
                if (!str)
                    return '';
                str = str.replace(/</g, '&lt;');
                str = str.replace(/>/g, '&gt;');
                str = str.replace(/"/g, '&quot;');
                str = str.replace(/'/g, '&#039;');
                return str;
            },
            replaceSymbol: function (str) {
                if (!str)
                    return '';
                str = str.replace(/&lt;/g, '<');
                str = str.replace(/&gt;/g, '>');
                str = str.replace(/&quot;/g, '"');
                return str;
            }
        };
        Helper.getFocus = function (obj) {
            obj.focus();
            if (obj.createTextRange) {
                var rtextRange = obj.createTextRange();
                rtextRange.moveStart('character', obj.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            }
            else if (obj.selectionStart) {
                obj.selectionStart = obj.value.length;
            }
            else if (window.getSelection && obj.lastChild) {
                var sel = window.getSelection();
                var tempRange = document.createRange();
                if (webimutil.Helper.browser.msie) {
                    tempRange.setStart(obj.lastChild, obj.lastChild.length);
                }
                else {
                    tempRange.setStart(obj.firstChild, obj.firstChild.length);
                }
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        };
        Helper.browser = {
            version: (userAgent.match(/.+(?:rv|it|ra|chrome|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
            safari: /webkit/.test(userAgent),
            opera: /opera|opr/.test(userAgent),
            msie: /msie|trident/.test(userAgent) && !/opera/.test(userAgent),
            chrome: /chrome/.test(userAgent),
            mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit|like gecko)/.test(userAgent)
        };
        Helper.os = {
            mac: (userAgent.match(/Mac\s+OS/i))
        };
        return Helper;
    })();
    webimutil.Helper = Helper;
    function jQuerylayer(message, type, time) {
        time = time ? time : 0;
        jQuery.layer({
            type: 1,
            title: false,
            area: ['auto', 'auto'],
            border: [0],
            shade: [0.1, '#000'],
            time: time,
            shadeClose: true,
            closeBtn: [0, false],
            page: {
                html: '<div id="showMesBox" class="' + (type ? 'successMes' : 'unsuccessMes') + '" style="width:240px; height:130px; overflow:auto"> <div class="showMesTop"><span class="showMesIco"></span></div> <div class="showMesBot">' + message + '</div></div>'
            }
        });
    }
    function cloneObject(obj) {
        if (!obj)
            return null;
        var ret;
        if (Object.prototype.toString.call(obj) == "[object Array]") {
            ret = [];
            var i = obj.length;
            while (i--) {
                ret[i] = cloneObject(obj[i]);
            }
            return ret;
        }
        else if (typeof obj === "object") {
            ret = {};
            for (var item in obj) {
                ret[item] = obj[item];
            }
            return ret;
        }
        else {
            return obj;
        }
    }
    var ImageHelper = (function () {
        function ImageHelper() {
        }
        ImageHelper.getThumbnail = function (obj, area, callback) {
            var canvas = document.createElement("canvas"), context = canvas.getContext('2d');
            var img = new Image();
            img.onload = function () {
                var target_w;
                var target_h;
                var imgarea = img.width * img.height;
                var _y = 0, _x = 0, maxWidth = 240, maxHeight = 240;
                if (imgarea > area) {
                    var scale = Math.sqrt(imgarea / area);
                    scale = Math.ceil(scale * 100) / 100;
                    target_w = img.width / scale;
                    target_h = img.height / scale;
                }
                else {
                    target_w = img.width;
                    target_h = img.height;
                }
                canvas.width = target_w;
                canvas.height = target_h;
                context.drawImage(img, 0, 0, target_w, target_h);
                try {
                    if (canvas.width > maxWidth || canvas.height > maxHeight) {
                        if (target_w > maxWidth) {
                            _x = (target_w - maxWidth) / 2;
                            target_w = maxWidth;
                        }
                        if (target_h > maxHeight) {
                            _y = (target_h - maxHeight) / 2;
                            target_h = maxHeight;
                        }
                        var imgData = context.getImageData(_x, _y, target_w, target_h);
                        context.createImageData(target_w, target_h);
                        canvas.width = target_w;
                        canvas.height = target_h;
                        context.putImageData(imgData, 0, 0);
                    }
                    var _canvas = canvas.toDataURL("image/jpeg", 0.5);
                    callback(obj, _canvas);
                }
                catch (e) {
                    callback(obj, null);
                }
            };
            img.src = ImageHelper.getFullPath(obj);
        };
        ImageHelper.getFullPath = function (file) {
            window.URL = window.URL || window.webkitURL;
            if (window.URL && window.URL.createObjectURL) {
                return window.URL.createObjectURL(file);
            }
            else {
                return null;
            }
        };
        return ImageHelper;
    })();
    webimutil.ImageHelper = ImageHelper;
    var DownloadHelper = (function () {
        function DownloadHelper() {
        }
        DownloadHelper.downloadFile = function (sUrl) {
            if (this.isChrome || this.isSafari) {
                var link = document.createElement('a');
                link.href = sUrl;
                if (link.download !== undefined) {
                    var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
                    link.download = fileName;
                }
                if (document.createEvent) {
                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    link.dispatchEvent(e);
                    return true;
                }
            }
            var query = '?download';
            window.open(sUrl + query);
        };
        DownloadHelper.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        DownloadHelper.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
        return DownloadHelper;
    })();
    webimutil.DownloadHelper = DownloadHelper;
    var PinYin = {
        "a": "\u554a\u963f\u9515",
        "ai": "\u57c3\u6328\u54ce\u5509\u54c0\u7691\u764c\u853c\u77ee\u827e\u788d\u7231\u9698\u8bf6\u6371\u55f3\u55cc\u5ad2\u7477\u66a7\u7839\u953f\u972d",
        "an": "\u978d\u6c28\u5b89\u4ffa\u6309\u6697\u5cb8\u80fa\u6848\u8c19\u57ef\u63de\u72b4\u5eb5\u6849\u94f5\u9e4c\u9878\u9eef",
        "ang": "\u80ae\u6602\u76ce",
        "ao": "\u51f9\u6556\u71ac\u7ff1\u8884\u50b2\u5965\u61ca\u6fb3\u5773\u62d7\u55f7\u5662\u5c99\u5ed2\u9068\u5aaa\u9a9c\u8071\u87af\u93ca\u9ccc\u93d6",
        "ba": "\u82ad\u634c\u6252\u53ed\u5427\u7b06\u516b\u75a4\u5df4\u62d4\u8dcb\u9776\u628a\u8019\u575d\u9738\u7f62\u7238\u8307\u83dd\u8406\u636d\u5c9c\u705e\u6777\u94af\u7c91\u9c85\u9b43",
        "bai": "\u767d\u67cf\u767e\u6446\u4f70\u8d25\u62dc\u7a17\u859c\u63b0\u97b4",
        "ban": "\u6591\u73ed\u642c\u6273\u822c\u9881\u677f\u7248\u626e\u62cc\u4f34\u74e3\u534a\u529e\u7eca\u962a\u5742\u8c73\u94a3\u7622\u764d\u8228",
        "bang": "\u90a6\u5e2e\u6886\u699c\u8180\u7ed1\u68d2\u78c5\u868c\u9551\u508d\u8c24\u84a1\u8783",
        "bao": "\u82de\u80de\u5305\u8912\u96f9\u4fdd\u5821\u9971\u5b9d\u62b1\u62a5\u66b4\u8c79\u9c8d\u7206\u52f9\u8446\u5b80\u5b62\u7172\u9e28\u8913\u8db5\u9f85",
        "bo": "\u5265\u8584\u73bb\u83e0\u64ad\u62e8\u94b5\u6ce2\u535a\u52c3\u640f\u94c2\u7b94\u4f2f\u5e1b\u8236\u8116\u818a\u6e24\u6cca\u9a73\u4eb3\u8543\u5575\u997d\u6a97\u64d8\u7934\u94b9\u9e41\u7c38\u8ddb",
        "bei": "\u676f\u7891\u60b2\u5351\u5317\u8f88\u80cc\u8d1d\u94a1\u500d\u72c8\u5907\u60eb\u7119\u88ab\u5b5b\u9642\u90b6\u57e4\u84d3\u5457\u602b\u6096\u789a\u9e4e\u8919\u943e",
        "ben": "\u5954\u82ef\u672c\u7b28\u755a\u574c\u951b",
        "beng": "\u5d29\u7ef7\u752d\u6cf5\u8e66\u8ff8\u552a\u5623\u750f",
        "bi": "\u903c\u9f3b\u6bd4\u9119\u7b14\u5f7c\u78a7\u84d6\u853d\u6bd5\u6bd9\u6bd6\u5e01\u5e87\u75f9\u95ed\u655d\u5f0a\u5fc5\u8f9f\u58c1\u81c2\u907f\u965b\u5315\u4ef3\u4ffe\u8298\u835c\u8378\u5421\u54d4\u72f4\u5eb3\u610e\u6ed7\u6fde\u5f3c\u59a3\u5a62\u5b16\u74a7\u8d32\u7540\u94cb\u79d5\u88e8\u7b5a\u7b85\u7be6\u822d\u895e\u8df8\u9ac0",
        "bian": "\u97ad\u8fb9\u7f16\u8d2c\u6241\u4fbf\u53d8\u535e\u8fa8\u8fa9\u8fab\u904d\u533e\u5f01\u82c4\u5fed\u6c74\u7f0f\u7178\u782d\u78a5\u7a39\u7a86\u8759\u7b3e\u9cca",
        "biao": "\u6807\u5f6a\u8198\u8868\u5a4a\u9aa0\u98d1\u98d9\u98da\u706c\u9556\u9573\u762d\u88f1\u9cd4",
        "bie": "\u9cd6\u618b\u522b\u762a\u8e69\u9cd8",
        "bin": "\u5f6c\u658c\u6fd2\u6ee8\u5bbe\u6448\u50a7\u6d5c\u7f24\u73a2\u6ba1\u8191\u9554\u9acc\u9b13",
        "bing": "\u5175\u51b0\u67c4\u4e19\u79c9\u997c\u70b3\u75c5\u5e76\u7980\u90b4\u6452\u7ee0\u678b\u69df\u71f9",
        "bu": "\u6355\u535c\u54fa\u8865\u57e0\u4e0d\u5e03\u6b65\u7c3f\u90e8\u6016\u62ca\u535f\u900b\u74ff\u6661\u949a\u91ad",
        "ca": "\u64e6\u5693\u7924",
        "cai": "\u731c\u88c1\u6750\u624d\u8d22\u776c\u8e29\u91c7\u5f69\u83dc\u8521",
        "can": "\u9910\u53c2\u8695\u6b8b\u60ed\u60e8\u707f\u9a96\u74a8\u7cb2\u9eea",
        "cang": "\u82cd\u8231\u4ed3\u6ca7\u85cf\u4f27",
        "cao": "\u64cd\u7cd9\u69fd\u66f9\u8349\u8279\u5608\u6f15\u87ac\u825a",
        "ce": "\u5395\u7b56\u4fa7\u518c\u6d4b\u5202\u5e3b\u607b",
        "ceng": "\u5c42\u8e6d\u564c",
        "cha": "\u63d2\u53c9\u832c\u8336\u67e5\u78b4\u643d\u5bdf\u5c94\u5dee\u8be7\u7339\u9987\u6c4a\u59f9\u6748\u6942\u69ce\u6aab\u9497\u9538\u9572\u8869",
        "chai": "\u62c6\u67f4\u8c7a\u4faa\u8308\u7625\u867f\u9f87",
        "chan": "\u6400\u63ba\u8749\u998b\u8c17\u7f20\u94f2\u4ea7\u9610\u98a4\u5181\u8c04\u8c36\u8487\u5edb\u5fcf\u6f7a\u6fb6\u5b71\u7fbc\u5a75\u5b17\u9aa3\u89c7\u7985\u9561\u88e3\u87fe\u8e94",
        "chang": "\u660c\u7316\u573a\u5c1d\u5e38\u957f\u507f\u80a0\u5382\u655e\u7545\u5531\u5021\u4f25\u9b2f\u82cc\u83d6\u5f9c\u6005\u60dd\u960a\u5a3c\u5ae6\u6636\u6c05\u9cb3",
        "chao": "\u8d85\u6284\u949e\u671d\u5632\u6f6e\u5de2\u5435\u7092\u600a\u7ec9\u6641\u8016",
        "che": "\u8f66\u626f\u64a4\u63a3\u5f7b\u6f88\u577c\u5c6e\u7817",
        "chen": "\u90f4\u81e3\u8fb0\u5c18\u6668\u5ff1\u6c89\u9648\u8d81\u886c\u79f0\u8c0c\u62bb\u55d4\u5bb8\u741b\u6987\u809c\u80c2\u789c\u9f80",
        "cheng": "\u6491\u57ce\u6a59\u6210\u5448\u4e58\u7a0b\u60e9\u6f84\u8bda\u627f\u901e\u9a8b\u79e4\u57d5\u5d4a\u5fb5\u6d48\u67a8\u67fd\u6a18\u665f\u584d\u77a0\u94d6\u88ce\u86cf\u9172",
        "chi": "\u5403\u75f4\u6301\u5319\u6c60\u8fdf\u5f1b\u9a70\u803b\u9f7f\u4f88\u5c3a\u8d64\u7fc5\u65a5\u70bd\u50ba\u5880\u82aa\u830c\u640b\u53f1\u54e7\u557b\u55e4\u5f73\u996c\u6cb2\u5ab8\u6555\u80dd\u7719\u7735\u9e31\u761b\u892b\u86a9\u87ad\u7b1e\u7bea\u8c49\u8e05\u8e1f\u9b51",
        "chong": "\u5145\u51b2\u866b\u5d07\u5ba0\u833a\u5fe1\u61a7\u94f3\u825f",
        "chou": "\u62bd\u916c\u7574\u8e0c\u7a20\u6101\u7b79\u4ec7\u7ef8\u7785\u4e11\u4fe6\u5733\u5e31\u60c6\u6eb4\u59af\u7633\u96e0\u9c8b",
        "chu": "\u81ed\u521d\u51fa\u6a71\u53a8\u8e87\u9504\u96cf\u6ec1\u9664\u695a\u7840\u50a8\u77d7\u6410\u89e6\u5904\u4e8d\u520d\u61b7\u7ecc\u6775\u696e\u6a17\u870d\u8e70\u9edc",
        "chuan": "\u63e3\u5ddd\u7a7f\u693d\u4f20\u8239\u5598\u4e32\u63be\u821b\u60f4\u9044\u5ddb\u6c1a\u948f\u9569\u8221",
        "chuang": "\u75ae\u7a97\u5e62\u5e8a\u95ef\u521b\u6006",
        "chui": "\u5439\u708a\u6376\u9524\u5782\u9672\u68f0\u69cc",
        "chun": "\u6625\u693f\u9187\u5507\u6df3\u7eaf\u8822\u4fc3\u83bc\u6c8c\u80ab\u6710\u9e51\u877d",
        "chuo": "\u6233\u7ef0\u851f\u8fb6\u8f8d\u955e\u8e14\u9f8a",
        "ci": "\u75b5\u8328\u78c1\u96cc\u8f9e\u6148\u74f7\u8bcd\u6b64\u523a\u8d50\u6b21\u8360\u5472\u5d6f\u9e5a\u8785\u7ccd\u8d91",
        "cong": "\u806a\u8471\u56f1\u5306\u4ece\u4e1b\u506c\u82c1\u6dd9\u9aa2\u742e\u7481\u679e",
        "cu": "\u51d1\u7c97\u918b\u7c07\u731d\u6b82\u8e59",
        "cuan": "\u8e7f\u7be1\u7a9c\u6c46\u64ba\u6615\u7228",
        "cui": "\u6467\u5d14\u50ac\u8106\u7601\u7cb9\u6dec\u7fe0\u8403\u60b4\u7480\u69b1\u96b9",
        "cun": "\u6751\u5b58\u5bf8\u78cb\u5fd6\u76b4",
        "cuo": "\u64ae\u6413\u63aa\u632b\u9519\u539d\u811e\u9509\u77ec\u75e4\u9e7e\u8e49\u8e9c",
        "da": "\u642d\u8fbe\u7b54\u7629\u6253\u5927\u8037\u54d2\u55d2\u601b\u59b2\u75b8\u8921\u7b2a\u977c\u9791",
        "dai": "\u5446\u6b79\u50a3\u6234\u5e26\u6b86\u4ee3\u8d37\u888b\u5f85\u902e\u6020\u57ed\u7519\u5454\u5cb1\u8fe8\u902f\u9a80\u7ed0\u73b3\u9edb",
        "dan": "\u803d\u62c5\u4e39\u5355\u90f8\u63b8\u80c6\u65e6\u6c2e\u4f46\u60ee\u6de1\u8bde\u5f39\u86cb\u4ebb\u510b\u5369\u840f\u5556\u6fb9\u6a90\u6b9a\u8d55\u7708\u7605\u8043\u7baa",
        "dang": "\u5f53\u6321\u515a\u8361\u6863\u8c20\u51fc\u83ea\u5b95\u7800\u94db\u88c6",
        "dao": "\u5200\u6363\u8e48\u5012\u5c9b\u7977\u5bfc\u5230\u7a3b\u60bc\u9053\u76d7\u53e8\u5541\u5fc9\u6d2e\u6c18\u7118\u5fd1\u7e9b",
        "de": "\u5fb7\u5f97\u7684\u951d",
        "deng": "\u8e6c\u706f\u767b\u7b49\u77aa\u51f3\u9093\u5654\u5d9d\u6225\u78f4\u956b\u7c26",
        "di": "\u5824\u4f4e\u6ef4\u8fea\u654c\u7b1b\u72c4\u6da4\u7fdf\u5ae1\u62b5\u5e95\u5730\u8482\u7b2c\u5e1d\u5f1f\u9012\u7f14\u6c10\u7c74\u8bcb\u8c1b\u90b8\u577b\u839c\u837b\u5600\u5a23\u67e2\u68e3\u89cc\u7825\u78b2\u7747\u955d\u7f9d\u9ab6",
        "dian": "\u98a0\u6382\u6ec7\u7898\u70b9\u5178\u975b\u57ab\u7535\u4f43\u7538\u5e97\u60e6\u5960\u6dc0\u6bbf\u4e36\u963d\u576b\u57dd\u5dc5\u73b7\u765c\u766b\u7c1f\u8e2e",
        "diao": "\u7889\u53fc\u96d5\u51cb\u5201\u6389\u540a\u9493\u8c03\u8f7a\u94de\u8729\u7c9c\u8c82",
        "die": "\u8dcc\u7239\u789f\u8776\u8fed\u8c0d\u53e0\u4f5a\u57a4\u581e\u63f2\u558b\u6e2b\u8f76\u7252\u74de\u8936\u800b\u8e40\u9cbd\u9cce",
        "ding": "\u4e01\u76ef\u53ee\u9489\u9876\u9f0e\u952d\u5b9a\u8ba2\u4e22\u4ec3\u5576\u738e\u815a\u7887\u753a\u94e4\u7594\u8035\u914a",
        "dong": "\u4e1c\u51ac\u8463\u61c2\u52a8\u680b\u4f97\u606b\u51bb\u6d1e\u578c\u549a\u5cbd\u5cd2\u5902\u6c21\u80e8\u80f4\u7850\u9e2b",
        "dou": "\u515c\u6296\u6597\u9661\u8c46\u9017\u75d8\u8538\u94ad\u7aa6\u7aac\u86aa\u7bfc\u9161",
        "du": "\u90fd\u7763\u6bd2\u728a\u72ec\u8bfb\u5835\u7779\u8d4c\u675c\u9540\u809a\u5ea6\u6e21\u5992\u828f\u561f\u6e0e\u691f\u6a50\u724d\u8839\u7b03\u9ad1\u9ee9",
        "duan": "\u7aef\u77ed\u953b\u6bb5\u65ad\u7f0e\u5f56\u6934\u7145\u7c16",
        "dui": "\u5806\u5151\u961f\u5bf9\u603c\u619d\u7893",
        "dun": "\u58a9\u5428\u8e72\u6566\u987f\u56e4\u949d\u76fe\u9041\u7096\u7818\u7905\u76f9\u9566\u8db8",
        "duo": "\u6387\u54c6\u591a\u593a\u579b\u8eb2\u6735\u8dfa\u8235\u5241\u60f0\u5815\u5484\u54da\u7f0d\u67c1\u94ce\u88f0\u8e31",
        "e": "\u86fe\u5ce8\u9e45\u4fc4\u989d\u8bb9\u5a25\u6076\u5384\u627c\u904f\u9102\u997f\u5669\u8c14\u57a9\u57ad\u82ca\u83aa\u843c\u5443\u6115\u5c59\u5a40\u8f6d\u66f7\u816d\u786a\u9507\u9537\u9e57\u989a\u9cc4",
        "en": "\u6069\u84bd\u6441\u5514\u55ef",
        "er": "\u800c\u513f\u8033\u5c14\u9975\u6d31\u4e8c\u8d30\u8fe9\u73e5\u94d2\u9e38\u9c95",
        "fa": "\u53d1\u7f5a\u7b4f\u4f10\u4e4f\u9600\u6cd5\u73d0\u57a1\u781d",
        "fan": "\u85e9\u5e06\u756a\u7ffb\u6a0a\u77fe\u9492\u7e41\u51e1\u70e6\u53cd\u8fd4\u8303\u8d29\u72af\u996d\u6cdb\u8629\u5e61\u72ad\u68b5\u6535\u71d4\u7548\u8e6f",
        "fang": "\u574a\u82b3\u65b9\u80aa\u623f\u9632\u59a8\u4eff\u8bbf\u7eba\u653e\u531a\u90a1\u5f77\u94ab\u822b\u9c82",
        "fei": "\u83f2\u975e\u5561\u98de\u80a5\u532a\u8bfd\u5420\u80ba\u5e9f\u6cb8\u8d39\u82be\u72d2\u60b1\u6ddd\u5983\u7ecb\u7eef\u69a7\u8153\u6590\u6249\u7953\u7829\u9544\u75f1\u871a\u7bda\u7fe1\u970f\u9cb1",
        "fen": "\u82ac\u915a\u5429\u6c1b\u5206\u7eb7\u575f\u711a\u6c7e\u7c89\u594b\u4efd\u5fff\u6124\u7caa\u507e\u7035\u68fc\u610d\u9cbc\u9f22",
        "feng": "\u4e30\u5c01\u67ab\u8702\u5cf0\u950b\u98ce\u75af\u70fd\u9022\u51af\u7f1d\u8bbd\u5949\u51e4\u4ff8\u9146\u8451\u6ca3\u781c",
        "fu": "\u4f5b\u5426\u592b\u6577\u80a4\u5b75\u6276\u62c2\u8f90\u5e45\u6c1f\u7b26\u4f0f\u4fd8\u670d\u6d6e\u6daa\u798f\u88b1\u5f17\u752b\u629a\u8f85\u4fef\u91dc\u65a7\u812f\u8151\u5e9c\u8150\u8d74\u526f\u8986\u8d4b\u590d\u5085\u4ed8\u961c\u7236\u8179\u8d1f\u5bcc\u8ba3\u9644\u5987\u7f1a\u5490\u5310\u51eb\u90db\u8299\u82fb\u832f\u83a9\u83d4\u544b\u5e5e\u6ecf\u8274\u5b5a\u9a78\u7ec2\u6874\u8d59\u9efb\u9efc\u7f58\u7a03\u99a5\u864d\u86a8\u8709\u8760\u876e\u9eb8\u8dba\u8dd7\u9cc6",
        "ga": "\u5676\u560e\u86e4\u5c2c\u5477\u5c15\u5c1c\u65ee\u9486",
        "gai": "\u8be5\u6539\u6982\u9499\u76d6\u6e89\u4e10\u9654\u5793\u6224\u8d45\u80f2",
        "gan": "\u5e72\u7518\u6746\u67d1\u7aff\u809d\u8d76\u611f\u79c6\u6562\u8d63\u5769\u82f7\u5c34\u64c0\u6cd4\u6de6\u6f89\u7ec0\u6a44\u65f0\u77f8\u75b3\u9150",
        "gang": "\u5188\u521a\u94a2\u7f38\u809b\u7eb2\u5c97\u6e2f\u6206\u7f61\u9883\u7b7b",
        "gong": "\u6760\u5de5\u653b\u529f\u606d\u9f9a\u4f9b\u8eac\u516c\u5bab\u5f13\u5de9\u6c5e\u62f1\u8d21\u5171\u857b\u5efe\u54a3\u73d9\u80b1\u86a3\u86e9\u89e5",
        "gao": "\u7bd9\u768b\u9ad8\u818f\u7f94\u7cd5\u641e\u9550\u7a3f\u544a\u777e\u8bf0\u90dc\u84bf\u85c1\u7f1f\u69d4\u69c1\u6772\u9506",
        "ge": "\u54e5\u6b4c\u6401\u6208\u9e3d\u80f3\u7599\u5272\u9769\u845b\u683c\u9601\u9694\u94ec\u4e2a\u5404\u9b32\u4ee1\u54ff\u5865\u55dd\u7ea5\u643f\u8188\u784c\u94ea\u9549\u88bc\u988c\u867c\u8238\u9abc\u9ac2",
        "gei": "\u7ed9",
        "gen": "\u6839\u8ddf\u4e98\u831b\u54cf\u826e",
        "geng": "\u8015\u66f4\u5e9a\u7fb9\u57c2\u803f\u6897\u54fd\u8d53\u9ca0",
        "gou": "\u94a9\u52fe\u6c9f\u82df\u72d7\u57a2\u6784\u8d2d\u591f\u4f5d\u8bdf\u5ca3\u9058\u5abe\u7f11\u89cf\u5f40\u9e32\u7b31\u7bdd\u97b2",
        "gu": "\u8f9c\u83c7\u5495\u7b8d\u4f30\u6cbd\u5b64\u59d1\u9f13\u53e4\u86ca\u9aa8\u8c37\u80a1\u6545\u987e\u56fa\u96c7\u560f\u8bc2\u83f0\u54cc\u5d2e\u6c69\u688f\u8f71\u726f\u727f\u80cd\u81cc\u6bc2\u77bd\u7f5f\u94b4\u9522\u74e0\u9e2a\u9e44\u75fc\u86c4\u9164\u89da\u9cb4\u9ab0\u9e58",
        "gua": "\u522e\u74dc\u5250\u5be1\u6302\u8902\u5366\u8bd6\u5471\u681d\u9e39",
        "guai": "\u4e56\u62d0\u602a\u54d9",
        "guan": "\u68fa\u5173\u5b98\u51a0\u89c2\u7ba1\u9986\u7f50\u60ef\u704c\u8d2f\u500c\u839e\u63bc\u6dab\u76e5\u9e73\u9ccf",
        "guang": "\u5149\u5e7f\u901b\u72b7\u6844\u80f1\u7592",
        "gui": "\u7470\u89c4\u572d\u7845\u5f52\u9f9f\u95fa\u8f68\u9b3c\u8be1\u7678\u6842\u67dc\u8dea\u8d35\u523d\u5326\u523f\u5e8b\u5b84\u59ab\u6867\u7085\u6677\u7688\u7c0b\u9c91\u9cdc",
        "gun": "\u8f8a\u6eda\u68cd\u4e28\u886e\u7ef2\u78d9\u9ca7",
        "guo": "\u9505\u90ed\u56fd\u679c\u88f9\u8fc7\u9998\u8803\u57da\u63b4\u5459\u56d7\u5e3c\u5d1e\u7313\u6901\u8662\u951e\u8052\u872e\u873e\u8748",
        "ha": "\u54c8",
        "hai": "\u9ab8\u5b69\u6d77\u6c26\u4ea5\u5bb3\u9a87\u54b4\u55e8\u988f\u91a2",
        "han": "\u9163\u61a8\u90af\u97e9\u542b\u6db5\u5bd2\u51fd\u558a\u7f55\u7ff0\u64bc\u634d\u65f1\u61be\u608d\u710a\u6c57\u6c49\u9097\u83e1\u6496\u961a\u701a\u6657\u7113\u9894\u86b6\u9f3e",
        "hen": "\u592f\u75d5\u5f88\u72e0\u6068",
        "hang": "\u676d\u822a\u6c86\u7ed7\u73e9\u6841",
        "hao": "\u58d5\u568e\u8c6a\u6beb\u90dd\u597d\u8017\u53f7\u6d69\u8585\u55e5\u5686\u6fe0\u704f\u660a\u7693\u98a2\u869d",
        "he": "\u5475\u559d\u8377\u83cf\u6838\u79be\u548c\u4f55\u5408\u76d2\u8c89\u9602\u6cb3\u6db8\u8d6b\u8910\u9e64\u8d3a\u8bc3\u52be\u58d1\u85ff\u55d1\u55ec\u9616\u76cd\u86b5\u7fee",
        "hei": "\u563f\u9ed1",
        "heng": "\u54fc\u4ea8\u6a2a\u8861\u6052\u8a07\u8605",
        "hong": "\u8f70\u54c4\u70d8\u8679\u9e3f\u6d2a\u5b8f\u5f18\u7ea2\u9ec9\u8ba7\u836d\u85a8\u95f3\u6cd3",
        "hou": "\u5589\u4faf\u7334\u543c\u539a\u5019\u540e\u5820\u5f8c\u9005\u760a\u7bcc\u7cc7\u9c8e\u9aba",
        "hu": "\u547c\u4e4e\u5ffd\u745a\u58f6\u846b\u80e1\u8774\u72d0\u7cca\u6e56\u5f27\u864e\u552c\u62a4\u4e92\u6caa\u6237\u51b1\u553f\u56eb\u5cb5\u7322\u6019\u60da\u6d52\u6ef9\u7425\u69f2\u8f77\u89f3\u70c0\u7173\u623d\u6248\u795c\u9e55\u9e71\u7b0f\u9190\u659b",
        "hua": "\u82b1\u54d7\u534e\u733e\u6ed1\u753b\u5212\u5316\u8bdd\u5290\u6d4d\u9a85\u6866\u94e7\u7a1e",
        "huai": "\u69d0\u5f8a\u6000\u6dee\u574f\u8fd8\u8e1d",
        "huan": "\u6b22\u73af\u6853\u7f13\u6362\u60a3\u5524\u75ea\u8c62\u7115\u6da3\u5ba6\u5e7b\u90c7\u5942\u57b8\u64d0\u571c\u6d39\u6d63\u6f36\u5bf0\u902d\u7f33\u953e\u9ca9\u9b1f",
        "huang": "\u8352\u614c\u9ec4\u78fa\u8757\u7c27\u7687\u51f0\u60f6\u714c\u6643\u5e4c\u604d\u8c0e\u968d\u5fa8\u6e5f\u6f62\u9051\u749c\u8093\u7640\u87e5\u7bc1\u9cc7",
        "hui": "\u7070\u6325\u8f89\u5fbd\u6062\u86d4\u56de\u6bc1\u6094\u6167\u5349\u60e0\u6666\u8d3f\u79fd\u4f1a\u70e9\u6c47\u8bb3\u8bf2\u7ed8\u8bd9\u8334\u835f\u8559\u54d5\u5599\u96b3\u6d04\u5f57\u7f0b\u73f2\u6656\u605a\u867a\u87ea\u9ebe",
        "hun": "\u8364\u660f\u5a5a\u9b42\u6d51\u6df7\u8be8\u9984\u960d\u6eb7\u7f17",
        "huo": "\u8c41\u6d3b\u4f19\u706b\u83b7\u6216\u60d1\u970d\u8d27\u7978\u6509\u56af\u5925\u94ac\u952a\u956c\u8020\u8816",
        "ji": "\u51fb\u573e\u57fa\u673a\u7578\u7a3d\u79ef\u7b95\u808c\u9965\u8ff9\u6fc0\u8ba5\u9e21\u59ec\u7ee9\u7f09\u5409\u6781\u68d8\u8f91\u7c4d\u96c6\u53ca\u6025\u75be\u6c72\u5373\u5ac9\u7ea7\u6324\u51e0\u810a\u5df1\u84df\u6280\u5180\u5b63\u4f0e\u796d\u5242\u60b8\u6d4e\u5bc4\u5bc2\u8ba1\u8bb0\u65e2\u5fcc\u9645\u5993\u7ee7\u7eaa\u5c45\u4e0c\u4e69\u525e\u4f76\u4f74\u8114\u58bc\u82a8\u82b0\u8401\u84ba\u857a\u638e\u53fd\u54ad\u54dc\u5527\u5c8c\u5d74\u6d0e\u5f50\u5c50\u9aa5\u757f\u7391\u696b\u6b9b\u621f\u6222\u8d4d\u89ca\u7284\u9f51\u77f6\u7f81\u5d47\u7a37\u7620\u7635\u866e\u7b08\u7b04\u66a8\u8dfb\u8dfd\u9701\u9c9a\u9cab\u9afb\u9e82",
        "jia": "\u5609\u67b7\u5939\u4f73\u5bb6\u52a0\u835a\u988a\u8d3e\u7532\u94be\u5047\u7a3c\u4ef7\u67b6\u9a7e\u5ac1\u4f3d\u90cf\u62ee\u5cac\u6d43\u8fe6\u73c8\u621b\u80db\u605d\u94d7\u9553\u75c2\u86f1\u7b33\u8888\u8dcf",
        "jian": "\u6b7c\u76d1\u575a\u5c16\u7b3a\u95f4\u714e\u517c\u80a9\u8270\u5978\u7f04\u8327\u68c0\u67ec\u78b1\u7877\u62e3\u6361\u7b80\u4fed\u526a\u51cf\u8350\u69db\u9274\u8df5\u8d31\u89c1\u952e\u7bad\u4ef6\u5065\u8230\u5251\u996f\u6e10\u6e85\u6da7\u5efa\u50ed\u8c0f\u8c2b\u83c5\u84b9\u641b\u56dd\u6e54\u8e47\u8b07\u7f23\u67a7\u67d9\u6957\u620b\u622c\u726e\u728d\u6bfd\u8171\u7751\u950f\u9e63\u88e5\u7b15\u7bb4\u7fe6\u8dbc\u8e3a\u9ca3\u97af",
        "jiang": "\u50f5\u59dc\u5c06\u6d46\u6c5f\u7586\u848b\u6868\u5956\u8bb2\u5320\u9171\u964d\u8333\u6d1a\u7edb\u7f30\u729f\u7913\u8029\u7ce8\u8c47",
        "jiao": "\u8549\u6912\u7901\u7126\u80f6\u4ea4\u90ca\u6d47\u9a84\u5a07\u56bc\u6405\u94f0\u77eb\u4fa5\u811a\u72e1\u89d2\u997a\u7f34\u7ede\u527f\u6559\u9175\u8f7f\u8f83\u53eb\u4f7c\u50ec\u832d\u6322\u564d\u5ce4\u5fbc\u59e3\u7e9f\u656b\u768e\u9e6a\u86df\u91ae\u8de4\u9c9b",
        "jie": "\u7a96\u63ed\u63a5\u7686\u79f8\u8857\u9636\u622a\u52ab\u8282\u6854\u6770\u6377\u776b\u7aed\u6d01\u7ed3\u89e3\u59d0\u6212\u85c9\u82a5\u754c\u501f\u4ecb\u75a5\u8beb\u5c4a\u5048\u8ba6\u8bd8\u5588\u55df\u736c\u5a55\u5b51\u6840\u7352\u78a3\u9534\u7596\u88b7\u9889\u86a7\u7faf\u9c92\u9ab1\u9aeb",
        "jin": "\u5dfe\u7b4b\u65a4\u91d1\u4eca\u6d25\u895f\u7d27\u9526\u4ec5\u8c28\u8fdb\u9773\u664b\u7981\u8fd1\u70ec\u6d78\u5c3d\u537a\u8369\u5807\u5664\u9991\u5ed1\u5997\u7f19\u747e\u69ff\u8d46\u89d0\u9485\u9513\u887f\u77dc",
        "jing": "\u52b2\u8346\u5162\u830e\u775b\u6676\u9cb8\u4eac\u60ca\u7cbe\u7cb3\u7ecf\u4e95\u8b66\u666f\u9888\u9759\u5883\u656c\u955c\u5f84\u75c9\u9756\u7adf\u7ade\u51c0\u522d\u5106\u9631\u83c1\u734d\u61ac\u6cfe\u8ff3\u5f2a\u5a67\u80bc\u80eb\u8148\u65cc",
        "jiong": "\u70af\u7a98\u5182\u8fe5\u6243",
        "jiu": "\u63ea\u7a76\u7ea0\u7396\u97ed\u4e45\u7078\u4e5d\u9152\u53a9\u6551\u65e7\u81fc\u8205\u548e\u5c31\u759a\u50e6\u557e\u9604\u67e9\u6855\u9e6b\u8d73\u9b0f",
        "ju": "\u97a0\u62d8\u72d9\u75bd\u9a79\u83ca\u5c40\u5480\u77e9\u4e3e\u6cae\u805a\u62d2\u636e\u5de8\u5177\u8ddd\u8e1e\u952f\u4ff1\u53e5\u60e7\u70ac\u5267\u5028\u8bb5\u82e3\u82f4\u8392\u63ac\u907d\u5c66\u741a\u67b8\u6910\u6998\u6989\u6a58\u728b\u98d3\u949c\u9514\u7aad\u88fe\u8d84\u91b5\u8e3d\u9f83\u96ce\u97ab",
        "juan": "\u6350\u9e43\u5a1f\u5026\u7737\u5377\u7ee2\u9104\u72f7\u6d93\u684a\u8832\u9529\u954c\u96bd",
        "jue": "\u6485\u652b\u6289\u6398\u5014\u7235\u89c9\u51b3\u8bc0\u7edd\u53a5\u5282\u8c32\u77cd\u8568\u5658\u5d1b\u7357\u5b53\u73cf\u6877\u6a5b\u721d\u9562\u8e76\u89d6",
        "jun": "\u5747\u83cc\u94a7\u519b\u541b\u5cfb\u4fca\u7ae3\u6d5a\u90e1\u9a8f\u6343\u72fb\u76b2\u7b60\u9e87",
        "ka": "\u5580\u5496\u5361\u4f67\u5494\u80e9",
        "ke": "\u54af\u5777\u82db\u67ef\u68f5\u78d5\u9897\u79d1\u58f3\u54b3\u53ef\u6e34\u514b\u523b\u5ba2\u8bfe\u5ca2\u606a\u6e98\u9a92\u7f02\u73c2\u8f72\u6c2a\u778c\u94b6\u75b4\u7aa0\u874c\u9ac1",
        "kai": "\u5f00\u63e9\u6977\u51ef\u6168\u5240\u57b2\u8488\u5ffe\u607a\u94e0\u950e",
        "kan": "\u520a\u582a\u52d8\u574e\u780d\u770b\u4f83\u51f5\u83b0\u83b6\u6221\u9f9b\u77b0",
        "kang": "\u5eb7\u6177\u7ce0\u625b\u6297\u4ea2\u7095\u5751\u4f09\u95f6\u94aa",
        "kao": "\u8003\u62f7\u70e4\u9760\u5c3b\u6832\u7292\u94d0",
        "ken": "\u80af\u5543\u57a6\u6073\u57a0\u88c9\u9880",
        "keng": "\u542d\u5fd0\u94ff",
        "kong": "\u7a7a\u6050\u5b54\u63a7\u5025\u5d06\u7b9c",
        "kou": "\u62a0\u53e3\u6263\u5bc7\u82a4\u853b\u53e9\u770d\u7b58",
        "ku": "\u67af\u54ed\u7a9f\u82e6\u9177\u5e93\u88e4\u5233\u5800\u55be\u7ed4\u9ab7",
        "kua": "\u5938\u57ae\u630e\u8de8\u80ef\u4f89",
        "kuai": "\u5757\u7b77\u4fa9\u5feb\u84af\u90d0\u8489\u72ef\u810d",
        "kuan": "\u5bbd\u6b3e\u9acb",
        "kuang": "\u5321\u7b50\u72c2\u6846\u77ff\u7736\u65f7\u51b5\u8bd3\u8bf3\u909d\u5739\u593c\u54d0\u7ea9\u8d36",
        "kui": "\u4e8f\u76d4\u5cbf\u7aa5\u8475\u594e\u9b41\u5080\u9988\u6127\u6e83\u9997\u532e\u5914\u9697\u63c6\u55b9\u559f\u609d\u6126\u9615\u9035\u668c\u777d\u8069\u8770\u7bd1\u81fe\u8dec",
        "kun": "\u5764\u6606\u6346\u56f0\u6083\u9603\u7428\u951f\u918c\u9cb2\u9ae1",
        "kuo": "\u62ec\u6269\u5ed3\u9614\u86de",
        "la": "\u5783\u62c9\u5587\u8721\u814a\u8fa3\u5566\u524c\u647a\u908b\u65ef\u782c\u760c",
        "lai": "\u83b1\u6765\u8d56\u5d03\u5f95\u6d9e\u6fd1\u8d49\u7750\u94fc\u765e\u7c41",
        "lan": "\u84dd\u5a6a\u680f\u62e6\u7bee\u9611\u5170\u6f9c\u8c30\u63fd\u89c8\u61d2\u7f06\u70c2\u6ee5\u5549\u5c9a\u61d4\u6f24\u6984\u6593\u7f71\u9567\u8934",
        "lang": "\u7405\u6994\u72fc\u5eca\u90ce\u6717\u6d6a\u83a8\u8497\u5577\u9606\u9512\u7a02\u8782",
        "lao": "\u635e\u52b3\u7262\u8001\u4f6c\u59e5\u916a\u70d9\u6d9d\u5520\u5d02\u6833\u94d1\u94f9\u75e8\u91aa",
        "le": "\u52d2\u4e50\u808b\u4ec2\u53fb\u561e\u6cd0\u9cd3",
        "lei": "\u96f7\u956d\u857e\u78ca\u7d2f\u5121\u5792\u64c2\u7c7b\u6cea\u7fb8\u8bd4\u837d\u54a7\u6f2f\u5ad8\u7f27\u6a91\u8012\u9179",
        "ling": "\u68f1\u51b7\u62ce\u73b2\u83f1\u96f6\u9f84\u94c3\u4f36\u7f9a\u51cc\u7075\u9675\u5cad\u9886\u53e6\u4ee4\u9143\u5844\u82d3\u5464\u56f9\u6ce0\u7eeb\u67c3\u68c2\u74f4\u8046\u86c9\u7fce\u9cae",
        "leng": "\u695e\u6123",
        "li": "\u5398\u68a8\u7281\u9ece\u7bf1\u72f8\u79bb\u6f13\u7406\u674e\u91cc\u9ca4\u793c\u8389\u8354\u540f\u6817\u4e3d\u5389\u52b1\u783e\u5386\u5229\u5088\u4f8b\u4fd0\u75e2\u7acb\u7c92\u6ca5\u96b6\u529b\u7483\u54e9\u4fea\u4fda\u90e6\u575c\u82c8\u8385\u84e0\u85dc\u6369\u5456\u5533\u55b1\u7301\u6ea7\u6fa7\u9026\u5a0c\u5ae0\u9a8a\u7f21\u73de\u67a5\u680e\u8f79\u623e\u783a\u8a48\u7f79\u9502\u9e42\u75a0\u75ac\u86ce\u870a\u8821\u7b20\u7be5\u7c9d\u91b4\u8dde\u96f3\u9ca1\u9ce2\u9ee7",
        "lian": "\u4fe9\u8054\u83b2\u8fde\u9570\u5ec9\u601c\u6d9f\u5e18\u655b\u8138\u94fe\u604b\u70bc\u7ec3\u631b\u8539\u5941\u6f4b\u6fc2\u5a08\u740f\u695d\u6b93\u81c1\u81a6\u88e2\u880a\u9ca2",
        "liang": "\u7cae\u51c9\u6881\u7cb1\u826f\u4e24\u8f86\u91cf\u667e\u4eae\u8c05\u589a\u690b\u8e09\u9753\u9b49",
        "liao": "\u64a9\u804a\u50da\u7597\u71ce\u5be5\u8fbd\u6f66\u4e86\u6482\u9563\u5ed6\u6599\u84fc\u5c25\u5639\u7360\u5bee\u7f2d\u948c\u9e69\u8022",
        "lie": "\u5217\u88c2\u70c8\u52a3\u730e\u51bd\u57d2\u6d0c\u8d94\u8e90\u9b23",
        "lin": "\u7433\u6797\u78f7\u9716\u4e34\u90bb\u9cde\u6dcb\u51db\u8d41\u541d\u853a\u5d99\u5eea\u9074\u6aa9\u8f9a\u77b5\u7cbc\u8e8f\u9e9f",
        "liu": "\u6e9c\u7409\u69b4\u786b\u998f\u7559\u5218\u7624\u6d41\u67f3\u516d\u62a1\u507b\u848c\u6cd6\u6d4f\u905b\u9a9d\u7efa\u65d2\u7198\u950d\u954f\u9e68\u938f",
        "long": "\u9f99\u804b\u5499\u7b3c\u7abf\u9686\u5784\u62e2\u9647\u5f04\u5785\u830f\u6cf7\u73d1\u680a\u80e7\u783b\u7643",
        "lou": "\u697c\u5a04\u6402\u7bd3\u6f0f\u964b\u55bd\u5d5d\u9542\u7618\u8027\u877c\u9ac5",
        "lu": "\u82a6\u5362\u9885\u5e90\u7089\u63b3\u5364\u864f\u9c81\u9e93\u788c\u9732\u8def\u8d42\u9e7f\u6f5e\u7984\u5f55\u9646\u622e\u5786\u6445\u64b8\u565c\u6cf8\u6e0c\u6f09\u7490\u680c\u6a79\u8f73\u8f82\u8f98\u6c07\u80ea\u9565\u9e2c\u9e6d\u7c0f\u823b\u9c88",
        "lv": "\u9a74\u5415\u94dd\u4fa3\u65c5\u5c65\u5c61\u7f15\u8651\u6c2f\u5f8b\u7387\u6ee4\u7eff\u634b\u95fe\u6988\u8182\u7a06\u891b",
        "luan": "\u5ce6\u5b6a\u6ee6\u5375\u4e71\u683e\u9e3e\u92ae",
        "lue": "\u63a0\u7565\u950a",
        "lun": "\u8f6e\u4f26\u4ed1\u6ca6\u7eb6\u8bba\u56f5",
        "luo": "\u841d\u87ba\u7f57\u903b\u9523\u7ba9\u9aa1\u88f8\u843d\u6d1b\u9a86\u7edc\u502e\u8366\u645e\u7321\u6cfa\u6924\u8136\u9559\u7630\u96d2",
        "ma": "\u5988\u9ebb\u739b\u7801\u8682\u9a6c\u9a82\u561b\u5417\u551b\u72b8\u5b37\u6769\u9ebd",
        "mai": "\u57cb\u4e70\u9ea6\u5356\u8fc8\u8109\u52a2\u836c\u54aa\u973e",
        "man": "\u7792\u9992\u86ee\u6ee1\u8513\u66fc\u6162\u6f2b\u8c29\u5881\u5e54\u7f26\u71b3\u9558\u989f\u87a8\u9cd7\u9794",
        "mang": "\u8292\u832b\u76f2\u5fd9\u83bd\u9099\u6f2d\u6726\u786d\u87d2",
        "meng": "\u6c13\u840c\u8499\u6aac\u76df\u9530\u731b\u68a6\u5b5f\u52d0\u750d\u77a2\u61f5\u791e\u867b\u8722\u8813\u824b\u8268\u9efe",
        "miao": "\u732b\u82d7\u63cf\u7784\u85d0\u79d2\u6e3a\u5e99\u5999\u55b5\u9088\u7f08\u7f2a\u676a\u6dfc\u7707\u9e4b\u8731",
        "mao": "\u8305\u951a\u6bdb\u77db\u94c6\u536f\u8302\u5192\u5e3d\u8c8c\u8d38\u4f94\u88a4\u52d6\u8306\u5cc1\u7441\u6634\u7266\u8004\u65c4\u61cb\u7780\u86d1\u8765\u87ca\u9ae6",
        "me": "\u4e48",
        "mei": "\u73ab\u679a\u6885\u9176\u9709\u7164\u6ca1\u7709\u5a92\u9541\u6bcf\u7f8e\u6627\u5bd0\u59b9\u5a9a\u5776\u8393\u5d4b\u7338\u6d7c\u6e44\u6963\u9545\u9e5b\u8882\u9b45",
        "men": "\u95e8\u95f7\u4eec\u626a\u739f\u7116\u61d1\u9494",
        "mi": "\u772f\u919a\u9761\u7cdc\u8ff7\u8c1c\u5f25\u7c73\u79d8\u89c5\u6ccc\u871c\u5bc6\u5e42\u8288\u5196\u8c27\u863c\u5627\u7315\u736f\u6c68\u5b93\u5f2d\u8112\u6549\u7cf8\u7e3b\u9e8b",
        "mian": "\u68c9\u7720\u7ef5\u5195\u514d\u52c9\u5a29\u7f05\u9762\u6c94\u6e4e\u817c\u7704",
        "mie": "\u8511\u706d\u54a9\u881b\u7bfe",
        "min": "\u6c11\u62bf\u76bf\u654f\u60af\u95fd\u82e0\u5cb7\u95f5\u6cef\u73c9",
        "ming": "\u660e\u879f\u9e23\u94ed\u540d\u547d\u51a5\u8317\u6e9f\u669d\u7791\u9169",
        "miu": "\u8c2c",
        "mo": "\u6478\u6479\u8611\u6a21\u819c\u78e8\u6469\u9b54\u62b9\u672b\u83ab\u58a8\u9ed8\u6cab\u6f20\u5bde\u964c\u8c1f\u8309\u84e6\u998d\u5aeb\u9546\u79e3\u763c\u8031\u87c6\u8c8a\u8c98",
        "mou": "\u8c0b\u725f\u67d0\u53b6\u54de\u5a7a\u7738\u936a",
        "mu": "\u62c7\u7261\u4ea9\u59c6\u6bcd\u5893\u66ae\u5e55\u52df\u6155\u6728\u76ee\u7766\u7267\u7a46\u4eeb\u82dc\u5452\u6c90\u6bea\u94bc",
        "na": "\u62ff\u54ea\u5450\u94a0\u90a3\u5a1c\u7eb3\u5185\u637a\u80ad\u954e\u8872\u7bac",
        "nai": "\u6c16\u4e43\u5976\u8010\u5948\u9f10\u827f\u8418\u67f0",
        "nan": "\u5357\u7537\u96be\u56ca\u5583\u56e1\u6960\u8169\u877b\u8d67",
        "nao": "\u6320\u8111\u607c\u95f9\u5b6c\u57b4\u7331\u7459\u7847\u94d9\u86f2",
        "ne": "\u6dd6\u5462\u8bb7",
        "nei": "\u9981",
        "nen": "\u5ae9\u80fd\u6798\u6041",
        "ni": "\u59ae\u9713\u502a\u6ce5\u5c3c\u62df\u4f60\u533f\u817b\u9006\u6eba\u4f32\u576d\u730a\u6029\u6ee0\u6635\u65ce\u7962\u615d\u7768\u94cc\u9cb5",
        "nian": "\u852b\u62c8\u5e74\u78be\u64b5\u637b\u5ff5\u5eff\u8f87\u9ecf\u9c87\u9cb6",
        "niang": "\u5a18\u917f",
        "niao": "\u9e1f\u5c3f\u8311\u5b32\u8132\u8885",
        "nie": "\u634f\u8042\u5b7d\u556e\u954a\u954d\u6d85\u4e5c\u9667\u8616\u55eb\u8080\u989e\u81ec\u8e51",
        "nin": "\u60a8\u67e0",
        "ning": "\u72de\u51dd\u5b81\u62e7\u6cde\u4f5e\u84e5\u549b\u752f\u804d",
        "niu": "\u725b\u626d\u94ae\u7ebd\u72c3\u5ff8\u599e\u86b4",
        "nong": "\u8113\u6d53\u519c\u4fac",
        "nu": "\u5974\u52aa\u6012\u5476\u5e11\u5f29\u80ec\u5b65\u9a7d",
        "nv": "\u5973\u6067\u9495\u8844",
        "nuan": "\u6696",
        "nuenue": "\u8650",
        "nue": "\u759f\u8c11",
        "nuo": "\u632a\u61e6\u7cef\u8bfa\u50a9\u6426\u558f\u9518",
        "ou": "\u54e6\u6b27\u9e25\u6bb4\u85d5\u5455\u5076\u6ca4\u6004\u74ef\u8026",
        "pa": "\u556a\u8db4\u722c\u5e15\u6015\u7436\u8469\u7b62",
        "pai": "\u62cd\u6392\u724c\u5f98\u6e43\u6d3e\u4ff3\u848e",
        "pan": "\u6500\u6f58\u76d8\u78d0\u76fc\u7554\u5224\u53db\u723f\u6cee\u88a2\u897b\u87e0\u8e52",
        "pang": "\u4e53\u5e9e\u65c1\u802a\u80d6\u6ec2\u9004",
        "pao": "\u629b\u5486\u5228\u70ae\u888d\u8dd1\u6ce1\u530f\u72cd\u5e96\u812c\u75b1",
        "pei": "\u5478\u80da\u57f9\u88f4\u8d54\u966a\u914d\u4f69\u6c9b\u638a\u8f94\u5e14\u6de0\u65c6\u952b\u9185\u9708",
        "pen": "\u55b7\u76c6\u6e53",
        "peng": "\u7830\u62a8\u70f9\u6f8e\u5f6d\u84ec\u68da\u787c\u7bf7\u81a8\u670b\u9e4f\u6367\u78b0\u576f\u580b\u562d\u6026\u87db",
        "pi": "\u7812\u9739\u6279\u62ab\u5288\u7435\u6bd7\u5564\u813e\u75b2\u76ae\u5339\u75de\u50fb\u5c41\u8b6c\u4e15\u9674\u90b3\u90eb\u572e\u9f19\u64d7\u567c\u5e80\u5ab2\u7eb0\u6787\u7513\u7765\u7f74\u94cd\u75e6\u7656\u758b\u868d\u8c94",
        "pian": "\u7bc7\u504f\u7247\u9a97\u8c1d\u9a88\u728f\u80fc\u890a\u7fe9\u8e41",
        "piao": "\u98d8\u6f02\u74e2\u7968\u527d\u560c\u5ad6\u7f25\u6b8d\u779f\u87b5",
        "pie": "\u6487\u77a5\u4e3f\u82e4\u6c15",
        "pin": "\u62fc\u9891\u8d2b\u54c1\u8058\u62da\u59d8\u5ad4\u6980\u725d\u98a6",
        "ping": "\u4e52\u576a\u82f9\u840d\u5e73\u51ed\u74f6\u8bc4\u5c4f\u4fdc\u5a09\u67b0\u9c86",
        "po": "\u5761\u6cfc\u9887\u5a46\u7834\u9b44\u8feb\u7c95\u53f5\u9131\u6ea5\u73c0\u948b\u94b7\u76a4\u7b38",
        "pou": "\u5256\u88d2\u8e23",
        "pu": "\u6251\u94fa\u4ec6\u8386\u8461\u83e9\u84b2\u57d4\u6734\u5703\u666e\u6d66\u8c31\u66dd\u7011\u530d\u5657\u6fee\u749e\u6c06\u9564\u9568\u8e7c",
        "qi": "\u671f\u6b3a\u6816\u621a\u59bb\u4e03\u51c4\u6f06\u67d2\u6c8f\u5176\u68cb\u5947\u6b67\u7566\u5d0e\u8110\u9f50\u65d7\u7948\u7941\u9a91\u8d77\u5c82\u4e5e\u4f01\u542f\u5951\u780c\u5668\u6c14\u8fc4\u5f03\u6c7d\u6ce3\u8bab\u4e9f\u4e93\u573b\u8291\u840b\u847a\u5601\u5c7a\u5c90\u6c54\u6dc7\u9a90\u7eee\u742a\u7426\u675e\u6864\u69ed\u6b39\u797a\u61a9\u789b\u86f4\u871e\u7da6\u7dae\u8dbf\u8e4a\u9ccd\u9e92",
        "qia": "\u6390\u6070\u6d3d\u845c",
        "qian": "\u7275\u6266\u948e\u94c5\u5343\u8fc1\u7b7e\u4edf\u8c26\u4e7e\u9ed4\u94b1\u94b3\u524d\u6f5c\u9063\u6d45\u8c34\u5811\u5d4c\u6b20\u6b49\u4f65\u9621\u828a\u82a1\u8368\u63ae\u5c8d\u60ad\u614a\u9a9e\u6434\u8930\u7f31\u6920\u80b7\u6106\u94a4\u8654\u7b9d",
        "qiang": "\u67aa\u545b\u8154\u7f8c\u5899\u8537\u5f3a\u62a2\u5af1\u6a2f\u6217\u709d\u9516\u9535\u956a\u8941\u8723\u7f9f\u8deb\u8dc4",
        "qiao": "\u6a47\u9539\u6572\u6084\u6865\u77a7\u4e54\u4fa8\u5de7\u9798\u64ac\u7fd8\u5ced\u4fcf\u7a8d\u5281\u8bee\u8c2f\u835e\u6100\u6194\u7f32\u6a35\u6bf3\u7857\u8df7\u9792",
        "qie": "\u5207\u8304\u4e14\u602f\u7a83\u90c4\u553c\u60ec\u59be\u6308\u9532\u7ba7",
        "qin": "\u94a6\u4fb5\u4eb2\u79e6\u7434\u52e4\u82b9\u64d2\u79bd\u5bdd\u6c81\u82a9\u84c1\u8572\u63ff\u5423\u55ea\u5659\u6eb1\u6a8e\u8793\u887e",
        "qing": "\u9752\u8f7b\u6c22\u503e\u537f\u6e05\u64ce\u6674\u6c30\u60c5\u9877\u8bf7\u5e86\u5029\u82d8\u570a\u6aa0\u78ec\u873b\u7f44\u7b90\u8b26\u9cad\u9ee5",
        "qiong": "\u743c\u7a77\u909b\u8315\u7a79\u7b47\u928e",
        "qiu": "\u79cb\u4e18\u90b1\u7403\u6c42\u56da\u914b\u6cc5\u4fc5\u6c3d\u5def\u827d\u72b0\u6e6b\u9011\u9052\u6978\u8d47\u9e20\u866c\u86af\u8764\u88d8\u7cd7\u9cc5\u9f3d",
        "qu": "\u8d8b\u533a\u86c6\u66f2\u8eaf\u5c48\u9a71\u6e20\u53d6\u5a36\u9f8b\u8da3\u53bb\u8bce\u52ac\u8556\u8627\u5c96\u8862\u9612\u74a9\u89d1\u6c0d\u795b\u78f2\u766f\u86d0\u883c\u9eb4\u77bf\u9ee2",
        "quan": "\u5708\u98a7\u6743\u919b\u6cc9\u5168\u75ca\u62f3\u72ac\u5238\u529d\u8be0\u8343\u737e\u609b\u7efb\u8f81\u754e\u94e8\u8737\u7b4c\u9b08",
        "que": "\u7f3a\u7094\u7638\u5374\u9e4a\u69b7\u786e\u96c0\u9619\u60ab",
        "qun": "\u88d9\u7fa4\u9021",
        "ran": "\u7136\u71c3\u5189\u67d3\u82d2\u9aef",
        "rang": "\u74e4\u58e4\u6518\u56b7\u8ba9\u79b3\u7a70",
        "rao": "\u9976\u6270\u7ed5\u835b\u5a06\u6861",
        "ruo": "\u60f9\u82e5\u5f31",
        "re": "\u70ed\u504c",
        "ren": "\u58ec\u4ec1\u4eba\u5fcd\u97e7\u4efb\u8ba4\u5203\u598a\u7eab\u4ede\u834f\u845a\u996a\u8f6b\u7a14\u887d",
        "reng": "\u6254\u4ecd",
        "ri": "\u65e5",
        "rong": "\u620e\u8338\u84c9\u8363\u878d\u7194\u6eb6\u5bb9\u7ed2\u5197\u5d58\u72e8\u7f1b\u6995\u877e",
        "rou": "\u63c9\u67d4\u8089\u7cc5\u8e42\u97a3",
        "ru": "\u8339\u8815\u5112\u5b7a\u5982\u8fb1\u4e73\u6c5d\u5165\u8925\u84d0\u85b7\u5685\u6d33\u6ebd\u6fe1\u94f7\u8966\u98a5",
        "ruan": "\u8f6f\u962e\u670a",
        "rui": "\u854a\u745e\u9510\u82ae\u8564\u777f\u868b",
        "run": "\u95f0\u6da6",
        "sa": "\u6492\u6d12\u8428\u5345\u4ee8\u6332\u98d2",
        "sai": "\u816e\u9cc3\u585e\u8d5b\u567b",
        "san": "\u4e09\u53c1\u4f1e\u6563\u5f61\u9993\u6c35\u6bf5\u7cc1\u9730",
        "sang": "\u6851\u55d3\u4e27\u6421\u78c9\u98a1",
        "sao": "\u6414\u9a9a\u626b\u5ac2\u57fd\u81ca\u7619\u9ccb",
        "se": "\u745f\u8272\u6da9\u556c\u94e9\u94ef\u7a51",
        "sen": "\u68ee",
        "seng": "\u50e7",
        "sha": "\u838e\u7802\u6740\u5239\u6c99\u7eb1\u50bb\u5565\u715e\u810e\u6b43\u75e7\u88df\u970e\u9ca8",
        "shai": "\u7b5b\u6652\u917e",
        "shan": "\u73ca\u82eb\u6749\u5c71\u5220\u717d\u886b\u95ea\u9655\u64c5\u8d61\u81b3\u5584\u6c55\u6247\u7f2e\u5261\u8baa\u912f\u57cf\u829f\u6f78\u59d7\u9a9f\u81bb\u9490\u759d\u87ee\u8222\u8dda\u9cdd",
        "shang": "\u5892\u4f24\u5546\u8d4f\u664c\u4e0a\u5c1a\u88f3\u57a7\u7ef1\u6b87\u71b5\u89de",
        "shao": "\u68a2\u634e\u7a0d\u70e7\u828d\u52fa\u97f6\u5c11\u54e8\u90b5\u7ecd\u52ad\u82d5\u6f72\u86f8\u7b24\u7b72\u8244",
        "she": "\u5962\u8d4a\u86c7\u820c\u820d\u8d66\u6444\u5c04\u6151\u6d89\u793e\u8bbe\u538d\u4f58\u731e\u7572\u9e9d",
        "shen": "\u7837\u7533\u547b\u4f38\u8eab\u6df1\u5a20\u7ec5\u795e\u6c88\u5ba1\u5a76\u751a\u80be\u614e\u6e17\u8bdc\u8c02\u5432\u54c2\u6e16\u6939\u77e7\u8703",
        "sheng": "\u58f0\u751f\u7525\u7272\u5347\u7ef3\u7701\u76db\u5269\u80dc\u5723\u4e1e\u6e11\u5ab5\u771a\u7b19",
        "shi": "\u5e08\u5931\u72ee\u65bd\u6e7f\u8bd7\u5c38\u8671\u5341\u77f3\u62fe\u65f6\u4ec0\u98df\u8680\u5b9e\u8bc6\u53f2\u77e2\u4f7f\u5c4e\u9a76\u59cb\u5f0f\u793a\u58eb\u4e16\u67ff\u4e8b\u62ed\u8a93\u901d\u52bf\u662f\u55dc\u566c\u9002\u4ed5\u4f8d\u91ca\u9970\u6c0f\u5e02\u6043\u5ba4\u89c6\u8bd5\u8c25\u57d8\u83b3\u84cd\u5f11\u5511\u9963\u8f7c\u8006\u8d33\u70bb\u793b\u94c8\u94ca\u87ab\u8210\u7b6e\u8c55\u9ca5\u9cba",
        "shou": "\u6536\u624b\u9996\u5b88\u5bff\u6388\u552e\u53d7\u7626\u517d\u624c\u72e9\u7ef6\u824f",
        "shu": "\u852c\u67a2\u68b3\u6b8a\u6292\u8f93\u53d4\u8212\u6dd1\u758f\u4e66\u8d4e\u5b70\u719f\u85af\u6691\u66d9\u7f72\u8700\u9ecd\u9f20\u5c5e\u672f\u8ff0\u6811\u675f\u620d\u7ad6\u5885\u5eb6\u6570\u6f31\u6055\u500f\u587e\u83fd\u5fc4\u6cad\u6d91\u6f8d\u59dd\u7ebe\u6bf9\u8167\u6bb3\u956f\u79eb\u9e6c",
        "shua": "\u5237\u800d\u5530\u6dae",
        "shuai": "\u6454\u8870\u7529\u5e05\u87c0",
        "shuan": "\u6813\u62f4\u95e9",
        "shuang": "\u971c\u53cc\u723d\u5b40",
        "shui": "\u8c01\u6c34\u7761\u7a0e",
        "shun": "\u542e\u77ac\u987a\u821c\u6042",
        "shuo": "\u8bf4\u7855\u6714\u70c1\u84b4\u6420\u55cd\u6fef\u5981\u69ca\u94c4",
        "si": "\u65af\u6495\u5636\u601d\u79c1\u53f8\u4e1d\u6b7b\u8086\u5bfa\u55e3\u56db\u4f3a\u4f3c\u9972\u5df3\u53ae\u4fdf\u5155\u83e5\u549d\u6c5c\u6cd7\u6f8c\u59d2\u9a77\u7f0c\u7940\u7960\u9536\u9e36\u801c\u86f3\u7b25",
        "song": "\u677e\u8038\u6002\u9882\u9001\u5b8b\u8bbc\u8bf5\u51c7\u83d8\u5d27\u5d69\u5fea\u609a\u6dde\u7ae6",
        "sou": "\u641c\u8258\u64de\u55fd\u53df\u55d6\u55fe\u998a\u6eb2\u98d5\u778d\u953c\u878b",
        "su": "\u82cf\u9165\u4fd7\u7d20\u901f\u7c9f\u50f3\u5851\u6eaf\u5bbf\u8bc9\u8083\u5919\u8c21\u850c\u55c9\u612b\u7c0c\u89eb\u7a23",
        "suan": "\u9178\u849c\u7b97",
        "sui": "\u867d\u968b\u968f\u7ee5\u9ad3\u788e\u5c81\u7a57\u9042\u96a7\u795f\u84d1\u51ab\u8c07\u6fc9\u9083\u71e7\u772d\u7762",
        "sun": "\u5b59\u635f\u7b0b\u836a\u72f2\u98e7\u69ab\u8de3\u96bc",
        "suo": "\u68ad\u5506\u7f29\u7410\u7d22\u9501\u6240\u5522\u55e6\u5a11\u686b\u7743\u7fa7",
        "ta": "\u584c\u4ed6\u5b83\u5979\u5854\u736d\u631e\u8e4b\u8e0f\u95fc\u6ebb\u9062\u69bb\u6c93",
        "tai": "\u80ce\u82d4\u62ac\u53f0\u6cf0\u915e\u592a\u6001\u6c70\u90b0\u85b9\u80bd\u70b1\u949b\u8dc6\u9c90",
        "tan": "\u574d\u644a\u8d2a\u762b\u6ee9\u575b\u6a80\u75f0\u6f6d\u8c2d\u8c08\u5766\u6bef\u8892\u78b3\u63a2\u53f9\u70ad\u90ef\u8548\u6619\u94bd\u952c\u8983",
        "tang": "\u6c64\u5858\u642a\u5802\u68e0\u819b\u5510\u7cd6\u50a5\u9967\u6e8f\u746d\u94f4\u9557\u8025\u8797\u87b3\u7fb0\u91a3",
        "thang": "\u5018\u8eba\u6dcc",
        "theng": "\u8d9f\u70eb",
        "tao": "\u638f\u6d9b\u6ed4\u7ee6\u8404\u6843\u9003\u6dd8\u9676\u8ba8\u5957\u6311\u9f17\u5555\u97ec\u9955",
        "te": "\u7279",
        "teng": "\u85e4\u817e\u75bc\u8a8a\u6ed5",
        "ti": "\u68af\u5254\u8e22\u9511\u63d0\u9898\u8e44\u557c\u4f53\u66ff\u568f\u60d5\u6d95\u5243\u5c49\u8351\u608c\u9016\u7ee8\u7f07\u9e48\u88fc\u918d",
        "tian": "\u5929\u6dfb\u586b\u7530\u751c\u606c\u8214\u8146\u63ad\u5fdd\u9617\u6b84\u754b\u94bf\u86ba",
        "tiao": "\u6761\u8fe2\u773a\u8df3\u4f7b\u7967\u94eb\u7a95\u9f86\u9ca6",
        "tie": "\u8d34\u94c1\u5e16\u841c\u992e",
        "ting": "\u5385\u542c\u70c3\u6c40\u5ef7\u505c\u4ead\u5ead\u633a\u8247\u839b\u8476\u5a77\u6883\u8713\u9706",
        "tong": "\u901a\u6850\u916e\u77b3\u540c\u94dc\u5f64\u7ae5\u6876\u6345\u7b52\u7edf\u75db\u4f5f\u50ee\u4edd\u833c\u55f5\u6078\u6f7c\u783c",
        "tou": "\u5077\u6295\u5934\u900f\u4ea0",
        "tu": "\u51f8\u79c3\u7a81\u56fe\u5f92\u9014\u6d82\u5c60\u571f\u5410\u5154\u580d\u837c\u83df\u948d\u9174",
        "tuan": "\u6e4d\u56e2\u7583",
        "tui": "\u63a8\u9893\u817f\u8715\u892a\u9000\u5fd2\u717a",
        "tun": "\u541e\u5c6f\u81c0\u9968\u66be\u8c5a\u7a80",
        "tuo": "\u62d6\u6258\u8131\u9e35\u9640\u9a6e\u9a7c\u692d\u59a5\u62d3\u553e\u4e47\u4f57\u5768\u5eb9\u6cb1\u67dd\u7823\u7ba8\u8204\u8dce\u9f0d",
        "wa": "\u6316\u54c7\u86d9\u6d3c\u5a03\u74e6\u889c\u4f64\u5a32\u817d",
        "wai": "\u6b6a\u5916",
        "wan": "\u8c4c\u5f2f\u6e7e\u73a9\u987d\u4e38\u70f7\u5b8c\u7897\u633d\u665a\u7696\u60cb\u5b9b\u5a49\u4e07\u8155\u525c\u8284\u82cb\u83c0\u7ea8\u7efe\u742c\u8118\u7579\u873f\u7ba2",
        "wang": "\u6c6a\u738b\u4ea1\u6789\u7f51\u5f80\u65fa\u671b\u5fd8\u5984\u7f54\u5c22\u60d8\u8f8b\u9b4d",
        "wei": "\u5a01\u5dcd\u5fae\u5371\u97e6\u8fdd\u6845\u56f4\u552f\u60df\u4e3a\u6f4d\u7ef4\u82c7\u840e\u59d4\u4f1f\u4f2a\u5c3e\u7eac\u672a\u851a\u5473\u754f\u80c3\u5582\u9b4f\u4f4d\u6e2d\u8c13\u5c09\u6170\u536b\u502d\u504e\u8bff\u9688\u8473\u8587\u5e0f\u5e37\u5d34\u5d6c\u7325\u732c\u95f1\u6ca9\u6d27\u6da0\u9036\u5a13\u73ae\u97ea\u8ece\u709c\u7168\u71a8\u75ff\u8249\u9c94",
        "wen": "\u761f\u6e29\u868a\u6587\u95fb\u7eb9\u543b\u7a33\u7d0a\u95ee\u520e\u6120\u960c\u6c76\u74ba\u97eb\u6b81\u96ef",
        "weng": "\u55e1\u7fc1\u74ee\u84ca\u8579",
        "wo": "\u631d\u8717\u6da1\u7a9d\u6211\u65a1\u5367\u63e1\u6c83\u83b4\u5e44\u6e25\u674c\u809f\u9f8c",
        "wu": "\u5deb\u545c\u94a8\u4e4c\u6c61\u8bec\u5c4b\u65e0\u829c\u68a7\u543e\u5434\u6bcb\u6b66\u4e94\u6342\u5348\u821e\u4f0d\u4fae\u575e\u620a\u96fe\u6664\u7269\u52ff\u52a1\u609f\u8bef\u5140\u4ef5\u9622\u90ac\u572c\u82b4\u5e91\u6003\u5fe4\u6d6f\u5be4\u8fd5\u59a9\u9a9b\u727e\u7110\u9e49\u9e5c\u8708\u92c8\u9f2f",
        "xi": "\u6614\u7199\u6790\u897f\u7852\u77fd\u6670\u563b\u5438\u9521\u727a\u7a00\u606f\u5e0c\u6089\u819d\u5915\u60dc\u7184\u70ef\u6eaa\u6c50\u7280\u6a84\u88ad\u5e2d\u4e60\u5ab3\u559c\u94e3\u6d17\u7cfb\u9699\u620f\u7ec6\u50d6\u516e\u96b0\u90d7\u831c\u8478\u84f0\u595a\u550f\u5f99\u9969\u960b\u6d60\u6dc5\u5c63\u5b09\u73ba\u6a28\u66e6\u89cb\u6b37\u71b9\u798a\u79a7\u94b8\u7699\u7a78\u8725\u87cb\u823e\u7fb2\u7c9e\u7fd5\u91af\u9f37",
        "xia": "\u778e\u867e\u5323\u971e\u8f96\u6687\u5ce1\u4fa0\u72ed\u4e0b\u53a6\u590f\u5413\u6380\u846d\u55c4\u72ce\u9050\u7455\u7856\u7615\u7f45\u9ee0",
        "xian": "\u9528\u5148\u4ed9\u9c9c\u7ea4\u54b8\u8d24\u8854\u8237\u95f2\u6d8e\u5f26\u5acc\u663e\u9669\u73b0\u732e\u53bf\u817a\u9985\u7fa1\u5baa\u9677\u9650\u7ebf\u51bc\u85d3\u5c98\u7303\u66b9\u5a34\u6c19\u7946\u9e47\u75eb\u86ac\u7b45\u7c7c\u9170\u8df9",
        "xiang": "\u76f8\u53a2\u9576\u9999\u7bb1\u8944\u6e58\u4e61\u7fd4\u7965\u8be6\u60f3\u54cd\u4eab\u9879\u5df7\u6a61\u50cf\u5411\u8c61\u8297\u8459\u9977\u5ea0\u9aa7\u7f03\u87d3\u9c9e\u98e8",
        "xiao": "\u8427\u785d\u9704\u524a\u54ee\u56a3\u9500\u6d88\u5bb5\u6dc6\u6653\u5c0f\u5b5d\u6821\u8096\u5578\u7b11\u6548\u54d3\u54bb\u5d24\u6f47\u900d\u9a81\u7ee1\u67ad\u67b5\u7b71\u7bab\u9b48",
        "xie": "\u6954\u4e9b\u6b47\u874e\u978b\u534f\u631f\u643a\u90aa\u659c\u80c1\u8c10\u5199\u68b0\u5378\u87f9\u61c8\u6cc4\u6cfb\u8c22\u5c51\u5055\u4eb5\u52f0\u71ee\u85a4\u64b7\u5ee8\u7023\u9082\u7ec1\u7f2c\u69ad\u698d\u6b59\u8e9e",
        "xin": "\u85aa\u82af\u950c\u6b23\u8f9b\u65b0\u5ffb\u5fc3\u4fe1\u8845\u56df\u99a8\u8398\u6b46\u94fd\u946b",
        "xing": "\u661f\u8165\u7329\u60fa\u5174\u5211\u578b\u5f62\u90a2\u884c\u9192\u5e78\u674f\u6027\u59d3\u9649\u8347\u8365\u64e4\u60bb\u784e",
        "xiong": "\u5144\u51f6\u80f8\u5308\u6c79\u96c4\u718a\u828e",
        "xiu": "\u4f11\u4fee\u7f9e\u673d\u55c5\u9508\u79c0\u8896\u7ee3\u83a0\u5cab\u9990\u5ea5\u9e3a\u8c85\u9af9",
        "xu": "\u589f\u620c\u9700\u865a\u5618\u987b\u5f90\u8bb8\u84c4\u9157\u53d9\u65ed\u5e8f\u755c\u6064\u7d6e\u5a7f\u7eea\u7eed\u8bb4\u8be9\u5729\u84ff\u6035\u6d2b\u6e86\u987c\u6829\u7166\u7809\u76f1\u80e5\u7cc8\u9191",
        "xuan": "\u8f69\u55a7\u5ba3\u60ac\u65cb\u7384\u9009\u7663\u7729\u7eda\u5107\u8c16\u8431\u63ce\u9994\u6ceb\u6d35\u6e32\u6f29\u7487\u6966\u6684\u70ab\u714a\u78b9\u94c9\u955f\u75c3",
        "xue": "\u9774\u859b\u5b66\u7a74\u96ea\u8840\u5671\u6cf6\u9cd5",
        "xun": "\u52cb\u718f\u5faa\u65ec\u8be2\u5bfb\u9a6f\u5de1\u6b89\u6c5b\u8bad\u8baf\u900a\u8fc5\u5dfd\u57d9\u8340\u85b0\u5ccb\u5f87\u6d54\u66db\u7aa8\u91ba\u9c9f",
        "ya": "\u538b\u62bc\u9e26\u9e2d\u5440\u4e2b\u82bd\u7259\u869c\u5d16\u8859\u6daf\u96c5\u54d1\u4e9a\u8bb6\u4f22\u63e0\u5416\u5c88\u8fd3\u5a05\u740a\u6860\u6c29\u7811\u775a\u75d6",
        "yan": "\u7109\u54bd\u9609\u70df\u6df9\u76d0\u4e25\u7814\u8712\u5ca9\u5ef6\u8a00\u989c\u960e\u708e\u6cbf\u5944\u63a9\u773c\u884d\u6f14\u8273\u5830\u71d5\u538c\u781a\u96c1\u5501\u5f66\u7130\u5bb4\u8c1a\u9a8c\u53a3\u9765\u8d5d\u4fe8\u5043\u5156\u8ba0\u8c33\u90fe\u9122\u82ab\u83f8\u5d26\u6079\u95eb\u960f\u6d07\u6e6e\u6edf\u598d\u5ae3\u7430\u664f\u80ed\u814c\u7131\u7f68\u7b75\u917d\u9b47\u990d\u9f39",
        "yang": "\u6b83\u592e\u9e2f\u79e7\u6768\u626c\u4f6f\u75a1\u7f8a\u6d0b\u9633\u6c27\u4ef0\u75d2\u517b\u6837\u6f3e\u5f89\u600f\u6cf1\u7080\u70ca\u6059\u86d8\u9785",
        "yao": "\u9080\u8170\u5996\u7476\u6447\u5c27\u9065\u7a91\u8c23\u59da\u54ac\u8200\u836f\u8981\u8000\u592d\u723b\u5406\u5d3e\u5fad\u7039\u5e7a\u73e7\u6773\u66dc\u80b4\u9e5e\u7a88\u7e47\u9cd0",
        "ye": "\u6930\u564e\u8036\u7237\u91ce\u51b6\u4e5f\u9875\u6396\u4e1a\u53f6\u66f3\u814b\u591c\u6db2\u8c12\u90ba\u63f6\u9980\u6654\u70e8\u94d8",
        "yi": "\u4e00\u58f9\u533b\u63d6\u94f1\u4f9d\u4f0a\u8863\u9890\u5937\u9057\u79fb\u4eea\u80f0\u7591\u6c82\u5b9c\u59e8\u5f5d\u6905\u8681\u501a\u5df2\u4e59\u77e3\u4ee5\u827a\u6291\u6613\u9091\u5c79\u4ebf\u5f79\u81c6\u9038\u8084\u75ab\u4ea6\u88d4\u610f\u6bc5\u5fc6\u4e49\u76ca\u6ea2\u8be3\u8bae\u8c0a\u8bd1\u5f02\u7ffc\u7fcc\u7ece\u5208\u5293\u4f7e\u8bd2\u572a\u572f\u57f8\u61ff\u82e1\u858f\u5f08\u5955\u6339\u5f0b\u5453\u54a6\u54bf\u566b\u5cc4\u5db7\u7317\u9974\u603f\u6021\u6092\u6f2a\u8fe4\u9a7f\u7f22\u6baa\u8d3b\u65d6\u71a0\u9487\u9552\u9571\u75cd\u7617\u7654\u7fca\u8864\u8734\u8223\u7fbf\u7ff3\u914f\u9edf",
        "yin": "\u8335\u836b\u56e0\u6bb7\u97f3\u9634\u59fb\u541f\u94f6\u6deb\u5bc5\u996e\u5c39\u5f15\u9690\u5370\u80e4\u911e\u5819\u831a\u5591\u72fa\u5924\u6c24\u94df\u763e\u8693\u972a\u9f88",
        "ying": "\u82f1\u6a31\u5a74\u9e70\u5e94\u7f28\u83b9\u8424\u8425\u8367\u8747\u8fce\u8d62\u76c8\u5f71\u9896\u786c\u6620\u5b34\u90e2\u8314\u83ba\u8426\u6484\u5624\u81ba\u6ee2\u6f46\u701b\u745b\u748e\u6979\u9e66\u763f\u988d\u7f42",
        "yo": "\u54df\u5537",
        "yong": "\u62e5\u4f63\u81c3\u75c8\u5eb8\u96cd\u8e0a\u86f9\u548f\u6cf3\u6d8c\u6c38\u607f\u52c7\u7528\u4fd1\u58c5\u5889\u6175\u9095\u955b\u752c\u9cd9\u9954",
        "you": "\u5e7d\u4f18\u60a0\u5fe7\u5c24\u7531\u90ae\u94c0\u72b9\u6cb9\u6e38\u9149\u6709\u53cb\u53f3\u4f51\u91c9\u8bf1\u53c8\u5e7c\u5363\u6538\u4f91\u83b8\u5466\u56ff\u5ba5\u67da\u7337\u7256\u94d5\u75a3\u8763\u9c7f\u9edd\u9f2c",
        "yu": "\u8fc2\u6de4\u4e8e\u76c2\u6986\u865e\u611a\u8206\u4f59\u4fde\u903e\u9c7c\u6109\u6e1d\u6e14\u9685\u4e88\u5a31\u96e8\u4e0e\u5c7f\u79b9\u5b87\u8bed\u7fbd\u7389\u57df\u828b\u90c1\u5401\u9047\u55bb\u5cea\u5fa1\u6108\u6b32\u72f1\u80b2\u8a89\u6d74\u5bd3\u88d5\u9884\u8c6b\u9a6d\u79ba\u6bd3\u4f1b\u4fe3\u8c00\u8c15\u8438\u84e3\u63c4\u5581\u5704\u5709\u5d5b\u72f3\u996b\u5ebe\u9608\u59aa\u59a4\u7ea1\u745c\u6631\u89ce\u8174\u6b24\u65bc\u715c\u71e0\u807f\u94b0\u9e46\u7610\u7600\u7ab3\u8753\u7afd\u8201\u96e9\u9f89",
        "yuan": "\u9e33\u6e0a\u51a4\u5143\u57a3\u8881\u539f\u63f4\u8f95\u56ed\u5458\u5706\u733f\u6e90\u7f18\u8fdc\u82d1\u613f\u6028\u9662\u586c\u6c85\u5a9b\u7457\u6a7c\u7230\u7722\u9e22\u8788\u9f0b",
        "yue": "\u66f0\u7ea6\u8d8a\u8dc3\u94a5\u5cb3\u7ca4\u6708\u60a6\u9605\u9fa0\u6a3e\u5216\u94ba",
        "yun": "\u8018\u4e91\u90e7\u5300\u9668\u5141\u8fd0\u8574\u915d\u6655\u97f5\u5b55\u90d3\u82b8\u72c1\u607d\u7ead\u6b92\u6600\u6c32",
        "za": "\u531d\u7838\u6742\u62f6\u5482",
        "zai": "\u683d\u54c9\u707e\u5bb0\u8f7d\u518d\u5728\u54b1\u5d3d\u753e",
        "zan": "\u6512\u6682\u8d5e\u74d2\u661d\u7c2a\u7ccc\u8db1\u933e",
        "zang": "\u8d43\u810f\u846c\u5958\u6215\u81e7",
        "zao": "\u906d\u7cdf\u51ff\u85fb\u67a3\u65e9\u6fa1\u86a4\u8e81\u566a\u9020\u7682\u7076\u71e5\u5523\u7f2b",
        "ze": "\u8d23\u62e9\u5219\u6cfd\u4ec4\u8d5c\u5567\u8fee\u6603\u7b2e\u7ba6\u8234",
        "zei": "\u8d3c",
        "zen": "\u600e\u8c2e",
        "zeng": "\u589e\u618e\u66fe\u8d60\u7f2f\u7511\u7f7e\u9503",
        "zha": "\u624e\u55b3\u6e23\u672d\u8f67\u94e1\u95f8\u7728\u6805\u69a8\u548b\u4e4d\u70b8\u8bc8\u63f8\u5412\u54a4\u54f3\u600d\u781f\u75c4\u86b1\u9f44",
        "zhai": "\u6458\u658b\u5b85\u7a84\u503a\u5be8\u7826",
        "zhan": "\u77bb\u6be1\u8a79\u7c98\u6cbe\u76cf\u65a9\u8f97\u5d2d\u5c55\u8638\u6808\u5360\u6218\u7ad9\u6e5b\u7efd\u8c35\u640c\u65c3",
        "zhang": "\u6a1f\u7ae0\u5f70\u6f33\u5f20\u638c\u6da8\u6756\u4e08\u5e10\u8d26\u4ed7\u80c0\u7634\u969c\u4ec9\u9123\u5e5b\u5d82\u7350\u5adc\u748b\u87d1",
        "zhao": "\u62db\u662d\u627e\u6cbc\u8d75\u7167\u7f69\u5146\u8087\u53ec\u722a\u8bcf\u68f9\u948a\u7b0a",
        "zhe": "\u906e\u6298\u54f2\u86f0\u8f99\u8005\u9517\u8517\u8fd9\u6d59\u8c2a\u966c\u67d8\u8f84\u78d4\u9e67\u891a\u8707\u8d6d",
        "zhen": "\u73cd\u659f\u771f\u7504\u7827\u81fb\u8d1e\u9488\u4fa6\u6795\u75b9\u8bca\u9707\u632f\u9547\u9635\u7f1c\u6862\u699b\u8f78\u8d48\u80d7\u6715\u796f\u755b\u9e29",
        "zheng": "\u84b8\u6323\u7741\u5f81\u72f0\u4e89\u6014\u6574\u62ef\u6b63\u653f\u5e27\u75c7\u90d1\u8bc1\u8be4\u5ce5\u94b2\u94ee\u7b5d",
        "zhi": "\u829d\u679d\u652f\u5431\u8718\u77e5\u80a2\u8102\u6c41\u4e4b\u7ec7\u804c\u76f4\u690d\u6b96\u6267\u503c\u4f84\u5740\u6307\u6b62\u8dbe\u53ea\u65e8\u7eb8\u5fd7\u631a\u63b7\u81f3\u81f4\u7f6e\u5e1c\u5cd9\u5236\u667a\u79e9\u7a1a\u8d28\u7099\u75d4\u6ede\u6cbb\u7a92\u536e\u965f\u90c5\u57f4\u82b7\u646d\u5e19\u5fee\u5f58\u54ab\u9a98\u6809\u67b3\u6800\u684e\u8f75\u8f7e\u6534\u8d3d\u81a3\u7949\u7957\u9ef9\u96c9\u9e37\u75e3\u86ed\u7d77\u916f\u8dd6\u8e2c\u8e2f\u8c78\u89ef",
        "zhong": "\u4e2d\u76c5\u5fe0\u949f\u8877\u7ec8\u79cd\u80bf\u91cd\u4ef2\u4f17\u51a2\u953a\u87bd\u8202\u822f\u8e35",
        "zhou": "\u821f\u5468\u5dde\u6d32\u8bcc\u7ca5\u8f74\u8098\u5e1a\u5492\u76b1\u5b99\u663c\u9aa4\u5544\u7740\u501c\u8bf9\u836e\u9b3b\u7ea3\u80c4\u78a1\u7c40\u8233\u914e\u9cb7",
        "zhu": "\u73e0\u682a\u86db\u6731\u732a\u8bf8\u8bdb\u9010\u7af9\u70db\u716e\u62c4\u77a9\u5631\u4e3b\u8457\u67f1\u52a9\u86c0\u8d2e\u94f8\u7b51\u4f4f\u6ce8\u795d\u9a7b\u4f2b\u4f8f\u90be\u82ce\u8331\u6d19\u6e1a\u6f74\u9a7a\u677c\u69e0\u6a65\u70b7\u94e2\u75b0\u7603\u86b0\u7afa\u7bb8\u7fe5\u8e85\u9e88",
        "zhua": "\u6293",
        "zhuai": "\u62fd",
        "zhuan": "\u4e13\u7816\u8f6c\u64b0\u8d5a\u7bc6\u629f\u556d\u989b",
        "zhuang": "\u6869\u5e84\u88c5\u5986\u649e\u58ee\u72b6\u4e2c",
        "zhui": "\u690e\u9525\u8ffd\u8d58\u5760\u7f00\u8411\u9a93\u7f12",
        "zhun": "\u8c06\u51c6",
        "zhuo": "\u6349\u62d9\u5353\u684c\u7422\u8301\u914c\u707c\u6d4a\u502c\u8bfc\u5ef4\u855e\u64e2\u555c\u6d5e\u6dbf\u6753\u712f\u799a\u65ab",
        "zi": "\u5179\u54a8\u8d44\u59ff\u6ecb\u6dc4\u5b5c\u7d2b\u4ed4\u7c7d\u6ed3\u5b50\u81ea\u6e0d\u5b57\u8c18\u5d6b\u59ca\u5b73\u7f01\u6893\u8f8e\u8d40\u6063\u7726\u9531\u79ed\u8014\u7b2b\u7ca2\u89dc\u8a3e\u9cbb\u9aed",
        "zong": "\u9b03\u68d5\u8e2a\u5b97\u7efc\u603b\u7eb5\u8159\u7cbd",
        "zou": "\u90b9\u8d70\u594f\u63cd\u9139\u9cb0",
        "zu": "\u79df\u8db3\u5352\u65cf\u7956\u8bc5\u963b\u7ec4\u4fce\u83f9\u5550\u5f82\u9a75\u8e74",
        "zuan": "\u94bb\u7e82\u6525\u7f35",
        "zui": "\u5634\u9189\u6700\u7f6a",
        "zun": "\u5c0a\u9075\u6499\u6a3d\u9cdf",
        "zuo": "\u6628\u5de6\u4f50\u67de\u505a\u4f5c\u5750\u5ea7\u961d\u963c\u80d9\u795a\u9162",
        "cou": "\u85ae\u6971\u8f8f\u8160",
        "nang": "\u652e\u54dd\u56d4\u9995\u66e9",
        "o": "\u5594",
        "dia": "\u55f2",
        "chuai": "\u562c\u81aa\u8e39",
        "cen": "\u5c91\u6d94",
        "diu": "\u94e5",
        "nou": "\u8028",
        "fou": "\u7f36",
        "bia": "\u9adf"
    };
    var ChineseCharacter = (function () {
        function ChineseCharacter() {
        }
        ChineseCharacter.getPortraitChar = function (name) {
            var f;
            if (name.length) {
                f = name.substr(0, 1).toUpperCase();
            }
            return f;
        };
        ChineseCharacter.getPortraitChar2 = function (name) {
            var f;
            if (name) {
                f = ChineseCharacter.convertToABC(name.charAt(0)).pinyin.charAt(0).toUpperCase();
                f = /[A-Z]/ig.test(f) ? f : "~";
            }
            return f;
        };
        ChineseCharacter.convertToABC = function (str) {
            var reg = /[0-9a-zA-Z\-]/, ret = {
                pinyin: "",
                first: ""
            };
            for (var i = 0, len = str.length; i < len; i++) {
                var c = str.substr(i, 1);
                if (reg.test(c)) {
                    ret.pinyin += c;
                    ret.first += c;
                }
                else {
                    var p = ChineseCharacter.arraySearch(c) || "";
                    ret.pinyin += p;
                    ret.first += p.substr(0, 1);
                }
            }
            return ret;
        };
        ChineseCharacter.arraySearch = function (chart) {
            for (var item in PinYin) {
                if (PinYin[item].indexOf(chart) !== -1) {
                    return item.substr(0, 1).toUpperCase() + item.substr(1, item.length);
                }
            }
            return null;
        };
        return ChineseCharacter;
    })();
    webimutil.ChineseCharacter = ChineseCharacter;
    var NotificationHelper = (function () {
        function NotificationHelper() {
        }
        NotificationHelper.isNotificationSupported = function () {
            return typeof Notification === "function" || typeof Notification === "object";
        };
        NotificationHelper.requestPermission = function () {
            if (!NotificationHelper.isNotificationSupported()) {
                return;
            }
            Notification.requestPermission(function (status) {
            });
        };
        NotificationHelper.onclick = function (n) { };
        NotificationHelper.showNotification = function (config) {
            if (!NotificationHelper.isNotificationSupported()) {
                console.log('the current browser does not support Notification API');
                return;
            }
            if (Notification.permission !== "granted") {
                console.log('the current page has not been granted for notification');
                return;
            }
            if (!document.hidden) {
                return;
            }
            if (!NotificationHelper.desktopNotification) {
                return;
            }
            var title = config.title;
            delete config.title;
            var n = new Notification(title, config);
            n.onshow = function () {
                setTimeout(function () {
                    n.close();
                }, 5000);
            };
            n.onclick = function () {
                window.focus();
                NotificationHelper.onclick(n);
                n.close();
            };
            n.onerror = function () {
            };
            n.onclose = function () {
            };
        };
        NotificationHelper.desktopNotification = true;
        return NotificationHelper;
    })();
    webimutil.NotificationHelper = NotificationHelper;
})(webimutil || (webimutil = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var webimmodel;
(function (webimmodel) {
    var Conversation = (function () {
        function Conversation(item) {
            if (item) {
                this.title = item.title;
                this.targetId = item.targetId;
                this.targetType = item.targetType;
                this.lastTime = item.lastTime;
                this.lastMsg = item.lastMsg;
                this.unReadNum = item.unReadNum;
                this.draftMsg = item.draftMsg;
                this.firstchar = item.firstchar;
            }
        }
        Conversation.prototype.setpinying = function (item) {
            this.pinyin = item.pinyin;
            this.everychar = item.everychar;
        };
        Conversation.convertToWebIM = function (item, operatorid) {
            var lasttime;
            if (item.latestMessage && item.sentTime) {
                lasttime = new Date(item.sentTime);
            }
            var msgContent = "";
            if (item.latestMessage) {
                msgContent = Message.messageToNotification(item.latestMessage, operatorid, false);
            }
            return new Conversation({
                title: item.conversationTitle || "",
                targetId: item.targetId || "",
                targetType: item.conversationType || "",
                lastTime: lasttime || new Date(),
                lastMsg: msgContent || "",
                unReadNum: item.unreadMessageCount,
                draftMsg: item.draft || ""
            });
        };
        return Conversation;
    })();
    webimmodel.Conversation = Conversation;
    (function (MessageDirection) {
        MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
        MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
    })(webimmodel.MessageDirection || (webimmodel.MessageDirection = {}));
    var MessageDirection = webimmodel.MessageDirection;
    (function (ReceivedStatus) {
        ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";
        ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";
        ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";
    })(webimmodel.ReceivedStatus || (webimmodel.ReceivedStatus = {}));
    var ReceivedStatus = webimmodel.ReceivedStatus;
    (function (SentStatus) {
        SentStatus[SentStatus["SENDING"] = 10] = "SENDING";
        SentStatus[SentStatus["FAILED"] = 20] = "FAILED";
        SentStatus[SentStatus["SENT"] = 30] = "SENT";
        SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";
        SentStatus[SentStatus["READ"] = 50] = "READ";
        SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";
    })(webimmodel.SentStatus || (webimmodel.SentStatus = {}));
    var SentStatus = webimmodel.SentStatus;
    (function (PanelType) {
        PanelType[PanelType["Message"] = 1] = "Message";
        PanelType[PanelType["InformationNotification"] = 2] = "InformationNotification";
        PanelType[PanelType["System"] = 103] = "System";
        PanelType[PanelType["Time"] = 104] = "Time";
        PanelType[PanelType["getHistory"] = 105] = "getHistory";
        PanelType[PanelType["getMore"] = 106] = "getMore";
        PanelType[PanelType["Other"] = 0] = "Other";
    })(webimmodel.PanelType || (webimmodel.PanelType = {}));
    var PanelType = webimmodel.PanelType;
    (function (AtTarget) {
        AtTarget[AtTarget["All"] = 1] = "All";
        AtTarget[AtTarget["Part"] = 2] = "Part";
    })(webimmodel.AtTarget || (webimmodel.AtTarget = {}));
    var AtTarget = webimmodel.AtTarget;
    webimmodel.MessageType = {
        DiscussionNotificationMessage: "DiscussionNotificationMessage",
        TextMessage: "TextMessage",
        ImageMessage: "ImageMessage",
        VoiceMessage: "VoiceMessage",
        RichContentMessage: "RichContentMessage",
        HandshakeMessage: "HandshakeMessage",
        HandShakeResponseMessage: "HandShakeResponseMessage",
        UnknownMessage: "UnknownMessage",
        SuspendMessage: "SuspendMessage",
        LocationMessage: "LocationMessage",
        InformationNotificationMessage: "InformationNotificationMessage",
        ContactNotificationMessage: "ContactNotificationMessage",
        ProfileNotificationMessage: "ProfileNotificationMessage",
        CommandNotificationMessage: "CommandNotificationMessage",
        ReadReceiptMessage: "ReadReceiptMessage",
        TypingStatusMessage: "TypingStatusMessage",
        FileMessage: "FileMessage",
        GroupNotificationMessage: "GroupNotificationMessage",
        RecallCommandMessage: "RecallCommandMessage",
        InviteMessage: "InviteMessage",
        HungupMessage: "HungupMessage",
        ReadReceiptRequestMessage: "ReadReceiptRequestMessage",
        ReadReceiptResponseMessage: "ReadReceiptResponseMessage",
        SyncReadStatusMessage: "SyncReadStatusMessage",
        JrmfReadPacketMessage: "JrmfReadPacketMessage",
        JrmfReadPacketOpenedMessage: "JrmfReadPacketOpenedMessage"
    };
    (function (conversationType) {
        conversationType[conversationType["Private"] = 1] = "Private";
        conversationType[conversationType["Discussion"] = 2] = "Discussion";
        conversationType[conversationType["Group"] = 3] = "Group";
        conversationType[conversationType["ChartRoom"] = 4] = "ChartRoom";
        conversationType[conversationType["CustomerService"] = 5] = "CustomerService";
        conversationType[conversationType["System"] = 6] = "System";
        conversationType[conversationType["AppPublicService"] = 7] = "AppPublicService";
        conversationType[conversationType["PublicService"] = 8] = "PublicService";
    })(webimmodel.conversationType || (webimmodel.conversationType = {}));
    var conversationType = webimmodel.conversationType;
    (function (NoticePanelType) {
        NoticePanelType[NoticePanelType["ApplyFriend"] = 1] = "ApplyFriend";
        NoticePanelType[NoticePanelType["AgreedFriend"] = 2] = "AgreedFriend";
        NoticePanelType[NoticePanelType["WarningNotice"] = 101] = "WarningNotice";
        NoticePanelType[NoticePanelType["System"] = 102] = "System";
    })(webimmodel.NoticePanelType || (webimmodel.NoticePanelType = {}));
    var NoticePanelType = webimmodel.NoticePanelType;
    (function (FriendStatus) {
        FriendStatus[FriendStatus["Requesting"] = 10] = "Requesting";
        FriendStatus[FriendStatus["Requested"] = 11] = "Requested";
        FriendStatus[FriendStatus["Agreed"] = 20] = "Agreed";
        FriendStatus[FriendStatus["Ignored"] = 21] = "Ignored";
        FriendStatus[FriendStatus["Deleted"] = 30] = "Deleted";
        FriendStatus[FriendStatus["GroupNotification"] = 101] = "GroupNotification";
    })(webimmodel.FriendStatus || (webimmodel.FriendStatus = {}));
    var FriendStatus = webimmodel.FriendStatus;
    (function (CommandNotificationMessageType) {
        CommandNotificationMessageType[CommandNotificationMessageType["ApplyGroup"] = 1] = "ApplyGroup";
        CommandNotificationMessageType[CommandNotificationMessageType["InviteAddGroup"] = 2] = "InviteAddGroup";
        CommandNotificationMessageType[CommandNotificationMessageType["KickOutGroup"] = 3] = "KickOutGroup";
        CommandNotificationMessageType[CommandNotificationMessageType["AcceptApplyGroup"] = 101] = "AcceptApplyGroup";
        CommandNotificationMessageType[CommandNotificationMessageType["RejectApplyGroup"] = 102] = "RejectApplyGroup";
        CommandNotificationMessageType[CommandNotificationMessageType["AcceptInviteAddGroup"] = 201] = "AcceptInviteAddGroup";
        CommandNotificationMessageType[CommandNotificationMessageType["RejectInviteAddGroup"] = 202] = "RejectInviteAddGroup";
    })(webimmodel.CommandNotificationMessageType || (webimmodel.CommandNotificationMessageType = {}));
    var CommandNotificationMessageType = webimmodel.CommandNotificationMessageType;
    (function (FileState) {
        FileState[FileState["Uploading"] = 0] = "Uploading";
        FileState[FileState["Canceled"] = 1] = "Canceled";
        FileState[FileState["Failed"] = 2] = "Failed";
        FileState[FileState["Success"] = 3] = "Success";
    })(webimmodel.FileState || (webimmodel.FileState = {}));
    var FileState = webimmodel.FileState;
    var ChatPanel = (function () {
        function ChatPanel(type) {
            this.panelType = type;
        }
        return ChatPanel;
    })();
    webimmodel.ChatPanel = ChatPanel;
    var Message = (function (_super) {
        __extends(Message, _super);
        function Message(content, conversationType, extra, objectName, messageDirection, messageId, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId, messageType) {
            _super.call(this, PanelType.Message);
        }
        Message.convertMsg = function (SDKmsg) {
            var msg = new Message();
            msg.conversationType = SDKmsg.conversationType;
            msg.extra = SDKmsg.extra;
            msg.objectName = SDKmsg.objectName;
            msg.messageDirection = SDKmsg.messageDirection;
            msg.messageId = SDKmsg.messageId;
            msg.messageUId = SDKmsg.messageUId;
            msg.receivedStatus = SDKmsg.receivedStatus;
            msg.receivedTime = new Date(SDKmsg.receivedTime);
            msg.senderUserId = SDKmsg.senderUserId;
            msg.sentStatus = SDKmsg.sendStatusMessage;
            msg.sentTime = new Date(SDKmsg.sentTime);
            msg.targetId = SDKmsg.targetId;
            msg.messageType = SDKmsg.messageType;
            switch (msg.messageType) {
                case webimmodel.MessageType.TextMessage:
                    var texmsg = new TextMessage();
                    var content = SDKmsg.content.content;
                    content = content.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
                    if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
                        content = RongIMLib.RongIMEmoji.emojiToHTML(content);
                    }
                    texmsg.content = content;
                    msg.content = texmsg;
                    msg.mentionedInfo = SDKmsg.content.mentionedInfo;
                    msg.receiptResponse = SDKmsg.receiptResponse;
                    break;
                case webimmodel.MessageType.ImageMessage:
                    var image = new ImageMessage();
                    var content = SDKmsg.content.content || "";
                    if (typeof content == "string" && content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    image.content = content;
                    image.imageUri = SDKmsg.content.imageUri;
                    msg.content = image;
                    break;
                case webimmodel.MessageType.VoiceMessage:
                    var voice = new VoiceMessage();
                    voice.content = SDKmsg.content.content;
                    voice.duration = SDKmsg.content.duration;
                    msg.content = voice;
                    break;
                case webimmodel.MessageType.RichContentMessage:
                    var rich = new RichContentMessage();
                    rich.content = SDKmsg.content.content;
                    rich.title = SDKmsg.content.title;
                    rich.imageUri = SDKmsg.content.imageUri;
                    rich.url = SDKmsg.content.url;
                    msg.content = rich;
                    break;
                case webimmodel.MessageType.LocationMessage:
                    var location = new LocationMessage();
                    var content = SDKmsg.content.content || "";
                    if (typeof content == "string" && content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    location.content = content;
                    location.latiude = SDKmsg.content.latiude;
                    location.longitude = SDKmsg.content.longitude;
                    location.poi = SDKmsg.content.poi;
                    msg.content = location;
                    break;
                case webimmodel.MessageType.FileMessage:
                    var file = new FileMessage();
                    var content = SDKmsg.content.content || "";
                    file.name = SDKmsg.content.name;
                    file.size = SDKmsg.content.size;
                    file.type = SDKmsg.content.type;
                    file.fileUrl = SDKmsg.content.fileUrl;
                    file.extra = SDKmsg.content.extra;
                    file.state = FileState.Success;
                    msg.content = file;
                    break;
                case webimmodel.MessageType.InformationNotificationMessage:
                    msg.content = SDKmsg.content.message;
                    msg.panelType = webimmodel.PanelType.InformationNotification;
                    break;
                case webimmodel.MessageType.ContactNotificationMessage:
                    var contact = new ContactNotificationMessage();
                    contact.content = SDKmsg.content.message;
                    contact.operation = SDKmsg.content.operation;
                    contact.sourceUserId = SDKmsg.content.sourceUserId;
                    contact.targetUserId = SDKmsg.content.targetUserId;
                    contact.message = SDKmsg.content.content;
                    switch (contact.operation) {
                        case "Request":
                            contact.noticeType = NoticePanelType.ApplyFriend;
                            break;
                        case "AcceptResponse":
                            contact.noticeType = NoticePanelType.AgreedFriend;
                            contact.content = "同意加为好友";
                            break;
                        case "RejectResponse":
                            console.log("拒绝好友通知消息未支持");
                            break;
                    }
                    msg.content = contact;
                    break;
                case webimmodel.MessageType.CommandNotificationMessage:
                    var comm = new CommandNotificationMessage();
                    comm.noticeType = NoticePanelType.WarningNotice;
                    comm.data = SDKmsg.content.data;
                    comm.name = SDKmsg.content.name;
                    msg.content = comm;
                    break;
                case webimmodel.MessageType.DiscussionNotificationMessage:
                    if (SDKmsg.objectName == "RC:DizNtf") {
                        var groupnot = new webimmodel.InformationNotificationMessage();
                        groupnot.content = SDKmsg.content.message;
                        msg.content = groupnot;
                        msg.panelType = webimmodel.PanelType.InformationNotification;
                    }
                    else {
                        console.log("has unknown message type " + SDKmsg.messageType);
                    }
                    break;
                case webimmodel.MessageType.ReadReceiptMessage:
                case webimmodel.MessageType.TypingStatusMessage:
                    break;
                case webimmodel.MessageType.RecallCommandMessage:
                    msg.content = '撤回了一条消息';
                    msg.panelType = webimmodel.PanelType.InformationNotification;
                    break;
                case webimmodel.MessageType.InviteMessage:
                case webimmodel.MessageType.HungupMessage:
                    msg.content = '当前版本暂不支持查看此消息';
                    msg.panelType = webimmodel.PanelType.InformationNotification;
                    break;
                case webimmodel.MessageType.ReadReceiptRequestMessage:
                    msg.content = SDKmsg.content.messageUId;
                    break;
                case webimmodel.MessageType.ReadReceiptResponseMessage:
                    msg.content = SDKmsg.content.receiptMessageDic;
                    msg.receiptResponse = SDKmsg.receiptResponse;
                    break;
                case webimmodel.MessageType.SyncReadStatusMessage:
                    break;
                default:
                    if (SDKmsg.objectName == "RC:GrpNtf") {
                        var groupnot = new webimmodel.InformationNotificationMessage();
                        groupnot.content = SDKmsg.content.message;
                        msg.content = groupnot;
                        msg.panelType = webimmodel.PanelType.InformationNotification;
                    }
                    else if (SDKmsg.objectName == "RC:RLStart" || SDKmsg.objectName == "RC:RL" || SDKmsg.objectName == "RC:RcCmd") {
                    }
                    else {
                        msg.content = '当前版本暂不支持查看此消息';
                        msg.panelType = webimmodel.PanelType.InformationNotification;
                        console.log("has unknown message type " + SDKmsg.messageType);
                    }
                    break;
            }
            if (msg.content) {
                msg.content.userInfo = SDKmsg.content.userInfo;
            }
            return msg;
        };
        Message.messageToNotification = function (msg, operatorid, isnotification) {
            if (!msg)
                return null;
            var msgtype = msg.messageType, msgContent;
            if (msgtype == webimmodel.MessageType.ImageMessage) {
                msgContent = "[图片]";
            }
            else if (msgtype == webimmodel.MessageType.LocationMessage) {
                msgContent = "[位置]";
            }
            else if (msgtype == webimmodel.MessageType.RichContentMessage) {
                msgContent = "[图文]";
            }
            else if (msgtype == webimmodel.MessageType.VoiceMessage) {
                msgContent = "[语音]";
            }
            else if (msgtype == webimmodel.MessageType.FileMessage) {
                msgContent = "[文件] " + msg.content.name;
            }
            else if (msgtype == webimmodel.MessageType.ContactNotificationMessage || msgtype == webimmodel.MessageType.CommandNotificationMessage || msgtype == webimmodel.MessageType.InformationNotificationMessage) {
                msgContent = "[通知消息]";
            }
            else if (msg.objectName == "RC:GrpNtf") {
                var data = msg.content.data;
                switch (msg.content.operation) {
                    case "Add":
                        if (msg.content.operatorUserId == operatorid) {
                            msgContent = data.targetUserDisplayNames ? ("你邀请" + data.targetUserDisplayNames.join("、") + "加入了群组") : "加入群组";
                        }
                        else {
                            msgContent = data.targetUserDisplayNames ? (data.operatorNickname + "邀请" + data.targetUserDisplayNames.join("、") + "加入了群组") : "加入群组";
                        }
                        break;
                    case "Quit":
                        msgContent = data.operatorNickname + "退出了群组";
                        break;
                    case "Kicked":
                        if (msg.content.operatorUserId == operatorid) {
                            msgContent = data.targetUserDisplayNames ? ("你将" + data.targetUserDisplayNames.join("、") + "移出了群组") : "移除群组";
                        }
                        else {
                            msgContent = data.targetUserDisplayNames ? (data.operatorNickname + "将" + data.targetUserDisplayNames.join("、") + "移出了群组") : "移除群组";
                        }
                        break;
                    case "Rename":
                        data.targetGroupName = RongIMLib.RongIMEmoji.calculateUTF(data.targetGroupName);
                        if (msg.content.operatorUserId == operatorid) {
                            msgContent = "你修改群名称为" + data.targetGroupName;
                        }
                        else {
                            msgContent = data.operatorNickname + "修改群名称为" + data.targetGroupName;
                        }
                        break;
                    case "Create":
                        if (msg.content.operatorUserId == operatorid) {
                            msgContent = "你创建了群组";
                        }
                        else {
                            msgContent = data.operatorNickname + "创建了群组";
                        }
                        break;
                    case "Dismiss":
                        msgContent = data.operatorNickname + "解散了群组";
                        if (data.targetGroupName) {
                            msgContent += data.targetGroupName;
                        }
                        break;
                    default:
                        break;
                }
            }
            else if (msg.objectName == "RC:DizNtf") {
                var data = msg;
                switch (msg.content.type) {
                    case 1:
                        msgContent = " 加入了讨论组";
                        break;
                    case 2:
                        msgContent = " 退出了讨论组";
                        break;
                    case 4:
                        msgContent = " 被踢出讨论组";
                        break;
                    case 3:
                        msgContent = " 修改了讨论组名称";
                        break;
                    default:
                        break;
                }
            }
            else if (msgtype == webimmodel.MessageType.TextMessage) {
                msgContent = msg.content ? msg.content.content : "";
                msgContent = webimutil.Helper.escapeSymbol.escapeHtml(msgContent);
                if (isnotification) {
                    msgContent = RongIMLib.RongIMEmoji.emojiToSymbol(msgContent);
                    if (webimutil.Helper.os.mac) {
                        msgContent = RongIMLib.RongIMEmoji.symbolToEmoji(msgContent);
                    }
                }
                else {
                    if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
                        msgContent = RongIMLib.RongIMEmoji.emojiToHTML(msgContent);
                    }
                }
                msgContent = msgContent.replace(/\n/g, " ");
                msgContent = msgContent.replace(/([\w]{49,50})/g, "$1 ");
            }
            else if (msgtype == webimmodel.MessageType.RecallCommandMessage) {
                msgContent = "撤回一条消息";
            }
            else {
                msgContent = "[当前版本暂不支持查看此消息]";
            }
            return msgContent;
        };
        return Message;
    })(ChatPanel);
    webimmodel.Message = Message;
    var ContactNotificationMessage = (function (_super) {
        __extends(ContactNotificationMessage, _super);
        function ContactNotificationMessage() {
            _super.apply(this, arguments);
        }
        return ContactNotificationMessage;
    })(Message);
    webimmodel.ContactNotificationMessage = ContactNotificationMessage;
    var CommandNotificationMessage = (function (_super) {
        __extends(CommandNotificationMessage, _super);
        function CommandNotificationMessage() {
            _super.apply(this, arguments);
        }
        return CommandNotificationMessage;
    })(Message);
    webimmodel.CommandNotificationMessage = CommandNotificationMessage;
    var TextMessage = (function () {
        function TextMessage(msg) {
            msg = msg || {};
            this.content = msg.content;
            this.userInfo = msg.userInfo;
        }
        return TextMessage;
    })();
    webimmodel.TextMessage = TextMessage;
    var InformationNotificationMessage = (function () {
        function InformationNotificationMessage() {
        }
        return InformationNotificationMessage;
    })();
    webimmodel.InformationNotificationMessage = InformationNotificationMessage;
    var ImageMessage = (function () {
        function ImageMessage() {
        }
        return ImageMessage;
    })();
    webimmodel.ImageMessage = ImageMessage;
    var VoiceMessage = (function () {
        function VoiceMessage() {
        }
        return VoiceMessage;
    })();
    webimmodel.VoiceMessage = VoiceMessage;
    var LocationMessage = (function () {
        function LocationMessage() {
        }
        return LocationMessage;
    })();
    webimmodel.LocationMessage = LocationMessage;
    var RichContentMessage = (function () {
        function RichContentMessage() {
        }
        return RichContentMessage;
    })();
    webimmodel.RichContentMessage = RichContentMessage;
    var DiscussionNotificationMessage = (function () {
        function DiscussionNotificationMessage() {
        }
        return DiscussionNotificationMessage;
    })();
    webimmodel.DiscussionNotificationMessage = DiscussionNotificationMessage;
    var FileMessage = (function () {
        function FileMessage() {
        }
        return FileMessage;
    })();
    webimmodel.FileMessage = FileMessage;
    var ReadReceiptRequestMessage = (function () {
        function ReadReceiptRequestMessage() {
        }
        return ReadReceiptRequestMessage;
    })();
    webimmodel.ReadReceiptRequestMessage = ReadReceiptRequestMessage;
    var ReadReceiptResponseMessage = (function () {
        function ReadReceiptResponseMessage() {
        }
        return ReadReceiptResponseMessage;
    })();
    webimmodel.ReadReceiptResponseMessage = ReadReceiptResponseMessage;
    var GetHistoryPanel = (function (_super) {
        __extends(GetHistoryPanel, _super);
        function GetHistoryPanel() {
            _super.call(this, PanelType.getHistory);
        }
        return GetHistoryPanel;
    })(ChatPanel);
    webimmodel.GetHistoryPanel = GetHistoryPanel;
    var GetMoreMessagePanel = (function (_super) {
        __extends(GetMoreMessagePanel, _super);
        function GetMoreMessagePanel() {
            _super.call(this, PanelType.getMore);
        }
        return GetMoreMessagePanel;
    })(ChatPanel);
    webimmodel.GetMoreMessagePanel = GetMoreMessagePanel;
    var TimePanl = (function (_super) {
        __extends(TimePanl, _super);
        function TimePanl(time) {
            _super.call(this, PanelType.Time);
            this.sendTime = time;
        }
        return TimePanl;
    })(ChatPanel);
    webimmodel.TimePanl = TimePanl;
    var WarningNoticeMessage = (function () {
        function WarningNoticeMessage(content) {
            this.content = content;
            this.status = webimmodel.FriendStatus.GroupNotification;
        }
        return WarningNoticeMessage;
    })();
    webimmodel.WarningNoticeMessage = WarningNoticeMessage;
    var NotificationFriend = (function () {
        function NotificationFriend(item) {
            this.id = item.id;
            this.name = item.name;
            this.portraitUri = item.portraitUri;
            this.content = item.content;
            this.status = item.status;
            this.timestamp = item.timestamp;
        }
        return NotificationFriend;
    })();
    webimmodel.NotificationFriend = NotificationFriend;
    var UserInfo = (function () {
        function UserInfo(id, token, nickName, portraitUri, phone, region, firstchar) {
            this.id = id;
            this.token = token;
            this.nickName = nickName;
            this.portraitUri = portraitUri;
            this.phone = phone;
            this.region = region;
            this.firstchar = firstchar;
        }
        return UserInfo;
    })();
    webimmodel.UserInfo = UserInfo;
    var Contact = (function () {
        function Contact(item) {
            this.id = item.id;
            this.name = item.name;
            this.imgSrc = item.imgSrc;
        }
        Contact.prototype.setpinying = function (item) {
            this.pinyin = item.pinyin;
            this.everychar = item.everychar;
            this.firstchar = item.firstchar;
        };
        return Contact;
    })();
    webimmodel.Contact = Contact;
    var Friend = (function (_super) {
        __extends(Friend, _super);
        function Friend(item) {
            _super.call(this, item);
        }
        return Friend;
    })(Contact);
    webimmodel.Friend = Friend;
    var Subgroup = (function () {
        function Subgroup(title, list) {
            this.title = title;
            this.list = list;
        }
        return Subgroup;
    })();
    webimmodel.Subgroup = Subgroup;
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group(item) {
            _super.call(this, item);
            this.upperlimit = item.upperlimit;
            this.fact = item.fact;
            this.creater = item.creater;
            this.memberList = [];
        }
        return Group;
    })(Contact);
    webimmodel.Group = Group;
    var Discussion = (function (_super) {
        __extends(Discussion, _super);
        function Discussion(item) {
            _super.call(this, item);
            this.upperlimit = item.upperlimit;
            this.fact = item.fact;
            this.creater = item.creater;
            this.memberList = [];
        }
        return Discussion;
    })(Contact);
    webimmodel.Discussion = Discussion;
    var Member = (function (_super) {
        __extends(Member, _super);
        function Member(item) {
            _super.call(this, item);
            this.role = item.role;
        }
        return Member;
    })(Contact);
    webimmodel.Member = Member;
})(webimmodel || (webimmodel = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var notification = angular.module("webim.notification", []);
notification.controller("notificationController", ["$scope", "$state", "mainDataServer",
    function ($scope, $state, mainDataServer) {
        $scope.back = function () {
            $state.go("main");
        };
        $scope.notificationList = mainDataServer.notification.notificationList;
    }]);
notification.directive("applyfriendNotice", ["mainServer", "mainDataServer",
    function (mainServer, mainDataServer) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<li class="clearfix">' +
                '<div class="center">请求添加你为好友</div>' +
                '<div class="left">' +
                '<div class="photo">' +
                '<img class="img" ng-show="item.portraitUri" ng-src="{{item.portraitUri||\'./css/img/barBg.png\'}}" alt="">' +
                '<div class="portrait" ng-show="!item.portraitUri">{{item.firstchar}}</div>' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.name}}</span>' +
                '</h3>' +
                '<p class="remarks">' +
                '<span class="ng-binding ng-scope">{{item.content}}</span>' +
                '</p>' +
                '</div>' +
                '</div>' +
                '<div class="right"><button class="functionBoxBtn" ng-show="!item.isFriend">接受</button><p class="" ng-show="item.isFriend">已添加</p></div>' +
                '</li>',
            link: function (scope, ele, attr) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                ele.find("button").on("click", function () {
                    var friend = mainDataServer.contactsList.getFriendById(scope.item.id);
                    if (friend) {
                        scope.item.isFriend = true;
                        scope.item.status = webimmodel.FriendStatus.Agreed;
                        webimutil.Helper.alertMessage.error("已经是好友了");
                    }
                    else {
                        mainServer.friend.agree(scope.item.id).success(function () {
                            scope.item.isFriend = true;
                            scope.item.status = webimmodel.FriendStatus.Agreed;
                            mainDataServer.contactsList.addFriend(new webimmodel.Friend({ id: scope.item.id, name: scope.item.name, imgSrc: scope.item.portraitUri }));
                        }).error(function (e) {
                            console.log(e);
                        });
                    }
                });
            }
        };
    }]);
notification.directive("applygroupNotice", ["mainServer", "RongIMSDKServer",
    function (mainServer, RongIMSDKServer) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<li class="clearfix">' +
                '<div class="center">申请加入“{{item.data.groupName}}”</div>' +
                '<div class="left">' +
                '<div class="photo">' +
                '<img class="img" ng-src="{{item.senderUserImgSrc||\'./css/img/barBg.png\'}}" alt="">' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.senderUserName}}</span>' +
                '</h3>' +
                '<p>' +
                '<span class="ng-binding ng-scope">{{item.data.message}}</span>' +
                '</p>' +
                '</div>' +
                '</div>' +
                '<div class="right"><button class="functionBoxBtn" ng-show="!agree">通过</button><p class="hide">已通过</p></div>' +
                '</li>',
            link: function (scope, ele, attr) {
                ele.find("button").on("click", function () {
                    //同意加我好友， 1请求服务器2发送通知
                });
            }
        };
    }]);
notification.directive("inviteAddGroup", ["mainServer", "mainDataServer",
    function (mainServer, mainDataServer) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<li class="clearfix  systemMes" >' +
                '<div class="left">' +
                '<div class="photo">' +
                '<img class="img" ng-src="{{item.senderUserImgSrc||\'./css/img/barBg.png\'}}" alt="">' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.senderUserName}}</span>' +
                '</h3>' +
                '<p>' +
                '<span class="ng-binding ng-scope"></span>' +
                '</p>' +
                '</div>' +
                '</div>' +
                '<div class="center">{{item.senderUserName}}邀请加入“{{item.data.groupName}}”</div>' +
                '<div class="right"><button class="functionBoxBtn"  ng-show="!agree">通过</button><p class="hide">已通过</p></div>' +
                '</li>',
            link: function (scope, ele, attr) {
            }
        };
    }]);
notification.directive("warningNotice", [function () {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<li class="clearfix systemMes">' +
                '<div class="left">' +
                '<div class="photo">' +
                '<img class="img" src="./css/img/barBg.png" alt="">' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text"></span>' +
                '</h3>' +
                '<p>' +
                '<span class="ng-binding ng-scope"></span>' +
                '</p>' +
                '</div>' +
                '</div>' +
                '<div class="center">{{item.content}}</div>' +
                '<div class="right"><button class="functionBoxBtn hide">通过</button><p class="">已通过</p></div>' +
                '</li>',
            link: function (scope, ele, attr) {
                if (scope.item.operation && scope.item.operation == "AcceptResponse") {
                    scope.item.content = scope.item.senderUserName + scope.item.content;
                }
                else if (scope.item.data) {
                    switch (scope.item.data.type) {
                        case webimmodel.CommandNotificationMessageType.AcceptApplyGroup:
                            scope.item.content = scope.item.content + scope.item.data.groupName;
                            break;
                        case webimmodel.CommandNotificationMessageType.AcceptInviteAddGroup:
                            scope.item.content = scope.item.data.userName + scope.item.content + scope.item.data.groupName;
                            break;
                    }
                }
            }
        };
    }]);
/// <reference path="../typings/tsd.d.ts"/>
var webim;
(function (webim_1) {
    var webim = angular.module('webim');
    webim.controller('organizationController', ["$scope", "organizationServer", "$state", "organizationData", "mainDataServer",
        function ($scope, organizationServer, $state, organizationData, mainDataServer) {
            $scope.treeOptions = {
                isLeaf: function (node) {
                    return !node.deptName;
                },
                isSelectable: function (node) {
                    return !node.deptName;
                },
                equality: function (node1, node2) {
                    return node1 === node2;
                }
            };
            organizationServer.getList('').then(function (data) {
                // $scope.organizationList = data.department;
                $scope.organizationList = data;
                organizationData.departmentList = data;
                $scope.toggleNode(data[0]);
                $scope.expandedNodes = [$scope.organizationList[0]];
            });
            $scope.toggleNode = function (node) {
                if (!node.children) {
                    organizationServer.getList(node.id).then(function (data) {
                        node.children = node.children || [];
                        node.children = angular.copy(node.children.concat(data));
                        organizationData.departmentList = data.concat(organizationData.departmentList);
                    });
                    organizationServer.getUserList(node.id).then(function (data) {
                        node.children = node.children || [];
                        node.children = angular.copy(data.concat(node.children));
                        organizationData.userList = organizationData.userList.concat(data);
                    });
                }
            };
            $scope.onSelection = function (node) {
                if (angular.isFunction($scope.selection)) {
                    if (node.userId == mainDataServer.loginUser.id) {
                        return;
                    }
                    $scope.selection(node);
                }
                else {
                    $state.go("main.companyuserinfo", { userid: node.userId });
                }
            };
        }]);
    webim.directive('organization', [function () {
            return {
                restrict: 'E',
                scope: {
                    selection: "="
                },
                template: '<treecontrol class="tree-classic"' +
                    ' tree-model="organizationList"' +
                    ' options="treeOptions"' +
                    ' expanded-nodes="expandedNodes"' +
                    ' on-node-toggle="toggleNode(node)"' +
                    ' on-selection="onSelection(node)">' +
                    '<span ng-show="node.deptName">{{node.deptName}}</span>' +
                    '<span ng-hide="node.deptName"><img class="r-organ-user-head-img" ng-src="{{node.user.portraitUri||\'css/img/user.png\'}}"><span>{{node.displayName}}</span></span>' +
                    '</treecontrol>',
                controller: 'organizationController'
            };
        }]);
    webim.directive("staffitem", ["$state", function ($state) {
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
                    '</div>',
                link: function (scope, ele, attr) {
                    angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                    ele.on("click", function () {
                        scope.$parent.selectGo(scope.item.id, webimmodel.conversationType.Private);
                    });
                }
            };
        }]);
    webim.directive("incloudmember", ["$state", function ($state) {
            return {
                restrict: "E",
                scope: { item: "=" },
                template: '<div class="notice_item ">' +
                    '<div class="photo">' +
                    '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'css/img/barBg.png\'}}" alt="" style="margin-top: 10px;">' +
                    '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
                    '</div>' +
                    '<div class="info">' +
                    '<h3 class="nickname">' +
                    '<span class="nickname_text">{{item.groupName}}</span><br>' +
                    '<span class="nickname_text containuser" style="">包含：{{item.include}}</span>' +
                    '</h3>' +
                    '</div>' +
                    '<div class="botDivider"></div>' +
                    '</div>',
                replace: true,
                link: function (scope, ele, attr) {
                    angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                    ele.on("click", function () {
                        scope.$parent.selectGoGroup(scope.item.id, webimmodel.conversationType.Group);
                    });
                }
            };
        }]);
    webim.service('organizationData', [function () {
            this.departmentList = [];
            this.userList = [];
            this.getDepartmentById = function (id) {
                var arr = this.departmentList;
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].id == id) {
                        return arr[i];
                    }
                }
            };
            this.getUserById = function (id) {
                var arr = this.userList;
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].userId == id) {
                        return arr[i];
                    }
                }
            };
        }]);
    webim.service('organizationServer', ["$q", "$http", function ($q, $http) {
            var serverUrl = window.__sealtalk_config.serverUrl;
            this.getList = function (id) {
                var defer = $q.defer();
                $http({
                    method: 'get',
                    url: serverUrl + '/departs',
                    params: {
                        parentid: id
                    }
                }).success(function (rep) {
                    defer.resolve(rep.result);
                }).error(function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getUserList = function (departid) {
                var defer = $q.defer();
                $http({
                    method: 'get',
                    url: serverUrl + '/departs/' + departid + '/members',
                }).success(function (rep) {
                    defer.resolve(rep.result);
                }).error(function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.search = function (str) {
                var defer = $q.defer();
                $http({
                    method: 'get',
                    url: './js/exampledata.json',
                    data: {
                        str: str
                    }
                }).success(function (rep) {
                    defer.resolve(rep.searchorganization.data);
                }).error(function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            };
        }]);
})(webim || (webim = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var webim;
(function (webim_2) {
    var webim = angular.module('webim');
    webim.controller('searchmessageController', ["$scope", "$state", "RongIMSDKServer", "conversationServer", "mainDataServer",
        function ($scope, $state, RongIMSDKServer, conversationServer, mainDataServer) {
            if (!mainDataServer.loginUser.nickName) {
                $state.go("main");
                return;
            }
            var conversationType = $state.params['conversationtype'];
            var targetId = $state.params['targetid'];
            var searchStr = $state.params['searchstr'];
            $scope.searchStr = searchStr;
            var messageList = [];
            var messageListCache = [];
            var lastTime = 0;
            $scope.hasmoreMessage = true;
            $scope.pagesize = 20;
            $scope.currentPage = 1;
            $scope.pageCount = 0;
            getMoreMessage();
            function convertHistoryList(list) {
                var msglen = list.length;
                var arr = [];
                while (msglen--) {
                    var msgsdk = list[msglen];
                    switch (msgsdk.messageType) {
                        case webimmodel.MessageType.ContactNotificationMessage:
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
                        default:
                            console.log("此消息类型未处理：" + msgsdk.messageType);
                            break;
                    }
                }
                return arr;
            }
            function unshiftHistoryMessages(item) {
                var arr = messageListCache;
                if (arr[0] && item.messageUId && item.messageUId === arr[0].messageUId) {
                    return;
                }
                conversationServer.messageAddUserInfo(item);
                arr.unshift(item);
            }
            function getMoreMessage() {
                if (searchStr) {
                    RongIMSDKServer.getMessagesFromConversation(targetId, conversationType, searchStr, lastTime, $scope.pagesize).then(function (data) {
                        $scope.pageCount = Math.ceil(data.count / $scope.pagesize) || 0;
                        console.log($scope.currentPage, $scope.pageCount);
                        if ($scope.currentPage == $scope.pageCount) {
                            $scope.hasmoreMessage = false;
                        }
                        lastTime = (data.message[0] || {}).sentTime || 0;
                        $scope.messageList = convertHistoryList(data.message);
                    });
                }
                else {
                    RongIMSDKServer.getHistoryMessages(+conversationType, targetId, lastTime, $scope.pagesize).then(function (data) {
                        $scope.pageCount = 0;
                        $scope.hasmoreMessage = data.has;
                        var list = data.data;
                        var end = list.length - $scope.pagesize;
                        list.splice(0, end < 0 ? 0 : end);
                        $scope.messageList = convertHistoryList(list);
                        lastTime = (list[0] || {}).sentTime || 0;
                    }, function (err) {
                        console.log('获取历史消息失败');
                    });
                }
            }
            $scope.pre = function () {
                var currentPage = $scope.currentPage;
                var pageCount = $scope.pageCount;
                var pagesize = $scope.pagesize;
                if (currentPage > 1) {
                    $scope.messageList = [];
                    currentPage--;
                    $scope.currentPage--;
                    $scope.messageList = messageListCache.slice(messageListCache.length - (currentPage * pagesize), messageListCache.length - ((currentPage - 1) * pagesize));
                }
            };
            $scope.next = function () {
                var currentPage = $scope.currentPage;
                var pageCount = $scope.pageCount;
                var pagesize = $scope.pagesize;
                console.log(currentPage * pagesize < messageListCache.length);
                console.log($scope.hasmoreMessage);
                if (currentPage * pagesize < messageListCache.length || $scope.hasmoreMessage) {
                    currentPage++;
                    $scope.currentPage++;
                    $scope.messageList = [];
                    if ((currentPage - 1) * pagesize < messageListCache.length) {
                        var start = messageListCache.length - (currentPage * pagesize);
                        $scope.messageList = messageListCache.slice(start < 0 ? 0 : start, messageListCache.length - ((currentPage - 1) * pagesize));
                    }
                    else {
                        getMoreMessage();
                    }
                }
            };
        }]);
    webim.directive('searchTextMessage', [function () {
            return {
                restrict: 'E',
                scope: {
                    message: "=",
                    searchstr: '='
                },
                template: '<pre>content<pre>',
                link: function (scope, element) {
                    var content = '';
                    if (scope.searchstr) {
                        content = scope.message.content.replace(new RegExp(scope.searchstr.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g, "\\$&"), 'g'), '<em class="r-msg-keyword">$&</em>');
                    }
                    else {
                        content = scope.message.content;
                    }
                    element.find('pre').html(content);
                }
            };
        }]);
    webim.directive('searchImageMessage', [function () {
            return {
                restrict: 'E',
                scope: {
                    message: '='
                },
                template: '<img ng-src="{{message.content}}"></img>',
                link: function (scope) {
                    if (!scope.message.content) {
                        scope.message.content = scope.message.imageUri;
                    }
                }
            };
        }]);
})(webim || (webim = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var userinfo = angular.module("webim.blacklist", ["webim.main.server"]);
userinfo.controller("blacklistController", ["$scope", "$state", "mainDataServer",
    function ($scope, $state, mainDataServer) {
        $scope.back = function () {
            window.history.back();
        };
        $scope.blacklist = mainDataServer.blackList.list;
    }]);
userinfo.directive("blackitem", ["mainServer", "mainDataServer", function (mainServer, mainDataServer) {
        return {
            restrict: "E",
            scope: { item: "=" },
            template: '<li class="chat_item groupUser_item">' +
                '<div class="photo">' +
                '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'css/img/barBg.png\'}}" alt="">' +
                '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
                '</div>' +
                '<div class="info">' +
                '<h3 class="nickname">' +
                '<span class="nickname_text">{{item.name}}</span>' +
                '</h3>' +
                '<div class="reject">' +
                '<a href="javascript:void 0">移出黑名单</a>' +
                '</div>' +
                '</div>' +
                '</li>',
            link: function (scope, ele, attr) {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                ele.find("a").on("click", function () {
                    mainServer.user.removeFromBlackList(scope.item.id).success(function () {
                        mainDataServer.blackList.remove(scope.item.id);
                    }).error(function (err) {
                        console.log(err);
                    });
                });
            }
        };
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var modifypassword = angular.module("webim.usermodifypassword", ["webim.main.server"]);
modifypassword.controller("modifypasswordController", ["$scope", "$state", "mainServer", "mainDataServer", "conversationServer",
    function ($scope, $state, mainServer, mainDataServer, conversationServer) {
        $scope.user = {
            oldpassword: "",
            newpassword: "",
            repeatpassword: ""
        };
        $scope.validate = {
            oldpassworderror: false
        };
        $scope.$watch("user.oldpassword", function () {
            $scope.validate.oldpassworderror = false;
        });
        $scope.back = function () {
            window.history.back();
        };
        $scope.save = function () {
            if ($scope.formModifyPWD.$valid) {
                mainServer.user.modefiyPassword($scope.user.newpassword, $scope.user.oldpassword).success(function (rep) {
                    if (rep.code == 200) {
                        logout();
                        webimutil.Helper.alertMessage.success("修改成功,请重新登录", 2);
                    }
                    else if (rep.code == 1000) {
                        $scope.validate.oldpassworderror = true;
                    }
                }).error(function (rep) {
                });
            }
        };
        $scope.validRepeatPwd = function () {
            var newpassword = angular.element(document.getElementById("newPW"));
            var repeatpassword = angular.element(document.getElementById("renewPW"));
            if (!repeatpassword.val()) {
                return;
            }
            var result = repeatpassword.val() != newpassword.val();
            $scope.formModifyPWD.repeatpassword.$setValidity("pwmatch", !result);
        };
        function logout() {
            mainServer.user.logout().success(function () {
                webimutil.CookieHelper.removeCookie("loginuserid");
                mainDataServer.loginUser = new webimmodel.UserInfo();
                conversationServer.historyMessagesCache.length = 0;
                if (window.Electron) {
                    window.Electron.webQuit();
                }
                $state.go("account.signin");
            });
        }
    }]);
/// <reference path="../../typings/tsd.d.ts"/>
var userinfo = angular.module("webim.userinfo", []);
userinfo.controller("userinfoController", ["$scope", "$state", "mainServer", "mainDataServer", "conversationServer",
    function ($scope, $state, mainServer, mainDataServer, conversationServer) {
        $scope.$on("$viewContentLoaded", function () {
            angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[mainDataServer.loginUser.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
        });
        $scope.loginUser = mainDataServer.loginUser;
        $scope.editable = false;
        $scope.newName = mainDataServer.loginUser.nickName;
        $scope.edit = function () {
            $scope.editable = true;
            $scope.newName = mainDataServer.loginUser.nickName;
            setTimeout(function () {
                var ele = document.getElementById("editName");
                ele.focus();
                ele.select();
            }, 0);
        };
        $scope.save = function () {
            if ($scope.modifyName.$valid) {
                mainServer.user.setNickName($scope.newName).success(function () {
                    mainDataServer.loginUser.nickName = $scope.newName;
                    mainDataServer.loginUser.firstchar = webimutil.ChineseCharacter.getPortraitChar($scope.newName);
                });
                $scope.editable = false;
            }
        };
        $scope.logout = function () {
            mainServer.user.logout().success(function () {
                webimutil.CookieHelper.removeCookie("loginuserid");
                mainDataServer.loginUser = new webimmodel.UserInfo();
                conversationServer.historyMessagesCache.length = 0;
                mainDataServer.conversation.totalUnreadCount = 0;
                if (window.Electron) {
                    window.Electron.webQuit();
                }
                $state.go("account.signin");
            });
        };
        $scope.back = function () {
            if ($scope.editable) {
                $scope.editable = false;
            }
            else {
                window.history.back();
            }
        };
    }]);
