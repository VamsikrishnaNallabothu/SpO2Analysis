angular.module('sbAdminApp')
    .service('ProfileService', function(httpService) {
        return {
            register: function(data) {
                return httpService.sendRequest('POST', data, 'signup', {});
            },
            saveProfile: function(data) {
                console.log(data);
            	return httpService.sendRequest('POST', data, 'users', {});
            },
            update: function(data){
                return httpService.sendRequest('PUT', data, 'users', {});
            },
            login: function(data){
                return httpService.sendRequest('POST', data, 'login', {});
            },
            getUserProfile: function(id){
                return httpService.sendRequest('GET', {}, 'user', {userId: id});
            }
        };
    });
