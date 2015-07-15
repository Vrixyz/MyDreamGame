var Util = require('util');
var World = require('./World');

var world = new World();

Util.log('Server to serve pages started!');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'client.html'));
});
app.get('/popup.css', function(req, res){
  res.sendFile(path.join(__dirname, 'popup.css'));
});
app.get('/static/bundle.js', function(req, res){
  res.sendFile(path.join(__dirname, 'static/bundle.js'));
});

app.get('/leaflet-0.7.3/images/marker-icon.png', function(req, res){
  res.sendFile(path.join(__dirname, '/leaflet-0.7.3/images/marker-icon.png'));
});
app.get('/leaflet-0.7.3/images/marker-shadow.png', function(req, res){
  res.sendFile(path.join(__dirname, '/leaflet-0.7.3/images/marker-shadow.png'));
});


var serverApi = io.of('/server/api');

var battleServer = null;

serverApi.on('connection', function(socket){
    console.log('/server/api : something connected to');
    
    world.battleServer = {};
    world.battleServer.socket = socket;
    
    socket.on('disconnect', function(){
         console.log('user disconnected');
    });
    
    socket.on('registerAsBattleServer', function(msg){
         console.log('registerAsBattleServer');
    });
    
    socket.on('battleOver', function(msg){
        var attacker = world.getHuman(msg.attacker);
        var attacked = world.getHuman(msg.attacked);
        
        if (attacker.socket)
            attacker.socket.emit('battleOver', msg);
        if (attacked.socket)
            attacked.socket.emit('battleOver', msg);
         console.log('battleOver: ' + Util.inspect(msg));
    });
});

io.on('connection', function(socket){
    console.log('/ : something connected');
    socket.on('disconnect', function(){
         console.log('user disconnected');
    });
    socket.on('ping', function (msg) {
        console.log("Received ping !");
        // send anwser to socket
        socket.emit('ping_anwser', 'pong');
    });

    // params: ({latitude,longitude}, name and local_id)
    socket.on('spawnHuman', function (msg) {
        Util.log("spawnHuman start");
        Util.log("remote: " + socket);
        Util.log("msg: " + Util.inspect(msg));
        var human = world.spawnHuman(socket, msg);
        // TODO: check if there's enough people near this guy and spawn number of bots depending on result
        world.spawnBotsForHuman(5, human);
        Util.log("spawnHuman near end : " + Util.inspect(human.getData()))
        socket.emit('spawnHuman_anwser', human.getData());
        Util.log("spawnHuman end")
    });

    socket.on('setPosition', function (msg) {
        Util.log("setPosition start");
        Util.log(msg);
        //Util.log(req.source);
        var human = world.getHuman(msg.id);
        if (human && human.socket && human.socket.id == socket.id) {
            world.moveHuman(human, msg.position);
            Util.log(human.position.lat + ";" + human.position.lng);
        }
        //cb(null, req.params);
        Util.log("setPosition end");
    });

    var isSub = false;
    socket.on('subscribeToWorldUpdates', function (msg) {
        //Util.log("getKnownWorld start");
        //  world
    
        if (!isSub) {
            isSub = true;
            //socket.isSubscribedToWorldUpdates = true;
            // FIXME: change logic in something lighter
            setInterval(function () {
                /*if (!socket || !socket.isSubscribedToWorldUpdates) {
                  clearInterval();
                  return;
                }*/
                var knownWorld = world.getKnownWorldFor(socket, msg.id);
                socket.emit('worldUpdate', knownWorld);
            }, 500);
        }
    });

    socket.on('attack', function (msg) {
        Util.log("attack start");
        //  world
        var result = world.attack(socket, msg.idAttacking, msg.idToAttack);
      
        socket.emit('attack_answer', result);
        Util.log("attack end");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});