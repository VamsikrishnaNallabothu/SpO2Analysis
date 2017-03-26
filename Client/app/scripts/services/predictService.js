angular.module('sbAdminApp')
.factory('PredictService', function (httpService) {
	return {
		predict: function(user){
			return httpService.sendRequest('POST',user,'predict',{})
		}
	}
});
