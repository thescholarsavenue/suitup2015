var checkCourse= function(arr, result){
	for(var i=0;i<arr.length;i++){
			if ((arr[i]['Dep']=='AR')||(arr[i]['Course']=='2')||(arr[i]['Course']=='3')){
				result[1]++;
			}
			else if (arr[i]['Course']=='1'){
				result[2]++;
			}
			else{
				result[0]++;
			}
		}
		return result; 
};

var donutty = function(stat1,r1,r2,col,textgiven){
	var stat=[0,0,0];
	    var total = stat1[0]+stat1[1]+stat1[2];
	    stat[0]=100;
	    stat[1]=(stat1[1]+stat1[2])*100/total;
	    stat[2]=stat1[2]*100/total;

	    console.log(stat);
	    var textcenter = [['Placed','PPO','Unplaced'],['UG4yr','UG5yr','PG']];
	    var statcol = [['#16a085','rgb(241, 196, 15)','rgb(231, 76, 60)'],['#5498C5','rgb(230, 38, 116)','rgb(39, 174, 96)']];
	    var arc_sex = d3.svg.arc()
		.innerRadius(r1)
		.outerRadius(r2)
		.startAngle(0)
		.endAngle(function(d,i){

			//console.log(d.endangle*pi);
			return d*36*pi/10;
		});

	var arcs_no = d3.select('#depbreakup').append('svg').attr('class','dep-wise-donut').attr('width','160px').attr('height','200px').attr('style','margin:10px');

	arcs_no.append("g").attr("style","transform:translate(80px,100px)").selectAll("path").data(stat).enter()
	.append("path").attr("d",arc_sex).attr("fill",function(d,i){
			return statcol[col][i];
		});
	arcs_no.append('circle').attr('cx',80).attr('cy',100).attr('r',r1-2).attr('fill','#383838');
	arcs_no.append("text").attr("text-anchor","middle").attr("x",80).attr("y",15).attr("class","descrip").style('font-weight',400).text(textgiven);
	arcs_no.append("text").attr("text-anchor","middle").attr("x",80).attr("y",83).attr("class","sex2").style('fill',statcol[col][2]).text(textcenter[col][0]+' : '+stat1[2]);
	arcs_no.append("text").attr("text-anchor","middle").attr("x",80).attr("y",102).attr("class","sex2").style('fill',statcol[col][1]).text(textcenter[col][1]+' : '+stat1[1]);
	arcs_no.append("text").attr("text-anchor","middle").attr("x",80).attr("y",120).attr("class","sex2").style('fill',statcol[col][0]).text(textcenter[col][2]+' : '+stat1[0]);

	arcs_no.append("rect").attr("rx",4).attr("ry",4).attr("x",0).attr("y",185).attr("width",160).attr('height',15).style('fill','#393939');
	arcs_no.append("text").attr("x",10).attr("y",198).attr("class","sex2").style('fill',statcol[col][2]).text((stat1[2]*100/total).toFixed(1)+'%');
	arcs_no.append("text").attr("x",65).attr("y",198).attr("class","sex2").style('fill',statcol[col][1]).text((stat1[1]*100/total).toFixed(1)+'%');
	arcs_no.append("text").attr("x",110).attr("y",198).attr("class","sex2").style('fill',statcol[col][0]).text((stat1[0]*100/total).toFixed(1)+'%');
};


var makedepcir = function(index){

  var xcir = d3.scale.linear().domain([1, 18]).range([80, 800]);
  var depcir = d3.select("#depdaysvg").append("svg").attr("class","axis depcir_"+deps[index]).attr("width", 880).attr("height", 40);
  depcir.append("line").attr("x1",60).attr("y1",20).attr("x2",820).attr("y2",20).attr("stroke","#333333").attr("stroke-width",1);
  depcir.append("text").attr("text-anchor","middle").attr("x",25).attr("y",30).attr("font-size",25).attr("font-weight",900).text(function(){
    return deps[index];
  });
  depcir.append("text").attr("text-anchor","middle").attr("x",855).attr("y",30).attr("font-size",25).attr("font-weight",900).text(function(){
    return deps[index];
  });
  for(var j=0;j<18;j++){
    depcir.append("circle").attr("cx",xcir(j+1)).attr("cy",20).attr("fill",coldep[deps[index]]).attr("r",(placed_depwise[index][j][0]+placed_depwise[index][j][1]+placed_depwise[index][j][2])*1.8).attr("opacity",0.75).append("title").text(function(){return placed_depwise[index][j][0]+placed_depwise[index][j][1]+placed_depwise[index][j][2];});
  }  
};

var draw_deplines = function(svgi,course,indexes,x,y){
	var svg=svgi.append("g").attr("class","compare");
  var tempPercentages = [];
  for(var i=0;i<18;i++){
    tempPercentages.push(0);
  }
  var totalpeople = placed_depwise[indexes][18][course]+unplaced_depwise[indexes][course];
  console.log(tempPercentages, totalpeople);
  for(var i=0;i<18;i++){
    if (totalpeople>0){
      tempPercentages[i]=placed_depwise[indexes][i][course]*100/totalpeople;
    }
  }
  console.log(tempPercentages);
   for(var j=1;j<18;j++){
        tempPercentages[j]+=tempPercentages[j-1];
      }

  	svg.append("text").attr("text-anchor","middle").attr("x",x(18.5)).attr("y",y(tempPercentages[17])).attr("class","sex2").style('fill',coldep[deps[indexes]]).text(deps[indexes]);
    svg.selectAll(".line"+indexes).data(tempPercentages)
    .enter().append("line")
      .attr("class", "line"+indexes)
      .attr("x1",function(d,j){
      	//console.log(j,d,j+1,name[1][j+1]);
      	return x(j+1);
      })
      .attr("x2",function(d,i){
      	if (i===17) return x(i+1);
      	return x(i+2);
      })
      .attr("y1",function(d,i){
      	if(i===17) return y(tempPercentages[17])
        return y(d);
      })
      .attr("y2",function(d,j){
      	if (j===17) return y(tempPercentages[17]);
      	return y(tempPercentages[j+1]);
      })
      .style("fill", "none")
      .style("stroke-width","1.5").style("stroke",function(d){ 
      	return coldep[deps[indexes]];
    });

    svg.selectAll("circle"+indexes).data(tempPercentages)
    .enter().append("circle")
      .attr("class", "circle"+indexes)
      .attr("cx",function(d,j){
      	//console.log(j,d,j+1,name[1][j+1]);
      	return x(j+1);
      })
      .attr("cy",function(d,i){
      	return y(d);
      })
      .attr("r",3)
      .style("fill", function(d){ 
      	return coldep[deps[indexes]];
    }).append("title").text(function(d){return d});
};
var placenumber_plot = function(svg,x,y, yaxistext, ymax, tickwidth){

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom").ticks(20).innerTickSize(-310)
    .outerTickSize(0)
    .tickPadding(10)
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10).innerTickSize(tickwidth)
    .outerTickSize(0)
    .tickPadding(10);
    x.domain([0,20]);
    y.domain([0,ymax]);


    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 330 + ")").call(xAxis);

    svg.append("g")
      .attr("class", "y axis").attr("transform", "translate(70," + 0 + ")").call(yAxis)

    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "rotate(-90) translate("+(-180)+","+20+")").attr("class","mired") // centre below axis
            .text(yaxistext);

    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+325+","+380+")").attr("class","mired") // centre below axis
            .text("Days");

};

