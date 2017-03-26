'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('MainCtrl', function($scope, moment, Upload,
        $timeout, httpService, Notification, es, UtilityService) {

        var dt1Key, dt2Key;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds




        if (typeof localStorage !== undefined) {
            var loggedInUser = JSON.parse(localStorage.getItem('userData'));
        }


        $scope.today = function() {
            var currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);
            $scope.dt1 = currentDate;
            dt1Key = UtilityService.keyGen($scope.dt1);
            $scope.dt2 = new Date();
            dt2Key = UtilityService.keyGen($scope.dt2);

        };
        $scope.today();

        function getEsData(dt1Key, dt2Key) {
            es.cluster.health(function(err, resp) {
                if (err) {
                    $scope.data = err.message;
                } else {
                    es.search({
                        index: 'sleeplogstash',
                        size: 100,
                        body: {
                            "query": {
                                "bool": {
                                    "must": [{
                                        "term": {
                                            "userId": loggedInUser.userId
                                        }
                                    }, {
                                        "range": {
                                            "@timestamp": {
                                                "gte": dt1Key,
                                                "lte": dt2Key

                                            }
                                        }
                                    }]
                                }
                            }
                        }

                    }).then(function(response) {
                        var data = response.hits.hits;
                        $scope.line.data[0] = UtilityService.pluck(UtilityService.pluck(data, '_source'), 'SpO2%');
                        $scope.line.labels = UtilityService.pluck(UtilityService.pluck(data, '_source'), 'Time');
                        $scope.bar.data[0] = UtilityService.pluck(UtilityService.pluck(data, '_source'), 'Pulse Rate');
                        $scope.bar.labels = $scope.line.labels;
                        $scope.mixedData = [$scope.line.data[0], $scope.bar.data[0]];
                        $scope.mixedLabels = $scope.line.labels;                    });
                }
            });

        }

        getEsData();




        $scope.creds = {
            bucket: 'cmpe295b-userdata',
            access_key: 'AKIAJZAA76YBHHURP3VA',
            secret_key: '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'
        }


        $scope.line = {
            labels: [],
            series: ['SpO2'],
            data: [
                []
            ],
            onClick: function(points, evt) {
                console.log(points, evt);
            }
        };

        $scope.bar = {
            labels: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM',
                '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12PM'
            ],
            series: ['Pulse Rate'],

            data: [
                []
            ],
            onClick: function(points, evt) {
                console.log(points, evt);
            }

        };

        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

        $scope.mixedLabels = ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM',
            '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12PM'
        ];
        $scope.mixedData = [
            [],
            []
        ];

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

        $scope.submit = function() {
            var dt = new Date();
            var keyName = loggedInUser.userId + '.csv';
            // Configure The S3 Object 
            AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
            var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });


            if ($scope.file) {
                var params = { Key: keyName, ContentType: $scope.file.type, ServerSideEncryption: 'AES256' };

                bucket.putObject(params, function(err, data) {
                        if (err) {
                            // There Was An Error With Your S3 Config
                            Notification.error("Problem with S3 configuration");
                            return false;
                        } else {
                            console.log(data);
                            Notification.success("Successfully uploaded");
                            var url = 'http://cmpe295b-userdata.s3.amazonaws.com/' + keyName;
                            httpService.sendRequest('POST', { 'key': key, 'url': url },
                                    'csvToEs', {})
                                .then(function(response) {
                                    Notification.success('Loaded to elastic search')
                                    console.log(response);
                                }, function(error) {
                                    console.log(error);
                                })
                        }
                    })
                    .on('httpUploadProgress', function(progress) {
                        // Log Progress Information
                        console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
                    });
            } else {
                // No File Selected
                Notification.warning("No file selected");
            }
        }






        $scope.clear = function() {
            $scope.dt = null;
        };

        var today = new Date();

        $scope.startDateOptions = {
            formatYear: 'yy',
            maxDate: today.setDate(today.getDate() - 1),
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
            var dt1Key = UtilityService.keyGen($scope.dt1);
            var dt2Key = UtilityService.keyGen($scope.dt2);
            getEsData(dt1Key, dt2Key);
        }



        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.popup1 = {
            opened: false
        };
        $scope.popup2 = {
            opened: false
        }




    });
