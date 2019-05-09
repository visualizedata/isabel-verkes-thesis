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

    let color = d3.scaleOrdinal( ["#7a7b7a","#454645"]);

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
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style( 'fill', function( d, i ){ return color( i ); });

    // Graph 1: Prep the tooltip bits, initial display is hidden
    const tooltip = svg.append("g")
        .attr("class", "tooltip")
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
    const drawbars = function() {
        svg.style('opacity', '0')
            .style('opacity', '1');

        // Bars
        groups.selectAll('rect')
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
                console.log('hallo')
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
        svg.append("rect").attr("class", 'legend').attr("x",100).attr("y",130).attr('width',10).attr('height',10).style("fill", "rgb(252, 141, 98)");
        svg.append("rect").attr("class", 'legend').attr("x",100).attr("y",160).attr('width',10).attr('height',10).style("fill", "#69b3a2");
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
            .attr("class", "tooltip")
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
                var xPosition = d3.mouse(this)[0] - 5;
                var yPosition = d3.mouse(this)[1] - 5;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text( d.activeMutualFexpense );
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
    var gs = d3.graphScroll()
        .container(d3.select('.container-1'))
        .graph(d3.selectAll('container-1 #graph'))
        .eventId('uniqueId1')  // namespace for scroll and resize events
        .sections(d3.selectAll('.container-1 #sections > div'))
        // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
        .on('active', function(i){
            if (i == 0) {
                resetGraphs();
            }
            else if (i == 1)
            { svg.style('opacity', '1')
                return drawbars();
            }
            else if (i == 2) {
                svg.transition().duration(1000);
                return drawLine()
            }
            // .transition()
            // .style('fill', colors[i])
        });



    // Graph 2 : waffle graph
    const svg2 = d3.select('.container-2 #graph2').html('')
        .append('svg')
        .attr("width",() => { return width + margin.left + margin.right})
        .attr("height",() => { return height + margin.top + margin.bottom});


    let numCols = 23;
    const waffle = function(nrCompanies){
        let numCols = 23;
        let groups2 =  svg2.append( 'g' )
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        groups2.selectAll(".rect")
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

    const waffle2 = function(nrCompanies){

        let groups2 =  svg2.append( 'g' )
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        groups2.selectAll(".rect")
            .data(nrCompanies)
            .enter()
            .append("rect")
            .attr('class', "waffle2")
            .attr("width", 12)
            .attr("height", 12)
            .attr("x", function(d, i){
                var colIndex = (438 + i) % numCols;
                return colIndex * 18
            })
            .attr("y", function(d, i){
                var rowIndex = Math.floor((438 + i) /numCols );
                return rowIndex * 18
            })
            .attr("r", 6)
            .style("fill", "#ec7d26")
            .style("stroke", "none");

        groups2.selectAll(".waffle3")
            .remove();
    };

    const waffle3 = function(){
        // if global var is active
        numCols = 8;
        const waffle1sq = d3.selectAll(".waffle1")
            .transition()
            .duration(500)
            .style('opacity', 0);

        const wafflesq2 = d3.selectAll('.waffle2')
            .attr("class", '.waffle3')
            .transition()
            .duration(500)
            .attr("width", 22)
            .attr("height", 22)
            .attr("x", function(d, i){
                var colIndex = i % numCols;
                return colIndex * 24
            })
            .attr("y", function(d, i){
                var rowIndex = Math.floor(i / numCols );
                return rowIndex * 24
            });

    };


    let gs2 = d3.graphScroll()
        .container(d3.select('.container-2'))
        .graph(d3.selectAll('.container-2 #graph2'))
        .eventId('uniqueId2')  // namespace for scroll and resize events
        .sections(d3.selectAll('.container-2 #sections2 > div'))
        .on('active', function(i){
            if (i == 0) {
                resetGraphs()
            }
            if (i == 1)
            {
                return waffle(d3.range(500))}
            if (i == 2)  {
                return waffle2(d3.range(62))
            }
            if (i == 3)  {
                return waffle3()
            }
        });

    d3.select('#source')
        .style({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})

}; //end of render function

render();
d3.select(window).on('resize', render);





const w = window.innerWidth * 0.3;
const h = 500;


const margin = {
    right: 10,
    left: 10,
    top: 10,
    bottom: 10
};

const width = w - margin.right - margin.left;
const height = h - margin.top - margin.bottom;

// const tooltip = d3.select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);



let numCols = Math.floor(Math.sqrt(500));

const svg = d3.select("#graph1")
    .append("svg")
    .attr("id", "chart")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

// build the first graph, appears before the slider was touched



// add a slider to communicate with each graph:
const sliderYears = d3.sliderBottom()
    .min([2014])
    .max([2018])
    .width(300)
    .ticks(5)
    .step(1)
    .tickFormat(d3.format('.0f'))
    .default(2018);

var gStep = d3
    .select('div#slider-step')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gStep.call(sliderYears);
//d3.select('p#value-step').text(sliderYears.value());
d3.select('#main-title').text("How did the largest asset managers vote in " + sliderYears.value() + "?");


////////////////////////////
// ###  Graph functions ###
////////////////////////////

let mastergraph = function(yearData) {

    // select companies only
    let companies = d3.map( yearData, function(d){return d.issuer_company } ).keys();

    let getShStroke = (company) => {
        let shaStroke = "#C2C2C2";
        let againstManFill = "None";

        yearData.forEach( ( datarow ) => {
            if (datarow.issuer_company === company) {
                let shaPropCount = +datarow.count_sharehold_propo;
                let againstMgmt = +datarow.count_against_mgmt;
                if ( shaPropCount > 0 )
                { shaStroke = "#f25c00"}
                if ( againstMgmt > 0)
                { againstManFill = "#FFD275" }
            }
        });
        return [shaStroke, againstManFill];
    }; // end of getShStroke



    svg.selectAll("rect")
        .data(companies )
        .enter()
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", function(d, i){
            let colIndex = i % numCols;
            return colIndex * 15
        })
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols);
            return  rowIndex * 15
        })
        .attr("r", 6)
        .attr("stroke", (d) => { return getShStroke(d)[0] })
        .attr("fill", (d) => { return getShStroke(d)[1] })

}; // end of Mastergraph1 function

