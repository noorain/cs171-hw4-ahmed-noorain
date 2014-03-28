/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};
 var padding = margin

var width = 1060 - margin.left - margin.right;
var height = 800 - margin.bottom - margin.top;
var h = height
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

 var ng = detailVis.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");

var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);//.precision(.1);
var path = d3.geo.path().projection(projection);
var dataSet = {};
var colors = d3.scale.category20();
var array1 = []
function loadStations() {

    d3.csv("../data/NSRDB_StationsMeta.csv",function(error,data){
        data.forEach(function(d,i) {
        var sname  = d["USAF"]
        var latitude = d["NSRDB_LAT(dd)"]
        var longitude = d["NSRDB_LON(dd)"];
        var id = d["USAF"]
        if(longitude != null)
        if(latitude != null){
            var screencoord = projection([longitude, latitude]);
            var info = { i:i, x:screencoord[0], y: screencoord[1], r:Math.random()*30, name: sname , key: id } 
            array1.push(info)
        }
    });

    g.selectAll("circle")
         .data(array1)
         .enter().append("svg:circle")
         .attr("stroke", "green")
         .attr("fill", "red")
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("r", 2)
         .on("mouseover", function(d) { createDetailVis(d.key) })
         .on("mouseout", function(d) { d3.selectAll("#mbars").select("svg")
       .remove();})

      $('svg circle').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          var d = this.__data__, c = colors(d.i);
          //console.log("Looking for:", d.key)
          //console.log("Stats Array:", stats)
          //console.log("stats[d.key]", stats[d.key])
          if(stats[d.key])

          return 'Station USAF: <span style="color:' + c + '">' + d.name + ' ' + stats[d.key].sum +  '</span>'; 
        else
        return 'Station USAF: <span style="color:' + c + '">' + d.name +  '</span>'; 
        }
      });

      //console.log("Stats in loadStations:", stats[690150][0].sum)


    });
}
var stats;
var stats_array = []
function loadStats() {
    d3.json("../data/reducedMonthStationHour2003_2004.json", function(error,data){
        completeDataSet= data;
        stats = data
        console.log("Complete reduced data", completeDataSet)
		//....
		
        loadStations();
    })

}


