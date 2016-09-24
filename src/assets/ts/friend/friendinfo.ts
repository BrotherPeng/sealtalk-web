/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-file-upload/angular-file-upload.d.ts"/>

var friendinfo = angular.module("webim.friendinfo", ["webim.main.server"]);

friendinfo.controller("friendinfoController", ["$scope", "$rootScope", "$state", "$stateParams", "$window", "mainDataServer", "mainServer", "RongIMSDKServer", '$http',
  function($scope: any, $rootScope: any, $state: angular.ui.IStateService, $stateParams: any, $window: angular.IWindowService, mainDataServer: mainDataServer, mainServer: mainServer, RongIMSDKServer: RongIMSDKServer, $http: angular.IHttpService) {

    $scope.$on("$viewContentLoaded", function() {
      setPortrait();
    });
    function setPortrait() {
      if (userid) {
        angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[userid.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
      }
    }

    $("#__selPortrait").css('opacity', '0');
    $('#__selPortrait').change(function(e) {
      if (e.target.files.length == 0) {
        return;
      }
      var _file = e.target.files[0];
      mainServer.user.getImageToken().success(function(rep) {
        var fd = new FormData();
        fd.append("file", _file);
        fd.append("token", rep.result.token);
        // var xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function(e) {
        //     if ( 4 == this.readyState ) {
        //          var _obj = JSON.parse(this.responseText);
        //          mainServer.user.setPortraitUri(IMGDOMAIN + _obj.key).success(function(rep) {
        //            if (rep.code == 200) {
        //              $scope.user.portraitUri = IMGDOMAIN + _obj.key;
        //              mainDataServer.loginUser.portraitUri = IMGDOMAIN + _obj.key;
        //            }
        //         });
        //     }
        // };
        // xhr.open('post', 'http://up.qiniu.com?', true);
        // xhr.send(fd);

        var req = {
          method: 'POST',
          url: 'http://up.qiniu.com?',
          headers: {
            //此处必须设置 undefined
            'Content-Type': <any>undefined
          },
          transformRequest: angular.identity,
          withCredentials: false,
          data: fd
        };
        $http(req).success(function(res: any) {
          mainServer.user.setPortraitUri(IMGDOMAIN + res.key).success(function(rep) {
            if (rep.code == 200) {
              $scope.user.portraitUri = IMGDOMAIN + res.key;
              mainDataServer.loginUser.portraitUri = IMGDOMAIN + res.key;
            }
          });
        }).error(function(err) {
          webimutil.Helper.alertMessage.error("头像上传出错！", 2);
        });

      }).error(function() {
        webimutil.Helper.alertMessage.error("头像上传初始化失败", 2);
      });

    });
    $("#__myPortrait").click(function(e) {
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
      // $scope.user.id = friend.id;
      // $scope.user.nickName = friend.name;
      // $scope.user.portraitUri = friend.imgSrc;
      // $scope.user.firstchar = friend.firstchar;
      //更新好友信息
      // mainDataServer.contactsList.removeFriend(userid);
      mainServer.friend.getProfile(userid).success(function(data) {
        var f = new webimmodel.Friend({ id: data.result.user.id, name: data.result.user.nickname, imgSrc: data.result.user.portraitUri });
        f.displayName = data.result.displayName;
        f.mobile = data.result.user.phone;
        // f = mainDataServer.contactsList.addFriend(f);
        var fold = webimutil.ChineseCharacter.getPortraitChar2(friend.displayName || friend.name);
        var fnew = webimutil.ChineseCharacter.getPortraitChar2(f.displayName || f.name);
        f.firstchar = webimutil.ChineseCharacter.getPortraitChar(f.displayName || f.name);;
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
      })

    }
    else if (isself) {
      $scope.user.id = mainDataServer.loginUser.id;
      $scope.user.nickName = mainDataServer.loginUser.nickName;
      $scope.user.portraitUri = mainDataServer.loginUser.portraitUri;
      $scope.user.firstchar = mainDataServer.loginUser.firstchar;
    }
    else {
      mainServer.user.getInfo(userid).then(function(rep) {

        var f = new webimmodel.Friend({ id: rep.data.result.id, name: rep.data.result.nickname, imgSrc: rep.data.result.portraitUri });

        // f = mainDataServer.contactsList.updateOrAddFriend(f);
        // mainDataServer.conversation.updateConversationDetail(webimmodel.conversationType.Private, userid, rep.data.result.displayName || rep.data.result.nickname, rep.data.result.portraitUri);
        mainDataServer.conversation.updateConversationDetail(webimmodel.conversationType.Private, userid, rep.data.result.displayName || rep.data.result.nickname, rep.data.result.portraitUri);

        var _member = new webimmodel.Member({
          id: rep.data.result.id,
          name: rep.data.result.nickname,
          imgSrc: rep.data.result.portraitUri
        });
        mainDataServer.contactsList.updateGroupMember(_member.id, _member);

        $scope.user.id = rep.data.result.id
        $scope.user.nickName = rep.data.result.nickname
        $scope.user.portraitUri = rep.data.result.portraitUri;
        $scope.user.firstchar = webimutil.ChineseCharacter.getPortraitChar(rep.data.result.nickname);
        setPortrait();



      })
    }
    //  else if (member) {
    //     $scope.user.id = member.id;
    //     $scope.user.nickName = member.name;
    //     $scope.user.portraitUri = member.imgSrc;
    //     $scope.user.firstchar = member.firstchar;
    // }

    //58 演示示例
    var userinfo = [
      {
        "id": 0,
        "oaName": "张三",
        "realName": "张三",
        "deptPathName": "",
        "mobilePhone": "188888880",
        "chat": "1"
      },
      {
        "id": 1,
        "oaName": "李四",
        "realName": "李四",
        "deptPathName": "",
        "mobilePhone": "188888881",
        "chat": "1"
      },
      {
        "id": 2,
        "oaName": "王五",
        "realName": "王五",
        "deptPathName": "",
        "mobilePhone": "188888882",
        "chat": "1"
      }
    ];

    userinfo.forEach(function(item) {
      if (item.id == userid) {
        $scope.user = {
          id: item.id,
          nickName: item.oaName,
          portraitUri: '',
          firstchar: ''
        }
      }
    })


    $scope.isEditable = false;
    $scope.newName = $scope.user.displayName || $scope.user.nickName;
    $scope.edit = function() {
      // $state.go("main.editfriendinfo", { userid: userid, groupid: groupid, targetid: targetid, conversationtype: conversationtype });
      $scope.isEditable = true;
      setTimeout(function() {
        $('#editName').focus();
        // $('#editName').select();
      }, 0);
    };
    $scope.editSave = function() {
      if ($scope.newName == $scope.user.displayName) {
        $scope.isEditable = false;
        return;
      }
      if ($scope.modifyName.$valid) {
        if (isself) {
          mainServer.user.setNickName($scope.newName).success(function() {
            mainDataServer.loginUser.nickName = $scope.newName;
            mainDataServer.loginUser.firstchar = webimutil.ChineseCharacter.getPortraitChar($scope.newName);
            $scope.user.nickName = $scope.newName;
            $scope.isEditable = false;
          })
        } else {
          mainServer.friend.setDisplayName(userid, $scope.newName).success(function(rep) {
            if (rep.code == 200) {
              if (friend) {
                friend.name = $scope.newName;
              }
              mainDataServer.conversation.updateConversationTitle(webimmodel.conversationType.Private, userid, $scope.newName);
              $scope.user.displayName = $scope.newName;
              $scope.isEditable = false;
            }
          }).error(function() {
            webimutil.Helper.alertMessage.error("修改用户名失败", 2);
          });
        }
      }
    }

    $scope.toAddFriend = function() {
      $state.go("main.applyfriend", { userId: $scope.user.id, userName: $scope.user.nickName, groupid: groupid, targetid: targetid, conversationtype: conversationtype })
    }

    $scope.toConversation = function() {
      $state.go("main.chat", { targetId: $scope.user.id, targetType: webimmodel.conversationType.Private }, { location: "replace" });
    };

    var addBlackList = function(id: any) {
      mainServer.user.addToBlackList(id).success(function() {
        mainDataServer.blackList.add(new webimmodel.Friend({
          id: $scope.user.id,
          name: $scope.user.nickName,
          imgSrc: $scope.user.portraitUri
        }))
      })
    }
    var removeBlackList = function(id: any) {
      mainServer.user.removeFromBlackList(id).success(function() {
        mainDataServer.blackList.remove(id);
      });
    }

    $scope.user.inBlackList = mainDataServer.blackList.getById(userid) ? true : false;

    var loading = false;

    $scope.removeFriend = function() {
      //删除好友
      //请求服务器删除
      if (loading)
        return;
      loading = true;
      mainServer.friend.setDisplayName($scope.user.id, "").success(function() {
      }).error(function() {
        console.log("删除好友昵称失败");
      })
      mainServer.friend.delete($scope.user.id).success(function() {
        RongIMSDKServer.removeConversation(webimmodel.conversationType.Private, $scope.user.id).then(function() {
          loading = false;
          var bo = mainDataServer.contactsList.removeFriend($scope.user.id);
          bo ? "" : console.log("删除好友失败");
          $state.go("main");
        }, function() {
          console.log("删除失败");
        });

      }).error(function() {
        loading = false;
        webimutil.Helper.alertMessage.error("删除失败", 2);
      })

    }

    $scope.switchchange = function() {
      if ($scope.user.inBlackList) {
        addBlackList($scope.user.id);
      } else {
        removeBlackList($scope.user.id);
      }
    }

    function goback() {
      if (groupid && groupid != "0") {
        $state.go("main.groupinfo", { groupid: groupid, conversationtype: conversationtype });
      } else {
        if (conversationtype && conversationtype != 0) {
          $state.go("main.chat", { targetId: targetid, targetType: conversationtype });
        } else {
          $state.go("main");
        }
      }
    }

    $scope.back = function() {
      if ($scope.isEditable) {
        $scope.editSave();
      } else {
        window.history.back();
      }
    }

    // mainServer.user.setPortraitUri(file.fileUrl).then(function(rep) {
    //     $scope.user.portraitUri = rep.config.data.portraitUri;
    //     mainDataServer.loginUser.portraitUri = rep.config.data.portraitUri;
    // })


    // RongIMLib.RongUploadLib.getInstance().setListeners({
    //   onFileAdded:function(file: any){
    //     RongIMLib.RongUploadLib.getInstance().start(null, null);
    //   },
    //   onBeforeUpload:function(file: any){
    //   },
    //   onUploadProgress:function(file: any){
    //   },
    //   onFileUploaded:function( file: any, message: webimmodel.Message){
    //       mainServer.user.setPortraitUri(file.fileUrl).then(function(rep) {
    //           $scope.user.portraitUri = rep.config.data.portraitUri;
    //           mainDataServer.loginUser.portraitUri = rep.config.data.portraitUri;
    //       })
    //
    //   },
    //   onError:function(up: any, err: any, errTip: string){
    //         $scope.uploadStatus.show = false;
    //         webimutil.Helper.alertMessage.error("上传图片出错！", 2);
    //
    //   },
    //   onUploadComplete:function(){
    //   }
    // });
    //
    // RongIMLib.RongUploadLib.getInstance().reload('IMAGE', 'FILE');

  }]);
