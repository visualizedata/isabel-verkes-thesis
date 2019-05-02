const w = window.innerWidth * 0.3;
const h = 500;


const margin = {
    right: 40,
    left: 40,
    top: 40,
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



// add a slider:
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



let mastergraph = function(yearData) {
    console.log(yearData);

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
        sliderYears.on('onchange', val => {
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

    // select only the data for the single year that is defined in the global scope or from the slider

    // create dataset for graph that shows first before slider is triggered, based on first year