d3.json("../data/us-named.json", function(error, data) {
    var usMap = topojson.feature(data,data.objects.states).features
    g.append("g")
      .attr("id", "states")
      .selectAll("path")
      .data(usMap)
      .enter().append("path")
      .attr("d", path)
      .on("click", clicked);
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
}


// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
var createDetailVis = function(cid){
    console.log("createDetailVis called for:", cid)

    for (a in stats[cid].hourly){
        console.log("Each Hour:", [a],  stats[cid].hourly[a])
    }
d3.selectAll("#detailVis").select("div").html("Hello, world!");
var data = [4, 8, 15, 16, 23, 42];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

console.log("Stats to add to greups" ,data)
var groups = ng.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        //.attr("transform", function(d, i) { return "translate(0, " + yScale(d.State) +")"; })
        
    
      var bars = groups
        .append("rect")
        .attr("width", function(d) { return d; })
        //.attr("x", function(d) { return d; })
        .attr("y", function(d) { return d*2; })
        .attr("height", 10)
        .style("fill", function(d, i) { return "red";})

////

//Set up stack method
        var stack = d3.layout.stack();

        d3.json("mperday.json",function(json){
            dataset = json;

            //Data, stacked
            stack(dataset);

            var color_hash = {
                    0 : ["Invite","#1f77b4"],
                    1 : ["Accept","#2ca02c"],
                    2 : ["Decline","#ff7f0e"]

            };

var w = width

            //Set up scales
            var xScale = d3.time.scale()
                .domain([new Date(dataset[0][0].time),d3.time.day.offset(new Date(dataset[0][dataset[0].length-1].time),8)])
                .rangeRound([0, w-padding.left-padding.right]);

            var yScale = d3.scale.linear()
                .domain([0,             
                    d3.max(dataset, function(d) {
                        return d3.max(d, function(d) {
                            return d.y0 + d.y;
                        });
                    })
                ])
                .range([h-padding.bottom-padding.top,0]);

            var xAxis = d3.svg.axis()
                           .scale(xScale)
                           .orient("bottom")
                           .ticks(d3.time.days,1);

            var yAxis = d3.svg.axis()
                           .scale(yScale)
                           .orient("left")
                           .ticks(10);



            //Easy colors accessible via a 10-step ordinal scale
            var colors = d3.scale.category10();

            //Create SVG element
            var svg = d3.select("#mbars")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

            // Add a group for each row of data
            var groups = svg.selectAll("g")
                .data(dataset)
                .enter()
                .append("g")
                .attr("class","rgroups")
                .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
                .style("fill", function(d, i) {
                    return color_hash[dataset.indexOf(d)][1];
                });

            // Add a rect for each data value
            var rects = groups.selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr("width", 2)
                .style("fill-opacity",1e-6);


            rects.transition()
                 .duration(function(d,i){
                     return 500 * i;
                 })
                 .ease("linear")
                .attr("x", function(d) {
                    return xScale(new Date(d.time));
                })
                .attr("y", function(d) {
                    return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
                })
                .attr("height", function(d) {
                    return -yScale(d.y) + (h - padding.top - padding.bottom);
                })
                .attr("width", 15)
                .style("fill-opacity",1);

                svg.append("g")
                    .attr("class","x axis")
                    .attr("transform","translate(40," + (h - padding.bottom) + ")")
                    .call(xAxis);


                svg.append("g")
                    .attr("class","y axis")
                    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
                    .call(yAxis);

                // adding legend

                var legend = svg.append("g")
                                .attr("class","legend")
                                .attr("x", w - padding.right - 65)
                                .attr("y", 25)
                                .attr("height", 100)
                                .attr("width",100);

                legend.selectAll("g").data(dataset)
                      .enter()
                      .append('g')
                      .each(function(d,i){
                        var g = d3.select(this);
                        g.append("rect")
                            .attr("x", w - padding.right - 65)
                            .attr("y", i*25 + 10)
                            .attr("width", 10)
                            .attr("height",10)
                            .style("fill",color_hash[String(i)][1]);

                        g.append("text")
                         .attr("x", w - padding.right - 50)
                         .attr("y", i*25 + 20)
                         .attr("height",30)
                         .attr("width",100)
                         .style("fill",color_hash[String(i)][1])
                         .text(color_hash[String(i)][0]);
                      });

                svg.append("text")
                .attr("transform","rotate(-90)")
                .attr("y", 0 - 5)
                .attr("x", 0-(h/2))
                .attr("dy","1em")
                .text("Number of Messages");

            svg.append("text")
               .attr("class","xtext")
               .attr("x",w/2 - padding.left)
               .attr("y",h - 5)
               .attr("text-anchor","middle")
               .text("Days");

            svg.append("text")
            .attr("class","title")
            .attr("x", (w / 2))             
            .attr("y", 20)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of messages per day.");

            //On click, update with new data            
            d3.selectAll(".m")
                .on("click", function() {
                    var date = this.getAttribute("value");

                    var str;
                    if(date == "2014-02-19"){
                        str = "19.json";
                    }else if(date == "2014-02-20"){
                        str = "19.json";
                    }else if(date == "2014-02-21"){
                        str = "19.json";
                    }else if(date == "2014-02-22"){
                        str = "19.json";
                    }else{
                        str = "19.json";
                    }

                    d3.json(str,function(json){

                        dataset = json;
                        stack(dataset);

                        console.log(dataset);

                        xScale.domain([new Date(0, 0, 0,dataset[0][0].time,0, 0, 0),new Date(0, 0, 0,dataset[0][dataset[0].length-1].time,0, 0, 0)])
                        .rangeRound([0, w-padding.left-padding.right]);

                        yScale.domain([0,               
                                        d3.max(dataset, function(d) {
                                            return d3.max(d, function(d) {
                                                return d.y0 + d.y;
                                            });
                                        })
                                    ])
                                    .range([h-padding.bottom-padding.top,0]);

                        xAxis.scale(xScale)
                             .ticks(d3.time.hour,2)
                             .tickFormat(d3.time.format("%H"));

                        yAxis.scale(yScale)
                             .orient("left")
                             .ticks(10);

                         groups = svg.selectAll(".rgroups")
                            .data(dataset);

                            groups.enter().append("g")
                            .attr("class","rgroups")
                            .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
                            .style("fill",function(d,i){
                                return color(i);
                            });


                            rect = groups.selectAll("rect")
                            .data(function(d){return d;});

                            rect.enter()
                              .append("rect")
                              .attr("x",w)
                              .attr("width",1)
                              .style("fill-opacity",1e-6);

                        rect.transition()
                            .duration(1000)
                            .ease("linear")
                            .attr("x",function(d){
                                return xScale(new Date(0, 0, 0,d.time,0, 0, 0));
                            })
                            .attr("y",function(d){
                                return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
                            })
                            .attr("height",function(d){
                                return -yScale(d.y) + (h - padding.top - padding.bottom);
                            })
                            .attr("width",15)
                            .style("fill-opacity",1);

                        rect.exit()
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .attr("x",w)
                           .remove();

                        groups.exit()
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .attr("x",w)
                           .remove();


                        svg.select(".x.axis")
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .call(xAxis);

                        svg.select(".y.axis")
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .call(yAxis);

                        svg.select(".xtext")
                           .text("Hours");

                        svg.select(".title")
                        .text("Number of messages per hour on " + date + ".");
                    });         
                });


        });



}


var updateDetailVis = function(data, name){
  
}



// ZOOMING
function zoomToBB() {


}

function resetZoom() {
    
}


