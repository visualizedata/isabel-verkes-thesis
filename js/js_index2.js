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

const graph2 = d3.select("#graph2_1")
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
    .attr('class', 'tooltip');
let switchEnviron = "master";


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
        let againstManFill = "#ffffff";
        let environPropText = [];

        yearData.forEach( ( datarow ) => {
            if (datarow.issuer_company === company) {
                let shaPropCount = +datarow.count_sharehold_propo;
                let againstMgmt = +datarow.count_against_mgmt;
                let environProp = +datarow.environ_prop;
                let prop = datarow.proposal;

                if ( shaPropCount > 0 )
                { shaStroke = "#E1652A"}
                if ( againstMgmt > 0)
                { againstManFill = "#FFD275" }
                if (environProp > 0) {
                    environPropText.push(prop);
                }
            }
        });

        return [shaStroke, againstManFill, environPropText];
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
                    this.parentElement.appendChild(this) }

            let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .moveToFront()
                .classed('selectedSq',true);


        }) // end of mouseover
        .on( 'mouseout', function (d) {
            let companyClass = getCompanyClass(d);

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

// _updateGraph
let updateGraph = function(yearData, graphNr) {

    // select companies only
    let companies = d3.map( yearData, function(d){ return d.issuer_company } ).keys();

    //reset heading
    tooltip.html("on proxy issues at S&P 500 companies");


    let getShStroke = (company) => {

        let shaStroke = "#C2C2C2";
        let againstManFill = "#ffffff";

        yearData.forEach( ( datarow ) => {
            if (datarow.issuer_company === company) {
                let shaPropCount = +datarow.count_sharehold_propo;
                let againstMgmt = +datarow.count_against_mgmt;
                if ( shaPropCount > 0 )
                { shaStroke = "#E1652A"}
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
        .style("fill", "#ffffff")
        .classed('selectedSq',false)
        .classed(function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        }, false);


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

        d3.selectAll("rect").on('mouseover', function(d)  {
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
                .html(() =>  {
                    return "on proxy issues at " + "<span style='color:#FF6116'>" + companyName + "</span>" })
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

    d3.selectAll("#environ_btn")
        .html("environmental"); // TODO fix this
};

let updateGrap_Environ = function(yearData, graphNr) {


    d3.select(".tooltip").html("on <span style='border-bottom:  3px solid darkorange;'> environmental</span> proxy issues")


    let fund;
    if (graphNr === graph1) {
        fund = "BlackRock";
    } else if (graphNr === graph2) {
        fund = "Vanguard"
    } else (fund = "StateStreet")

    // select unique companies only
    let companies = d3.map( yearData, function(d){ return d.comp} ).keys();


    let getStrokeText = (company) => {

        let againstManFill;
        let proposals = [];
        let countvotedAgainstM = 0;


        yearData.forEach((datarow) => {
            if (datarow.comp === company) {
                let voted = datarow.voted;
                let voteToDisplay;
                if (voted === "AGAINST MGMT") {
                    countvotedAgainstM += 1;
                    voteToDisplay = "voted <span style='font-weight: bolder; border-bottom: 3px solid darkorange;'>FOR</span> in " + datarow.year;

                } else {
                    voteToDisplay = fund + "voted against in " + datarow.year;}
                let sentence = datarow.prop.toLowerCase();
                let upper = sentence.charAt(0).toUpperCase() + sentence.substring(1);
                proposals.push(upper + "  -  " + voteToDisplay);
            }
        });
        let countVotes = (countvotedAgainstM/proposals.length)*100;
        if (countVotes=== 0) {againstManFill = "#535b5b" }
        else if ((countVotes > 0 ) && (countVotes < 30)) { againstManFill ="#aebd96" }
        else if ((countVotes > 5)) { againstManFill =  "#48a834" }
        // console.log(proposals);
        return [againstManFill, proposals];
    }; // end of get stroke

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

    let numCols2 = 7;
    let blocks = rects
        .data(companies)
        .enter()
        .append("rect")
        .attr('class','blocks')
        .attr("height", 6)
        .style("stroke", "#ec5900")
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols2);
            return  rowIndex * 25
        })
        .attr("x", function(d, i){
            let colIndex = i % numCols2;
            return colIndex * 25
        })
        .attr('width', 10)
        .style("fill", "#ffffff")
        .classed('selectedSq',false)
        .classed(function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        }, false);


    blocks.merge(rects)
        .transition(t)
        .attr("x", function(d, i){
            let colIndex = i % numCols2;
            return colIndex * 25
        })
        .attr("y", function(d, i){
            let rowIndex = Math.floor(i/numCols2);
            return  rowIndex * 25
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("stroke", "#ec5900")
        .style('fill', (d)=>{return getStrokeText(d)[0]})
        .attr("class", function(d){
            let companyClass = getCompanyClass(d);
            return "c" + companyClass + "__rect"
        });


    d3.selectAll("rect").on('mouseover', function(d)  {
         console.log("sdfasdfasdfasdf")
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
            .html(() =>  {return "on <span style='border-bottom:  3px solid darkorange;'> environmental</span> proxy issues at " + "<span style='color:#FF6116'>" + companyName + "</span>" })
            .style("left", d + "px")
            .style("top", d + "px");

        // console.log(companyName);
        // d3.select("#propText").html((d)=>{})

    })
        .on( 'mouseout', function (d) {
            let companyClass = getCompanyClass(d);

            d3.selectAll('.c'+ companyClass + "__rect")
                .classed('selectedSq',false);

            tooltip
                .html("on environmental proxy issues")
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
        let dataMC = data.sort((a, b) => ( +a.marketcap < +b.marketcap ) ? 1 : -1);
        // convert years from strings to numbers
        dataMC.forEach( function(d) { return d.year = +d.year })

        // get data from slider
        let startYearData = getYearData(dataMC, 2018);

        // start with a graph
        mastergraph(startYearData, graph1);
        return dataBr = dataMC;
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
        let dataMC = data.sort((a, b) => ( +a.marketcap < +b.marketcap ) ? 1 : -1);
        // convert years from strings to numbers
        dataMC.forEach( function(d) { return d.year = +d.year });

        // start with a graph
        let startYearData = getYearData(dataMC, 2018);
        mastergraph(startYearData, graph2);

      dataVang = dataMC;

    })
    .catch(function(error){
        console.log('data load error')
    });

//////////////////////////
// ### Graph 3 - StSt ###
///////////////////////////


// load the data
let dataStSt;
let dataStStSorted;
d3.csv('Data/StStDataSP500_allyears.csv')
    .then(function(data) {

        let dataMC = data.sort((a, b) => ( +a.marketcap < +b.marketcap ) ? 1 : -1);
        // convert years from strings to numbers
        dataMC.forEach( function(d) { return d.year = +d.year })

        // start with a graph
        let startYearData = getYearData(dataMC, 2018);
        mastergraph(startYearData, graph3);

        dataStSt = dataMC;


    })
    .catch(function(error){
        console.log('data load error')
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
            VangCompaniesEnvFilter.push( { comp:comp, propnr:propnr, prop:prop, voted:voted} )
        }
    });

    BRDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if ( environProp  > 0 ) {
            let prop  = datarow.proposal;
            let propnr = datarow.prop_nr;
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;
            BrCompaniesEnvFilter.push( { comp:comp, propnr:propnr, prop:prop, voted:voted} )
        }
    });


    StStDataForProp.forEach( ( datarow ) => {
        let environProp = +datarow.environ_prop;
        if ( environProp  > 0 ) {
            let prop  = datarow.proposal;
            let propnr = datarow.prop_nr;
            let comp = datarow.issuer_company;
            let voted = datarow.against_mgmt;
            StStCompaniesEnvFilter.push( { comp:comp, propnr:propnr, prop:prop, voted:voted} )
        }
    });


    return [BrCompaniesEnvFilter, VangCompaniesEnvFilter, StStCompaniesEnvFilter];
};

const createEnviron = function() {
    let environYearData = getdataEnviron(thisYear); // get data for each fund
    let BrEnviron = environYearData[0];
    let VangEnviron = environYearData[1];
    let StStEnviron = environYearData[2];

    updateGrap_Environ (BrEnviron, graph1);
    updateGrap_Environ (VangEnviron, graph2);
    updateGrap_Environ (StStEnviron, graph3);
    console.log(environYearData[0]);


};

d3.select("#environ_btn").on('click', function(d) {

    if (switchEnviron === "eviron") {
        d3.select("#environ_btn").style("text-decoration", "None")

        switchEnviron = "master";
        let BrDataUpdate = getYearData(dataBr, thisYear);
        updateGraph( BrDataUpdate, graph1);

        let VangDataUpdate = getYearData(dataVang, thisYear);
        updateGraph(VangDataUpdate , graph2);

        let StStDataUpdate = getYearData(dataStSt, thisYear);
        updateGraph(StStDataUpdate, graph3);
    }
        else {

        d3.select("#environ_btn").html("all combined");
        switchEnviron = "eviron";
        return createEnviron()
    }

});


sliderYears.on("onchange", val => {


    d3.select('#main-title').text("How did the largest asset managers vote in " + val + "?");

    if (switchEnviron === "master") {
            let BrDataUpdate = getYearData(dataBr, val);
            updateGraph( BrDataUpdate, graph1);

            let VangDataUpdate = getYearData(dataVang, val);
            updateGraph(VangDataUpdate , graph2);

            let StStDataUpdate = getYearData(dataStSt, val);
            updateGraph(StStDataUpdate, graph3);
            // this changes the global variable?

            d3.select("#environ_btn").on('click', function(d) {
                let environYearData = getdataEnviron(val); // get data for each fund
                let BrEnviron = environYearData[0];
                let VangEnviron = environYearData[1];
                let StStEnviron = environYearData[2];

                updateGrap_Environ(BrEnviron, graph1);
                updateGrap_Environ(VangEnviron, graph2);
                updateGrap_Environ(StStEnviron, graph3);


                //add title things
                let selectsq = d3.select('.selectedSq');
                //console.log("this is the selection: "+ selectsq);
                //d3.select("#propText").html((d,i)=>{return BrEnviron.prop})
            }); // end of onclick
    } else {
        createEnviron()
    }
    thisYear = val;
    }); // end of sliders




let legendSwitch= "showIMG";
let legend_IMG = d3.select("#legend_mainGraph_IMG");
let legend_butto = d3.select("#legend_mainGraph");
legend_IMG.style("opacity", 0)

legend_butto.on("click", function(){
        if (legendSwitch === "showIMG") {
            legend_IMG.style("opacity", 1);
            d3.select("#legend_mainGraph")
                .style("text-decoration", "line-through");
        legendSwitch = "removeIMG";

        }
            else {
            legend_IMG.style("opacity", 0);
                d3.select("#legend_mainGraph")
                    .style("text-decoration", "None");
                legendSwitch = "showIMG";
            }
        })
