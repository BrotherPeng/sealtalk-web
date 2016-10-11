/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

var mainDire = angular.module("webim.main.directive", ["webim.main.server"]);

mainDire.directive("conversation", ["$state", "mainDataServer", function($state: angular.ui.IStateService, mainDataServer: mainDataServer) {
    return {
        restrict: "E",
        scope: {
            item: "="
        },
        template: '<div class="chatList" ng-class="{selected:isCurrentConversation}" id="{{item.targetType}}_{{item.targetId}}">' +
        '<div class="chat_item online slide-left">' +

        '<div class="photo">' +
        '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'assets/img/barBg.png\'}}" alt="">' +
        '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
        '<i class="Presence Presence--stacked Presence--mainBox" ng-show="{{item.targetType==4}}"></i>' +
        '</div>' +

        '<div class="ext_info">' +
        '<div class="ext">' +
        '<p class="attr clearfix timer">' +
        '<span class="pull-left">{{item.lastTime|showTime}}</span>' +
        '</p>' +
        '<p class="attr clearfix">' +
        '<span class="badge" ng-if="item.unReadNum>0">{{item.unReadNum>99?"99+":item.unReadNum}}</span>' +
        '<i class="no-remind" ng-show="false"></i>' +
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
        link: function(scope: any, ele: angular.IRootElementService, attrs: any, ngModel: any) {
            // scope.isCurrentConversation = scope.item.targetType == mainDataServer.conversation.currentConversation.targetType && scope.item.targetId == mainDataServer.conversation.currentConversation.targetId;
            // scope.item.lastMsg = webimutil.Helper.escapeSymbol.replaceSymbol(scope.item.lastMsg);
            if (!scope.item.targetId) {
                scope.item.imgSrc = 'assets/img/barBg.png';
            }
            else if (scope.item.targetType == webimmodel.conversationType.Discussion) {
                scope.item.imgSrc = 'assets/img/room_icon.png';
            }
            else {
                angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.targetId.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
            }
            ele.bind("click", function() {
                scope.$parent.unSelect(scope.item.targetType + '_' + scope.item.targetId);
                scope.$parent.$apply();
                mainDataServer.conversation.totalUnreadCount = mainDataServer.conversation.totalUnreadCount - scope.item.unReadNum;
                scope.item.unReadNum = 0;
                scope.item.atStr = '';
                if (scope.item.targetType == webimmodel.conversationType.System) {
                    $state.go("main.notification");
                    return;
                }

                if ($state.is("main") || $state.is("main.none")) {
                    $state.go("main.chat", { targetId: scope.item.targetId, targetType: scope.item.targetType });
                } else {
                    $state.go("main.chat", { targetId: scope.item.targetId, targetType: scope.item.targetType }, { location: "replace" });
                }

            })
        }
    }
}]);

mainDire.directive("addbtn", [function() {
    return {
        restrict: "EA",
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {

            var CLOSE: any;
            function closeAddbtn() {
                this.style.display = "none"
                document.removeEventListener("click", CLOSE, false);
            }

            ele.bind("click", function() {
                var ul = ele.find("ul")[0];
                var status = getComputedStyle(ul, null)["display"];
                if (!status || status == "none") {
                    ul.style.display = "block";
                    CLOSE = function() { closeAddbtn.call(ul); }
                    setTimeout(function() {
                        document.addEventListener("click", CLOSE, false);
                    }, 0)
                } else {
                    ul.style.display = "none";
                }
            })
        }
    }
}])

mainDire.directive("groupitem", ["$state", "organizationgroup", function($state: angular.ui.IStateService, organizationgroup: any) {
    return {
        restrict: "E",
        scope: { item: "=" },
        template:
        // '<div class="noticeBarList">' +
        '<div class="notice_item ">' +
        '<div class="photo">' +
        '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'assets/img/barBg.png\'}}" alt="">' +
        '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
        '</div>' +
        '<div class="info">' +
        '<h3 class="nickname">' +
        '<span class="nickname_text">{{item.name}}</span>' +
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
                $state.go("main.groupinfo", { groupid: scope.item.id, conversationtype: "0" });
                scope.$parent.unSelectContact();
                angular.element(ele[0]).addClass('selected');
                scope.$parent.selectGoGroup(scope.item.id, webimmodel.conversationType.Group);
                // organizationgroup.showPanle(scope.item.id);
            });
        }
    }
}]);

