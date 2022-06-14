
addrank  = []
subrank = []

function prepend(value, array) {
    var newArray = array.slice();
    newArray.unshift(value);
    return newArray;
}

function add(longshort){
    // longshort == "long || "short"
    if(no.value && money.value && startDate.value && endDate.value){
        $("#startDate").attr("disabled", "disabled");
        $("#startDate").css("cursor", "not-allowed");
        $("#endDate").attr("disabled", "disabled");
        $("#endDate").css("cursor", "not-allowed");
        $("#bar > svg").remove();
        if(longshort == "long"){
            ls = `<span class="ant-tag ant-tag-green">多</span>`;
        }
        else{
            ls = `<span class="ant-tag ant-tag-volcano">空</span>`;
        }
        $("#tool").before(`<tr><td class="ant-table-cell">${no.value}</td><td class="ant-table-cell">${money.value}</td><td class="ant-table-cell">${startDate.value}</td><td class="ant-table-cell">${endDate.value}</td><td class="ant-table-cell" style="text-align:center;">${ls}</td><td class="ant-table-cell" style="text-align:center;"><span class="ant-tag ant-tag-volcano" onclick="del(this)">刪除</span></td></tr>`);
        redrawBar(no.value, "Profit", startDate.value, endDate.value, money.value, "add", longshort);
        // });
    }
    else{
        alert("有欄位未填或填寫錯誤")
    }
}

function del(n){
    stockNumber = $(n).parent().parent().children().eq(0).text();
    m = $(n).parent().parent().children().eq(1).text();
    if($(n).parent().parent().children().eq(4).text() == "多"){
        longshort = "long";
    }
    else{
        longshort = "short";
    }
    console.log(longshort);
    $("#bar > svg").remove();
    redrawBar(stockNumber, "Profit", startDate.value, endDate.value, m, "sub", longshort);
    $(n).parent().parent().remove();
}

function rank(data, name, mode, longshort, m, startDate, endDate){
    // m : money
    console.log(name, mode, longshort, m, startDate, endDate)
    if(mode == "add"){
        if(longshort == "long"){
            if(data[data.length-1].totalProfit > 1){
                addrank.push( { "name":name, "profit": data[0].money * data[data.length-1].totalProfit, "percent": data[data.length-1].totalProfit, "money":m, "longshort": longshort, "startDate": startDate, "endDate": endDate } );
                redrawAddPie();
            }
            else{
                subrank.push( { "name":name, "profit": data[0].money * data[data.length-1].totalProfit, "percent": data[data.length-1].totalProfit, "money":m, "longshort": longshort, "startDate": startDate, "endDate": endDate } );
                redrawSubPie();
            }
        }
        else{
            if(data[data.length-1].totalProfit < 1){
                subrank.push( { "name":name, "profit": data[0].money * data[data.length-1].totalProfit, "percent": data[data.length-1].totalProfit, "money":m, "longshort": longshort, "startDate": startDate, "endDate": endDate } );
                redrawSubPie();
            }
            else{
                addrank.push( { "name":name, "profit": data[0].money * data[data.length-1].totalProfit, "percent": data[data.length-1].totalProfit, "money":m, "longshort": longshort, "startDate": startDate, "endDate": endDate } );
                redrawAddPie();
                
            }
        }
    }
    else{
        flag = 0;
        if(!flag){
            for(var i=0;i<addrank.length;i++){
                if(addrank[i].name == name && addrank[i].longshort == longshort && addrank[i].startDate == startDate && addrank[i].endDate == endDate && addrank[i].money == m){
                    addrank.splice(i, 1);
                    flag = 1;
                    redrawAddPie();
                    break;
                }
            }
        }
        if(!flag){
            for(var i=0;i<subrank.length;i++){
                if(subrank[i].name == name && subrank[i].longshort == longshort && subrank[i].startDate == startDate && subrank[i].endDate == endDate && subrank[i].money == m){
                    subrank.splice(i, 1);
                    flag = 1;
                    redrawSubPie();
                    break;
                }
            }
        }
    }
    
    console.log("subrank", subrank);
    console.log("addrank", addrank);
    
}