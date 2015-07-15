var Util = require('util');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clientsManager = require("./ClientsManager");
var serverMapCom = require('./ServerToMapCommunication');

var path = require('path');

var PlayerHuman = require('./PlayerHuman');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'client/client.html'));
});
/*app.get('/popup.css', function(req, res){
  res.sendFile(path.join(__dirname, 'popup.css'));
})*/
app.get('/static/bundle.js', function(req, res){
  res.sendFile(path.join(__dirname, 'static/bundle.js'));
});

var battles = [];

// TODO: use namespace
io.on('connection', function(socket){
    console.log('Something connected.');
    
    // player commands
    
    // params {id}
    socket.on('registerAsPlayer', function (msg) {
        Util.log("registerAsPlayer: ");
        
        clientsManager.addClient(new PlayerHuman(msg.id, socket));
    });
    socket.on('setStatusAttack', function (msg) {
        console.log('setStatusAttack');
        self.status = Player.statusEnum.attacking;
    });
    socket.on('setStatusDefense', function (msg) {
        console.log('setStatusDefense');
        self.status = Player.statusEnum.defending;
    });
     socket.on('setStatusReload', function (msg) {
         console.log('setStatusReload');
        self.status = Player.statusEnum.reloading;
    });
        
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});
