angular.module('sbAdminApp')
    .factory('UtilityService', function(moment) {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

        return {
            pluck: function(arr, key) {
                var newArr = [];
                for (var i = 0, x = arr.length; i < x; i++) {
                    if (arr[i].hasOwnProperty(key)) {
                        newArr.push(arr[i][key])
                    }
                }
                return newArr;
            },
            keyGen: function(date) {
                return (new Date(date - tzoffset)).toISOString().slice(0, -1)
            },
            getDates: function (startDate, stopDate) {
                var dateArray = [];
                var currentDate = moment(startDate);
                while (currentDate <= stopDate) {
                    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
                    currentDate = moment(currentDate).add(1, 'days');
                }
                if (dateArray.length === 0){
                    return [moment(startDate).format('YYYY-MM-DD'), moment(stopDate).format('YYYY-MM-DD')];
                }
                return dateArray;
            }

        }
    });
