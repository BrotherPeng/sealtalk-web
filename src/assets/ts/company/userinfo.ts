/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../../typings/angular-file-upload/angular-file-upload.d.ts"/>
/// <reference path="../../../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../model/util.ts"/>
/// <reference path="../main/server.ts" />


var companyuserinfo = angular.module('webim');

companyuserinfo.controller('companyuserinfoController',["$scope","$state","organizationData","mainServer","mainDataServer",
	function($scope:any,$state:ng.ui.IStateService,organizationData:any,mainServer:mainServer,mainDataServer:mainDataServer){

	if (!mainDataServer.loginUser.nickName) {
        $state.go("main");
        return;
     }

	var userid = $state.params['userid'];
	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	console.log(userid);

	$scope.user = {

	}
	angular.element(document.getElementById("portrait")).css("background-color", webimutil.Helper.portraitColors[userid.charCodeAt(0) % webimutil.Helper.portraitColors.length]);

	var user = organizationData.getUserById(userid);
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		console.log(user);

	var dep = organizationData.getDepartmentById(user.deptId);

	user.deptName = dep.deptName;

	// mainServer.user.getInfo(user.managerId).then(function(rep){
	mainServer.user.getDeptUserInfo(userid).then(function(rep){
	    console.log('~~~~~~~~~~~~~~~~~~~~~~~~');
	    console.log(rep.data.result);
		user.managerName = rep.data.result.nickname;
	})

	user.firstchar = user.displayName.charAt(0);

	$scope.user=user;

	$scope.back = function(){
		window.history.back();
	}

	$scope.toConversation = function(){
		 $state.go("main.chat", { targetId: userid, targetType: 1 });
	}


}])
