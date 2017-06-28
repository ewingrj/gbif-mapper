(function () {
    'use strict';

    angular.module('map.query')
        .factory('QueryBuilder', QueryBuilder);

    QueryBuilder.$inject = [];

    function QueryBuilder() {

        function QueryBuilder() {
            this.source = [];
            this.queryString = "";
        }

        QueryBuilder.prototype = {

            add: function (key, val) {
                if (!this._isEmpty()) {
                    this.queryString += "&";
                }

                this.queryString += key + "=" + val;
            },

            build: function () {
                if (this._isEmpty()) {
                    this.queryString = "q=*";
                }
                return new Query(this.queryString);
            },

            _isEmpty: function() {
                return this.queryString.trim().length === 0;
            }
        };

        return QueryBuilder;

        function Query(queryString) {
            this.queryString = queryString;
        }
    }

})();