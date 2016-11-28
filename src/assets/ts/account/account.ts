/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-file-upload/angular-file-upload.d.ts"/>

var account = angular.module("webim.account", ["webim.main.server"]);


account.controller("signinController", ["$scope", "$state", "mainServer", "mainDataServer", "conversationServer", "RongIMSDKServer",
    function($scope: any, $state: angular.ui.IStateService, mainServer: mainServer, mainDataServer: mainDataServer, conversationServer: conversationServer, RongIMSDKServer: RongIMSDKServer) {
        $scope.user = {
            accountNumber: "",
            passWord: ""
        }

        $scope.userorpwdIsError = false;

        $scope.$watch("user.passWord", function(newVal: string, oldVal: string) {
            if (newVal == oldVal) {
                return;
            }
            else {
                $scope.userorpwdIsError = false;
            }
        });

        conversationServer.historyMessagesCache = {};//清空历史消息
        mainDataServer.conversation.conversations = [];//清空会话列表
        if(window.Electron){
          window.Electron.updateBadgeNumber(0);
        }
        if (RongIMLib.RongIMClient && RongIMLib.RongIMClient.getInstance) {
            try {
                RongIMSDKServer.logout();
                //清除之前会话列表SDK问题 TODO:SDK2.0 logout时已清除
                // var carr = RongIMSDKServer.conversationList();
                // carr.splice(0, carr.length);
            } catch (e) {

            }

        }
        $scope.signin = function() {
            var username1 = localStorage.getItem('username1');
            alert(username1);
            localStorage.setItem('username1', $scope.user.accountNumber);
            $scope.formSignin.submitted = true;
            webimutil.CookieHelper.removeCookie("loginuserid");//清除登录状态
            mainDataServer.loginUser = new webimmodel.UserInfo();//清除用户信息

            if ($scope.formSignin.$valid) {
                mainServer.user.signin($scope.user.accountNumber, "86", $scope.user.passWord).success(function(rep) {
                    if (rep.code === 200) {
                        console.log('~~~~~~~~~~~~~~~~~');
                        console.log(rep);
                        console.log('~~~~~~~~~~~~~~~~~');
                        // 登录账户
                        mainDataServer.loginUser.id = rep.result.id;
                        mainDataServer.loginUser.token = rep.result.token;
                        mainDataServer.loginUser.phone = $scope.user.accountNumber;
                        var exdate = new Date();
　　　　                 exdate.setDate(exdate.getDate() + 30);
                        webimutil.CookieHelper.setCookie("loginuserid", rep.result.id, exdate.toGMTString());
                        webimutil.CookieHelper.setCookie("loginusertoken", rep.result.token, exdate.toGMTString());
                        webimutil.CookieHelper.setCookie("loginusermobile", $scope.user.accountNumber, exdate.toGMTString());
                        $state.go("main");

                    } else if (rep.code === 1000) {
                        //用户或密码错误
                        $scope.userorpwdIsError = true;
                    } else {

                    }
                }).error(function(error, code) {
                    if (code == 400) {
                        webimutil.Helper.alertMessage.error("无效的用户名", 2);
                    }
                });
            }
        }
    }])

account.controller("signupController", ["$scope", "$interval", "$state", "mainServer",
    function($scope: any, $interval: angular.IIntervalService, $state: angular.ui.IStateService, mainServer: mainServer) {

        $scope.user = {
            // accountNumber: "",
            nickname: "",
            phone: "",
            code: "",
            passWord: ""
        }

        $scope.$watch("user.code", function() {
            $scope.codeIsError = false;
        });

        $scope.signup = function() {
            $scope.formSignup.submitted = true;
            if ($scope.formSignup.$valid) {
                mainServer.user.verifyCode($scope.user.phone, "86", $scope.user.code).success(function(data) {
                    if (data.code == 200 && data.result.verification_token) {
                        mainServer.user.signup($scope.user.nickname, $scope.user.passWord, data.result.verification_token).
                            success(function(e) {
                                webimutil.Helper.alertMessage.success("注册成功", 2);
                                $state.go("account.signin");
                            }).error(function(e) {
                                webimutil.Helper.alertMessage.error("注册失败", 2);
                            })
                    } else {
                        //短信验证码错误
                        $scope.codeIsError = true;
                    }

                }).error(function(error, code) {
                    if (code == 403) {
                        webimutil.Helper.alertMessage.error("手机号已被注册过", 2);
                    } else if (code == 404) {
                        // webimutil.Helper.alertMessage.error("验证过期刷新重试！");
                        $scope.codeIsError = true;
                    } else {
                        $scope.codeIsError = true;
                    }
                });
            }
        }

    }])

account.controller("forgotpasswordController", ["$scope", "$state", "mainServer",
    function($scope: any, $state: angular.ui.IStateService, mainServer: mainServer) {
        $scope.user = {
            phone: "",
            code: ""
        }

        $scope.codeIsError = false;

        $scope.$watch("user.code", function() {
            $scope.codeIsError = false;
        })

        $scope.nextfun = function() {
            $scope.formFogot.submitted = true;
            if ($scope.formFogot.$valid) {
                mainServer.user.verifyCode($scope.user.phone, "86", $scope.user.code).success(function(res) {
                    if (res.code == 200 && res.result.verification_token) {
                        $state.go("account.resetpassword", { token: res.result.verification_token });
                    } else {
                        //短信验证码错误
                        $scope.codeIsError = true;
                    }
                }).error(function(e) {

                })
            }
        }
    }])

