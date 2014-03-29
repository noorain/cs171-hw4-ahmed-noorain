var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;
var height = 700 - margin.bottom - margin.top;

var color = d3.scale.linear()
    //.range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
    .range(["#ffffcc","#c2e699","#78c679","#31a354","#006837"])
    .interpolate(d3.interpolateHcl);



var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};

var dataSet = {};

var mapping = {};

var svg = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
    }).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    })
    .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(50,500)");

var detailVis = d3.select("#detailVis").append("svg").attr({
    width:350,
    height:100
})

var ng = detailVis.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");


// --- this is just for fun.. play arround with it iof you like :)
var projectionMethods = [
    {
        name:"mercator",
        method: d3.geo.mercator().translate([width / 2, height / 2])//.precision(.1);
    },{
        name:"equiRect",
        method: d3.geo.equirectangular().translate([width / 2, height / 2])//.precision(.1);
    },{
        name:"stereo",
        method: d3.geo.stereographic().translate([width / 2, height / 2])//.precision(.1);
    }
];
// --- this is just for fun.. play arround with it iof you like :)


var actualProjectionMethod = 0;
var colorMin = colorbrewer.Greens[3][0];
var colorMax = colorbrewer.Greens[3][2];
var path = d3.geo.path().projection(projectionMethods[0].method);
var fdata;

function findcode(icode){
    //console.log("Looking for:", icode)
    for( i in mapping)
       // console.log("I Loop:" ,mapping[i])
    if(mapping[i].CODE3 == icode)
        return mapping[i].CODE2
}

var mapped_value_date = []
var value_ob = []

function runAQueryOn(error, indicators, data) {
    var value_ob = []
    var sel_year = $("#selectorYear option:selected").text();
    var sel_metric = $("#selector option:selected").val()
//    console.log("sel_year/sel_metric", sel_year, sel_metric)
    $.ajax({
       url: "http://api.worldbank.org/countries/all/indicators/" + sel_metric + "?per_page=2500&format=jsonP&prefix=Getdata&date="
         + sel_year, 
        jsonpCallback:'getdata',
        dataType:'jsonp',
        success: function (data, status){
            value_data = data[1]
            var value_only = []
            for(a in value_data){
                if(+data[1][a].value != 0 )
                value_only.push(+data[1][a].value)
                mapped_value_date[data[1][a].country.id] = +data[1][a].value
                if(+data[1][a].value > 0){
                    var map_info= {"State": data[1][a].country.id, "Rate": +data[1][a].value}
                    value_ob.push(map_info)
                }
            }
            createDetailVis(value_ob);
            var q = d3.scale.quantize().domain([d3.min(value_only), d3.max(value_only)]).range([1,2,3,4,5]);
            svg.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(fdata.features)
                .enter().append("path")
                .style("fill", function(d,i) { 
                if(q(mapped_value_date[findcode(d.id)]) > 0)
                    return color(q(mapped_value_date[findcode(d.id)]));
                else return "grey"
                     })

                .attr("d", path)
                    }
                });
}



var initVis = function(error, indicators, data){
    d3.csv("../data/mapping.csv", function(error,mapdata){
    mapping = mapdata
    fdata = data;
    var dropDown = d3.selectAll("#selector").append("select")
    var options = dropDown.selectAll("option")
            .data(indicators)
            .enter()
            .append("option")
            .text(function (d) { return d.IndicatorName; })
            .attr("value", function (d) { return d.IndicatorCode; })
            .attr("selected", 
                function (d) { if (d.IndicatorCode == "allsi.bi_q1" ) { return "selected" } })
    
    var dropDown2 = d3.selectAll("#selectorYear").append("select")
    var options2 = dropDown2.selectAll("option")
            .data([2011,2012])
            .enter()
            .append("option")
            .text(function (d,i) { 
                return d; })
            .attr("value", function (d) { return d; })
    $('svg path').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
        return 'Hello'; 
        }
      });
    runAQueryOn(error, indicators, data)
})
}


