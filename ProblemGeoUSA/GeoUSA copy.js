/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 1060 - margin.left - margin.right;
var height = 800 - margin.bottom - margin.top;
var centered;
var bbVis = {
    x: 100,
    y: 10,
    w: width - 100,
    h: 300
};


var detailVis = d3.select("#detailVis").append("svg").attr({
    width:350,
    height:200
})

var canvas = d3.select("#vis").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
    })

var svg = canvas.append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var g = svg.append("g");
var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);


//var screencoord = projection([longitude, latitude]);

var dataSet = {};


var colors = d3.scale.category20();

function loadStations() {

    d3.csv("../data/NSRDB_StationsMeta.csv",function(error,data){
        console.log(data[0])
data.forEach(function(d) {
    console.log("d:", d)
    //NSRDB_LAT(dd),NSRDB_LON(dd)
      //console.log("Looping", d["NSRDB_LAT(dd)"])
      var latitude = d["NSRDB_LAT(dd)"]
    var longitude = d["NSRDB_LON(dd)"];
    if(longitude != null)
        if(latitude != null){
var screencoord = projection([longitude, latitude]);

//console.log("screencoord", screencoord)
//console.log("YEs")
//console.log(screencoord);
g.append("circle")
.data(screencoord)
//.attr("transform", function(d) { console.log("translate(" + d + ")"); return "translate(" + d + ")"; })
    .attr("cx", screencoord[0]) // projected location on map (pixel)
    .attr("cy", screencoord[1])
    .attr("r", 2)
    .style("fill", "red")

   
 
}
    });

 console.log("Adding Tipsy")
    $('g circle').tipsy({ 
        gravity: 'w', 
        html: true,
        title: function(e,i) {
        var f = this.__data__
        //, c = colors(d.i);
         console.log("D in Tipsssssy:", e)
         return 'Hi ';


        }
      });
    console.log("Added Tipsy")
    
    

    });
}


function loadStats() {


    d3.json("../data/reducedMonthStationHour2003_2004.json", function(error,data){
        completeDataSet= data;

		//....
		
        loadStations();
    })

}


d3.json("../data/us-named.json", function(error, data) {

console.log("Data as of usmap", data)
 var usMap = topojson.feature(data,data.objects.states).features

g.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(usMap)
    .enter().append("path")
      .attr("d", path)
      .on("click", clicked);

/*
  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);
*/
/*
   svg.selectAll(".country").data(usMap).enter().append("path")
      .attr("d", path).style("fill", "white")
      .on("click", clicked);
    // see also: http://bl.ocks.org/mbostock/4122298
*/
    loadStats();
});


function clicked(d) {
   console.log("d in clicked" ,d )
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

console.log("translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

      



}


// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
var createDetailVis = function(){

}


var updateDetailVis = function(data, name){
  
}



// ZOOMING
function zoomToBB() {


}

function resetZoom() {
    
}


