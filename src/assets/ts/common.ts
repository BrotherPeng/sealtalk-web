module webim {
  angular.module('webim').service('searchData', ["$q", "$http", "mainDataServer", "RongIMSDKServer", "organizationServer",
    function($q: ng.IQService, $http: ng.IHttpService, mainDataServer: mainDataServer, RongIMSDKServer: RongIMSDKServer,organizationServer:any) {
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
          organizationServer.search(str).then(function(data:any){

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
            search.staffList = data;
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
          organizationServer.search(str).then(function(data:any){
            var search: any;

            search = data;
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
            data=data.splice(0,1);
            this.enableCache && (cacheData.conversationByContent[str] = data);
            defer.resolve(data);
          })
        }

        return defer.promise;
      }

    }]);
}
