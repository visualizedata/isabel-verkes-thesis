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
let counter2 = -1; // for scroll

// to ensure tooltop divs and hovered-over elements are
// on the front
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

function render(){

    if (oldWidth === innerWidth) return;
    oldWidth = innerWidth;

    const margin = { top: 10, right: 70, bottom: 30, left: 70 };
    // let width = d3.select('#graph').node().offsetWidth ;
    // let height = d3.select('#graph').node().offsetHeight + 300;
    let width = 500
    let height = 300;

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
        .paddingInner(0.09);
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
    tooltip.append("div")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);
    tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px");

    // Graph 1 : Functions and a reset
    const resetGraphs = function() {
        svg.style("opacity", 0);
    };


    // Graph 1 : Draw first bar chart
    const drawbars = function() {


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
                let xPosition = d3.mouse(this)[0] - 5;
                let yPosition = d3.mouse(this)[1] - 5;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text((Math.floor((d[1] - d[0]) * 100) / 100).toFixed(1) + "%");
            });

        // Axis
        groups.append("g") // x-axis
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .attr("font-weight", "lighter")
            .attr("font-family", "Source Sans Pro, sans-serif")
            .style("opacity", 0.5)
            .call(d3.axisBottom(x_scale_graph1).tickFormat((d) => d+2005));

        groups.append("g") // y-axis
            .attr("class", "axis")
            .attr("font-family", "Source Sans Pro, sans-serif")
            .style("opacity", 0.5)
            .style("font-weight","lighter")
            .call(d3.axisLeft(y_scale_graph1).ticks(5).tickFormat(d => d + "%"))
            .append("text")
            .attr("x", 2)
            .attr("y", y_scale_graph1(y_scale_graph1.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#696969")
            .attr("font-weight", "lighter")
            .attr("font-family", "Source Sans Pro, sans-serif")
            .attr("text-anchor", "center")
            .attr("transform","rotate(-90),translate(-9, -55)")
            .style("color", "#696969")
            .text("Market share of Mutual Funds and ETFs");

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
            .attr("width", 150)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 3)
            .attr("dy", "1.2em")
            .style("text-anchor", "start")
            .attr("font-size", "12px");


        const line = d3.line()
            .x((d,i) => x_scaleLine( i ) )
            .y((d) => y_scaleLine( d['IndexmutualFundExpenseRatios']))
            .curve(d3.curveMonotoneX);
        groups.append("path")
            .attr("class", "line") // class for styling
            .attr("d", line(dataGraph1)) // calls the line generator
            .on("mouseover", function() { tooltip
                .style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 5;
                var yPosition = d3.mouse(this)[1] - 5;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")")
                tooltip.select("text")
                    .text("Costs of passive investing");
            });

        const line2 = d3.line()
            .x((d,i) => x_scaleLine( i ) )
            .y((d) => y_scaleLine( d['activeMutualFexpense']))
            .curve(d3.curveMonotoneX);
        groups.append("path")
            .attr("class", "line2") // class for styling
            .attr("d", line2(dataGraph1)) // calls the line generator
            .on("mouseover", function() { tooltip
                .style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 5;
                var yPosition = d3.mouse(this)[1] - 5;
                tooltip
                    .attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text( "Costs of active investing");
            });

        // add axis for lines
        groups.append("g") // y-axis
            .attr("class", "axis")
            .attr("transform","translate(" + (width) + ")")
            .style("opacity", 0.6)
            .style("font-weight","lighter")
            .call(d3.axisRight(y_scaleLine).ticks(5).tickFormat(d => d))
            .append("text")
            // .attr("x", 2)
            // .attr("y", y_scaleLine(y_scaleLine.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#696969")
            .style("font-weight","lighter")
            .attr("font-family", "Source Sans Pro', sans-serif")
            .style("color", "#696969")
            .attr("transform","rotate(-90), translate(-168,35)")
            .text("Costs of investing (as Expense Ratio)");


    }; // end draw line function

    // Apply to graph scroll, calling all graph functions
    let gs = d3.graphScroll()
        .container(d3.select('.container-1'))
        .graph(d3.selectAll('container-1 #graph'))
        .eventId('uniqueId1')  // namespace for scroll and resize events
        .sections(d3.selectAll('.container-1 #sections > div'))
        .offset(innerWidth < 900 ? innerHeight - 30 : 100)
        .on('active', function(i){
            if (i === 0) {
               return resetGraphs()
            }
            else if (i === 1)
            {    svg.transition().duration(1000);
                svg.style('opacity', '1');
                return drawbars();
            }

            else if (i === 2)
            {
                svg.transition().duration(1000);
                return drawLine()
            }
            //else if (i === 3) {}

            // .transition()
            // .style('fill', colors[i])
        });


///////////////////////////
// Graph 2 : Prepare SVG//

