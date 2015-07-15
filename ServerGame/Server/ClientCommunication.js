/**
* Created by TiTi on 2/28/2015.
*/

var Human = require('./Human');

var $ = require('jquery');
var socket = io();

function Communication() {
    var url = "http://localhost:1337/api";
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
    
    this.spawnHuman = function(position_coordinates, pseudo) {
        var params = {position: position_coordinates, pseudo: pseudo};
        console.log("params: " + params);
        socket.emit('spawnHuman', params);
    }
    this.spawnHuman_answer = function(human){}; // to override

    this.subscribeToWorldUpdates = function(humanID) {
        socket.emit('subscribeToWorldUpdates', {id:humanID});
    };
    this.worldUpdate = function(world) {} // to override

    this.setPosition = function(position_coordinates, humanID) {
        socket.emit('setPosition', {position: position_coordinates, id:humanID});
    };

    this.attack = function(humanID, humanIDToAttack) {
        socket.emit('attack', {idAttacking: humanID, idToAttack: humanIDToAttack});
    };
    
    // answers
    this.attack_answer = function(answer) {} // to override
    this.attack_update = function(update) {} // to override
    
    // requests
    this.battleOver = function(battleDefinition) {} // to override

    /*  socket = io();

    socket.on('ping', function (msg) {
    console.log("Received ping !");
    // FIXME: send only to socket
    socket.emit('ping', 'pong');
    });
    */
    }

    var com = new Communication();

    // minimal parsing of data received
    var Util = require('util');
    socket.on('spawnHuman_anwser', function (msg) {
        console.log('spawnHuman_answer: ' +  Util.inspect(msg));
        var h = new Human(socket, msg);
        console.log('spawnHuman_answer: ' + Util.inspect(h.getData()));

        h.socket = socket;
        h.ID = msg.ID
        com.spawnHuman_answer(h);
    });

    socket.on('worldUpdate', function (msg) {
        // console.log('worldUpdate');
        com.worldUpdate(msg);
    });
    
    socket.on('attack_update', function (msg) {
        console.log('attack_update: ' +  msg);
        com.attack_update(msg);
    });
    
    socket.on('battleOver', function (msg) {
        console.log('battleOver: ' +  Util.inspect(msg));
        com.battleOver(msg);
    });

module.exports = com;