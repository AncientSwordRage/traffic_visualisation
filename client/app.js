'use strict';

//* App Module 

angular.module('app', [])
    .controller('appController', function() {
        /* Set up*/
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var format = d3.format(",d");

        var treemap = d3.treemap()
            .size([width, height])
            .round(true)
            .padding(1);

        /* Data */

        /* Create Tree */
        /* Draw Tree */
        /* Draw other pages */
    });