// Update graph
let updateGraph = function(yearData) {

    // select companies only
    let companies = d3.map( yearData, function(d){return d.issuer_company } ).keys();

    let getShStroke = (company) => {
        let shaStroke = "#C2C2C2";
        let againstManFill = "None";

        yearData.forEach( ( datarow ) => {
            if (datarow.issuer_company === company) {
                let shaPropCount = +datarow.count_sharehold_propo;
                let againstMgmt = +datarow.count_against_mgmt;
                if ( shaPropCount > 0 )
                { shaStroke = "#f25c00"}
                if ( againstMgmt > 0)
                { againstManFill = "#FFD275" }
            }
        });
        return [shaStroke, againstManFill];
    }; // end of getShStroke


    let t = d3.transition()
        .duration(100);

    let rects = svg.selectAll("rect")
        .data(companies);

    // exit
    rects
        .exit()
        .remove();

    let blocks = rects
        .data(companies )
        .enter()
        .append("rect")
        .attr('class','blocks')
        .attr("height", 0)
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols);
            return  rowIndex * 15
        })
        .attr("x", function(d, i){
            let colIndex = i % numCols;
            return colIndex * 15
        })
        .attr('width', 12);


    blocks.merge(rects)
        .transition(t)
        .attr("x", function(d, i){
            let colIndex = i % numCols;
            return colIndex * 15
        })
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols);
            return  rowIndex * 15
        })
        .attr("width", 12)
        .attr("height", 12)
        .style("stroke", (d)=>{return getShStroke(d)[0]})
        .style('fill', (d)=>{return getShStroke(d)[1]})
};


///////////////////////////
// ###  Graph 1 - BR   ###
///////////////////////////

// load the data
let data = d3.csv('Data/Vanguard_proposals_all_years.csv')
    .then(function(data) {

        // convert years from strings to numbers
        data.forEach( function(d) { return d.year = +d.year });

        // get data from slider
        let getYearData = function( data, yearInputFromSlider) {
            return (data.filter( function(d) {return d.year === yearInputFromSlider }));
        };
        let startYearData = getYearData(data, 2018);

        // start with a graph
        mastergraph(startYearData);

        // tiggering the updateGraph function
        sliderYears.on( 'onchange', val => {
            let updatedData = getYearData(data, val);
            //console.log("updated data: " + updatedData[1].year); // ! does work
            updateGraph(updatedData);
            //d3.select('p#value-step').text(val);
            d3.select('#main-title').text("How did the largest asset managers vote in " + val + "?");
        });

    })
    .catch(function(error){
        console.log('data load error')
    });
/////////////
// ### Graph 2 - VANG ###
///////////////////////////

// load the data
let dataBR = d3.csv('Data/BrDataSP500_allyears.csv')
    .then(function(data) {

        // convert years from strings to numbers
        data.forEach( function(d) { return d.year = +d.year });

        // get data from slider
        let getYearData = function( data, yearInputFromSlider) {
            return (data.filter( function(d) {return d.year === yearInputFromSlider }));
        };
        let startYearData = getYearData(data, 2018);
        console.log(startYearData);
        //
        // start with a graph
        mastergraph(startYearData);

        // // tiggering the updateGraph function
        // sliderYears.on('onchange', val => {
        //     let updatedData = getYearData(data, val);
        //     //console.log("updated data: " + updatedData[1].year); // ! does work
        //     updateGraph(updatedData);
        //     //d3.select('p#value-step').text(val);
        //     d3.select('#main-title').text("How did the largest asset managers vote in " + val + "?");
        // });

    })
    .catch(function(error){
        console.log('data load error')
    });

// select only the data for the single year that is defined in the global scope or from the slider
// create dataset for graph that shows first before slider is triggered, based on first year


