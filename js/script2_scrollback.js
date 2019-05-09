let oldWidth = 0;
const dataGraph1 = [
    {
        "Year": 2005,
        "Indexmutualfunds": 6.7,
        "IndexETFs": 3.3,
        "Totalindex": 10,
        "IndexmutualFundExpenseRatios": 0.21,
        "activeMutualFexpense": 0.91
    },
    {
        "Year": 2006,
        "Indexmutualfunds": 6.9,
        "IndexETFs": 3.9,
        "Totalindex": 10.8,
        "IndexmutualFundExpenseRatios": 0.19,
        "activeMutualFexpense": 0.88
    },
    {
        "Year": 2007,
        "Indexmutualfunds": 6.8,
        "IndexETFs": 4.8,
        "Totalindex": 11.6,
        "IndexmutualFundExpenseRatios": 0.17,
        "activeMutualFexpense": 0.86
    },
    {
        "Year": 2008,
        "Indexmutualfunds": 6.1,
        "IndexETFs": 5.2,
        "Totalindex": 11.3,
        "IndexmutualFundExpenseRatios": 0.18,
        "activeMutualFexpense": 0.83
    },
    {
        "Year": 2009,
        "Indexmutualfunds": 7,
        "IndexETFs": 6.5,
        "Totalindex": 13.6,
        "IndexmutualFundExpenseRatios": 0.17,
        "activeMutualFexpense": 0.87
    },
    {
        "Year": 2010,
        "Indexmutualfunds": 7.9,
        "IndexETFs": 7.7,
        "Totalindex": 15.6,
        "IndexmutualFundExpenseRatios": 0.15,
        "activeMutualFexpense": 0.83
    },
    {
        "Year": 2011,
        "Indexmutualfunds": 8.6,
        "IndexETFs": 8.2,
        "Totalindex": 16.9,
        "IndexmutualFundExpenseRatios": 0.14,
        "activeMutualFexpense": 0.79
    },
    {
        "Year": 2012,
        "Indexmutualfunds": 9.1,
        "IndexETFs": 9.2,
        "Totalindex": 18.3,
        "IndexmutualFundExpenseRatios": 0.13,
        "activeMutualFexpense": 0.77
    },
    {
        "Year": 2013,
        "Indexmutualfunds": 10.4,
        "IndexETFs": 9.9,
        "Totalindex": 20.3,
        "IndexmutualFundExpenseRatios": 0.12,
        "activeMutualFexpense": 0.74
    },
    {
        "Year": 2014,
        "Indexmutualfunds": 11.5,
        "IndexETFs": 11,
        "Totalindex": 22.5,
        "IndexmutualFundExpenseRatios": 0.11,
        "activeMutualFexpense": 0.7
    },
    {
        "Year": 2015,
        "Indexmutualfunds": 12.4,
        "IndexETFs": 11.7,
        "Totalindex": 24.1,
        "IndexmutualFundExpenseRatios": 0.1,
        "activeMutualFexpense": 0.67
    },
    {
        "Year": 2016,
        "Indexmutualfunds": 13.9,
        "IndexETFs": 13.2,
        "Totalindex": 27.1,
        "IndexmutualFundExpenseRatios": 0.09,
        "activeMutualFexpense": 0.63
    },
    {
        "Year": 2017,
        "Indexmutualfunds": 15.2,
        "IndexETFs": 15.1,
        "Totalindex": 30.3,
        "IndexmutualFundExpenseRatios": 0.08,
        "activeMutualFexpense": 0.59
    },
    {
        "Year": 2018,
        "Indexmutualfunds": 15.7,
        "IndexETFs": 15.7,
        "Totalindex": 31.4,
        "IndexmutualFundExpenseRatios": 0.08,
        "activeMutualFexpense": 0.55
    }
]

