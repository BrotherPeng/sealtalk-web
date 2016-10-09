module webim {
  angular.module('webim').service('searchData', ["$q", "$http", "mainDataServer", "RongIMSDKServer",
    function($q: ng.IQService, $http: ng.IHttpService, mainDataServer: mainDataServer, RongIMSDKServer: RongIMSDKServer) {
      var cacheData: any = {
        organization: {},
        contact: {},
        conversationByContent:{}
      };

      this.enableCache = false;

      this.searchContact = function(str: string) {

        var defer = $q.defer();

        if (this.enableCache && cacheData.contact[str]) {
          defer.resolve(cacheData.contact[str]);
        } else {
          //此处修改为根据 名称查询人员的接口
          $http({
            method: 'get',
            url: './assets/js/exampledata.json',
          }).success(function(rep: any) {
            var search: any = {};

            search.includeMember = [];
            mainDataServer.contactsList.groupList.forEach(function(item) {
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
            search.staffList = rep.searchorganization.data;
            this.enableCache && (cacheData.contact[str] = search);
            defer.resolve(search);
          })
        }

        return defer.promise;
      }

      this.searchOrganization = function(str: string) {
        var defer = $q.defer();

        if (this.enableCache && cacheData.organization[str]) {
          defer.resolve(cacheData.organization[str]);
        } else {
          //此处修改为根据 名称查询人员的接口
          $http({
            method: 'get',
            url: './assets/js/exampledata.json',
          }).success(function(rep: any) {
            var search: any;

            search = rep.searchorganization.data;
            this.enableCache && (cacheData.organization[str] = search);
            defer.resolve(search);
          })
        }

        return defer.promise;
      }

      this.getConversationByContent = function(str: string) {
        var defer = $q.defer();

        if (this.enableCache && cacheData.conversationByContent[str]) {
          defer.resolve(cacheData.conversationByContent[str]);
        } else {
          RongIMSDKServer.getConversationByContent(str).then(function(data){
            data=data.splice(1,1);
            this.enableCache && (cacheData.conversationByContent[str] = data);
            defer.resolve(data);
          })
        }

        return defer.promise;
      }

    }]);
}
