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


let numCols = Math.floor(Math.sqrt(500));

// set areas for graphs
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

// prepare tooltips
let tooltip = d3.select('#subtitle')
    .attr('class', 'tooltip')
    // .style('opacity', 0);



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

let thisYear = 2018;

let getYearData = function( data, yearInputFromSlider) {
    return (data.filter( function(d) {return d.year === yearInputFromSlider }));
};

// to move the SVG element to the front
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

let getCompanyClass = function(d) {return d.split('*').join('').split("!").join('').split('.').join('').split(',').join('').split('&').join('').split("'").join('').split(' ').join('_').toLowerCase()};


let mastergraph = function(yearData, graphNr) {
    // select companies only
    let companies = d3.map( yearData, function(d){return d.issuer_company } ).keys();
    //console.log(yearData[0]);
    let getShStroke = (company) => {

        let shaStroke = "#C2C2C2";
        let againstManFill = "#FFFFFF";

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

    let sqs = graphNr.selectAll("rect")
        .data(companies)
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
        .attr("stroke", (d) => { return getShStroke(d)[0] })
        .attr("fill", (d) => { return getShStroke(d)[1] })
        .attr("class",function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        });


        sqs.on('mouseover', function(d)  {
            let companyName = d;

            tooltip
                .transition()
                .duration(100)
                .style('opacity', 0.9);
            tooltip
                .html(() =>  {return "on proxy issues at " + "<span style='color:#FF6116'>" + companyName + "</span>" })
                .style("left", d + "px")
                .style("top", d + "px");

            if ( this !== d3.select('rect:last-child').node()) {
                    this.parentElement.appendChild(this)};
            //
            // let rect = d3.select(this)
            //     .attr("class", "selectedSq")
            //     .attr("transform", "translate(-2, -2)")
            //     .attr("height", 19)
            //     .attr("width", 19)
            //     .attr("stroke-width", 4);

            let companyClass = getCompanyClass(d)

            d3.selectAll('.c'+ companyClass + "__rect")
                .moveToFront()
                .classed('selectedSq',true);

        })
        .on( 'mouseout', function (d) {
            let companyClass = getCompanyClass(d)

            d3.selectAll('.c'+ companyClass + "__rect")
                .classed('selectedSq',false);

            //
            // let rects = d3.selectAll('rect')
            //     .classed("selectedSq", false)
            //     .attr('mouse','pointer')
            //     .attr("transform", "translate(0, 0)")
            //     .attr("height", 12)
            //     .attr("width", 12)
            //     .attr("stroke-width", 1);

            tooltip
                .html(() => {return "on proxy issues at S&P 500 companies" })
                .transition()
                .duration(100)
                .style('opacity', 0.9);
        });


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

    //d3.selectAll('rect').classed('selectedSq',false)
    let rects = graphNr.selectAll("rect")
        .classed('selectedSq',false)
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
        .attr('width', 10)
        .classed('selectedSq',false)
        .attr("removeClass",function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        });


    let sqs = blocks.merge(rects)
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
        .attr("class",function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
            });

        blocks.on('mouseover', function(d)  {
                let companyName = d;
                let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .moveToFront()
                .classed('selectedSq',true);

            tooltip
                .transition()
                .duration(100)
                .style('opacity', 0.9);
            tooltip
                .html(() =>  {return "on proxy issues at " + "<span style='color:#FF6116'>" + companyName + "</span>" })
                .style("left", d + "px")
                .style("top", d + "px");

        })
        .on( 'mouseout', function (d) {
            let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .classed('selectedSq',false);

            tooltip
                .html(() => {return "on proxy issues at S&P 500 companies" })
                .transition()
                .duration(100)
                .style('opacity', 0.9);
        });

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

        return dataStSt = data;

    })
    .catch(function(error){
        console.log('data load error')
    });


sliderYears.on("onchange", val => {
    d3.select('#main-title').text("How did the largest asset managers vote in " + val + "?");

    let BrDataUpdate = getYearData(dataBr, val);
    updateGraph( BrDataUpdate, graph1);

    let VangDataUpdate = getYearData(dataVang, val);
    updateGraph(VangDataUpdate , graph2);


    let StStDataUpdate = getYearData(dataStSt, val);
    updateGraph(StStDataUpdate, graph3);
    // this changes the global variable?

    //return thisYear = val;

});


//  selection for Environmental props
let getdataEnviron = function(year) {
    let VangDataForProp = getYearData(dataVang, year);
    let VangCompaniesEnvFilter = [];
    let BRDataForProp = getYearData(dataBr, year);
    let BrCompaniesEnvFilter = [];
    let StStDataForProp = getYearData(dataStSt, year);
    let StStCompaniesEnvFilter = [];

    VangDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if ( environProp  > 0 ) {
            let prop  = datarow.proposal;
            let propnr = datarow.prop_nr;
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;

            if ( environProp > 0 )
                { VangCompaniesEnvFilter.push( { comp:comp, propnr:propnr, prop:prop, voted:voted} ) }
        }
    });

    BRDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if ( environProp  > 0 ) {
            let prop  = datarow.proposal;
            let propnr = datarow.prop_nr;
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;
            if ( environProp > 0 )
            { BrCompaniesEnvFilter.push( { comp:comp, propnr:propnr, prop:prop, voted: voted } ) }
        }
    });

    StStDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if ( environProp  > 0 ) {
            let prop  = datarow.proposal;
            let propnr = datarow.prop_nr;
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;
            if ( environProp > 0 )
            { StStCompaniesEnvFilter.push( { comp:comp, propnr:propnr, prop:prop, voted: voted} ) }
        }
    });
    return [BrCompaniesEnvFilter, VangCompaniesEnvFilter, StStCompaniesEnvFilter];
};


d3.select("#environ_btn").on('click', function(d, i) {
    let environYearData = getdataEnviron(thisYear); // get data for each fund
    let BrEnviron = environYearData[0];
    let VangEnviron = environYearData[1];
    let StStEnviron = environYearData[2];
    console.log(VangEnviron);

    //d3.select("#propText").html(()=>)

});