function render(){

    if (oldWidth === innerWidth) return;
    oldWidth = innerWidth;

    const margin = { top: 10, right: 50, bottom: 20, left: 50 };
    // let width = d3.select('#graph').node().offsetWidth ;
    // let height = d3.select('#graph').node().offsetHeight ;
    let width = d3.select('#graph').node().offsetWidth ;
    let height = 400;

    if (innerWidth <= 925){
        width = innerWidth;
        height = innerHeight*.7;
    }

    // Create SVG element
    let svg = d3.select('#graph').html('')
        .append('svg')
        .attr("width",() => { return width + margin.left + margin.right})
        .attr("height",() => { return height + margin.top + margin.bottom});

    let color = d3.scaleOrdinal( ["#b3b4b3","#d4d4d4"]);

    // @param: Graph 1: Stack Layout
    const stack =  d3.stack().keys([ 'Indexmutualfunds', 'IndexETFs' ]);
    const stack_data = stack(dataGraph1);

    // Graph 1: Scales
    let x_scale_graph1 =   d3.scaleBand()
        .domain(d3.range(dataGraph1.length))
        .range([0, width])
        .paddingInner(0.05);
    let y_scale_graph1  = d3.scaleLinear()
        .domain([
            0, d3.max( dataGraph1, function(d){
                return d['Indexmutualfunds'] + d['IndexETFs'];
            })
        ])
        .range([ height, 0 ]);

    // Graph 1: Groups
    let groups = svg.selectAll( 'g' )
        .data( stack_data )
        .enter()
        .append( 'g' )
        .attr("class", "bargraph1")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style( 'fill', function( d, i ){ return color( i ); });

    // Graph 1: Prep the tooltip bits, initial display is hidden
    const tooltip = svg.append("g")
        .attr("class", "tooltip-graphPassive")
        .style("display", "none");
    tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);
    tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px");

    // Graph 1: Functions and a reset
    const resetGraphs = function() {
        svg.style("opacity", "0");
    };

    // const getBogle_img = function() {
    //     d3.selectAll(".bargraph1")
    //         .style("opacity", 0);
    //     d3.selectAll(".legend")
    //         .style("opacity", 0);
    //     tooltip.style("display", "none");
    //     d3.select(".tooltip-graphPassive")
    //         .style("opacity", 0);
    //
    //     svg.append("svg:image")
    //         .style("opacity", 1)
    //         .attr('x', -50)
    //         .attr('y', 30)
    //         .attr("class", "bogle_img")
    //         .attr('width', 900)
    //         .attr('height', 250)
    //         .attr("xlink:href", "https://github.com/IsVer/mst/blob/master/Data/img/Asset%201.png?raw=truex")
    // };


    const drawbars = function() {
        d3.select(".bogle_img").remove();
        d3.selectAll(".bargraph1")
            .transition()
            .duration(100)
            .style("opacity", 1);

        // Bars
        let bars = groups.selectAll('rect')
            .data(function (d) {
                return d;
            })
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return x_scale_graph1(i);
            })
            .attr("y", function (d) {
                return y_scale_graph1(d[1]);
            })
            .attr("height", function (d) {
                return y_scale_graph1(d[0]) - y_scale_graph1(d[1]);
            })
            .attr("width", x_scale_graph1.bandwidth())
            .on("mouseenter", function () {
                tooltip.style("display", null);
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            })
            .on("mousemove", function (d) {
                var xPosition = d3.mouse(this)[0] - 5;
                var yPosition = d3.mouse(this)[1] - 5;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text((Math.floor((d[1] - d[0]) * 100) / 100).toFixed(1) + "%");
            });

        // Axis
        groups.append("g") // x-axis
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .attr("font-weight", "lighter")
            .attr("font-family", "Source Sans Pro, sans-serif")
            .call(d3.axisBottom(x_scale_graph1).tickFormat((d) => d+2005));

        groups.append("g") // y-axis
            .attr("class", "axis")
            .attr("font-family", "Source Sans Pro, sans-serif")
            .call(d3.axisLeft(y_scale_graph1).ticks(null, 's').tickFormat(d => d + "%"))
            .append("text")
            .attr("x", 2)
            .attr("y", y_scale_graph1(y_scale_graph1.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#696969")
            .attr("font-weight", "lighter")
            .attr("font-family", "Source Sans Pro, sans-serif")
            .attr("text-anchor", "center")
            .attr("transform","rotate(-90),translate(-4, -55)")
            .style("color", "#696969")
            .text("Market shares of index-based Mutual Funds and ETFs");

        // Handmade legend
        svg.append("rect").attr("class", 'legend').attr("x",100).attr("y",130).attr('width',10).attr('height',10).style("fill", "#d4d4d4");
        svg.append("rect").attr("class", 'legend').attr("x",100).attr("y",160).attr('width',10).attr('height',10).style("fill", "#b3b4b3");
        svg.append("text").attr("class", 'legend').attr("x", 113).attr("y", 135).text("ETFs").style("font-size", "11px").attr("alignment-baseline","middle");
        svg.append("text").attr("class", 'legend').attr("x", 113).attr("y", 166).text("Mutual Funds").style("font-size", "11px").attr("alignment-baseline","middle");


    }; // end bars function
    let drawLine = function() {

        // Line chart
        let y_scaleLine  = d3.scaleLinear()
            .domain([
                0, d3.max( dataGraph1, function(d){
                    return d['activeMutualFexpense'];
                })
            ])
            .range([ height, 0 ]);
        let x_scaleLine =   d3.scaleBand()
            .domain(d3.range(dataGraph1.length) )
            .range([0, width + margin.right - 10]);

        // Prep the tooltip bits, initial display is hidden
        const tooltip = svg.append("g")
            .attr("class", "tooltip-graphPassive")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 60)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 30)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px");


        const line = d3.line()
            .x((d,i) => x_scaleLine( i ) )
            .y((d) => y_scaleLine( d['IndexmutualFundExpenseRatios']))
            .curve(d3.curveMonotoneX);
        groups.append("path")
            .attr("class", "line") // class for styling
            .attr("d", line(dataGraph1)); // calls the line generator

        const line2 = d3.line()
            .x((d,i) => x_scaleLine( i ) )
            .y((d) => y_scaleLine( d['activeMutualFexpense']))
            .curve(d3.curveMonotoneX);
        groups.append("path")
            .attr("class", "line2") // class for styling
            .attr("d", line2(dataGraph1)) // calls the line generator
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 7;
                var yPosition = d3.mouse(this)[1] - 7;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                //tooltip.select("text").text( d.activeMutualFexpense );
            });

        // add axis for lines
        groups.append("g") // y-axis
            .attr("class", "axis")
            .attr("transform","translate(" + (width) + ")")
            .call(d3.axisRight(y_scaleLine).ticks(null, 's').tickFormat(d => d))
            .append("text")
            // .attr("x", 2)
            // .attr("y", y_scaleLine(y_scaleLine.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#696969")
            // .attr("font-weight", "bold")
            .attr("font-family", "Source Sans Pro', sans-serif")
            .style("color", "#696969")
            .attr("transform","rotate(-90), translate(-68,35)")
            .text("Expense Ratio");


    }; // end draw line function

    // Apply to graph scroll
    let gs = d3.graphScroll()
        .container(d3.select('.container-1'))
        .graph(d3.selectAll('container-1 #graph'))
        .eventId('uniqueId1')  // namespace for scroll and resize events
        .sections(d3.selectAll('.container-1 #sections > div'))
        .offset(innerWidth < 900 ? innerHeight - 30 : 200)
        .on('active', function(i){
            if (i === 0) {
                resetGraphs()
            }
            else if (i === 1)
            {   svg.transition().duration(1000);
                svg.style('opacity', '1');
                return drawbars();
            }

            else if (i === 2)
            {  svg.transition().duration(1000);
                return drawLine()
            }
            //else if (i === 3) {}

            // .transition()
            // .style('fill', colors[i])
        });


    // Graph 2 : waffle graph
    const svg2 = d3.select('.container-2 #graph2').html('')
        .append('svg')
        .attr("width",() => { return width + margin.left + margin.right})
        .attr("height",() => { return height + margin.top + margin.bottom});

    const translateGroup = svg2.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('id', 'translate-group');

    // Felix: Instead of appending groups on scroll I'm making buckets for the waffles
    // and use them as containers for the changes
    // to prevent appending new groups on every scroll event

    translateGroup.append('g')
        .attr('id', 'waffle1-group');

    translateGroup.append('g')
        .attr('id', 'waffle2-group');

    // Felix: With these two variables I access the groups in the functions

    const firstWaffleGroup = d3.select('#waffle1-group');
    const secondWaffleGroup = d3.select('#waffle2-group');


    let numCols = 23;
    const waffle = function(nrCompanies){
        let numCols = 23;

        firstWaffleGroup.selectAll(".rect")
            .data(nrCompanies)
            .enter()
            .append("rect")
            .attr('class', "waffle1")
            .attr("width", 12)
            .attr("height", 12)
            .attr("x", function(d, i){
                var colIndex = i % numCols;
                return colIndex * 18
            })
            .attr("y", function(d, i){
                var rowIndex = Math.floor(i/numCols);
                return rowIndex * 18
            })
            .attr("r", 6)
            .style("fill", "#c2c2c2")
            .style("stroke", "none");

    };

    // Felix: With the checked variable I try to identify, if the this scroll
    // event has been passed already, if so I can apply a different part
    // of the function (this is not 100% safe, when people reload the page beyond
    // this point it inverses the logic, have to think of a more failsafe version
    // you could force starting from the top on reload for example).

    // Felix: This currently just sets the opacity of the orange circles to zero,
    // but you can also give them the same attributes as befor to make them small again
    // and in the next step set the opacity to zero.
    // Happy coding!

    // let checked = false;
    // const waffle2 = function(nrCompanies){
    //
    //     if (checked == false) {
    //         checked = true;
    //         console.log("2", checked);
    //
    //         secondWaffleGroup.selectAll(".rect")
    //             .data(nrCompanies)
    //             .enter()
    //             .append("rect")
    //             .attr('class', "waffle2")
    //             .attr("width", 12)
    //             .attr("height", 12)
    //             .attr("x", function(d, i){
    //                 var colIndex = (438 + i) % numCols;
    //                 return colIndex * 18
    //             })
    //             .attr("y", function(d, i){
    //                 var rowIndex = Math.floor((438 + i) /numCols );
    //                 return rowIndex * 18
    //             })
    //             .attr("r", 6)
    //             .style("fill", "#ec7d26")
    //             .style("stroke", "none")
    //             .attr("opacity", 1);
    //     } else {
    //         checked = false;
    //         d3.select("#waffle2-group").selectAll("rect").attr("opacity", 0);
    //     }
    // };
    //
    // const waffle3 = function(){
    //     console.log("3");
    //     // if global var is active
    //     numCols = 8;
    //     const waffle1sq = d3.selectAll(".waffle1")
    //         .transition()
    //         .duration(500)
    //         .style('opacity', 0);
    //
    //     const wafflesq2 = d3.selectAll('.waffle2')
    //         .attr("class", '.waffle3')
    //         .transition()
    //         .duration(500)
    //         .attr("width", 22)
    //         .attr("height", 22)
    //         .attr("x", function(d, i){
    //             var colIndex = i % numCols;
    //             return colIndex * 24
    //         })
    //         .attr("y", function(d, i){
    //             var rowIndex = Math.floor(i / numCols );
    //             return rowIndex * 24
    //         });
    //
    // };
    //
    //
    // let gs2 = d3.graphScroll()
    //     .container(d3.select('.container-2'))
    //     .graph(d3.selectAll('.container-2 #graph2'))
    //     .eventId('uniqueId2')  // namespace for scroll and resize events
    //     .sections(d3.selectAll('.container-2 #sections2 > div'))
    //     .on('active', function(i){
    //         if (i == 0) {
    //             resetGraphs()
    //         }
    //         if (i == 1)
    //         {
    //             return waffle(d3.range(500))}
    //         if (i == 2)  {
    //             return waffle2(d3.range(62))
    //         }
    //         if (i == 3)  {
    //             return waffle3()
    //         }
    //     });
    //
    // d3.select('#source')
    //     .style({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})

}; //end of render function

render();
d3.select(window).on('resize', render);



