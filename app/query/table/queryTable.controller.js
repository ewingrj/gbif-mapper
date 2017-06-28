(function () {
    'use strict';

    angular.module('map.query')
        .controller('QueryTableController', QueryTableController);

    QueryTableController.$inject = ['$scope', '$window', 'queryResults'];

    function QueryTableController($scope, $window, queryResults) {
        var vm = this;
        vm.queryResults = queryResults;

        // vm.tableColumns = ["principalInvestigator", "materialSampleID", "locality", "decimalLatitude", "decimalLongitude", "genus", "species", "bcid"];
        vm.tableColumns = [];
        vm.tableData = [];
        vm.currentPage = 1;
        vm.pageSize = 50;
        vm.updatePage = updatePage;
        vm.toGBIF = toGBIF;

        function updatePage() {
            var start = (vm.currentPage - 1) * vm.pageSize;
            var end = start + vm.pageSize;

            var data = vm.queryResults.data.slice(start, end);

            prepareTableData(data);
        }

        function toGBIF(resource) {
            var keyIndex = vm.tableColumns.indexOf("key");
            $window.open("http://www.gbif.org/occurrence/" + resource[keyIndex]);
        }

        /*
         transform the data into an array so we can use sly-repeat to display it. sly-repeat bypasses the $watches
         greatly improving the performance of sizable tables
         */
        function prepareTableData(data) {
            vm.tableData = [];
            if (data[0]) {
                vm.tableColumns = Object.keys(data[0]).filter(function(key) {
                    return key.indexOf('Key') === -1;
                });
            }

            if (data.length > 0) {

                angular.forEach(data, function (resource) {
                    var resourceData = [];
                    angular.forEach(vm.tableColumns, function (key) {
                        var text = resource[key];
                        if (angular.isArray(text)) {
                            text = text.join(" | ");
                        } else if (angular.isObject(text)) {
                            text = (angular.equals({}, text)) ? '' : JSON.stringify(text);
                        }
                        resourceData.push((text) ? text.toString() : '');
                    });
                    vm.tableData.push(resourceData);
                });

            }
        }

        $scope.$watch('queryTableVm.queryResults.data', function () {
            vm.currentPage = 1;
            updatePage();
        });
    }

})();