account.controller("resetpasswordController", ["$scope", "$state", "$stateParams", "mainServer",
    function($scope: any, $state: angular.ui.IStateService, $stateParams: angular.ui.IStateParamsService, mainServer: mainServer) {

        var token = $stateParams["token"];
        $scope.user = {
            newpassword: "",
            repassword: ""
        }

        $scope.submit = function() {
            $scope.formResetPwd.submitted = true;
            if ($scope.formResetPwd.$valid) {
                mainServer.user.resetPassword($scope.user.newpassword, token).success(function(req) {
                    if (req.code == 200) {
                        $state.go("account.signin");
                        webimutil.Helper.alertMessage.success("重置成功", 2);
                    } else {
                        webimutil.Helper.alertMessage.error("重置失败", 2);
                    }
                }).error(function(error, code) {
                    if (code == 400) {
                        webimutil.Helper.alertMessage.error("重置失败", 2);
                    } else if (code == 404) {
                        webimutil.Helper.alertMessage.error("重置失败", 2);
                    }
                });
            }
        }

    }]);

account.directive("usernameAvailable", ["$http", "$q", "mainServer",
    function($http: angular.IHttpService, $q: angular.IQService, mainServer: mainServer) {
        return {
            require: "ngModel",
            link: function(scope: any, ele: angular.IRootElementService, attr: any, ngModel: angular.INgModelController) {
                if (ngModel) {
                    var usernameRegexp = /^[a-z0-9A-Z_]{4,64}$/;
                }
                var customValidator = function(value: string) {
                    var validity = ngModel.$isEmpty(value) || usernameRegexp.test(value);
                    ngModel.$setValidity("userformat", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);

                ngModel.$asyncValidators['uniqueUsername'] = function(modelValue: any, viewValue: any) {
                    var value = modelValue || viewValue;
                    return mainServer.user.checkUsernameAvailable(value).then(function resolved(res) {
                        if (res.data && res.data.result) {
                            return true
                        }
                        else {
                            return $q.reject(res.data);
                        }

                    }, function rejected() {
                    })
                };
            }
        }
    }]);

account.directive("phoneAvailable", ["$http", "$q", "mainServer",
    function($http: angular.IHttpService, $q: angular.IQService, mainServer: mainServer) {
        return {
            require: "ngModel",
            link: function(scope: any, ele: angular.IRootElementService, attr: any, ngModel: angular.INgModelController) {
                if (ngModel) {
                    var phoneRegexp = /^1[3-9][0-9]{9,9}$/;
                }
                var customValidator = function(value: string) {
                    var validity = ngModel.$isEmpty(value) || phoneRegexp.test(value);
                    ngModel.$setValidity("phoneformat", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);

                ngModel.$asyncValidators['uniquephone'] = function(modelValue: any, viewValue: any) {
                    var value = modelValue || viewValue;
                    return mainServer.user.checkPhoneAvailable(value, "86").then(function resolved(res) {
                        if (res.data && res.data.result) {
                            return true
                        }
                        else {
                            return $q.reject(res.data);
                        }

                    }, function rejected() {
                    })
                };
            }
        }
    }]);

account.directive("phoneRegistered", ["$http", "$q", "mainServer",
    function($http: angular.IHttpService, $q: angular.IQService, mainServer: mainServer) {
        return {
            require: "ngModel",
            link: function(scope: any, ele: angular.IRootElementService, attr: any, ngModel: angular.INgModelController) {
                if (ngModel) {
                    var phoneRegexp = /^1[3-9][0-9]{9,9}$/;
                }
                var customValidator = function(value: string) {
                    var validity = ngModel.$isEmpty(value) || phoneRegexp.test(value);
                    ngModel.$setValidity("phoneformat", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);

                ngModel.$asyncValidators['uniquephone'] = function(modelValue: any, viewValue: any) {
                    var value = modelValue || viewValue;
                    return mainServer.user.checkPhoneAvailable(value, "86").then(function resolved(res) {
                        if (res.data && res.data.result) {
                            return $q.reject(res.data);
                        }
                        else {
                            return true
                        }

                    }, function rejected() {
                    })
                };
            }
        }
    }])

account.directive("sendCodeButton", ["$interval", "mainServer", function($interval: angular.IIntervalService, mainServer: mainServer) {
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
        // '<span class="sec" ng-show="codeTime==0">{{startTime}} s</span>' +
        '<span class="sec" ng-show="codeTime>0">{{codeTime}} s</span>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            scope.codeTime = 0;
            scope.startTime = scope.startTime || 60;
            scope.region = scope.region || "86";

            scope.sendCode = function() {
                if (scope.codeTime == 0 && scope.available) {
                    mainServer.user.sendCode(scope.phone, "86").success(function(rep) {
                        if (rep.code == 200) {
                            scope.loading = true;
                            scope.codeTime = scope.startTime;
                            scope.interval = $interval(function() {
                                if (scope.codeTime > 0) {
                                    scope.codeTime = scope.codeTime - 1;
                                } else {
                                    scope.loading = false;
                                    $interval.cancel(scope.interval);
                                }
                            }, 1000);
                        } else if (rep.code == 5000) {
                            webimutil.Helper.alertMessage.error("发送频率过快，请稍后再发", 2);
                        }
                    }).error(function(error, code) {
                        if (code == 400) {
                            webimutil.Helper.alertMessage.error("无效手机号", 2);
                        }
                    })
                }
            }
        }
    }
}]);
