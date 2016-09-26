module webim {
    angular.module('webim').service('searchData', ["$q", "$http", "mainDataServer", function($q: ng.IQService, $http: ng.IHttpService, mainDataServer: mainDataServer) {
        var cacheData: any = {};

        this.enableCache = false;

        this.searchContact = function(str: string) {

            var defer = $q.defer();

            if (this.enableCache && cacheData[str]) {
                defer.resolve(cacheData[str]);
            } else {
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
                    this.enableCache && (cacheData[str] = search);
                    defer.resolve(search);
                })
            }

            return defer.promise;
        }

        this.searchOrganization = function(str: string) {
            var defer = $q.defer();

            if (this.enableCache && cacheData[str]) {
                defer.resolve(cacheData[str]);
            } else {
                $http({
                    method: 'get',
                    url: './assets/js/exampledata.json',
                }).success(function(rep: any) {
                    var search: any;

                    search = rep.searchorganization.data;
                    this.enableCache && (cacheData[str] = search);
                    defer.resolve(search);
                })
            }

            return defer.promise;
        }

    }]);
}
