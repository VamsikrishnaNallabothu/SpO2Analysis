angular.module('sbAdminApp')
.service('es', function (esFactory) {
  return esFactory({ host: 'localhost:9200' });
});
