var Util = require('util');
var World = require('../shared/World');

var world = new World();

Util.log('Server to serve pages started!');

var express = require('express');
var session = require('express-session');
var uuid = require('node-uuid');
var passport = require('passport');
var StrategyGoogle = require('passport-google-openidconnect').Strategy;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../app/client.html'));
});
app.get('/popup.css', function(req, res){
  res.sendFile(path.join(__dirname, '../app/popup.css'));
});
app.get('/static/bundle.js', function(req, res){
  res.sendFile(path.join(__dirname, '../app/static/bundle.js'));
});
app.get('/static/bundle.js', function(req, res){
    res.sendFile(path.join(__dirname, '../app/static/bundle.js'));
});
app.get('/node_modules/leaflet/dist/images/marker-shadow.png', function(req, res){
    Util.log(req);
    res.sendFile(path.join(__dirname, '../node_modules/leaflet/dist/images/marker-shadow.png'));
});
app.get('/node_modules/leaflet/dist/images/marker-icon.png', function(req, res){
    res.sendFile(path.join(__dirname, '../node_modules/leaflet/dist/images/marker-icon.png'));
});
app.get('/angulartest', function(req, res){
    res.sendFile(path.join(__dirname, '../app/angular/index.html'));
});

app.get('/bower_components/*', function(req, res){
    res.sendFile(path.join(__dirname, '..' + req.originalUrl));
});

app.get('/app/*', function(req, res){
    Util.log('bordel');
    Util.log(req);
    res.sendFile(path.join(__dirname, '..' + req.originalUrl));
});


passport.serializeUser(function(user, done) {
    Util.log('serializer');
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    Util.log('deserializer');
    done(null, obj);
});

// FIXME: use a proper store instance ( https://github.com/expressjs/session )
app.use(session({
    genid: function(req) {
        return uuid.v4(); // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    name: 'mapServer',
    resave: false,
    saveUninitialized:false
}));

//FIXME: use different project (consumerkey) than authentication server
// FIXME: hide consumerSecret
passport.use(new StrategyGoogle({
        clientID: "942079075130-01hs0upc7v40vg5jk8non8bj1jeffp21.apps.googleusercontent.com",
        clientSecret: "1_Q2SWiBENvTVzzmvgXShhwA",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
        Util.log('callback');
        Util.log(accessToken);
        Util.log(profile);
        return done(null, null);
//        User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //          return done(err, user);
    //    });
    }
));
app.get('/auth/google',
    passport.authenticate('google-openidconnect'));

app.get('/auth/google/callback',
    function(req, res) {
        Util.log('auth');
        // Successful authentication, redirect home.
        res.redirect('/');
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