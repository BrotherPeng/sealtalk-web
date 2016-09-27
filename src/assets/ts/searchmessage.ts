module webim {
    var webim=  angular.module('webim');
    webim.controller('searchmessageController', ['$scope', "$state",
    function($scope: any, $state: ng.ui.IStateService) {

      var targetid = $state.params['targetid'];
      var conversationtype = $state.params['conversationtype'];
      var searchstr = $state.params['searchstr'];


    }]);

    // webim.directive('')

}
