/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *//*
var express = require('express');
var http = require('http');
var url = require('url');
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);

getStock = function (req, res)
{
    console.log("Received by server");
    var obj = req.body;
    console.log(obj);
    res.json({val:0});
};
app.get('/getStock', getStock);

var options = {
  host: 'http://query.yahooapis.com/v1/public/yql',
  path: 'q=select%20Symbol,DaysLow%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22CSCO%22,%22GOOG%22)&format=JSON&env=store://datatables.org/alltableswithkeys'
};

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

*/

