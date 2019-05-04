const w = 400;
const h = 400;


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

const graph1 = d3.select("#graph1")
    .append("svg")
    .attr("id", "chart1")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

const graph2 = d3.select("#graph2")
    .append("svg")
    .attr("id", "chart2")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

const graph3 = d3.select("#graph3")
    .append("svg")
    .attr("id", "chart3")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(0" + margin.left + "," + margin.top + ")");

// build the first graph, appears before the slider was touched



// add a slider to communicate with each graph:
let sliderYears = d3.sliderBottom()
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



////////////////////////////
// ###  Graph functions ###
////////////////////////////

//Preparing dataformatter and 2 functions for graphs

let getYearData = function( data, yearInputFromSlider) {
    return (data.filter( function(d) {return d.year === yearInputFromSlider }));
};

let mastergraph = function(yearData, graphNr) {

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


    graphNr.selectAll("rect")
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

let updateGraph = function(yearData, graphNr) {

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
        .duration(1000);

    let rects = graphNr.selectAll("rect")
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
        .attr("height", 6)
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols);
            return  rowIndex * 15
        })
        .attr("x", function(d, i){
            let colIndex = i % numCols;
            return colIndex * 15
        })
        .attr('width', 10);


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
let dataBr;
d3.csv('Data/BrDataSP500_allyears.csv')
    .then(function(data) {

        // convert years from strings to numbers
        data.forEach( function(d) { return d.year = +d.year });

        // get data from slider
        let startYearData = getYearData(data, 2018);

        // start with a graph
        mastergraph(startYearData, graph1);
        return dataBr = data;
    })
    .catch(function(error){
        console.log('data load error')
    });



//////////////////////////
// ### Graph 2 - VANG ###
///////////////////////////

// load the data
let dataVang;
d3.csv('Data/Vanguard_proposals_all_years.csv')
    .then(function(data) {

        // convert years from strings to numbers
        data.forEach( function(d) { return d.year = +d.year });

        // start with a graph
        let startYearData = getYearData(data, 2018);
        mastergraph(startYearData, graph2);

        return dataVang = data;
    })
    .catch(function(error){
        console.log('data load error')
    });

//////////////////////////
// ### Graph 3 - StSt ###
///////////////////////////


// load the data
let dataStSt;
d3.csv('Data/StStDataSP500_allyears.csv')
    .then(function(data) {

        // convert years from strings to numbers
        data.forEach( function(d) { return d.year = +d.year });

        // start with a graph
        let startYearData = getYearData(data, 2018);
        mastergraph(startYearData, graph3);

        dataStSt = data;

        // let updatedDataStSt = getYearData(data, StStupdateYear );
        // console.log(updatedDataStSt)
        //console.log("updated data: " + updatedData[1].year); // ! does work

        //     //d3.select('p#value-step').text(val);
        //     //d3.select('#main-title').text("How did the largest asset managers vote in " + val + "?");
        // });

    })
    .catch(function(error){
        console.log('data load error')
    });


sliderYears.on("onchange", val => {
    d3.select('#main-title').text("How did the largest asset managers vote in " + val + "?");
    // let StStdata = getStStData(val);
    let BrDataUpdate = getYearData(dataBr, val);
    updateGraph( BrDataUpdate, graph1);

    let VangDataUpdate = getYearData(dataVang, val);
    updateGraph(VangDataUpdate , graph2);


    let StStDataUpdate = getYearData(dataStSt, val);
    updateGraph(StStDataUpdate, graph3);

});


