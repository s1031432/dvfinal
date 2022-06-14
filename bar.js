total = [];
totalMoney = 0;
function redrawBar(stocknumber, stockname, startDate, endDate, money, mode, longshort){
    var dim = {
        width: 960, height: 360,
        margin: { top: 20, right: 50, bottom: 30, left: 50 },
        ohlc: { height: 305 },
        indicator: { height: 65, padding: 5 }
    };
    dim.plot = {
        width: dim.width - dim.margin.left - dim.margin.right,
        height: dim.height - dim.margin.top - dim.margin.bottom
    };
    dim.indicator.top = dim.ohlc.height+dim.indicator.padding;
    dim.indicator.bottom = dim.indicator.top+dim.indicator.height+dim.indicator.padding;

    var indicatorTop = d3.scaleLinear()
            .range([dim.indicator.top, dim.indicator.bottom]);

    var parseDate = d3.timeParse("%d-%b-%y");

    var zoom = d3.zoom()
            .on("zoom", zoomed);

    var x = techan.scale.financetime()
            .range([0, dim.plot.width]);

    var y = d3.scaleLinear()
            .range([dim.ohlc.height, 0]);

    var yPercent = y.copy();   // Same as y at this stage, will get a different domain later

    var yInit, yPercentInit, zoomableInit;

    // var yVolume = d3.scaleLinear()
    //         .range([y(0), y(0.2)]);

    var candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

    var xAxis = d3.axisBottom(x);

    var timeAnnotation = techan.plot.axisannotation()
            .axis(xAxis)
            .orient('bottom')
            .format(d3.timeFormat('%Y-%m-%d'))
            .width(65)
            .translate([0, dim.plot.height]);

    var yAxis = d3.axisRight(y);

    var ohlcAnnotation = techan.plot.axisannotation()
            .axis(yAxis)
            .orient('right')
            .format(d3.format(',.2f'))
            .translate([x(1), 0]);

    // * 
    var percentAxis = d3.axisLeft(yPercent)
            .tickFormat((f => d => f((d + 1)/100))(d3.format('+.1%')));
            
    var percentAnnotation = techan.plot.axisannotation()
            .axis(percentAxis)
            .orient('left');

    var ohlcCrosshair = techan.plot.crosshair()
            .xScale(timeAnnotation.axis().scale())
            .yScale(ohlcAnnotation.axis().scale())
            .xAnnotation(timeAnnotation)
            .yAnnotation([ohlcAnnotation, percentAnnotation])
            .verticalWireRange([0, dim.plot.height]);
    
    var svg = d3.select("#bar").insert("svg")
            .attr("width", dim.width)
            .attr("height", dim.height);

    var defs = svg.append("defs");

    defs.append("clipPath")
            .attr("id", "ohlcClip")
        .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", dim.plot.width)
            .attr("height", dim.ohlc.height);

    defs.selectAll("indicatorClip").data([0, 1])
        .enter()
            .append("clipPath")
            .attr("id", function(d, i) { return "indicatorClip-" + i; })
        .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) { return indicatorTop(i); })
            .attr("width", dim.plot.width)
            .attr("height", dim.indicator.height);

    svg = svg.append("g")
            .attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");

    svg.append('text')
            .attr("class", "symbol")
            .attr("x", 20)
            .text(stockname+" ("+stocknumber+")");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dim.plot.height + ")");

    var ohlcSelection = svg.append("g")
            .attr("class", "ohlc")
            .attr("transform", "translate(0,0)");

    ohlcSelection.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + x(1) + ",0)")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -12)
            .attr("dy", ".71em")
            .style("text-anchor", "end")

    ohlcSelection.append("g")
            .attr("class", "candlestick")
            .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
            .attr("class", "percent axis");

    // Add trendlines and other interactions last to be above zoom pane
    svg.append('g')
            .attr("class", "crosshair ohlc");


    // stocknumber, stockname, startDate, endDate, money
    d3.csv("http://127.0.0.1:5000/"+stocknumber+"/"+startDate+"/"+endDate+"/"+money, function(error, data) {

        console.log("dataAAA", mode, longshort, money, data);
        var accessor = candlestick.accessor(),
            indicatorPreRoll = 2;  // Don't show where indicators don't have data
        if(longshort == "short"){
            for(var i=1;i<data.length;i++){
                data[i].income = parseFloat(data[i].income)*-1;
                data[i].money = parseFloat(data[i]) + parseFloat(data[i].income);
                data[i].profit = parseFloat(data[i].money) / parseFloat(data[i-1].money);
                data[i].totalProfit = parseFloat( data[0].Close ) / parseFloat( data[i].Close )
            }
        }
        
        if(!total.length){
            total = data;
            totalMoney = parseInt(totalMoney) + parseInt(money);
        }
        else{
            if(mode == "add"){
                totalMoney = parseInt(totalMoney) + parseInt(money);
                for(var i=0;i<total.length;i++){
                    console.log(typeof total[i].income, typeof data[i].income)
                    total[i].income = parseFloat(total[i].income) + parseFloat(data[i].income);
                }
            }
            else{
                totalMoney = parseInt(totalMoney) - parseInt(money);
                for(var i=0;i<total.length;i++){
                    total[i].income = parseFloat(total[i].income) - parseFloat(data[i].income);
                }
            }
        }
        rank(data, stocknumber, mode, longshort, money, startDate, endDate);

        for(var i=0;i<total.length;i++){
            total[i].Open  =  String(0);
            total[i].High  =  total[i].income >= 0 ? total[i].income : String(0);
            total[i].Low   =  total[i].income >= 0 ? total[i].income : String(0);
            total[i].Close =  total[i].income;
        }
        if(!totalMoney){
            $("#startDate").attr("disabled", false);
            $("#startDate").css("cursor", "");
            $("#endDate").attr("disabled", false);
            $("#endDate").css("cursor", "");
        }
        
        data = total;
        console.log(data, totalMoney);

        data = data.map(function(d) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
        console.log(data)
        x.domain(techan.scale.plot.time(data).domain());

        y.domain(techan.scale.plot.ohlc(data.slice(indicatorPreRoll)).domain());
        yPercent.domain(techan.scale.plot.percent(y, accessor(data[indicatorPreRoll])).domain());

        svg.select("g.candlestick").datum(data).call(candlestick);
        svg.select("g.crosshair.ohlc").call(ohlcCrosshair).call(zoom);

        // Stash for zooming
        zoomableInit = x.zoomable().domain([indicatorPreRoll, data.length]).copy(); // Zoom in a little to hide indicator preroll
        yInit = y.copy();
        yPercentInit = yPercent.copy();

        draw();
    });


    function zoomed() {
        x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
        y.domain(d3.event.transform.rescaleY(yInit).domain());
        yPercent.domain(d3.event.transform.rescaleY(yPercentInit).domain());
        draw();
    }

    function draw() {
        svg.select("g.x.axis").call(xAxis);
        svg.select("g.ohlc .axis").call(yAxis);
        svg.select("g.percent.axis").call(percentAxis);

        // We know the data does not change, a simple refresh that does not perform data joins will suffice.
        svg.select("g.candlestick").call(candlestick.refresh);
        svg.select("g.crosshair.ohlc").call(ohlcCrosshair.refresh);
    }
}