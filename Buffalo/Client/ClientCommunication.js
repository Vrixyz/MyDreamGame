/**
* Created by TiTi on 2/28/2015.
*/

var $ = require('jquery');
var socket = io();

function Communication() {
    var request_id = 0;
/*
    this.postRequest = function(methodString, params, callback) {
        var request = {};
        request.method = methodString;
        request.params = params;
        request.id = request_id++;
        request.jsonrpc = "2.0";

        $.post(url, JSON.stringify(request), callback, "json");
    } */
    
    this.authenticate = function(id) {
       socket.emit('registerAsPlayer', {id:id});
    }
    
    this.setStatusAttack = function(player) {
       socket.emit('setStatusAttack', null);
    }
    this.setStatusDefense = function(player) {
       socket.emit('setStatusDefense', null);
    }
    this.setStatusReload = function(player) {
       socket.emit('setStatusReload', null);
    }
    
    this.battleOver = function(human){}; // to override
    this.battleStarted = function(human){}; // to override

}

socket.on("roundEnded", function(msg) {
    console.log("roundEnded");
});

socket.on('battleStarted', function (msg) { // ugly
    console.log('battleStarted: ' +  Util.inspect(msg));
   $("#popupBattle").get(0).style.display = "block";
   $("#popupWaiting").get(0).style.display = "none";
   
    com.battleStarted(msg); // msg should be the id of the winner
});

socket.on('battleOver', function (msg) { // ugly
    console.log('battleOver: ' +  Util.inspect(msg));
   $("#popupBattle").get(0).style.display = "none";
   $("#popupWaiting").get(0).style.display = "block";
   
    com.battleStarted(msg); // msg should be the id of the winner
});

var com = new Communication();

// minimal parsing of data received
var Util = require('util');

//var global = require("./Global");

module.exports = com;