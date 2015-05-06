/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var no_of_users = 0;

$(".required").html("");

function getPerStockPrice(stock)
{
    var perstock = stock.AskRealtime;
    if (perstock === 0 || perstock === null || perstock === "")
        perstock = stock.Ask;
    return perstock;
}


$(document).ready(function(){
    //$.getScript("js/stockmodel.js");
    //emptyLocalStorage();
    if(typeof(Storage) === "undefined")
    {
        console.log("Browser not supported local storage");
        return;
    }
    
    $("#next1").click(function(){
        var un = $("#username").val();
        var passwd = $('#passwd').val();
        var repasswd = $('#repasswd').val();

        if(un === null || $.trim(un) === "" 
            || passwd === null || $.trim(passwd) === ""
            || repasswd === null || $.trim(repasswd) === "")
        {
            $("#createaccount .required").html("Enter the required fields");
            return false;
        }
        if(passwd !== repasswd)
        {
            $("#createaccount .required").html("passwd doesn't match");
            return false;
        }
    });
    
    $("#next2").click(function()
    {
      var user = $("#username").val();
      var deposit = parseInt($("#deposit").val());
      var accno = parseInt($("#moneydepositaccountno").val());
      var bank = $("#moneydepositaccountbank").val();
      console.log(accno, accno)
      if(isNaN(deposit) || isNaN(accno))
      {
        $("#depositPage .required").html("Enter the required fields - Account No, Deposit Amount should be numbers");
        return false;
      }
      if(deposit < 100)
      {
        console.log("less than 100");
        $("#depositPage .required").html("Deposit Amount must be 100 or more");    
        return false;
      }
      $("#confirminfo").append("<p>Account Name: " + user + "</p>" + "<p> Current Deposit: "
              + deposit + "</p>" );
    });

    $("#signupchangephoto").click(function() {
        navigator.camera.getPicture(signupPhotoOnSuccess, signupPhotoOnFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI });

        function signupPhotoOnSuccess(imageURI) {
            $("#signupphoto").attr('src', imageURI);
        }

        function signupPhotoOnFail(message) {
            alert('Failed because: ' + message);
        }
    });
    $("#confirm").click(function()
    {
        $("#signup").submit();
    });

  $("#signup").submit(function(event) {
        $(".required").html("");
        var un = $("#username").val();
        var passwd = $('#passwd').val();
        console.log("user: "+ un);
        console.log("passwd: " + passwd);
        if(!storeNewUser(un, passwd))
        {
            console.log("Already Username exists");
            $("#createaccount .required").html("Already Username exists");
            return false;
        }
      var deposit = $("#deposit").val();
      var user = $("#username").val(); 
      var accno = parseInt($("#moneydepositaccountno").val());
      var bank = $("#moneydepositaccountbank").val();
      var photo = $("#signupphoto").attr('src');
      console.log("User deposit: " + user);
      storeDeposit(user, deposit, bank, accno, photo);
      return false;
  });
  
  $("#deposit").submit(function(event) {
  });
  
  $("#register").click(function(){
      console.log("sign up page");
      $("#registerpage").load("signup.html #pagetwo div");
  });
  
  $("#login").click(function()
  {
        $("#pageone .required").html("");
        var un = $("#user").val();
        var passwd = $("#pwd").val();
        console.log(un);

        if(!checkLogin(un, passwd))
        {
            $("#pageone .required").html("Account not exists");
            return false;
        }        
  });
});

function getSingleStockValue(symbol, callback)
{
    if (symbol === "")
        return;
    $.get("http://query.yahooapis.com/v1/public/yql?q=select%20Name,AskRealtime,Ask%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" +
            symbol + "%22)&format=json&env=store://datatables.org/alltableswithkeys", function(data) {
                if (callback)
                    callback(symbol, data.query.results.quote);
    }).fail(function(){
        console.err("failure");
    });
}

function getStockValue(symbolmap, callback)
{
    var symbol_str = "";
    for(var key in symbolmap) {
        symbol_str += key + ",";
    }
    $.get("http://query.yahooapis.com/v1/public/yql?q=select%20Name,AskRealtime,Ask%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" +
            symbol_str + "%22)&format=json&env=store://datatables.org/alltableswithkeys", function(data) {
                var res = {};
                var i=0;
                if (Object.keys(symbolmap).length == 1) {
                    for(var key in symbolmap)
                        res[key] = data.query.results.quote;
                } else {
                    for(var key in symbolmap) {
                        res[key] = data.query.results.quote[i];
                        i++;
                    }
                }
                if (callback)
                    callback(symbolmap, res);
    }).fail(function(){
        console.err("failure");
    });
}

//global variable - stock to buy or sell
var stockname_to_buy_or_sell;

