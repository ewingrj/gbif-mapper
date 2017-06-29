(function () {
    'use strict';

    angular.module('map.query')
        .controller('QueryFormController', QueryFormController);

    QueryFormController.$inject = ['GBIFMapperService', 'queryParams', 'queryService', 'queryMap', 'usSpinnerService', 'alerts'];

    function QueryFormController(GBIFMapperService, queryParams, queryService, queryMap, usSpinnerService, alerts) {
        var vm = this;
        var _currentLayer = undefined;

        // select lists
        vm.countryCodes = [];
        vm.spatialLayers = [];

        // view toggles
        vm.moreSearchOptions = false;
        vm.showMap = true;
        vm.spatialLayer = undefined;

        vm.params = queryParams;
        vm.map = queryMap;

        vm.queryJson = queryJson;

        activate();

        function activate() {
            getCountryCodes();
            getSpatialLayers();
        }

        function queryJson() {
            usSpinnerService.spin('query-spinner');

            if (vm.spatialLayer) {
                var l = omnivore.wkt.parse(vm.spatialLayer);
                vm.params.bounds = l.getBounds();

                if (_currentLayer && l.getBounds() !== _currentLayer.getBounds()) {
                    queryMap.removeLayer(_currentLayer);
                }

                queryMap.addLayer(l);
                _currentLayer = l;

            } else {
                vm.params.bounds = null;
            }

            GBIFMapperService.query(queryParams.build(), 0)
                .finally(queryJsonFinally);

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