var $ = require('jquery');

var L = require('leaflet');
L.Icon.Default.imagePath = './leaflet-0.7.3/images';

var World = require('./World');
var Human = require('./Human');
var UnitRenderer = require('./UnitRenderer');
var me = require('./Player');
var FightManager = require('./Fight/FightManager');

var com = require('./ClientCommunication');


//var http = require('http').Server(app);
//var io = require('socket.io')(http);

var socket = io();

socket.on('ping_anwser', function(msg){
  alert(msg);
});

socket.emit('ping', '');

// this is shortcut to embed globals for html into bundle.js, I probably should put it in a different "bundle.js"
require('./Global.js');


//com.postRequest("ping", {}, displaySearchResult);
// end pure jquery


// map code
var map = L.map('map').setView([48.80773, 2.39004], 20);

/*
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); */

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'examples.map-i875mjb7'
}).addTo(map);

var popup = L.popup();


var world = new World();

function displaySearchResult(response) {
  if (response.result) {
    //console.log(response.result);
    var t = new Human(response.result);
    //console.log(Human);
    //console.log(t);
   // console.log("id: " + t.ID);
  }
  else if (response.error)
    alert("Search error: " + response.error.message);
}

me.init();


function spawnResponse(response) {
  if (response.result) {
    console.log(response.result);
    var t = new Human(response.result);
    console.log(Human);
    console.log(t);
    me.init(new UnitRenderer(map, t, true));
    console.log("id: " + t.ID);
  }
  else if (response.error)
    alert("Search error: " + response.error.message);
}

//com.postRequest("spawnHuman", {lat: 48.8076945929382, lng: 2.3900882899761196}, spawnResponse);
com.spawnHuman( {lat: 48.8076945929382, lng: 2.3900882899761196}, "ME");

var Util = require('util');

com.spawnHuman_answer = function(human) {
    console.log("human:" + Util.inspect(human.getData()));
    me.init(new UnitRenderer(map, human, true));
    console.log("id: " +human.ID);
    console.log("me.unitRenderer: " + me.unitRenderer);
    console.log("me.unitRenderer: " + me.unitRenderer.unit);
};

/*L.circle([51.508, -0.11], 500, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5
}).addTo(map).bindPopup("I am a circle.");

L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
]).addTo(map).bindPopup("I am a polygon.");
*/
function positionMoved(response) {
  if (response.result) {
    //alert(response.result)
    me.unitRenderer.unit.position = response.result.position;
    me.unitRenderer.update();
  }
  else if (response.error)
    alert("move error: " + response.error.message);
}

function onMapClick(e) {
  /*popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map); */
    //alert(e.latlng)
    console.log({id: me.unitRenderer.unit.ID, position: e.latlng});
    com.setPosition(e.latlng, me.unitRenderer.unit.ID);

}

/// {marker, human}
var markerOthers = [];

function updateWorld(msg) {
  if (!me || !me.unitRenderer) {
    // should unsubscribe
    return;
  }
  if (msg) {
    //console.log(msg);
    var humans = msg.humans;
    // console.log(msg.me);
    // console.log(msg.me.position);
    // console.log(humans);
    //console.log(humans.length);
    // console.log(humans.length);
  var i;
    for (var index = 0; index < humans.length; index++) {
      // console.log(humans[index]);      

      var h; 
      h = world.getHuman(humans[index].ID);
      var unitRenderer;
      unitRenderer = null;
      if (!h) {
        h = world.addExistingHuman(humans[index]);
        console.log(h.getData());
        unitRenderer = new UnitRenderer(map, h);
        markerOthers[markerOthers.length] = unitRenderer;
        console.log("popup creation");
      }
      
      if (!unitRenderer) {
        i = 0;
        while (i < markerOthers.length && !unitRenderer) {
          if (markerOthers[i].unit.ID == h.ID) {
            unitRenderer = markerOthers[i];
          }
          i++;
        }
      }
      if (unitRenderer) { // FIXME: this test should be useless
        unitRenderer.isToKill = false;
        unitRenderer.update();
      } else {
        //console.log("will kill : " + h.pseudo);
      }
      
    }
    //console.log("markerOthers: " + markerOthers);
    // clean useless id in array
    i = 0
    while (i < markerOthers.length) {
      //console.log("should kill " +markerOthers[i].unit.pseudo + " : " + markerOthers[i].isToKill);
      if (markerOthers[i].isToKill) {
        //console.log("delete a unit : " + markerOthers[i].unit.pseudo);
        world.kill(markerOthers[i].unit);
        markerOthers[i].delete();
        markerOthers.splice(i, 1);
      } else {
        markerOthers[i].isToKill = true; // set for next world update
        i++;
      }
    }
    //console.log("markerOthers: " + markerOthers);
    if (!msg.me) {

      //alert("you're dead !");
      /*$("#popupRespawn").get(0).style.display='block';*/
      me.unitRenderer.delete();
      me.unitRenderer = null;
    }
    else {
      var latlngReceived = msg.me.position;
      /*if (me.unitRenderer.unit.status != msg.me.status) {
        me.unitRenderer.unit.status =  msg.me.status;
        if (me.unitRenderer.unit.status == Human.statusEnum.inBattle) {
          FightManager.displayFightPopup();
        }
      }*/
      //console.log(latlngReceived);
      me.unitRenderer.unit.position = latlngReceived;
      me.unitRenderer.update();
    }
      //console.log(" end me.unitRenderer.unit" + me.unitRenderer.unit);
  } else if (msg.error)
    alert("updateWorld error: " +msg.error.message);
}

com.worldUpdate = function(world) {
  updateWorld(world);
};

com.battleOver = function(battleDefinition) {
    FightManager.hideFightPopup();
    if (battleDefinition.winner == null || battleDefinition.winner == me.unitRenderer.unit.id) {
        me.unitRenderer.unit.status = Human.statusEnum.exploring;
        $("#popupBattleResultWin").get(0).style.display='block';
    } else {
        $("#popupRespawn").get(0).style.display='block';
        me.unitRenderer.delete();
        me.unitRenderer = null;
    }
};

global.spawnHuman = function() {
  //com.postRequest("spawnHuman", {lat: 48.8076945929382, lng: 2.3900882899761196}, spawnResponse);
  com.spawnHuman( {lat: 48.8076945929382, lng: 2.3900882899761196}, "ME")
};

setInterval(function () {
   if (me && me.unitRenderer) {
      com.subscribeToWorldUpdates(me.unitRenderer.unit.ID); // update human we're subscibed to.
      }
  }, 1000);

map.on('click', onMapClick);