const margin2 = { top: 80, right: 70, bottom: 10, left: 70 };
let width2 = d3.select('#graph2').node().offsetWidth ;
let height2 = d3.select('#graph2').node().offsetHeight + 400;
    //let width = d3.select('#graph').node().offsetWidth - 40;
    //let height = 300;

let svgTwo = d3.select('.container-2  #graph2').html('')
    .append('svg')
    .attr("width",() => { return width2 + margin2.left + margin2.right})
    .attr("height",() => { return height2 + margin2.top + margin2.bottom})

// Graph 2; votes
    const getPropTypes= function() {
       if (counter2 > 0) {
           d3.selectAll(".waffle1")
               .style("opacity", 0);
           d3.selectAll("#img_propTypes_detail")
               .style("opacity", 0);
       }
        svgTwo.append("svg:image")
            .attr("id", "img_propTypes")
            .attr('x', 0)
            .attr('y', 3)
            .attr('width', "80%")
            .attr('height', "80%")
            .style("opacity", 0)
            .transition()
            .delay(900)
            .duration(900)
            .style("opacity", 1)
            .attr("xlink:href", "Data/img/legend2.svg");
    };

// Graph 2; votes
    const getPropTypes_detail= function() {
        if (counter2 >= 0) {
            svgTwo
                .selectAll("*")
                .remove()
        }
        svgTwo.append("svg:image")
            .attr("id", "img_propTypes_detail")
            .attr('x', 0)
            .attr('y', 3)
            .attr('width', "80%")
            .attr('height', "80%")
            .transition()
            .delay(90)
            .duration(900)
            .style("opacity", 1)
            .attr("xlink:href", "Data/img/legend2_detail.svg");
    };

// Graph 2 ; waffle graph


    let waffle1_data, waffle1_companies;
    let numCols;
    let rects;

    d3.csv('Data/Vanguard_ENV_focus2.csv')
        .then(function(data) {
            waffle1_data = data;
            waffle1_companies = d3.map( data, function(d){return d.issuer_company } ).keys();
            waffle1_companies = waffle1_companies.reverse();
        })
        .catch(function(error){
            console.log('data load error')
    }); // end of data function


