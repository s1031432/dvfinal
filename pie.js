function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}
function redrawAddPie() {
    $("#pie1").empty();
    $("#pie1").html('<svg id="addPieChart" width="240" height="240"></svg><div id="addText"></div>');
    var adddata = { "name": [], "money": [], "percent": [] };
    for (var i = 0; i < addrank.length; i++) {
        adddata.money.push(addrank[i].money * addrank[i].percent - addrank[i].money)
        adddata.name.push(addrank[i].name)
        adddata.percent.push(addrank[i].percent)
        // data.push({"name":addrank[i].name, "money":addrank[i].money*addrank[i].percent, "percent":addrank[i].percent})
    }
    console.log(adddata)
    
    var width = 240,
        height = 240,
        radius = Math.min(width, height) / 2;

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d; });

    var svg = d3.select("#addPieChart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(adddata.money))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            let addTotal = adddata.money.reduce((partialSum, a) => partialSum + a, 0);
            console.log(addTotal)
            eachColor = (255 - Math.round(adddata.money[d.index] / addTotal * 220)).toString(16);
            return "#" + String(eachColor) + "FF" + String(eachColor);
        });

    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return adddata.name[d.index]
        });
    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", "1.35em")
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return "$" + separator(d.data.toFixed(2))
        });
        
    d3.selectAll('.arc path')
        .style('cursor', 'pointer')
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .style('transform', 'scale(1.05)')
        })
        .on('mouseleave', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .style('transform', 'scale(1)')
        })
    let addTotal = adddata.money.reduce((partialSum, a) => partialSum + a, 0);
    $("#addText").append("獲利：$"+separator(addTotal.toFixed(2)))
}

function redrawSubPie() {
    $("#pie2").empty();
    $("#pie2").html('<svg id="subPieChart" width="240" height="240"></svg><div id="subText"></div>');

    var subdata = { "name": [], "money": [], "percent": [] };
    for (var i = 0; i < subrank.length; i++) {
        subdata.money.push(subrank[i].money - subrank[i].money * subrank[i].percent)
        subdata.name.push(subrank[i].name)
        subdata.percent.push(subrank[i].percent)
        // data.push({"name":addrank[i].name, "money":addrank[i].money*addrank[i].percent, "percent":addrank[i].percent})
    }
    console.log("FK");
    console.log(subdata)
    var width = 240,
        height = 240,
        radius = Math.min(width, height) / 2;

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d; });

    var svg = d3.select("#subPieChart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(subdata.money))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { 
            let subTotal = subdata.money.reduce((partialSum, a) => partialSum + a, 0);
            console.log(subTotal)
            eachColor = (255 - Math.round(subdata.money[d.index] / subTotal * 220)).toString(16);
            return "#FF" + String(eachColor) + String(eachColor);
        });

    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr('text-anchor', 'middle')
        .text(function (d) {
            console.log(d);
            console.log(subdata);
            return subdata.name[d.index]
        });
    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", "1.35em")
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return "$" + separator(d.data.toFixed(2))
        });
    d3.selectAll('.arc path')
        .style('cursor', 'pointer')
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .style('transform', 'scale(1.05)')
        })
        .on('mouseleave', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .style('transform', 'scale(1)')
        })
    let subTotal = subdata.money.reduce((partialSum, a) => partialSum + a, 0);
    $("#subText").append("虧損：$"+separator(subTotal.toFixed(2)))
}
//

// var data = [
//     { name: "USA", value: 40 },
//     { name: "UK", value: 20 },
//     { name: "Canada", value: 30 },
//     { name: "Maxico", value: 10 },
// ];
// var text = "";

// var width = 260;
// var height = 260;
// var thickness = 40;
// var duration = 750;

// var radius = Math.min(width, height) / 2;
// var color = d3.scaleOrdinal(d3.schemeCategory10);

// var svg = d3.select("#pieChart")
//     .attr('class', 'pie')
//     .attr('width', width)
//     .attr('height', height);

// var g = svg.append('g')
//     .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

// var arc = d3.arc()
//     .innerRadius(radius - thickness)
//     .outerRadius(radius);

// var pie = d3.pie()
//     .value(function (d) { return d.value; })
//     .sort(null);



// var path = g.selectAll('path')
//     .data(pie(data))
//     .enter()
//     .append("g")
//     .attr('class', 'test')
//     .on("mouseover", function (d) {
//         let g = d3.select('.text-group');

//         g.select(".name-text")
//             .text(`${d.data.name}`)
//             .attr('text-anchor', 'middle')
//             .attr('dy', '-1.2em');

//         g.select(".value-text")
//             .text(`${d.data.value}`)
//             .attr('text-anchor', 'middle')
//             .attr('dy', '.6em');
//     })
//     .on("mouseout", function (d) {
//         // d3.select(this)
//         //   .style("cursor", "none")
//         //   .style("fill", color(this._current));
//     })
//     .append('path')
//     .attr('d', arc)
//     .attr('fill', (d, i) => color(i))
//     .on("mouseover", function (d) {
//         d3.select(this)
//             .style("cursor", "pointer")
//             .style("fill", "black");
//     })
//     .on("mouseout", function (d) {
//         d3.select(this)
//             .style("cursor", "none")
//             .style("fill", color(this._current));
//     })
//     .each(function (d, i) { this._current = i; });


// g.append('text')
//     .attr('text-anchor', 'middle')
//     .attr('dy', '.35em')
//     .text(text);

// let x = d3.select('.test')
//     .style("cursor", "pointer")
//     .style("fill", "black")
//     .append("g")
//     .attr("class", "text-group");

// x.append("text")
//     .attr("class", "name-text")
//     .text(`${data[0].name}`)
//     .attr('text-anchor', 'middle')
//     .attr('dy', '-1.2em');

// x.append("text")
//     .attr("class", "value-text")
//     .text(`${data[0].value}`)
//     .attr('text-anchor', 'middle')
//     .attr('dy', '.6em');