mainDire.directive("frienditem", ["$state", function($state: angular.ui.IStateService) {
    return {
        restrict: "E",
        scope: { item: "=" },
        replace: true,
        template: '<div class="members_item " >' +
        '<div class="photo">' +
        '<img class="img" ng-show="item.imgSrc" ng-src="{{item.imgSrc||\'assets/img/barBg.png\'}}" alt="">' +
        '<div class="portrait" ng-show="!item.imgSrc">{{item.firstchar}}</div>' +
        '</div>' +
        '<div class="info">' +
        '<h3 class="nickname">' +
        '<span class="nickname_text">{{item.displayName||item.name}}</span>' +
        '</h3>' +
        '</div>' +
        '<div class="botDivider"></div>' +
        // '<i class="Presence Presence--members online"></i>' +
        '</div>',
        link: function(scope: any, ele: any, attr: any) {
            angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.id.charCodeAt(0) % webimutil.Helper.portraitColors.length]);

            ele.on("click", function() {
                // $state.go("main.friendinfo", { userid: scope.item.id, groupid: "0", targetid: "0", conversationtype: "0" });
                // scope.$parent.unSelectContact();
                // angular.element(ele[0]).addClass('selected');
                scope.$parent.selectGo(scope.item.id, webimmodel.conversationType.Private);
            });
        }
    }
}])

mainDire.directive("searchInput", ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: "E",
        scope: {
            search: "&",
            showText: "@",
            delayTime: "@",
            focus: "&",
            control: '=',
            content:'='
        },
        template: '<form class="searchArea clearfix">' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" id="{{id}}" ng-model="content" placeholder="{{showText||\'搜索\'}}">' +        // '<i class="clearInputBtn" ng-show="content.length>0" ng-click="clear()"></i>' +
        '<label class="" for="{{id}}"></label>' +
        '</div>' +
        '</form>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            scope.id = "groupSearch" + scope.$id;

            scope.clear = function() {
                scope.content = "";
                document.getElementById(scope.id).focus();
            }

            scope.delayTime = parseInt(scope.delayTime) || 800;

            var input = ele.find("input");
            scope.content = ""
            input.on("blur", function(e) {
                angular.element(this).val().trim() ? void (0) : angular.element(this).parent().removeClass("isfocus");
            });
            input.on("focus", function(e) {
                angular.element(this).parent().addClass("isfocus");
            });

            var _timeout: angular.IPromise<any>;

            scope.$watch("content", function(newVal: string, oldVal: string) {
                if (newVal === oldVal)
                    return;
                $timeout.cancel(_timeout);
                _timeout = $timeout(function() {
                    scope.search({ content: scope.content });
                }, scope.delayTime);
            })

            scope.internalControl = scope.control || {};
            scope.internalControl.clear = function() {
                scope.content = "";
            };

        }
    }
}]);

mainDire.directive("inputWrap", [function() {
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
        // '<i class="iconfont-smile"></i>' +
        '<div class="wordsLen"><span class="word_start">{{message.length}}</span>/{{maxlength}}</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attrs: angular.IAttributes) {
            scope.showplaceholder = true;
            scope.maxlength = scope.maxlength || 64;

            var info = scope.$parent.getInfo();
            if (info) {
                // angular.element(ele[0].getElementsByClassName("prompt-text")[0]).text(info);
                scope.message = info;
            }

            if (scope.loadedfocus) {
                angular.element(ele).find("textarea")[0].focus();
                scope.showplaceholder = true;
            }

            ele.find("textarea").bind("focus", function() {
                // scope.showplaceholder = false;
                // scope.$apply();
            });

            ele.find("textarea").bind("blur", function() {
                if (!scope.message || !scope.message.length) {
                    scope.showplaceholder = true;
                }
                scope.$apply();
            });

            ele.find("textarea").bind('input propertychange', function() {
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
            scope.$watch("message", function(newVal: any, oldVal: any) {
                if (newVal.length > scope.maxlength) {
                    scope.message = newVal.substring(0, scope.maxlength);
                }
            });
        }
    }
}]);

mainDire.directive("pwMatch", [function() {
    return {
        require: "ngModel",
        link: function(scope: angular.IScope, ele: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {

            var inputNames = attrs["pwMatch"].trim().split(".");
            var validfun = function(input: string) {
                var form = <any>document.forms[inputNames[0]];
                var password = form[inputNames[1]].value;
                var valid = input == password;

                ngModel.$setValidity("pwmatch", valid);

                return valid ? password : undefined;
            }

            ngModel.$parsers.push(validfun);
            ngModel.$formatters.push(validfun);

        }
    }
}])

mainDire.directive("myFocus", [function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope: any, element: any, attrs: any, ctrl: any) {
            ctrl.$focused = false;
            element.on('focus', function() {
                scope.$apply(function() { ctrl.$focused = true; });
            }).on('blur', function() {
                scope.$apply(function() { ctrl.$focused = false; });
            });
            element.on("keydown", function(e: any) {
                if (e.keyCode === 13 || e.keyCode === 10) {
                    setTimeout(function() {
                        element[0].blur();
                    })
                }
            });
        }
    }
}]);
