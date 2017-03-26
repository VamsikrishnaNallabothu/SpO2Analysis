'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:Predict Controller
 * @description
 * # Predict Ctrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('PredictCtrl', function($scope, Notification, PredictService) {
        $scope.user = { 'telNo': '', 'age':'', 'bmiNumber': '', 'weight': '', 'bp': '', 'sleepHours':'', 'snorelevel':'','disturbed':'' };
        $scope.predict = function() {
            PredictService.predict($scope.user).then(function(response) {
                Notification.success('Registration Successful');
                Notification.success('Message sent');
            }, function(error) {
                Notification.error({ message: error.data.message, delay: 1000 });
            });
        }

    });