var hist = function(cgsvg1,datatotal,x1,y1,dataunplaced,coursetext){

  var formatCount = d3.format(",.0f");
  var xAxis = d3.svg.axis()
    .scale(x1)
    .orient("bottom");

  var bar = cgsvg1.selectAll(".bartotal")
    .data(datatotal)
    .enter().append("g")
    .attr("class", "bartotal")
    .attr("transform", function(d) { return "translate(" + x1(d.x) + "," + y1(d.y) + ")"; });

    bar.append("rect")
    .attr("x", 1)
    .attr("y",30)
    .attr("width", function(){
      //console.log(data);
      return x1(datatotal[0].dx+5);
    })
    .attr("height", function(d) { return 250 - y1(d.y); });
  bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 16)
    .attr("x", (x1(datatotal[0].dx+5) / 2))
    .attr("text-anchor", "middle")
    .style("fill","#222")
    .text(function(d) { return formatCount(d.y); });

  var bar2 = cgsvg1.selectAll(".bartotal2")
    .data(dataunplaced)
    .enter().append("g")
    .attr("class", "bartotal2")
    .attr("transform", function(d) { return "translate(" + x1(d.x) + "," + y1(d.y) + ")"; });

  bar2.append("rect")
    .attr("x", 1)
    .attr("y",30)
    .attr("width", function(){
      //console.log(data);
      return x1(dataunplaced[0].dx+5);
    })
    .attr("height", function(d) { return 250 - y1(d.y); });
  bar2.append("text")
    .attr("dy", ".75em")
    .attr("y", 16)
    .attr("x", (x1(dataunplaced[0].dx+5) / 2))
    .attr("text-anchor", "middle")
    .style("fill","red")
    .text(function(d) { return formatCount(d.y); });


  cgsvg1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,280)")
    .call(xAxis);

    cgsvg1.append("text").attr("x",-20).attr("y",340).attr("class","descrip").text(coursetext+' Histogram: ');
    cgsvg1.append("text").attr("x",100).attr("y",340).attr("class","descrip").style('font-weight','600').text('Registered CGPAs');
    cgsvg1.append("text").attr("x",260).attr("y",340).attr("class","descrip").text(' & ');
    cgsvg1.append("text").attr("x",275).attr("y",340).attr("class","descrip").style('fill','#D41F1F').style('font-weight','600').text('Unplaced CGPAs');
};

var dep_cmp = function(course, values){
  var svg = d3.select("#depcmpsvg").append("svg").attr("class","day-wise-plot").attr("width", 690).attr("height", 400).append("g");
  var  x = d3.scale.linear().range([70,670]);
  var  y = d3.scale.linear().range([330, 20]);
  console.log('yoyo');
  placenumber_plot(svg,x,y,"% Placed (Without PPO)",100, -600);
  if(values){
	for( var i=0;i<values.length;i++){
		values[i]=Number(values[i]);
		draw_deplines(svg,course,values[i],x,y);
	}}
	
  /*
	donutty([unplaced_breakup[2],ppo_breakup[2],placed_breakup[2]],50,80,0,'UG4yr');
	donutty([unplaced_breakup[1],ppo_breakup[1],placed_breakup[1]],50,80,0,'UG5yr');		
	donutty([unplaced_breakup[0],ppo_breakup[0],placed_breakup[0]],50,80,0,'PG');

	donutty(unplaced_breakup,50,80,1,'Total Unplaced');
	donutty(placed_breakup,50,80,1, 'Total Placed');
*/
};

var dep_donut = function(dep){
  donutty([unplaced_depwise[dep][0],ppos_depwise[dep][0],placed_depwise[dep][18][0]],50,80,0,'UG4yr');
  donutty([unplaced_depwise[dep][1],ppos_depwise[dep][1],placed_depwise[dep][18][1]],50,80,0,'UG5yr');    
  donutty([unplaced_depwise[dep][2],ppos_depwise[dep][2],placed_depwise[dep][18][2]],50,80,0,'PG');
}

var genderbar = function(){
  var newsvg = d3.select("#gender").append("svg").attr("class","gender-bars").attr("width", 690).attr("height", 140).append("g").attr("style","transform:translate(90px,0px)");
  newsvg.append("rect").attr("class","ug4gen").attr("x",96).attr("y",20).attr("width",154).attr("height",25).attr("fill","#E74C3C");
  newsvg.append("rect").attr("class","ug4gen").attr("x",250).attr("y",20).attr("width",136).attr("height",25).attr("fill","#2980b9");

  newsvg.append("rect").attr("class","ug5gen").attr("x",82).attr("y",50).attr("width",168).attr("height",25).attr("fill","#E74C3C");
  newsvg.append("rect").attr("class","ug5gen").attr("x",250).attr("y",50).attr("width",140).attr("height",25).attr("fill","#2980b9");

  newsvg.append("rect").attr("class","pggen").attr("x",192).attr("y",80).attr("width",58).attr("height",25).attr("fill","#E74C3C");
  newsvg.append("rect").attr("class","pggen").attr("x",250).attr("y",80).attr("width",72).attr("height",25).attr("fill","#2980b9");

  newsvg.append("text").attr("x",245).attr("y",15).attr("text-anchor","middle").attr("fill","#333").style("font-weight",900).style("font-size",19).text("% of Registered students with Job offers");
  
  newsvg.append("text").attr("x",125).attr("y",40).attr("text-anchor","middle").attr("fill","#eee").style("font-weight",600).text("77.1%");
  newsvg.append("text").attr("x",110).attr("y",70).attr("text-anchor","middle").attr("fill","#eee").style("font-weight",600).text("83.8%");
  newsvg.append("text").attr("x",220).attr("y",100).attr("text-anchor","middle").attr("fill","#eee").style("font-weight",600).text("28.8%");
  newsvg.append("text").attr("x",355).attr("y",40).attr("text-anchor","middle").attr("fill","#eee").style("font-weight",600).text("67.9%");
  newsvg.append("text").attr("x",360).attr("y",70).attr("text-anchor","middle").attr("fill","#eee").style("font-weight",600).text("70.5%");
  newsvg.append("text").attr("x",290).attr("y",100).attr("text-anchor","middle").attr("fill","#eee").style("font-weight",600).text("36.3%");

  newsvg.append("text").attr("x",20).attr("y",37).attr("text-anchor","middle").attr("fill","#333").style("font-weight",900).text("UG4Yr");
  newsvg.append("text").attr("x",20).attr("y",67).attr("text-anchor","middle").attr("fill","#333").style("font-weight",900).text("UG5Yr");
  newsvg.append("text").attr("x",20).attr("y",97).attr("text-anchor","middle").attr("fill","#333").style("font-weight",900).text("PG");

  newsvg.append("path").style("transform","translate(370px,-10px)scale(1.5)").attr("d","M63.051,36.943c-1.078-2.546-2.868-4.706-5.126-6.234c-2.264-1.527-4.992-2.421-7.923-2.421  c-1.951,0-3.814,0.396-5.511,1.114c-2.544,1.078-4.702,2.873-6.229,5.134c-1.526,2.258-2.42,4.996-2.42,7.925  c0,1.952,0.399,3.82,1.113,5.517c1.078,2.547,2.965,4.707,5.221,6.233C43.86,55.352,44,56.137,48,56.464V63h-4.573  c-1.15,0-2.085,0.346-2.085,1.5s0.935,1.5,2.085,1.5H48v3.519c0,1.211,0.789,2.193,2,2.193s2-0.982,2-2.193V66h4.579  c1.154,0,2.088-0.346,2.088-1.5S57.733,63,56.579,63H52v-6.536c0-0.18,2.372-0.5,3.418-0.945c2.543-1.076,4.75-2.871,6.279-5.132  c1.525-2.26,2.446-4.997,2.443-7.925C64.14,40.509,63.768,38.64,63.051,36.943z M59.847,46.622c-0.81,1.917-2.167,3.553-3.873,4.705  s-3.752,1.825-5.972,1.825c-1.479,0-2.878-0.299-4.152-0.84c-1.919-0.809-3.551-2.167-4.706-3.873  c-1.147-1.71-1.823-3.758-1.823-5.977c0-1.481,0.299-2.882,0.842-4.161c0.81-1.917,2.169-3.551,3.87-4.707  c1.709-1.151,3.755-1.823,5.97-1.823c1.483,0,2.884,0.3,4.158,0.839c1.916,0.81,3.547,2.168,4.702,3.875  c1.15,1.707,1.823,3.756,1.823,5.976C60.686,43.941,60.387,45.343,59.847,46.622z").attr("fill","#E74C3C");
  newsvg.append("path").style("transform","translate(440px,-10px)scale(1.5)").attr("d","M67.846,34.187c0-1.154-0.935-2.09-2.09-2.09l0,0H52.607c-1.154,0-2.089,0.936-2.089,2.09c0,1.152,0.935,2.088,2.089,2.088  h8.046l-7.76,7.768l3.099,3.103l7.677-7.683v7.887c0,1.153,0.937,2.088,2.087,2.088c1.155,0,2.09-0.935,2.09-2.088V34.19V34.187z M37.527,44.941l1.231,1.23c1.058-1.055,2.269-1.834,3.57-2.354c1.301-0.518,2.691-0.776,4.083-0.776  c1.345,0,2.691,0.264,3.956,0.787c1.269,0.525,2.462,1.306,3.499,2.343c1.041,1.046,1.82,2.245,2.342,3.523  c0.523,1.282,0.784,2.643,0.784,4.003c0,1.379-0.258,2.753-0.778,4.046c-0.521,1.291-1.299,2.497-2.348,3.547  c-1.051,1.052-2.258,1.831-3.553,2.352c-1.291,0.52-2.671,0.778-4.053,0.778c-1.356,0-2.709-0.261-3.987-0.784  s-2.474-1.303-3.516-2.346c-1.046-1.048-1.824-2.249-2.347-3.534c-0.52-1.287-0.78-2.656-0.78-4.025c0-1.369,0.261-2.739,0.78-4.022  c0.522-1.287,1.301-2.489,2.347-3.538L37.527,44.941l-1.227-1.231c-1.381,1.38-2.42,2.981-3.112,4.688  c-0.691,1.709-1.034,3.521-1.034,5.333s0.343,3.625,1.034,5.333c0.692,1.707,1.731,3.309,3.112,4.688  c1.368,1.373,2.962,2.414,4.658,3.107c1.694,0.694,3.499,1.043,5.303,1.043c1.818,0,3.636-0.339,5.351-1.03  c1.715-0.69,3.328-1.73,4.715-3.121c1.387-1.385,2.426-2.993,3.115-4.708c0.691-1.714,1.032-3.53,1.032-5.347  c0-1.808-0.352-3.616-1.04-5.317c-0.694-1.702-1.733-3.296-3.107-4.67c-1.364-1.364-2.942-2.405-4.629-3.1  c-1.686-0.696-3.484-1.052-5.286-1.052c-1.819,0-3.646,0.336-5.371,1.025c-1.722,0.687-3.347,1.729-4.74,3.127L37.527,44.941z").attr("fill","#2980b9");

}

