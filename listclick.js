$(".ant-list-item").on("click", function(){
    stocknumber = $(this).text().split(" ")[0];
    stockname = $(this).text().split(" ")[1];
    no.value = stocknumber;
    $("#candle > svg").remove();
    redrawCandle( stocknumber, stockname );
});



$(".ant-segmented-item-label").on("click", function(){
    displaytarget = $(this).attr("title");
    $(".ant-spin-nested-loading").hide();
    $(".ant-segmented-item-selected").removeClass("ant-segmented-item-selected");
    $(this).addClass("ant-segmented-item-selected");
    $("#"+displaytarget).show();
})