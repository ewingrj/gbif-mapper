(function () {
    'use strict';

    angular.module('map.query')
        .factory('queryService', queryService);

    queryService.$inject = ['$http', 'alerts'];

    function queryService($http, alerts) {

        var queryService = {
            queryJson: queryJson,
            countryCodes: countryCodes
        };

        return queryService;

        function queryJson(query, page, limit) {
            alerts.removeTmp();
            return $http({
                method: 'GET',
                url: "http://api.gbif.org/v1/occurrence/search?" + limit + "&page=" + page,
                params: query,
                keepJson: true
            })
                .then(queryJsonComplete);

            function queryJsonComplete(response) {
                var results = {
                    size: 0,
                    totalElements: 0,
                    data: []
                };

                if (response.data) {
                    results.size = response.data.limit;

                    results.totalElements = response.data.count;

                    if (results.totalElements === 0) {
                        alerts.info("No results found.")
                    }

                    results.data = response.data.content;
                }

                return results;
            }
        }

        function countryCodes() {
            return $http.get('query/CountryCodes.json');
        }
    }
})();
