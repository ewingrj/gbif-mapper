(function () {
    'use strict';

    angular.module('map.query')
        .factory('queryMap', queryMap);

    queryMap.$inject = ['Map'];

    function queryMap(Map) {

        function QueryMap(latColumn, lngColumn) {
            Map.call(this, latColumn, lngColumn);
        }

        QueryMap.prototype = Object.create(Map.prototype);

        QueryMap.prototype.setMarkers = function (data) {
            Map.prototype.setMarkers.call(this, data, generatePopupContent);
        };

        return new QueryMap('decimalLatitude', 'decimalLongitude');

        function generatePopupContent(resource) {
            return "<strong>Genus</strong>:  " + resource.genus + "<br>" +
                "<strong>Species</strong>:  " + resource.species + "<br>" +
                "<strong>Locality, Country</strong>:  " + resource.locality + ", " + resource.country + "<br>" +
                "<a href='http://www.gbif.org/occurrence/" + resource.key + "' target='_blank'>Occurrence details</a>";
        }
    }
})();