$( document ).on( "pagebeforeshow", "#account", function() {
    var userdet = getCurrentUserDetails();
    $("#account_cash").html("$" + userdet.account.cash.toFixed(2));
    $("#account_stocks").html("");
    getStockValue(userdet.account.stocks, function(symbols, prices) {
        var total_stock = 0;
        for(var key in symbols) {
            var perprice = getPerStockPrice(prices[key]);
            $("#account_stocks").append(
                    "<li><table width=\"100%\"><tr><td><h4>" + prices[key].Name + "</h4><p>" + 
                    key + " - " + symbols[key] + " Stocks @ $" + perprice + " each" +
                    "</p></td>" +
                    "<td align=\"right\"><h1>$" + (symbols[key] * perprice).toFixed(2) +
                    //" <a class=\"ui-btn ui-btn-inline\">Sell</a>" +
                    "</h1></td></tr></table></li>");
            total_stock += symbols[key] * perprice;
        }
        //$("#account_stocks").listview('refresh');
        $("#account_total").html("$" + (total_stock + userdet.account.cash).toFixed(2));
        $("#account_total_stock").html("$" + total_stock.toFixed(2));
        $("#account_stocks").listview( "refresh" );
    });

});
$( document ).on( "pagebeforeshow", "#trade", function() {
    var userdet = getCurrentUserDetails();
    $("#buysymbolstocks").html("");
    $.each(all_stock_symbols, function(i, val) {
        $("#buysymbolstocks").append("<li><a href='#' class='buysymbol-item'>" + val[0] + " - " + val[1] + "</a></li>");
    });
    $("a.buysymbol-item").click(function() {
        $("#buysymboltext").val( $( this ).text() );
        $("#buysymbolstocks li" ).addClass('ui-screen-hidden');
    });
    $("#trade_stocks").html("");
    getStockValue(userdet.account.stocks, function(symbols, prices) {
        for(var key in symbols) {
            var perprice = getPerStockPrice(prices[key]);
            $("#trade_stocks").append(
                    "<li data-filtertext=\"" + prices[key].Name + " " + key + "\"><table width=\"100%\">"+
                    "<tr><td><h4>" + prices[key].Name + "</h4><p>Symbol:" + 
                    key + " <br/> " + symbols[key] + " Stocks <br/> $" + perprice + " each" +
                    "</p></td>" +
                    "<td align=\"right\"><p>$" + (symbols[key] * perprice).toFixed(2) +
                    " <a id='buysymbol-"+key+"' href='javascript:void(0)' class=\"ui-btn ui-shadow ui-icon-plus ui-btn-inline ui-btn-icon-notext\">Buy</a>" +
                    "<a id='sellsymbol-"+key+"' href=\"#formsell\" class=\"ui-btn ui-shadow ui-icon-minus ui-btn-inline ui-btn-icon-notext\">Sell</a>" +
                    "</p></td></tr></table></li>");
            $("#buysymbol-"+key).on("click", function() {
                stockname_to_buy_or_sell = $(this).attr("id").split("-")[1];
                $.mobile.navigate("#formbuy");
            });
            $("#sellsymbol-"+key).on("click", function() {
                stockname_to_buy_or_sell = $(this).attr("id").split("-")[1];
                $.mobile.navigate("#formsell");
            });
        }
        $("#trade_stocks").listview( "refresh" );
    });
    $("#buysymbolstocks").listview( "refresh" );
    $("#buysymbolbutton").click(function() {
        stockname_to_buy_or_sell = $("#buysymboltext").val().split(" ")[0];
        $.mobile.navigate("#formbuy");
    });
});

// http://demos.jquerymobile.com/1.4.5/toolbar-fixed-persistent/index.html
$(function() {
        $( "[data-role='navbar']" ).navbar();
        $( "[data-role='header']" ).toolbar();
});
$( document ).on( "pagecontainerchange", function(event, ui) {
    var current = $(".ui-page-active").attr('id');
    $( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
    // Add active class to current nav button
    $( "[data-role='navbar'] a" ).each(function() {
        if ( $( this ).text().toLowerCase() === current ) {
                $( this ).addClass( "ui-btn-active" );
        }
    });
});

$( document ).on( "pagebeforeshow", "#signout", function() {
    signOutCurrentUser();
    $.mobile.navigate("");
});

$( document ).on( "pagebeforeshow", "#createaccount", function() {
    $(".required").html("");
});

$( document ).on( "pageshow", "#pageone", function() {
    $(".required").html("");
});
$( document ).on( "pageshow", "#reports", function() {
    $(".required").html("");
});
$( document ).on( "pageshow", "#depositpage", function() {
    $(".required").html("");
});
$( document ).on( "pageshow", "#confirmpage", function() {
    $(".required").html("");
});