queue()
    .defer(d3.csv,"../data/worldBank_indicators.csv")
    .defer(d3.json,"../data/world_data.json")
    .await(initVis);

var changePro = function(d,i){
    path= d3.geo.path().projection(projectionMethods[0].method);
    svg.selectAll(".country").transition().duration(750).attr("d",path);
    runAQueryOn("1") 
};

d3.select("body").append("button").text("Show").on({
    "click":changePro
})

// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
var createDetailVis = function(input){
    d3.selectAll("#mbars").select("svg").remove();
    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, height], .8, 0);
    var bar_height = 15;
    var state = function(d) { return d.State; };
    var ratev = function(d) { return d.Rate; };
    var svg = d3.select("#mbars").append("svg")
      .attr("width", width+margin.left+margin.right)
      .attr("height", height+margin.top+margin.bottom);

    var g = svg.append("g")
      .attr("transform", "translate("+(margin.left)+","+margin.top+")");
    g.append("text")
    .attr("class", "ncaption")
    .attr("y", 0)
    .text("Metric for TOP 40 Countries");

  
      data = input
      var max = d3.max(data, function(d) { return d.Rate; } );
      var min = 0; // d3.min(data, function(d) { return d.Rate; } );;


    sortStatedesc = function (a, b) {
      return d3.ascending(a.State, b.State);
    }

    sortRatesdesc = function(a, b) {
      if(b.Rate-a.Rate != 0)
        return b.Rate - a.Rate;
      else
        return d3.descending(a.State, b.State);
    }

    sortStateasc = function (a, b) {
      return d3.descending(a.State, b.State);
    }

    sortRatesasc = function(a, b) {
      if(a.Rate-b.Rate != 0)
        return  a.Rate - b.Rate;
      else
        return d3.descending(a.State, b.State);
    }


var sinput = []
var ninput = input.sort(sortRatesdesc)
 for ( i in ninput)
 {
    //console.log("I:", i)
    if( i < 40)
    sinput.push(ninput[i])
 }
    data = sinput
    var color = d3.scale.linear()
    .domain(
      [d3.min(data, function(d) { return d.Rate }), 
      d3.max(data, function(d) { return d.Rate })])
    .interpolate(d3.interpolateRgb)
    .range(["#31a354","#006837"])
//    .range(["orangered", "silver"]);


      xScale.domain([min, max]);
      yScale.domain(data.map(state));

      var groups = g.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0, " + yScale(d.State) +")"; })
        
        // STATE TEXT
      groups.append("text")
        .attr("x", function(d) { return  -20; })
        .attr("y", function(d) { return bar_height/2; })
        .text(function(d) { return d.State; })
        .attr("text-anchor","end")

      groups.append("text")
        .attr("x", function(d,i) { return  xScale(d.Rate); })
        .attr("y", function(d) { return bar_height/2; })
        .text(function(d) { return d.Rate; })
        //.attr("text-anchor","")
        .attr("font-family", "sans-serif") 
        .attr("font-size", "11px")
        .attr("dy",".55em")
        //.attr("fill", "red");
      var bars = groups
        .append("rect")
        .attr("width", function(d) { return xScale(d.Rate); })
        .attr("height", bar_height)
        .style("fill", function(d, i) { return color(d.Rate);})

    var stateclicked = 0; 
    var rateclicked = 0; 

    // ON LOAD: 
    groups.sort(sortRatesdesc)
    yScale.domain(data.map(ratev));
    groups
        .transition()
        .duration(750)
        .delay(function(d, i) { return i * 10; })
        .attr("id",function(d, i) { return i; })
        .attr("transform", function(d, i) {  
          //console.log(yScale(d.Rate),yScale(),d,i); 
          return "translate("+ 0 +", "+ i*16 +")";
        })
        .selectAll("rect").style("fill", function(d, i) {  return color(d.Rate);})
      

   
}

