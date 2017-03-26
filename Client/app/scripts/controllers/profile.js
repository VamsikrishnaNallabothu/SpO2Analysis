'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ProfileCtrl', function($scope, $state, Notification, ProfileService) {

            var loggedInUser;
            if (typeof localStorage !== undefined) {
                loggedInUser = localStorage.getItem('userData');
                $scope.loggedInUser = JSON.parse(loggedInUser);
            }

            $scope.reset = function() {
                $state.go('dashboard.home');
            }

            $scope.submit = function() {
                var savedUser = JSON.parse(loggedInUser);
                if (_.isEqual(savedUser, $scope.loggedInUser)) {
                    Notification.warning('No new data to update');
                } else {
                    ProfileService.update($scope.loggedInUser).then(function(response) {
                        if (typeof localStorage !== undefined) {
                            Notification.success('Update successful');
                            localStorage.setItem('userData', JSON.stringify(response.data));
                            $scope.loggedInUser = JSON.parse(loggedInUser);
                            $state.go('dashboard.home');
                        }
                    }, function() {
                        Notification.error('update failed');
                    });
                }

            };
        });
