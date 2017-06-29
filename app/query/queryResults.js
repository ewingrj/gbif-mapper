(function () {
    'use strict';

    angular.module('map.query')
        .factory('queryResults', queryResults);

    queryResults.$inject = [];

    function queryResults() {

        var queryResults = {
            size: 0,
            total: 0,
            data: [],
            isSet: false,
            update: update,
            append: append,
            clear: clear
        };

        return queryResults;

        function update(data) {
            angular.extend(queryResults, data);
            queryResults.isSet = true;
        }

        function append(data) {
            queryResults.size += data.size;
            queryResults.data.push(data.data);

            if (!queryResults.total) {
                queryResults.total = data.total;
            }
        }

        function clear() {
            queryResults.data = [];
            queryResults.isSet = false;
        }
    }
})();