// First waffle function

    let getStrokeText = (company) => {
        let againstManFill;
        let proposals = [];
        let countvotedAgainstM = 0;
        let countvotedForM = 0;
        waffle1_data.forEach((datarow) => {
            if (datarow.issuer_company === company) {
                let voted = datarow.against_mgmt;
                let voteToDisplay;
                if (voted === "AGAINST MGMT") {
                    countvotedAgainstM += 1;
                    voteToDisplay = "voted <span style='font-weight: bolder; border-bottom: 3px solid darkorange;'>FOR</span> in " + datarow.year;
                } else {
                    //countvotedForM+=1;
                    voteToDisplay = "Vanguard voted against in " + datarow.year;}
                let sentence = datarow.proposal.toLowerCase();
                let upper = sentence.charAt(0).toUpperCase() + sentence.substring(1);
                proposals.push(upper + "  -  " + voteToDisplay);
            }
        });
        let countVotes = (countvotedAgainstM/proposals.length)*100;
        if (countVotes=== 0) {againstManFill = "#535b5b" }
        else if ((countVotes > 0 ) && (countVotes < 30)) { againstManFill ="#aebd96" }
        else if ((countVotes > 5)) { againstManFill =  "#48a834" }
        return [againstManFill, proposals];
    }; // end of get stroke


    let waffle = function(nrCompanies, propData) {

        if (counter2 <= 1) // removing previous graph}
        {
            svgTwo
                .selectAll("*")
                .remove()
        }

        numCols = 8;

        let groups2 = svgTwo.selectAll("g")
            .data(propData)
            .enter()
            .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

       rects = groups2.selectAll("rect")
            .data( nrCompanies )
            .enter()
            .append("rect")
            .attr("height",40)
            .attr("width",40)
            .attr('class', "waffle1")
            .attr("x", function (d, i) {
                let colIndex = (i) % 7;
                return colIndex * 50 ;
            })
            .attr("y", function (d, i) {
                let rowIndex = Math.floor(i / 7);
                return rowIndex * 50;
            })
            .style("fill", (d) => {
                return getStrokeText(d)[0]
            })
            .style("stroke", "#E1652A")
            .style("stroke-width", "1.7px");

        // Graph 2: Prep the tooltip bits, and header
        let titlegraph2 =  svgTwo.append("text")
            .attr('class', "waffle1")
            .attr("x", 67)
            .attr("y", 20)
            .text("How Vanguard voted on environmental issues")
            .style("font-family", "'Arvo', serif");
        let subtitlegraph2 =  svgTwo.append("text")
            .attr('class', "waffle1")
            .attr("x", 67)
            .attr("dy", "3.1em")
            .text("Covering shareholder proposals demanding environmental")
            .attr("fill", "#6a7272")
            .attr("font-size", ".8em");
        let subtitle__2graph2 =  svgTwo.append("text")
            .attr('class', "waffle1")
            .attr("x", 67)
            .attr("dy","4.2em")
            .text("action within the S&P500 over the period between 2014-2018")
            .attr("fill", "#6a7272")
            .attr("font-size", ".8em");
        // let legendTitle_graph2 =  svgTwo.append("text")
        //     .attr('class', "waffle1")
        //     .attr("x", width- 260)
        //     .attr("dy", height - 100)
        //     .text("How to read:")
        //     .attr("fill", "#6a7272")
        //     .attr("font-size", ".8em");
        let legend_graph2 = svgTwo.append("svg:image")
            .attr("class", "waffle1")
            .attr("x", 380)
            .attr("y", 76)
            .attr('width', "55%")
            .attr('height', "55%")
            .attr("xlink:href", "Data/img/legend2_waffle_4.svg");


        let tooltip2 = svgTwo.append("g")
            .attr("class", "tooltip-graphEnviron")
            .style("display", "none");
        tooltip2.append("rect")
            .attr("width", 180 )
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);
        tooltip2.append("text")
            .attr("x", 5)
            .attr("dy", "1.2em")
            .style("text-anchor", "center")
            .style("font-family", "Roboto")
            .attr("font-size", "12px");

            rects.on("mouseenter", function () {
                tooltip2.style("display", null);
            })
            .on("mouseout", function () {
                tooltip2.style("display", "none");
            })
            .on("mousemove", function (d) {
                let xPosition = d3.mouse(this)[0] + 6;
                let yPosition = d3.mouse(this)[1] + 30;
                tooltip2.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip2.select("text").text(d)
                tooltip2.attr("class", "tooltipEnvironGraph");
                d3.select("tooltip2").moveToFront();
            }); // end mousemove

};// end of waffle function

    // const waffle2 = function(nrCompanies){
    //
    //     let groups2 =  svg2.append( 'g' )
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //
    //     groups2.selectAll("rect")
    //         .data(nrCompanies)
    //         .enter()
    //         .append("rect")
    //         .attr('class', "waffle2")
    //         .attr("width", 30)
    //         .attr("height", 30)
    //         .attr("x", function(d, i){
    //             var colIndex = (438 + i) % numCols;
    //             return colIndex * 18
    //         })
    //         .attr("y", function(d, i){
    //             var rowIndex = Math.floor((438 + i) /numCols );
    //             return rowIndex * 18
    //         })
    //         .attr("r", 6)
    //         .style("fill", "#ec7d26")
    //         .style("stroke", "none");
    //
    //     groups2.selectAll(".waffle3")
    //         .remove();
    // };

    // const waffle3 = function(){
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
    //         .attr("width", 30)
    //         .attr("height", 30)
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

    let getPropgraph = function(){
         d3.selectAll("rect").on("click", function (d){
                let proparray = getStrokeText(d)[1];
                proparray = proparray.map((prop)=>{
                    // prop = prop.replace(/^,\s*/, "");
                    return "•   " + prop + "<br>"});
                d3.select("#Environ_proptexts_para")
                    .classed("Environ_proptexts_ACTIVE", true)
                    .html( "At <span style='font-weight: bolder; color: #ec5900'> "+ d + "</span>, shareholder activists demanded the company to: <br>" + proparray.join(""))
            });

    }; // end getPropgraph

    const getPolciies= function() {
        if (counter2 > 0) {
            d3.selectAll(".waffle1")
                .style("opacity", 0);
            d3.selectAll("#img_propTypes_detail")
                .style("opacity", 0);
        }
        svgTwo.append("svg:image")
            .attr("id", "img_propTypes")
            .attr('x', 0)
            .attr('y', 3)
            .attr('width', "80%")
            .attr('height', "80%")
            .style("opacity", 0)
            .transition()
            .delay(900)
            .duration(900)
            .style("opacity", 1)
            .attr("xlink:href", "Data/img/legend2.svg");
    };




    let gs2 = d3.graphScroll()
        .container(d3.select('.container-2'))
        .graph(d3.selectAll('.container-2 #graph2'))
        .eventId('uniqueId2')  // namespace for scroll and resize events
        .sections(d3.selectAll('.container-2 #sections2 > div'))
        .on('active', function(i){
            if (i == 0) {
               getPropTypes();
                counter2 = 0;
            }
            if (i === 1) {
                getPropTypes_detail()
                counter2 = 1;
            }
            if (i === 2)  {
                waffle(waffle1_companies, waffle1_data);
                d3.select("#Environ_proptexts_para")
                    .classed("Environ_proptexts_ACTIVE", false)
                    .html('What was on the ballot and how did Vanguard vote? Click on the companies to check the proposals. <span style=\"font-weight: bolder; font-size:xx-large; color: #ec5900\"> →\t</span>')

                counter2 = 2;
            }
            if (i === 3)  {
                getPropgraph();
                counter2 = 3;

            }
        });

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

} //end of render function

render();
d3.select(window).on('resize', render);