var colourify = function(classy){
	for(var j=0;j<deps.length-1;j++){
		if (j%9==0){
			//console.log('batch created',j/9);
			$("#"+classy).append($('<div class="col-md-4" id="batch'+classy+j/9+'"></div>'));
		}
		if(j%3==0){

			//console.log('catch created',j/3);
			$("#batch"+classy+parseInt(j/9)).append($('<div class="col-md-4 col-xs-4" id="catch'+classy+j/3+'"></div>'));
		}
		//console.log(deps[j], coldep[deps[j]], j);
		var hi = $("#catch"+classy+parseInt(j/3)).append($('<div class="col-md-4 col-xs-4" id="match'+classy+j+'"></div>').html(deps[j]).css("background-color", coldep[deps[j]])).css("font-weight",800).css("font-size",10);
		//console.log(hi);
	}
};

var explosion = function(){
	var mainsvg = d3.select("#mainsvgDayAll").append("svg").attr("width",730).attr("height", 370).attr("class","svg-All");
  var tempdata = placed_depwise.map(function(d){
    return d[18];
  });
  //console.log(tempdata);
	var arc_b_1 = d3.svg.arc()
	.innerRadius(80)
	.outerRadius(80)
	.startAngle(function(d,i){

		return i*12.857*pi;
	})
	.endAngle(function(d,i){
		return (i+1)*pi*12.857;
	});
	var arc_b_2 = d3.svg.arc()
	.innerRadius(80)
	.outerRadius(function(d){
		return 80+d[18][2]*2;
	})
	.startAngle(function(d,i){

		return i*12.857*pi;
	})
	.endAngle(function(d,i){
		return (i+1)*pi*12.857;
	});

	var arc_d_1 = d3.svg.arc()
	.innerRadius(80)
	.outerRadius(80)
	.startAngle(function(d,i){

		return i*12.857*pi;
	})
	.endAngle(function(d,i){
		return (i+1)*pi*12.857;
	});
	var arc_d_2 = d3.svg.arc()
	.innerRadius(80)
	.outerRadius(function(d,i){
		return 80+(d[18][2]+d[18][1])*2;
	})
	.startAngle(function(d,i){

		return i*12.857*pi;
	})
	.endAngle(function(d,i){
		return (i+1)*pi*12.857;
	});

	var arc_p_1 = d3.svg.arc()
	.innerRadius(80)
	.outerRadius(80)
	.startAngle(function(d,i){

		return i*12.857*pi;
	})
	.endAngle(function(d,i){
		return (i+1)*pi*12.857;
	});
	var arc_p_2 = d3.svg.arc()
	.innerRadius(80)
	.outerRadius(function(d,i){
    //console.log(d);
		return 80+(d[18][0]+d[18][1]+d[18][2])*2;
	})
	.startAngle(function(d,i){

		return i*12.857*pi;
	})
	.endAngle(function(d,i){
		return (i+1)*pi*12.857;
	});

	var arcs_p = mainsvg.append("g").attr("class","pg").attr("style","transform:translate(340px,155px)").selectAll("path")
	.data(placed_depwise).enter().append("path").attr("d",arc_p_1).attr("fill",function(d,i){
    //console.log(d);
		var color = coldep[deps[i]];
      	color = color.split('(')[1].split(')')[0].split(",");
      	var darker = 'rgb(' +parseInt(72*parseInt(color[0])/100)+','+parseInt(72*parseInt(color[1])/100)+','+parseInt(72*parseInt(color[2])/100)+')';   
      	return darker;
	}).attr("id",function(d,i){ return deps[i]+'text';}).transition().duration(1000).attr("d",arc_p_2);

  //console.log('tempdata = ',tempdata);
  
  d3.select(".svg-All").on("mouseover",function(){
  mainsvg.append("g").attr("style","transform:translate(340px,155px)").selectAll(".deptext")
  .data(placed_depwise)
   .enter().append("text").attr("x",function(d){

    return (70+(d[18][0]+d[18][1]+d[18][2]))*0.15;
  }).attr("dy",-2)
  .attr("class", "deptext")
   .append("textPath")
  .attr("xlink:href",function(d,i){return "#"+deps[i]+"text";})
  .style("text-anchor","middle").style("font-weight",900)

  .text(function(d,i){return deps[i];});  

  }).on("mouseout",function(){
    d3.selectAll(".deptext").remove();
  })
	
	var arcs_d = mainsvg.append("g").attr("class","dual_arch").attr("style","transform:translate(340px,155px)").selectAll("path")
	.data(placed_depwise).enter().append("path").attr("d",arc_d_1).attr("fill",function(d,i){
		var color = coldep[deps[i]];
      	color = color.split('(')[1].split(')')[0].split(",");
      	var darker = 'rgb(' +parseInt(85*parseInt(color[0])/100)+','+parseInt(85*parseInt(color[1])/100)+','+parseInt(85*parseInt(color[2])/100)+')';   
      	return darker;
	}).transition().duration(1000).attr("d",arc_d_2);

	var arcs_b = mainsvg.append("g").attr("class","btech").attr("style","transform:translate(340px,155px)").selectAll("path")
	.data(placed_depwise).enter().append("path").attr("d",arc_b_1).attr("fill",function(d,i){
		return coldep[deps[i]];
	}).transition().duration(1000).attr("d",arc_b_2);


		
	mainsvg.append("circle").attr("cx",340).attr("cy",155).attr("r",0).attr("fill","rgb(52, 73, 94)").transition().duration(900).attr("r",76);

	mainsvg.append("text").attr("text-anchor","middle").attr("x",340).attr("y",160).attr("class","banner-text1").text("1111") ;
	mainsvg.append("text").attr("text-anchor","middle").attr("x",340).attr("y",180).attr("class","banner-text2").text("Students Hired");
	

	//Tooltip - modern
	
	d3.selectAll("path").on("mouseover",function(d){
			var dep = d.department;
			var selectionsvg = d3.select(this.parentNode.parentNode);
			var dayOfSelection = selectionsvg[0][0].className.animVal[7];
			dayOfSelection = 'Day'+dayOfSelection;
			var courseSelection = d3.select(this.parentNode)[0][0].className.animVal;
			var textOnTT = d[dayOfSelection][courseSelection];
			if (courseSelection=='btech')
				textOnTT='B.Tech : '+textOnTT;
			
			else if (courseSelection=='dual_arch'){
				if (dep=='AR')
					textOnTT='B.Arch : '+textOnTT;
				else
					textOnTT='Dual/M.Sc : '+textOnTT;
			}
			else if (courseSelection=='pg')
				textOnTT='PG : '+textOnTT;
			
			selectionsvg.append("rect").attr("fill","#222222").style("opacity",0).transition().duration(600).style("opacity",0.95).attr("id","tool-tip-ya").attr("rx",5).attr("ry",5).attr("x",function(){
				return d3.mouse(this)[0];
			}).attr("y",function(){
				return d3.mouse(this)[1];
			}).attr("width",100).attr("height",60);
			selectionsvg.append("text").style("opacity",0).transition().duration(600).style("opacity",1).attr("id","tool-tip-text-1").attr("text-anchor","middle").attr("x",function(){
				return d3.mouse(this)[0]+50;
			}).attr("y",function(){
				return d3.mouse(this)[1]+20;
			}).text(dep);
			selectionsvg.append("text").style("opacity",0).transition().duration(600).style("opacity",1).attr("id","tool-tip-text-2").attr("text-anchor","middle").attr("x",function(){
				return d3.mouse(this)[0]+50;
			}).attr("y",function(){
				return d3.mouse(this)[1]+40;
			}).text(textOnTT)
		})
		.on("mouseout",function(){
			d3.select("#tool-tip-ya").remove();
			d3.select("#tool-tip-text-1").remove();
			d3.select("#tool-tip-text-2").remove();
		});
};

