(function () {
    'use strict';

    angular.module('map.query')
        .factory('queryParams', queryParams);

    queryParams.$inject = ['QueryBuilder'];

    function queryParams(QueryBuilder) {
        var defaultParams = {
            queryString: null,
            genus: null,
            locality: null,
            family: null,
            species: null,
            country: null,
            fromYear: null,
            toYear: null
        };

        var params = {
            build: buildQuery,
            clear: clear
        };

        activate();

        return params;

        function activate() {
            clear();
        }

        function buildQuery() {
            var builder = new QueryBuilder();

            if (params.queryString) {
                builder.add("q", params.queryString);
            }

            if (params.country) {
                builder.add("country", params.country);
            }

            if (params.genus) {
                builder.add("genusKey", params.genus);
            }

            if (params.locality) {
                builder.add("locality", params.locality);
            }

            if (params.family) {
                builder.add("familyKey", params.family);
            }

            if (params.species) {
                builder.add("speciesKey", params.species);
            }

            if (params.fromYear || params.toYear) {
                builder.add("year", params.fromYear + "," + params.toYear);
            }

            return builder.build();

        }

        function clear() {
            angular.extend(params, defaultParams);
        }
    }

})();