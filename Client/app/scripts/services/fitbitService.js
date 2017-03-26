angular.module('sbAdminApp')
    .factory('FitBitAPI', function($http, $q, Session, httpService) {

        return {
            getProfileData: function() {
                var header = { 'Authorization': 'Bearer ' + Session.accessToken };
                var url = 'https://api.fitbit.com/1/user/' + Session.accountUserId + '/profile.json';
                return httpService.sendFitBitRequest('GET', {}, url, {}, header);                
            },
            getActivityData: function($dates, activity) {

                var promises = [];

                angular.forEach($dates, function(date, key) {
                    promises.push($http({
                        method: 'GET',
                        url: 'https://api.fitbit.com/1/user/' + Session.accountUserId + '/'+activity+'/date/' + date + '.json',
                        headers: { 'Authorization': 'Bearer ' + Session.accessToken }
                    }));
                });

                return $q.all(promises);
            }
        }
    });