var banner = function(nu){
	var mainsvg = d3.select("#mainsvgDayAll").append("svg").attr("width",120).attr("height", 370).attr("class","hidden-xs hidden-sm svg-banner-"+nu);
	//mainsvg.append("rect").attr("x",0).attr("y",0).attr("width",120).attr("height",370).attr("fill","#DE3726");
	mainsvg.append("rect").attr("x",0).attr("y",0).attr("width",120).attr("height",370).attr("fill","rgb(173, 10, 77)");
	//mainsvg.append("path").attr("d","M 10 0 L 10 350 L 60 290 L 110 350 L 110 0 ").attr("fill","white");
	mainsvg.append("path").attr("d","M 10 0 L 10 340 L 60 285 L 110 340 L 110 0 ").attr("stroke","white").attr("stroke-width",4).attr("fill","none");
	mainsvg.append("path").attr("d","M 0 370 L 60 300 L 120 370 L 0 370").attr("fill","white");
	
};


var coldep={ 'AE':"rgb(231, 76, 60)", 'AG': "rgb(46, 204, 113)",'AR': "rgb(230, 126, 34)",'BT': "rgb(149, 165, 166)",'CE': "rgb(52, 73, 94)",'CH': "rgb(241, 196, 15)",'CS': "rgb(241, 15, 107)",'CY': "rgb(26, 188, 156)",'EC': "rgb(155, 89, 182)",'EE': "rgb(52, 152, 219)",'EX': "rgb(15, 219, 241)",'GG': "rgb(142, 241, 15)",'HS': "rgb(184, 134, 11)",'ID': "rgb(233, 150, 122)",'IE': "rgb(26, 188, 156)",'IM': "rgb(46, 204, 113)",'IT': "rgb(52, 152, 219)",'MA': "rgb(241, 196, 15",'ME': "rgb(52, 73, 94)",'MF': "rgb(155, 89, 182)",'MI': "rgb(230, 126, 34)",'MM': "rgb(231, 76, 60)",'MT': "rgb(149, 165, 166)",'NA': "rgb(241, 15, 107)",'PH': "rgb(15, 219, 241)",'QE': "rgb(142, 241, 15)",'QM': "rgb(184, 134, 11)",'RE': "rgb(233, 150, 122)"};
var deps = ["AE", "AG", "AR", "BT", "CE", "CH", "CS", "CY", "EC", "EE", "EX", "GG", "HS", "ID", "IE", "IM", "IT", "MA", "ME", "MF", "MI", "MM", "MT", "NA", "PH", "QE", "QM", "RE"];
var course = ["UG4yr", "UG5yr","PG","Total"];
var placed_depwise = [[[0, 3, 0, 3], [1, 3, 0, 4], [1, 5, 2, 8], [0, 1, 0, 1], [2, 2, 0, 4], [0, 2, 0, 2], [1, 0, 0, 1], [0, 0, 0, 0], [0, 2, 0, 2], [0, 2, 0, 2], [0, 0, 1, 1], [1, 0, 1, 2], [0, 1, 1, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 1], [0, 0, 0, 0], [7, 21, 5, 33]], [[2, 4, 0, 6], [0, 2, 0, 2], [0, 1, 0, 1], [1, 2, 0, 3], [1, 2, 0, 3], [0, 1, 0, 1], [0, 0, 0, 0], [2, 1, 0, 3], [1, 0, 0, 1], [1, 2, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1], [0, 2, 0, 2], [2, 1, 0, 3], [1, 0, 1, 2], [0, 0, 0, 0], [11, 18, 2, 31]], [[0, 2, 0, 2], [0, 0, 0, 0], [0, 2, 0, 2], [0, 3, 0, 3], [0, 1, 0, 1], [0, 0, 0, 0], [0, 4, 0, 4], [0, 3, 0, 3], [0, 2, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 2, 0, 2], [0, 2, 0, 2], [0, 0, 0, 0], [0, 22, 0, 22]], [[0, 3, 0, 3], [0, 3, 0, 3], [0, 2, 0, 2], [1, 0, 0, 1], [0, 0, 0, 0], [1, 0, 0, 1], [0, 0, 0, 0], [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 1, 1], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 12, 1, 17]], [[1, 1, 0, 2], [1, 6, 1, 8], [0, 1, 0, 1], [3, 6, 0, 9], [2, 1, 0, 3], [3, 1, 0, 4], [2, 0, 0, 2], [1, 0, 1, 2], [1, 1, 0, 2], [1, 1, 0, 2], [0, 0, 0, 0], [2, 2, 1, 5], [0, 0, 0, 0], [1, 0, 1, 2], [2, 0, 2, 4], [3, 2, 8, 13], [0, 0, 0, 0], [0, 0, 4, 4], [23, 22, 18, 63]], [[4, 9, 0, 13], [1, 2, 1, 4], [1, 1, 0, 2], [4, 2, 0, 6], [2, 2, 4, 8], [1, 0, 0, 1], [7, 0, 0, 7], [1, 1, 0, 2], [2, 2, 1, 5], [2, 1, 1, 4], [1, 0, 3, 4], [1, 1, 0, 2], [0, 0, 0, 0], [1, 1, 2, 4], [1, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [29, 22, 12, 63]], [[8, 11, 5, 24], [8, 8, 4, 20], [4, 3, 11, 18], [1, 1, 0, 2], [0, 2, 3, 5], [4, 3, 0, 7], [1, 0, 1, 2], [1, 1, 0, 2], [0, 0, 3, 3], [0, 0, 0, 0], [2, 0, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 1, 1, 2], [0, 0, 0, 0], [29, 31, 28, 88]], [[0, 3, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 2, 0, 2], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 3, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 11, 0, 11]], [[5, 11, 0, 16], [7, 5, 10, 22], [8, 10, 15, 33], [7, 1, 4, 12], [1, 0, 8, 9], [3, 2, 0, 5], [0, 0, 5, 5], [1, 0, 0, 1], [1, 0, 3, 4], [4, 0, 5, 9], [3, 1, 4, 8], [0, 0, 0, 0], [0, 2, 0, 2], [0, 0, 2, 2], [0, 0, 1, 1], [1, 1, 3, 5], [1, 0, 1, 2], [0, 0, 0, 0], [42, 33, 61, 136]], [[5, 6, 0, 11], [2, 4, 0, 6], [8, 3, 2, 13], [1, 1, 0, 2], [7, 1, 1, 9], [5, 1, 0, 6], [1, 0, 1, 2], [0, 0, 0, 0], [0, 0, 2, 2], [4, 2, 2, 8], [1, 0, 2, 3], [0, 1, 1, 2], [0, 1, 1, 2], [2, 1, 0, 3], [0, 0, 0, 0], [0, 2, 0, 2], [1, 0, 0, 1], [1, 0, 0, 1], [38, 23, 12, 73]], [[0, 3, 0, 3], [0, 2, 0, 2], [0, 1, 0, 1], [0, 0, 0, 0], [0, 2, 0, 2], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 2, 0, 2], [0, 1, 0, 1], [0, 1, 0, 1], [0, 2, 0, 2], [0, 15, 0, 15]], [[0, 1, 0, 1], [0, 1, 0, 1], [0, 2, 1, 3], [0, 0, 0, 0], [0, 4, 0, 4], [0, 0, 0, 0], [0, 1, 0, 1], [0, 3, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 2, 5, 7], [0, 0, 0, 0], [0, 0, 0, 0], [0, 15, 6, 21]], [[0, 8, 0, 8], [0, 4, 0, 4], [0, 0, 0, 0], [0, 2, 0, 2], [0, 2, 0, 2], [0, 0, 0, 0], [0, 1, 0, 1], [0, 5, 0, 5], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 25, 0, 25]], [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 6, 6], [0, 0, 0, 0], [0, 0, 2, 2], [0, 0, 8, 8]], [[5, 0, 0, 5], [3, 0, 0, 3], [4, 0, 0, 4], [0, 0, 0, 0], [2, 0, 0, 2], [0, 0, 0, 0], [2, 0, 0, 2], [0, 0, 0, 0], [1, 0, 0, 1], [4, 0, 0, 4], [0, 0, 0, 0], [1, 0, 0, 1], [0, 0, 0, 0], [1, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 1], [24, 0, 0, 24]], [[2, 5, 0, 7], [0, 3, 1, 4], [1, 3, 0, 4], [1, 1, 0, 2], [2, 0, 0, 2], [2, 3, 0, 5], [2, 0, 0, 2], [2, 0, 0, 2], [0, 0, 0, 0], [1, 1, 1, 3], [1, 2, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 2, 3], [0, 0, 0, 0], [1, 1, 0, 2], [2, 0, 0, 2], [0, 0, 0, 0], [18, 19, 4, 41]], [[0, 0, 2, 2], [0, 0, 1, 1], [0, 0, 4, 4], [0, 0, 3, 3], [0, 0, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 12, 12]], [[0, 8, 1, 9], [0, 5, 0, 5], [0, 3, 0, 3], [0, 2, 1, 3], [0, 2, 1, 3], [0, 1, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 1, 1], [0, 1, 0, 1], [0, 1, 1, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 2, 0, 2], [0, 0, 0, 0], [0, 0, 3, 3], [0, 1, 1, 2], [0, 0, 0, 0], [0, 27, 9, 36]], [[5, 7, 0, 12], [0, 2, 3, 5], [12, 0, 3, 15], [1, 7, 0, 8], [4, 4, 0, 8], [4, 3, 0, 7], [5, 4, 3, 12], [0, 1, 0, 1], [1, 0, 4, 5], [6, 7, 3, 16], [2, 5, 6, 13], [1, 2, 4, 7], [0, 1, 2, 3], [0, 1, 0, 1], [2, 0, 2, 4], [1, 3, 3, 7], [0, 0, 0, 0], [0, 0, 1, 1], [44, 47, 34, 125]], [[2, 0, 0, 2], [1, 0, 0, 1], [1, 1, 0, 2], [0, 0, 0, 0], [1, 1, 0, 2], [1, 1, 0, 2], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 2], [0, 0, 0, 0], [1, 0, 0, 1], [1, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [12, 5, 0, 17]], [[0, 4, 0, 4], [1, 3, 0, 4], [1, 2, 0, 3], [2, 2, 0, 4], [2, 2, 0, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 0, 0], [8, 5, 0, 13], [0, 0, 0, 0], [0, 0, 0, 0], [15, 20, 0, 35]], [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1]], [[1, 1, 0, 2], [0, 3, 0, 3], [2, 3, 1, 6], [1, 0, 0, 1], [0, 1, 0, 1], [2, 0, 0, 2], [0, 1, 1, 2], [1, 2, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [5, 0, 0, 5], [3, 2, 0, 5], [0, 1, 0, 1], [0, 0, 0, 0], [1, 0, 0, 1], [0, 0, 1, 1], [0, 1, 0, 1], [0, 0, 0, 0], [16, 15, 3, 34]], [[1, 3, 0, 4], [0, 1, 0, 1], [1, 0, 0, 1], [2, 4, 1, 7], [2, 1, 0, 3], [1, 0, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [3, 1, 1, 5], [0, 0, 0, 0], [0, 3, 0, 3], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [10, 15, 2, 27]], [[0, 0, 0, 0], [0, 2, 0, 2], [0, 3, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 2, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 9, 1, 10]], [[0, 1, 0, 1], [0, 1, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 4, 0, 4]], [[0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 2, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 4, 0, 4]], [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 2, 2], [0, 0, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 5, 5]]];
var unplaced_depwise = [[15, 8, 16, 39], [17, 13, 71, 101], [0, 42, 0, 42], [4, 9, 10, 23], [15, 12, 29, 56], [12, 9, 27, 48], [7, 5, 2, 14], [0, 7, 16, 23], [12, 10, 27, 49], [15, 5, 15, 35], [0, 12, 0, 12], [0, 14, 31, 45], [0, 2, 14, 16], [0, 0, 1, 1], [7, 0, 0, 7], [4, 2, 3, 9], [0, 0, 2, 2], [0, 9, 17, 26], [18, 14, 32, 64], [10, 7, 0, 17], [14, 18, 9, 41], [0, 0, 6, 6], [14, 10, 20, 44], [14, 12, 7, 33], [0, 4, 36, 40], [0, 0, 0, 0], [0, 1, 0, 1], [0, 0, 0, 0]];
var ppos_depwise = [[0, 0, 0, 0], [0, 3, 0, 3], [0, 0, 0, 0], [1, 4, 0, 5], [3, 1, 0, 4], [7, 2, 0, 9], [27, 10, 0, 37], [0, 1, 0, 1], [14, 4, 0, 18], [5, 2, 1, 8], [0, 1, 0, 1], [0, 1, 0, 1], [0, 7, 0, 7], [0, 0, 0, 0], [0, 0, 0, 0], [4, 1, 0, 5], [0, 0, 1, 1], [0, 15, 0, 15], [4, 4, 0, 8], [1, 0, 0, 1], [1, 1, 0, 2], [0, 0, 0, 0], [3, 0, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var ugpg = {'placed':[322, 435, 224], 'unplaced':[178, 225, 391], 'ppo':[70, 57, 3]};
var gender = {'placed':[120,861],'unplaced':[113,681],'ppo':[17,113]};
var placed_coursewise = [[41, 25, 44, 25, 28, 27, 21, 11, 7, 28, 15, 10, 2, 6, 6, 18, 6, 2],[95, 60, 46, 40, 30, 20, 13, 23, 7, 20, 16, 12, 7, 10, 5, 22, 7, 2], [8, 21, 40, 9, 19, 0, 11, 3, 14, 15, 18, 7, 4, 9, 6, 29, 4, 7],[144, 106, 130, 74, 77, 47, 45, 37, 28, 63, 49, 29, 13, 25, 17, 69, 17, 11]];
var companycount = [35,28,28,22,16,7,13,13,8,16,7,8,5,13,9,12,6,5];
var allsectors = {'sde':'SDE','data':'Data Analytics','core':'Core','non core':'Non-Core', 'finance': 'Finance', 'consult':'Consulting'};
var pi = Math.PI/180;
window.onload = function(){
    banner(1);
		explosion();
		banner(2);
    d3.select(".svg-banner-1").append("text").attr("text-anchor","middle").attr("x",60).attr("y",50).attr("class","banner-text1").text("28");
		d3.select(".svg-banner-1").append("text").attr("text-anchor","middle").attr("x",60).attr("y",75).attr("class","banner-text2").text("Department");
		d3.select(".svg-banner-1").append("text").attr("text-anchor","middle").attr("x",60).attr("y",95).attr("class","banner-text2").text("Streams");

		d3.select(".svg-banner-1").append("text").attr("text-anchor","middle").attr("x",60).attr("y",155).attr("class","banner-text1").text("981");
		d3.select(".svg-banner-1").append("text").attr("text-anchor","middle").attr("x",60).attr("y",180).attr("class","banner-text2").text("Placed");

		d3.select(".svg-banner-1").append("text").attr("text-anchor","middle").attr("x",60).attr("y",250).attr("class","banner-text1").text("130");
		d3.select(".svg-banner-1").append("text").attr("text-anchor","middle").attr("x",60).attr("y",275).attr("class","banner-text2").text("PPOs");

		d3.select(".svg-banner-2").append("text").attr("text-anchor","middle").attr("x",60).attr("y",50).attr("class","banner-text1").text("250");
		d3.select(".svg-banner-2").append("text").attr("text-anchor","middle").attr("x",60).attr("y",75).attr("class","banner-text2").text("Company");
		d3.select(".svg-banner-2").append("text").attr("text-anchor","middle").attr("x",60).attr("y",95).attr("class","banner-text2").text("Profiles");

		d3.select(".svg-banner-2").append("text").attr("text-anchor","middle").attr("x",60).attr("y",155).attr("class","banner-text1").text("18");
		d3.select(".svg-banner-2").append("text").attr("text-anchor","middle").attr("x",60).attr("y",180).attr("class","banner-text2").text("Days");

		d3.select(".svg-banner-2").append("text").attr("text-anchor","middle").attr("x",60).attr("y",250).attr("class","banner-text1").text("237");
		d3.select(".svg-banner-2").append("text").attr("text-anchor","middle").attr("x",60).attr("y",275).attr("class","banner-text2").text("Hours Tests");

    for(var j=0;j<8;j++){
        colourify('testcolours'+j);
    }


        var svg = d3.select("#numsvg").append("svg").attr("class","numsvg1-plot").attr("width", 500).attr("height", 400).append("g");
        var  x = d3.scale.linear().range([70,470]);
        var  y = d3.scale.linear().range([330, 20]);
        placenumber_plot(svg,x,y,"Registered Students Placed Each Day",150, -400);

          for(var k=0;k<4;k++){
          svg.append("text").attr("text-anchor","middle").attr("x",x(1.25)).attr("y",y(placed_coursewise[k][0])-10).attr("class","sex2").style('fill',coldep[deps[k]]).text(course[k]);
          svg.selectAll(".linemain"+k).data(placed_coursewise[k])
          .enter().append("line")
          .attr("class", "linemain"+k)
          .attr("x1",function(d,j){
            //console.log(j,d,j+1,name[1][j+1]);
            return x(j+1);
          })
          .attr("x2",function(d,i){
            if (i===17) return x(i+1)
            return x(i+2);
          })
          .attr("y1",function(d,i){
            return y(d);
          })
          .attr("y2",function(d,j){
            if (j===17) return y(d);
            return y(placed_coursewise[k][j+1]);
          })
          .style("fill", "none")
          .style("stroke-width","1.5").style("stroke",function(d){ 
            return coldep[deps[k]];
          });

          svg.selectAll("circlemain"+k).data(placed_coursewise[k])
          .enter().append("circle")
          .attr("class", "circlemain"+k)
          .attr("cx",function(d,j){
          //console.log(j,d,j+1,name[1][j+1]);
          return x(j+1);
          })
          .attr("cy",function(d,i){
          return y(d);
          })
          .attr("r",3)
          .style("fill", function(d){ 
          return coldep[deps[k]];
          });
        }
        for(var j=1;j<18;j++){
          placed_coursewise[0][j]+=placed_coursewise[0][j-1];
          placed_coursewise[1][j]+=placed_coursewise[1][j-1];
          placed_coursewise[2][j]+=placed_coursewise[2][j-1];
          placed_coursewise[3][j]+=placed_coursewise[3][j-1];
        }
        
        var svg = d3.select("#numsvg").append("svg").attr("class","numsvg1-plot").attr("width", 500).attr("height", 400).append("g");

        placenumber_plot(svg,x,y,"Cumulative Registered Students Placed",1000, -400);
        for(var k=0;k<4;k++){
          svg.append("text").attr("text-anchor","middle").attr("x",x(17.5)).attr("y",y(placed_coursewise[k][17])-5).attr("class","sex2").style('fill',coldep[deps[k]]).text(course[k]);
          svg.selectAll(".linemain"+k).data(placed_coursewise[k])
          .enter().append("line")
          .attr("class", "linemain"+k)
          .attr("x1",function(d,j){
            //console.log(j,d,j+1,name[1][j+1]);
            return x(j+1);
          })
          .attr("x2",function(d,i){
            if (i===17) return x(i+1);
            return x(i+2);
          })
          .attr("y1",function(d,i){
            return y(d);
          })
          .attr("y2",function(d,j){
            if (j===17) return y(d);
            return y(placed_coursewise[k][j+1]);
          })
          .style("fill", "none")
          .style("stroke-width","1.5").style("stroke",function(d){ 
            return coldep[deps[k]];
          });

          svg.selectAll("circlemain"+k).data(placed_coursewise[k])
          .enter().append("circle")
          .attr("class", "circlemain"+k)
          .attr("cx",function(d,j){
          //console.log(j,d,j+1,name[1][j+1]);
          return x(j+1);
          })
          .attr("cy",function(d,i){
          return y(d);
          })
          .attr("r",3)
          .style("fill", function(d){ 
          return coldep[deps[k]];
          });
        }

        var xcir = d3.scale.linear().domain([1, 18]).range([80, 800]);
        var xAxisCir = d3.svg.axis().scale(xcir).orient("bottom").ticks(18);
        var depcir = d3.select("#depdaysvg").append("svg").attr("class","axis").attr("width", 880).attr("height", 20).append("g").call(xAxisCir);


        for(var i=0;i<deps.length;i++){
          makedepcir(i);
        }
        var depcir = d3.select("#depdaysvg").append("svg").attr("class","axis").attr("width", 880).attr("height", 20).append("g").call(xAxisCir);

        var options = $("#dep-options");
        var options2 = $("#course-options");
          for(var j=0;j<deps.length;j++) {
            options.append($('<option class="dep-items"></option>').val(j).html(deps[j]));
          }
          for(var j=0;j<course.length;j++) {
            options2.append($('<option class="course-items"></option>').val(j).html(course[j]));
          }
          $('.selectpicker.depcompare').selectpicker('refresh');
          $('.selectpicker.depcompare').val(['0','4','6']);
          $('.selectpicker.depcompare').selectpicker('render');
          $('.selectpicker.courseselect').selectpicker('refresh');
          $('.selectpicker.courseselect').val(0);
          $('.selectpicker.courseselect').selectpicker('render');
          dep_cmp(0,['0','4','6']);
          $('.selectpicker.depcompare').change(function(){
            var selectedDeps = $('.selectpicker.depcompare').val();
            var selectedCourse = $('.selectpicker.courseselect').val();
            d3.select(".day-wise-plot").remove();
            dep_cmp(selectedCourse, selectedDeps);
          });

          $('.selectpicker.courseselect').change(function(){
            var selectedDeps = $('.selectpicker.depcompare').val();
            var selectedCourse = $('.selectpicker.courseselect').val();
            d3.select(".day-wise-plot").remove();
            dep_cmp(selectedCourse, selectedDeps);
          });

          var options3 = $("#dep-options-2");
          for(var j=0;j<deps.length;j++) {
            options3.append($('<option class="dep-items-2"></option>').val(j).html(deps[j]));
          }
         
          $('.selectpicker.depselect').selectpicker('refresh');
          $('.selectpicker.depselect').val(6);
          $('.selectpicker.depselect').selectpicker('render');
          
          dep_donut(6);
          $('.selectpicker.depselect').change(function(){
            var selectedDep = $('.selectpicker.depselect').val();
            d3.selectAll(".dep-wise-donut").remove();
            dep_donut(selectedDep);
          });

          genderbar();


        var secos = [['Consulting',18], ['Core',86], ['Data', 29], ['Finance', 14], ['Non-Core', 31], ['SDE', 72]];

        var xsector = d3.scale.ordinal()
        .rangeRoundBands([0, 500], .1);
        var ysector = d3.scale.linear()
        .range([200, 0]);
        var xAxis = d3.svg.axis()
        .scale(xsector)
        .orient("bottom");
        xsector.domain(secos.map(function(d) { return d[0]; }));
        ysector.domain([0, 90]);

        var sectorsvg = d3.select("#sectorsvg").append("svg").attr("class","sector")
        .attr("width", 500)
        .attr("height", 220)
        .append("g").style("transform","translate(0px,10px)")



          var bar = sectorsvg.selectAll(".bari")
            .data(secos)
            .enter().append("g")
            .attr("class", "bari")

            bar.append("rect")
            .attr("x", function(d){
              return xsector(d[0]);
            })
            .attr("y",15)
            .attr("width", 60)
            .attr("height", function(d) { 
              return 200 - ysector(d[1]); })
            .attr('fill',function(d,i){
              return coldep[deps[i]];
            });
          
            bar.append("text")
            .attr("y", 10)
            .attr("x", function(d){
              return xsector(d[0])+30;
            })
            .attr("text-anchor", "middle")
            .style("fill","#333")
            .text(function(d) { return d[0]; });

            bar.append("text")
            .attr("y", 30)
            .attr("x", function(d){
              return xsector(d[0])+30;
            })
            .attr("text-anchor", "middle")
            .style("fill","#333").style("font-weight",'800').attr("stroke","#eee").attr("stroke-width",1)
            .text(function(d) { return d[1]; });



        var svg = d3.select("#compsvg").append("svg").attr("class","compsvg1-plot").attr("width", 500).attr("height", 400).append("g");
        var  x = d3.scale.linear().range([70,470]);
        var  y = d3.scale.linear().range([330, 20]);
        placenumber_plot(svg,x,y,"Company Profiles Each Day",40, -400);

      svg.selectAll(".linecomp").data(companycount)
      .enter().append("line")
      .attr("class", "linecomp")
      .attr("x1",function(d,j){
        //console.log(j,d,j+1,name[1][j+1]);
        return x(j+1);
      })
      .attr("x2",function(d,i){
        if (i===17) return x(i+1);
        return x(i+2);
      })
      .attr("y1",function(d,i){
        if(i===17) return y(d)
        return y(d);
      })
      .attr("y2",function(d,j){
        if (j===17) return y(d);
        return y(companycount[j+1]);
      })
      .style("fill", "none")
      .style("stroke-width","1.5").style("stroke",function(d){ 
        return coldep[deps[1]];
    });

    svg.selectAll("circlecomp").data(companycount)
    .enter().append("circle")
      .attr("class", "circlecomp")
      .attr("cx",function(d,j){
        //console.log(j,d,j+1,name[1][j+1]);
        return x(j+1);
      })
      .attr("cy",function(d,i){
        return y(d);
      })
      .attr("r",3)
      .style("fill", function(d){ 
        return coldep[deps[1]];
    }).append("title").text(function(d){return d});

      $(".part-1-button").click(function(){
        $(".part-1-button").css("background-color","#333").css("color","#eee");
        $(".part-2-button").css("background-color","#F1C40F").css("color","#333");
        $(".part-3-button").css("background-color","#F1C40F").css("color","#333");
        window.location="#part1";

      });
      $(".part-2-button").click(function(){
        $(".part-2-button").css("background-color","#333").css("color","#eee");
        $(".part-1-button").css("background-color","#F1C40F").css("color","#333");
        $(".part-3-button").css("background-color","#F1C40F").css("color","#333");
        window.location="#part2";

      });
      $(".part-3-button").click(function(){
        $(".part-3-button").css("background-color","#333").css("color","#eee");
        $(".part-2-button").css("background-color","#F1C40F").css("color","#333");
        $(".part-1-button").css("background-color","#F1C40F").css("color","#333");
        window.location="#part3";

      });

      /*    var unplaced_peeps = unplaced_db.find();
          var ppo_peeps = ppo_db.find();
          var peeps = placed_db.find({'Acceptance': 'ACCEPTED'});
      
          var placed_ug_cgs = peeps.map(function(d){
          if (d['Course']==='1' || d['Course']==='2' || d['Course']==='3'){
            return Number(d['Current CGPA']); 
          }
        });
        var unplaced_ug_cgs = unplaced_peeps.map(function(d){
          if (d['Course']==='1' || d['Course']==='2' || d['Course']==='3'){
            return Number(d['CGPA']); 
          } 
        });
        var ppo_ug_cgs = ppo_peeps.map(function(d){
          if (d['Course']==='1' || d['Course']==='2' || d['Course']==='3'){
            return Number(d['CGPA']); 
          }
        });
        var total_ug_cgs=placed_ug_cgs.concat(unplaced_ug_cgs);
        total_ug_cgs=total_ug_cgs.concat(ppo_ug_cgs);

        var x1 = d3.scale.linear()
          .domain([5, 10])
          .range([0, 400]);
        
        var datatotal = d3.layout.histogram()
          .bins(x1.ticks(10))
          (total_ug_cgs);


        var dataunplaced = d3.layout.histogram()
          .bins(x1.ticks(10))
          (unplaced_ug_cgs);

    
       
        var y1 = d3.scale.linear()
        .domain([0, d3.max(datatotal, function(d) { return d.y; })])
        .range([250, 0]);



        var cgsvg1 = d3.select("#cgsvg").append("svg").attr("class","cghist_1").style("margin","10px")
        .attr("width", 450)
        .attr("height", 350)
        .append("g")
        .attr("transform", "translate(20,0)");

        hist(cgsvg1,datatotal,x1,y1,dataunplaced,'UG');

        var placed_pg_cgs = peeps.map(function(d){
          if (d['Course']!='1' && d['Course']!='2' && d['Course']!='3'){
            return Number(d['Current CGPA']); 
          }
        });
        var unplaced_pg_cgs = unplaced_peeps.map(function(d){
          if (d['Course']!='1' && d['Course']!='2' && d['Course']!='3'){
            return Number(d['CGPA']); 
          } 
        });
        var ppo_pg_cgs = ppo_peeps.map(function(d){
          if (d['Course']!='1' && d['Course']!='2' && d['Course']!='3'){
            return Number(d['CGPA']); 
          }
        });
        var total_pg_cgs=placed_pg_cgs.concat(unplaced_pg_cgs);
        total_pg_cgs=total_pg_cgs.concat(ppo_pg_cgs);

        var x1 = d3.scale.linear()
          .domain([5, 10])
          .range([0, 400]);
        
        var datatotal = d3.layout.histogram()
          .bins(x1.ticks(10))
          (total_pg_cgs);


        var dataunplaced = d3.layout.histogram()
          .bins(x1.ticks(10))
          (unplaced_pg_cgs);

    
       
        var y1 = d3.scale.linear()
        .domain([0, d3.max(datatotal, function(d) { return d.y; })])
        .range([250, 0]);



        var cgsvg2 = d3.select("#cgsvg").append("svg").attr("class","cghist_2").style("margin","10px")
        .attr("width", 450)
        .attr("height", 350)
        .append("g")
        .attr("transform", "translate(20,0)");

        hist(cgsvg2,datatotal,x1,y1,dataunplaced,'PG');



        var secos = [['Consulting',18], ['Core',86], ['Data', 29], ['Finance', 14], ['Non-Core', 31], ['SDE', 72]];

        var xsector = d3.scale.ordinal()
        .rangeRoundBands([0, 500], .1);
        var ysector = d3.scale.linear()
        .range([200, 0]);
        var xAxis = d3.svg.axis()
        .scale(xsector)
        .orient("bottom");
        xsector.domain(secos.map(function(d) { return d[0]; }));
        ysector.domain([0, 90]);

        var sectorsvg = d3.select("#sectorsvg").append("svg").attr("class","sector")
        .attr("width", 500)
        .attr("height", 200)
        .append("g")



          var bar = sectorsvg.selectAll(".bari")
            .data(secos)
            .enter().append("g")
            .attr("class", "bari")

            bar.append("rect")
            .attr("x", function(d){
              return xsector(d[0]);
            })
            .attr("y",15)
            .attr("width", 60)
            .attr("height", function(d) { 
              return 200 - ysector(d[1]); })
            .attr('fill',function(d,i){
              return coldep[deps[i]];
            });
          
            bar.append("text")
            .attr("y", 10)
            .attr("x", function(d){
              return xsector(d[0])+30;
            })
            .attr("text-anchor", "middle")
            .style("fill","#eee")
            .text(function(d) { return d[0]; });

            bar.append("text")
            .attr("y", 30)
            .attr("x", function(d){
              return xsector(d[0])+30;
            })
            .attr("text-anchor", "middle")
            .style("fill","#333333").style("font-weight",'800')
            .text(function(d) { return d[1]; });


				$("#nav-dep").click(function(){
					$("#dep-tab").css("display","block");
					$("#home-tab").css("display","none");
					$("#company-tab").css("display","none");

					d3.selectAll(".dep-items").remove();

					var options = $("#dep-options");
					var options2 = $("#dep-options-2");
					//console.log(deps.length);
					for(var j=0;j<deps.length;j++) {
						options.append($('<option class="dep-items"></option>').val(j).html(deps[j]));
						options2.append($('<option class="dep-items"></option>').val(j).html(deps[j]));
						//options.append($('<option></option>').val(j).html(companies[j].toLowerCase().toTitleCase()));
					}
					$('.selectpicker.depwala').selectpicker('refresh');
					$('.selectpicker.depcompare').selectpicker('refresh');
					d3.select(".day-wise-plot").remove();
					d3.selectAll(".salary").remove();
					d3.selectAll(".compare").remove();
					d3.selectAll(".nopiesvg").remove();
					d3.selectAll(".cghist").remove();
          d3.selectAll(".cghist_pg").remove();
          $("#companylist").html("");
					$('.selectpicker.depwala').val(6);
					$('.selectpicker.depcompare').val(['0','4']);
					$('.selectpicker.depcompare').selectpicker('render');
					$('.selectpicker.depwala').selectpicker('render');
					dep_page(6,['0','4']);

					$('.selectpicker.depwala').change(function(){
						var selectedDepIndex = $('.selectpicker.depwala').val();
						var selectedDeps = $('.selectpicker.depcompare').val();
						
						d3.select(".day-wise-plot").remove();
						d3.selectAll(".compare").remove();
						d3.selectAll(".salary").remove();
						//d3.select(".sexpiesvg").remove();
						d3.selectAll(".nopiesvg").remove();
						d3.selectAll(".cghist").remove();
            d3.selectAll(".cghist_pg").remove();
            $("#companylist").html("");
						dep_page(selectedDepIndex,selectedDeps);
					});


					$('.selectpicker.depcompare').change(function(){

						var selectedDepIndex = $('.selectpicker.depwala').val();
						var selectedDeps = $('.selectpicker.depcompare').val();
						d3.select(".day-wise-plot").remove();
						d3.selectAll(".salary").remove();
						d3.selectAll(".nopiesvg").remove();
						d3.selectAll(".cghist").remove();
            d3.selectAll(".cghist_pg").remove();
            $("#companylist").html("");
						//console.log(selectedDepIndex);
						
						d3.selectAll(".compare").remove();
						dep_page(selectedDepIndex,selectedDeps);
					});

				});

			

				$("#nav-company").click(function(){
					$("#home-tab").css("display","none");
					$("#dep-tab").css("display","none");
					$("#company-tab").css("display","block");
					d3.selectAll(".company-items").remove();
					var options = $("#comp-options");
					companies.sort();
					for(var j=0;j<companies.length;j++) {
						options.append($('<option class="company-items"></option>').val(j).html(companies[j]));
						//options.append($('<option></option>').val(j).html(companies[j].toLowerCase().toTitleCase()));
					}
					$('.selectpicker.comp-wala').selectpicker('refresh');
					d3.select(".bar-svg-plot").remove();
					d3.select(".sexpiesvg").remove();
					d3.select(".nopiesvg").remove();
					populate_company_page(99);
					$('.selectpicker.comp-wala').change(function(){
						var selectedCompanyIndex = $('.selectpicker.comp-wala').val();
						//console.log(selectedCompanyIndex);
						populate_company_page(selectedCompanyIndex);
						d3.select(".bar-svg-plot").remove();
						d3.select(".sexpiesvg").remove();
						d3.select(".nopiesvg").remove();
					});
				});

				$("#nav-home").click(function(){
					$("#home-tab").css("display","block");
					$("#dep-tab").css("display","none");
					$("#company-tab").css("display","none");
				});

        */
};