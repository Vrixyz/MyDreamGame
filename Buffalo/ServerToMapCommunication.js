/**
* Created by TiTi on 2/28/2015.
*/

// Connect to server
var io = require('socket.io-client')
var socket = io.connect('http://localhost:3000/server/api', {reconnect: true});

var $ = require('jquery');

var Battle = require("./Battle");

var clientsManager = require("./ClientsManager");

var PlayerBot = require("./PlayerBot");

//var socket = io('/server/api');
socket.on('connection', function(socket){
  console.log('someone connected');
});

socket.on('connect', function(socket){
  console.log('connected to map server as client!');
});

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
    
    this.battleOver = function(human){}; // to override
    this.battleStarted = function(human){}; // to override
    //
    this.startBattle = function(idAttacker, idAttacked) { // to override ! put that code elsewhere
        console.log('startBattle');
        var newBattle = new Battle(socket);
        Util.log(Util.inspect(newBattle));
        
        var attacker = clientsManager.getPlayer(idAttacker);
        if (attacker == null) {
            attacker = new PlayerBot(idAttacker);
        }
        var attacked = clientsManager.getPlayer(idAttacked);
        if (attacked == null) {
            attacked = new PlayerBot(idAttacked);
        }
        newBattle.start(attacker, attacked);
        Util.log(Util.inspect(newBattle));
        // TODO: a battle manager
        //battles[battles.length] = newBattle;
    };
}

var com = new Communication();

// minimal printing of data received
var Util = require('util');

socket.on('battleOver', function (msg) {
    console.log('battleOver: ' +  Util.inspect(msg));
   
    com.battleOver(msg); // msg should be the id of the winner
});

// params : {idAttacker:int, idAttacked:int}
socket.on('battleStarted', function (msg) {
    console.log('battleStarted! ' + Util.inspect(msg));
    com.startBattle(msg.idAttacker, msg.idAttacked);
}); // TODO: use this


socket.on('battleOver', function (msg) { // ugly
    console.log('battleOver: ' +  Util.inspect(msg));
   $("#popupBattle").get(0).style.display = "none";
   $("#popupWaiting").get(0).style.display = "block";
    com.battleOver(msg); // msg should be the id of the winner
});

// msg: {ennemyID:int}

module.exports = com;