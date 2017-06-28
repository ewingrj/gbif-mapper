(function () {
    'use strict';

    angular.module('map.query')
        .controller('QueryFormController', QueryFormController);

    QueryFormController.$inject = ['queryParams', 'queryService', 'queryResults', 'queryMap', 'usSpinnerService', 'alerts'];

    function QueryFormController(queryParams, queryService, queryResults, queryMap, usSpinnerService, alerts) {

        var vm = this;

        // select lists
        vm.countryCodes = [];
        vm.spatialLayers = [];

        // view toggles
        vm.moreSearchOptions = false;
        vm.showMap = true;
        vm.spatialLayer = undefined;

        vm.params = queryParams;

        vm.queryJson = queryJson;

        activate();

        function activate() {
            getCountryCodes();
            getSpatialLayers();
        }

        function queryJson() {
            usSpinnerService.spin('query-spinner');

            queryService.queryJson(queryParams.build(), 0, 10000)
                .then(queryJsonSuccess)
                .catch(queryJsonFailed)
                .finally(queryJsonFinally);

            function queryJsonSuccess(data) {
                queryResults.update(data);
                queryMap.setMarkers(queryResults.data);

                if (vm.spatialLayer) {
                    queryMap.zoomToLayer(omnivore.wkt.parse(vm.spatialLayer));
                }
            }

            function queryJsonFailed(response) {
                alerts.error('Failed to load query results');
                console.log('query-error:', response);
                vm.queryResults.isSet = false;
            }

            function queryJsonFinally() {
                usSpinnerService.stop('query-spinner');
            }
        }

        function getCountryCodes() {
            queryService.countryCodes()
                .then(function (codes) {
                    vm.countryCodes = codes;
                }, function () {
                    alerts.error('error fetching countryCodes');
                });
        }

        function getSpatialLayers() {
            queryService.spatialLayers()
                .then(function (response) {
                    vm.spatialLayers = response.data;
                }, function () {
                    alerts.error('error fetching spatial layers');
                });
        }
    }

})();