angular.module('sbAdminApp')
.service('httpService', function($http) {
  var baseUrl = 'http://localhost:3000/api/';
  var reqHeaders = {'Content-Type': 'application/json'};

  this.sendRequest = function(methodType, data, url, params){
    var reqUrl = baseUrl + url;
    return $http({method: methodType, data:data, url: reqUrl, headers: reqHeaders, params: params });
  };

  this.sendFitBitRequest = function(methodType, data, url, params, header){
  	return $http({method: methodType, data:data, url:url, headers: header, params:params});
  }

});