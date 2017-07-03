'use strict';

//* App Module 

angular.module('app', [])
    .controller('appController', function() {
        /* Set up*/
        let vehicleCountHeaders = ['PedalCycles', 'Motorcycles', 'CarsTaxis', 'BusesCoaches', 'LightGoodsVehicles', 'V2AxleRigidHGV', 'V3AxleRigidHGV', 'V4or5AxleRigidHGV', 'V3or4AxleArticHGV', 'V5AxleArticHGV', 'V6orMoreAxleArticHGV', 'AllHGVs', 'AllMotorVehicles']
        let numericColHeaders = ['AADFYear', 'CP', 'Easting', 'Northing', 'LinkLength_km', 'LinkLength_miles'].concat(vehicleCountHeaders);

        var width = 100, // % of the parent element
            height = 100,
            x = d3.scaleLinear().domain([0, width]).range([0, width]),
            y = d3.scaleLinear().domain([0, width]).range([0, height]),
            node,
            root,
            imgUrl = "",
            blue = d3.hsl(216, 0.92, 0.68),
            color = d3.scaleOrdinal()
            .range([
                    d3.rgb(blue).brighter([0.25]),
                    d3.rgb(blue),
                    d3.rgb(blue).darker([0.25])
                ]
                .map(function(c) {
                    c = d3.rgb(c);
                    return c;
                })),
            treemap = d3.treemap()
            .size([width, height])
            .paddingInner(0)
            .round(true);
        /* Data */
        d3.csv("traffic_data.csv", function(d) {
            Array.from(numericColHeaders).forEach(function(header) {
                d[header] = parseInt(d[header]);
            });
            return d;
        }, function(error, data) {
            if (error) throw error;
            const years = _.chain(data).pluck('AADFYear').unique().value();
            let year_data = data.map(row => {
                const {
                    AADFYear,
                    CP,
                    Easting,
                    Northing,
                    StartJunction,
                    EndJunction,
                    LinkLength_km,
                    LinkLength_miles
                } = row;
                return years.map(year => ({
                    AADFYear,
                    CP,
                    data_type: 'Year-CP',
                    id: `${AADFYear}_${CP}`,
                    parent_id: 'root'
                }));
            }).reduce((prev, next) => prev.concat(next), []);
            year_data = _.uniq(year_data, 'id');
            let vehicle_data = data.map(row => {
                const {
                    AADFYear,
                    CP,
                    Easting,
                    Northing,
                    StartJunction,
                    EndJunction,
                    LinkLength_km,
                    LinkLength_miles
                } = row
                return vehicleCountHeaders.map(header => ({
                    AADFYear,
                    CP,
                    Easting,
                    Northing,
                    StartJunction,
                    EndJunction,
                    LinkLength_km,
                    LinkLength_miles,
                    id: `${header}_${CP}`,
                    parent_id: `${AADFYear}_${CP}`,
                    value: row[header]
                }));
            }).reduce((prev, next) => prev.concat(next), []);
            let all_data = [{ id: 'root' }].concat(year_data).concat(vehicle_data);
            var root = d3.stratify()
                .id(function(d) {
                    return d.id;
                })
                .parentId(function(d) {
                    return d.parent_id;
                })
                (all_data)
                .sum(function(d) {
                    return d.value;
                })
                .sort(function(a, b) {
                    return b.height - a.height || b.value - a.value;
                });
            treemap(root)
            var chart = d3.select("#chart");
            var cell = chart
                .selectAll(".node")
                .data(root.descendants())
                .enter().append("div")
                .attr("class", function(d) {
                    return "node level-" + d.depth; })
                .attr("title", function(d) {
                    return d.data.name ? d.data.name : "null"; })
                .style("left", function(d) {
                    return x(d.x0) + "%"; })
                .style("top", function(d) {
                    return y(d.y0) + "%"; })
                .style("width", function(d) {
                    return x(d.x1 - d.x0) + "%"; })
                .style("height", function(d) {
                    return y(d.y1 - d.y0) + "%"; })
                //.style("background-image", function(d) { return d.value ? imgUrl + d.value : ""; })
                .style("background-color", function(d) {
                    while (d.depth > 1) d = d.parent;
                    return color(d.data.name); })
                .on("mousedown touchstart", function(d) {
                    zoom(d);
                    //zoom(node == d.parent ? root : d.parent);
                    //zoom(d.children !== null ? d : root);
                })
                .append("p")
                .attr("class", "label")
                .text(function(d) {
                    return d.data.name ? d.data.name : "null"; });

            function zoom(d) { // http://jsfiddle.net/ramnathv/amszcymq/

                console.log('clicked: ' + d.data.name + ', depth: ' + d.depth);
                console.log('cell x0: ' + d.x0 + ', y0: ' + d.y0 + ', x1: ' + d.x1 + ', y1: ' + d.y1);

                x.domain([d.x0, d.x1]);
                y.domain([d.y0, d.y1]);

                var t = d3.transition()
                    .duration(800)
                    .ease(d3.easeCubicOut);

                chart
                    .merge(cell)
                    .transition(t)
                    .style("left", function(d) {
                        return x(d.x0) + "%"; })
                    .style("top", function(d) {
                        return y(d.y0) + "%"; })
                    .style("width", function(d) {
                        return x(d.x1 - d.x0) + "%"; })
                    .style("height", function(d) {
                        return y(d.y1 - d.y0) + "%"; });
                //node = d;
                //d3.event.stopPropagation();
            }
        });
    });
/* Create Tree */
/* Draw Tree */
/* Draw other pages */
