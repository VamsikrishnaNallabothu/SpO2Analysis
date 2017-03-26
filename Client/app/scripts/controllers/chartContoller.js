'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ChartCtrl', ['$scope', '$timeout', 'Session', 'FitBitAPI', '$filter', 'UtilityService', 'es', 'httpService',
        function($scope, $timeout, Session, FitBitAPI, $filter, UtilityService, es, httpService) {


            /*Date & ES data functionality*/

            var dt1Key, dt2Key;
            $scope.fitbitData = true;

           // $scope.parameter1 = 'bmi_s1';

            $scope.selectValue = function() {
                getEsData($scope.parameter1, $scope.parameter2);
            }
           // $scope.selectValue();



            $scope.user_info = {};
            $scope.activity = [];
            $scope.labels = [];
            $scope.barLabels = [];
            $scope.data = [
                [],
                []
            ];
            $scope.barData = [
                [],
                []
            ];

            if (typeof localStorage !== undefined) {
                var loggedInUser = JSON.parse(localStorage.getItem('userData'));
            }

            $scope.parameters = [{ 'name': 'Age', value: 'age' }, { 'name': 'Gender', value: 'age_s1' }, { 'name': 'Sleep Time', value: 'slptime' }, { 'name': 'BMI', value: 'bmi_s1' }];

            $scope.today = function() {
                var currentDate = new Date();
                var dates;
                currentDate.setDate(currentDate.getDate() - 1);
                $scope.dt1 = currentDate;
                dt1Key = UtilityService.keyGen($scope.dt1);
                $scope.dt2 = new Date();
                dt2Key = UtilityService.keyGen($scope.dt2);
                dates = UtilityService.getDates(dt1Key, dt2Key);
                FitBitAPI.getProfileData().then(function(response) {
                    var user = response.data.user;
                    $scope.user = user;
                    $scope.avatar = user.avatar150;
                    $scope.name = user.fullName;
                    $scope.gender = user.gender;
                    $scope.averageDailySteps = user.averageDailySteps;
                });

                FitBitAPI.getActivityData(dates, 'activities').then(function(data) {
                    var activities = [];
                    var idx = 0;

                    angular.forEach(data, function(value, key) {

                        var activity = value.data.summary;
                        var info = {};

                        info.user_id = Session.accountUserId;
                        info.steps = activity.steps;
                        info.calories = activity.caloriesOut;
                        info.caloriesBMR = activity.caloriesBMR;

                        activities.push(info);
                        activities[idx].day = dates[idx];

                        idx++;
                    });

                    for (var i = 0; i < activities.length; i++) {
                        $scope.activity[i] = activities[i];
                        $scope.data[0].push($scope.activity[i].steps);
                        $scope.data[1].push($scope.activity[i].calories);
                        $scope.barData[0].push($scope.activity[i].calories);
                        $scope.barData[1].push($scope.activity[i].caloriesBMR);
                    }

                    $scope.series = ['Steps', 'Calories Burned'];
                    $scope.barSeries = ['Calories Burned', 'Calories BMR'];

                })

                FitBitAPI.getActivityData(dates, 'sleep').then(function(data){
                    var activities = [];
                    var idx = 0;

                    /*angular.forEach(data, function(value, key) {

                        var activity = value.data.summary;
                        var info = {};

                        info.user_id = Session.accountUserId;
                        info.steps = activity.steps;
                        info.calories = activity.caloriesOut;
                        info.caloriesBMR = activity.caloriesBMR;

                        activities.push(info);
                        activities[idx].day = dates[idx];

                        idx++;
                    });

                    for (var i = 0; i < activities.length; i++) {
                        $scope.activity[i] = activities[i];
                        $scope.data[0].push($scope.activity[i].steps);
                        $scope.data[1].push($scope.activity[i].calories);
                        $scope.barData[0].push($scope.activity[i].calories);
                        $scope.barData[1].push($scope.activity[i].caloriesBMR);
                    }*/
                    console.log(data);
                })

                FitBitAPI.getActivityData(dates,'sleep/minutesAsleep').then(function(data){
                    var activities = [];
                    var idx = 0;
                    /*angular.forEach(data, function(value, key) {

                        var activity = value.data.summary;
                        var info = {};

                        info.user_id = Session.accountUserId;
                        info.steps = activity.steps;
                        info.calories = activity.caloriesOut;
                        info.caloriesBMR = activity.caloriesBMR;

                        activities.push(info);
                        activities[idx].day = dates[idx];

                        idx++;
                    });

                    for (var i = 0; i < activities.length; i++) {
                        $scope.activity[i] = activities[i];
                        $scope.data[0].push($scope.activity[i].steps);
                        $scope.data[1].push($scope.activity[i].calories);
                        $scope.barData[0].push($scope.activity[i].calories);
                        $scope.barData[1].push($scope.activity[i].caloriesBMR);
                    }*/
                    console.log(data);


                })
                FitBitAPI.getActivityData(dates,'sleep/awakeningsCount').then(function(data){
                    var activities = [];
                    var idx = 0;
                    /*angular.forEach(data, function(value, key) {

                        var activity = value.data.summary;
                        var info = {};

                        info.user_id = Session.accountUserId;
                        info.steps = activity.steps;
                        info.calories = activity.caloriesOut;
                        info.caloriesBMR = activity.caloriesBMR;

                        activities.push(info);
                        activities[idx].day = dates[idx];

                        idx++;
                    });

                    for (var i = 0; i < activities.length; i++) {
                        $scope.activity[i] = activities[i];
                        $scope.data[0].push($scope.activity[i].steps);
                        $scope.data[1].push($scope.activity[i].calories);
                        $scope.barData[0].push($scope.activity[i].calories);
                        $scope.barData[1].push($scope.activity[i].caloriesBMR);
                    }*/
                    console.log(data);


                })
            };


            $scope.today();

            function getEsData(par1) {
                es.cluster.health(function(err, resp) {
                    if (err) {
                        $scope.data = err.message;
                    } else {
                        es.search({
                            index: 'sleepanalysis',
                            size: 500,
                            body: {
                                "query": {
                                    "match_all": {}
                                }
                            }

                        }).then(function(response) {
                            console.log(response);
                            var data = response.hits.hits;
                            $scope.lineChart.data[0]= UtilityService.pluck(UtilityService.pluck(data, '_source'), 'bmi_s1');
                            $scope.barChart.data[0] = UtilityService.pluck(UtilityService.pluck(data, '_source'), 'AvgSpO2');

                            $scope.mixedData = [$scope.lineChart.data, $scope.barChart.data];
                            $scope.mixedData.series = [par1, 'AvgSpO2'];
                        });
                    }
                });

            }

            /*getEsData();*/


            $scope.clear = function() {
                $scope.dt = null;
            };

            var currentDay = new Date();

            $scope.startDateOptions = {
                formatYear: 'yy',
                maxDate: currentDay.setDate(currentDay.getDate() - 1),
                minDate: new Date(2016, 10, 1),
                startingDay: 1
            };

            $scope.endDateOptions = {
                formatYear: 'yy',
                maxDate: new Date(),
                minDate: new Date(2016, 10, 1),
                startingDay: 1
            };

            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };

            $scope.open2 = function() {
                $scope.popup2.opened = true;
            };

            $scope.dateChange = function() {
                var dateArray = UtilityService.getDates($scope.dt1, $scope.dt2);
            }

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.popup1 = {
                opened: false
            };
            $scope.popup2 = {
                opened: false
            }







            /*
                        $scope.today = new Date();

                        var dates = [];
                        var past_days = 4;

                        for (var i = 1; i <= past_days; i++) {
                            var curr_date = new Date();
                            curr_date.setDate($scope.today.getDate() - (past_days - i));
                            curr_date = $filter('date')(curr_date, "yyyy-MM-dd");

                            dates.push(curr_date);

                            curr_date = $filter('date')(curr_date, "EEE d");
                            $scope.labels.push(curr_date);
                        }*/


            if (typeof localStorage !== undefined &&
                JSON.parse(localStorage.getItem('fitbit'))) {
                $scope.fitbitData = false;
                $scope.user_info.accessToken = Session.accessToken;
                $scope.user_info.expiresIn = Session.expiresIn;
                $scope.user_info.accountUserId = Session.accountUserId;
            }
            $scope.fitbit_client_id = "227YGT";
            $scope.redirect_uri_url = "http://localhost:9000/index.html";
            $scope.getFitBitData = function() {
                // window.location.href = "https://www.fitbit.com/oauth2/authorize?client_id=" + $scope.fitbit_client_id + "&response_type=token&scope=activity%20profile&expires_in=2592000";
                window.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=' + $scope.fitbit_client_id + '&redirect_uri=' + $scope.redirect_uri_url + '&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800';
            }

            $scope.lineChart = {
                labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                series: ['SpO2'],
                data: [
                    []
                ],
                onClick: function(points, evt) {
                    console.log(points, evt);
                }
            };

            $scope.barChart = {
                labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                series: ['Pulse Rate'],

                data: [
                    []
                ],
                onClick: function(points, evt) {
                    console.log(points, evt);
                }

            };

            $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

            $scope.mixedData = [
                [],
                []
            ];

            $scope.mixedLabels = [0,50,100,150,200,250,300,350,400,450,500];
            $scope.mixedSeries = [['BMI','Avg SpO2']];

            $scope.datasetOverride = [{
                label: "Bar chart",
                borderWidth: 1,
                type: 'bar'
            }, {
                label: "Line chart",
                borderWidth: 3,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                type: 'line'
            }];

            /*
                        FitBitAPI.getProfileData().then(function(response) {
                            var user = response.data.user;
                            $scope.user = user;
                            $scope.avatar = user.avatar150;
                            $scope.name = user.fullName;
                            $scope.gender = user.gender;
                            $scope.averageDailySteps = user.averageDailySteps;
                        });

                        FitBitAPI.getActivityData(dates).then(function(data) {
                            var activities = [];
                            var idx = 0;

                            angular.forEach(data, function(value, key) {

                                var activity = value.data.summary;
                                var info = {};

                                info.user_id = Session.accountUserId;
                                info.steps = activity.steps;
                                info.calories = activity.caloriesOut;
                                info.caloriesBMR = activity.caloriesBMR;

                                activities.push(info);
                                activities[idx].day = dates[idx];

                                idx++;
                            });

                            for (var i = 0; i < activities.length; i++) {
                                $scope.activity[i] = activities[i];
                                $scope.data[0].push($scope.activity[i].steps);
                                $scope.data[1].push($scope.activity[i].calories);
                                $scope.barData[0].push($scope.activity[i].calories);
                                $scope.barData[1].push($scope.activity[i].caloriesBMR);
                            }

                            $scope.series = ['Steps', 'Calories Burned'];
                            $scope.barSeries = ['Calories Burned', 'Calories BMR'];

                        })

                        $scope.onClick = function(points, evt) {
                            console.log(points, evt);
                        };*/


            /*$scope.line = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                series: ['Series A', 'Series B'],
                data: [
                    [65, 59, 80, 81, 56, 55, 40],
                    [28, 48, 40, 19, 86, 27, 90]
                ],
                onClick: function(points, evt) {
                    console.log(points, evt);
                }
            };*/

            /* $scope.bar = {
                 labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
                 series: ['Series A', 'Series B'],

                 data: [
                     [65, 59, 80, 81, 56, 55, 40],
                     [28, 48, 40, 19, 86, 27, 90]
                 ]

             };*/

            /*$scope.donut = {
                labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
                data: [300, 500, 100]
            };

            $scope.radar = {
                labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],

                data: [
                    [65, 59, 90, 81, 56, 55, 40],
                    [28, 48, 40, 19, 96, 27, 100]
                ]
            };

            $scope.pie = {
                labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
                data: [300, 500, 100]
            };

            $scope.polar = {
                labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
                data: [300, 500, 100, 40, 120]
            };

            $scope.dynamic = {
                labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
                data: [300, 500, 100, 40, 120],
                type: 'PolarArea',

                toggle: function() {
                    this.type = this.type === 'PolarArea' ?
                        'Pie' : 'PolarArea';
                }
            };*/


        }
    ]);
