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
    .range(["#ffffcc","#c2e699","#78c679"])
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
    height:200
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

function runAQueryOn(error, indicators, data) {
    var sel_year = $("#selectorYear option:selected").text();
    var sel_metric = $("#selector option:selected").val()
    console.log("sel_year/sel_metric", sel_year, sel_metric)
    $.ajax({
       url: "http://api.worldbank.org/countries/all/indicators/" + sel_metric + "?per_page=2500&format=jsonP&prefix=Getdata&date="
         + sel_year, //do something here
          //url:"http://api.worldbank.org/countries/all/indicators/SH.TBS.INCD?per_page=250&format=jsonP&prefix=Getdata&date=2012",
//        url: "http://api.worldbank.org/countries/all/indicators/SH.TBS.DTEC.ZS?format=jsonP&prefix=Getdata&date=2012",
        jsonpCallback:'getdata',
        dataType:'jsonp',
        success: function (data, status){
           // console.log("Data from API:", data[1])
            value_data = data[1]
            var value_only = []
            var value_ob = []
            for(a in value_data){
                //console.log("A:", data[1][a].country.id)
                if(+data[1][a].value != 0 )
                value_only.push(+data[1][a].value)
            mapped_value_date[data[1][a].country.id] = +data[1][a].value
            var map_info= {"date": data[1][a].country.id, "value": +data[1][a].value}
            
            //mapped_value_object = {[data[1][a].country.id] = +data[1][a].value
            }
            console.log("MIN:", d3.min(value_only))
          console.log("MAX:", d3.max(value_only))
             var q = d3.scale.quantize().domain([d3.min(value_only), d3.max(value_only)]).range([1,2,3,4,5,6,7,8,9,10,11]);
                
            color.domain([1,2,3,4,5,6,7,8,9,10]);
        var x = d3.scale.linear()
            .domain([0, 390])
            .range([0, 240]);

    var xAxis = d3.svg.axis().scale(x)

    .orient("bottom")
    .tickSize(13)
    .tickValues(color.domain());

    g.selectAll("rect")
    .data(color.range().map(function(d, i) {
      return {
        x0: i ? x(color.domain()[i - 1]) : x.range()[0],
        x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
        z: d
      };
    }))
    .enter().append("rect")
    .attr("height", 25)
    .attr("x", function(d,i) { return d.x0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .style("fill", function(d) { return d.z; });

    g.call(xAxis)
    .append("text")
    .attr("class", "caption")
    .attr("y", 400-6)
    .text("Population per square mile");

    console.log(" console.log(mapped_value_date):"  , mapped_value_date)
console.log("fdata.features:", fdata.features)
            svg.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(fdata.features)
                .enter().append("path")
                .style("fill", function(d,i) { 
                
                    /*console.log("D.id:", d.id)
                    console.log("findcode(d.id)", findcode(d.id));
                    console.log("q(mapped_value_date[findcode(d.id)]))", q(mapped_value_date[findcode(d.id)]));
                    console.log("mapped_value_date[findcode(d.id)]:", mapped_value_date[findcode(d.id)]); 
                    */
                    if(q(mapped_value_date[findcode(d.id)]) > 0)
                    return color(q(mapped_value_date[findcode(d.id)]));
                else return "grey"
                     })

                .attr("d", path)
                    }
    });
    createDetailVis(mapped_value_date)
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
    //$('#selectorYear').find('option:eq(1)').attr('selected', true);
    //$('#selector').find('option:eq(1)').attr('selected', true);

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
   // createDetailVis()
};

d3.select("body").append("button").text("Show").on({
    "click":changePro
})




// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
var createDetailVis = function(input){

    d3.selectAll("#mbars").select("svg")
       .remove();
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
 
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(d) { return d + ":00" });
 
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(20);
    var svg = d3.select("#mbars").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
 
    d3.csv("bar-data.csv", function(error, data) {
        data.forEach(function(d) {
            d.date = d.date;
            d.value = +d.value;
        });
    console.log("Compare mapped_value_date", input)
    console.log("Compare bardata", data)
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );
 
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Values");

      svg.append("g")
    .append("text")
          .attr("y", 6)
          .attr("x", 400)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Summed Hourly Value");
 
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "green")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
 
    });
}

