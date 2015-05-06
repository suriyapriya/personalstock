$( document ).on( "pageshow", "#formbuy", function() {
    var userdet = getCurrentUserDetails();
    var symbol = stockname_to_buy_or_sell;
    $("#formbuysymbol").html(symbol);
    $("#formbuycashavail").html("$ " + userdet.account.cash.toFixed(2));
    getSingleStockValue(symbol, function(symbols, price) {
        var perstock = getPerStockPrice(price);
        var maxno = Math.floor(userdet.account.cash/perstock);
        $("#formbuyname").html(price.Name);
        $("#formbuyprice").html(perstock);
        $("#formbuyslider").val(maxno);
        $("#formbuyslider").attr("max", maxno).slider("refresh");
        $("#formbuycashspend").html("$ "+ (maxno*perstock).toFixed(2));
        $("#formbuycashremain").html("$ "+ (userdet.account.cash-maxno*perstock).toFixed(2));
        $("#formbuyslider").on("slidestart slidestop", function() {
            var tobuy = parseInt($("#formbuyslider").val());
            $("#formbuycashspend").html("$ "+ (tobuy*perstock).toFixed(2));
            $("#formbuycashremain").html("$ "+ (userdet.account.cash-tobuy*perstock).toFixed(2));
        });
        console.log(perstock);
        $("#formbuysubmit").click(function() {
            var symbol = stockname_to_buy_or_sell;
            if (symbol === "") {
                stockname_to_buy_or_sell = '';
                $.mobile.navigate("#trade");
                return false;
            }
            var tobuy = parseInt($("#formbuyslider").val());
            if (tobuy <=0 || tobuy > maxno) {
                stockname_to_buy_or_sell = '';
                $.mobile.navigate("#trade");
                return false;
            }
            var buy_stock_price = parseFloat($("#formbuyprice").html());
            var buy_stock_name = $("#formbuyname").html();
            console.log(tobuy, buy_stock_price);
            var userdet = getCurrentUserDetails();
            userdet.account.cash -= tobuy*buy_stock_price;
            if (!(symbol in userdet.account.stocks))
                userdet.account.stocks[symbol] = 0;
            userdet.account.stocks[symbol] += tobuy;
            var comment = "Buy "+tobuy+" stocks of "+symbol+" - '"+buy_stock_name+"' @ $"+buy_stock_price+" each";
            userdet.account.history.push([Date(), comment, -tobuy*buy_stock_price]);
            saveUserDetails(userdet);
            alert("Stocks bought for $ "+tobuy*buy_stock_price);
            stockname_to_buy_or_sell = '';
            $.mobile.navigate("#trade");
            return false;
        });
    });
});

$( document ).on( "pageshow", "#formsell", function() {
    var userdet = getCurrentUserDetails();
    var symbol = stockname_to_buy_or_sell;
    $("#formsellsymbol").html(symbol);
    getSingleStockValue(symbol, function(symbols, price) {
        var perstock = getPerStockPrice(price);
        var maxno = Math.floor(userdet.account.stocks[symbol]);
        $("#formsellname").html(price.Name);
        $("#formsellprice").html(perstock);
        $("#formsellslider").val(maxno);
        $("#formsellslider").attr("max", maxno).slider("refresh");
        $("#formsellcashtotal").html("$ "+ (maxno*perstock).toFixed(2));
        $("#formsellslider").on("slidestart slidestop", function() {
            var tosell = parseInt($("#formsellslider").val());
            $("#formsellcashtotal").html("$ "+ (tosell*perstock).toFixed(2));
        });
        $("#formsellsubmit").click(function() {
            var symbol = stockname_to_buy_or_sell;
            var tosell = parseInt($("#formsellslider").val());
            if (tosell <= 0 || tosell > maxno)
                return false;
            var sell_stock_price = parseFloat($("#formsellprice").html());
            var sell_stock_name = $("#formsellname").html();
            var userdet = getCurrentUserDetails();
            userdet.account.cash += tosell*sell_stock_price;
            if (!(symbol in userdet.account.stocks))
                return false;
            userdet.account.stocks[symbol] -= tosell;
            if (userdet.account.stocks[symbol] === 0)
                delete userdet.account.stocks[symbol];
            var comment = "Sell "+tosell+" stocks of "+symbol+" - '"+sell_stock_name+"' @ $"+sell_stock_price+" each";
            userdet.account.history.push([Date(), comment, +tosell*sell_stock_price]);
            saveUserDetails(userdet);
            alert("Stocks sold for $ "+tosell*sell_stock_price);
            stockname_to_buy_or_sell = '';
            $.mobile.navigate("#trade");
            return false;
        });
    });
});
