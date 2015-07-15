/**
 * Created by TiTi on 2/21/2015.
 */

var L = require('leaflet');

L.Icon.Default.imagePath = './leaflet-0.7.3/images';

var me = require('./Player');

// TODO: build a helper

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function lineLength(lat1, lng1, lat2, lng2){
  var R = 6371000; // metres
  var φ1 = Math.radians(lat1);
  var φ2 = Math.radians(lat2);
  var Δφ = Math.radians(lat2-lat1);
  var Δλ = Math.radians(lng2-lng1);

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;
  return d;
}

function distanceFromTo(pos1, pos2) {
  return lineLength(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
}

/// map, u {position, pseudo}
function UnitRenderer(m, u, isPlayer) {
  this.incr = 0;
  this.map = m;
  this.unit = u;
  this.marker = L.marker([u.position.lat, u.position.lng], {draggable: false}).addTo(m)
    .bindPopup();
  if (isPlayer) {
    this.circleRange = L.circle([u.position.lat, u.position.lng], u.range, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.1
    }).addTo(m);
  }
  
//  this.inRangeToAttack;
  
  this.update = function() {
    if (this.marker.getLatLng() != this.unit.position)
      {
        this.marker.setLatLng(this.unit.position);
        if (this.circleRange)
          this.circleRange.setLatLng(this.unit.position);
      }
    var computedIsInRange = (me && distanceFromTo(me.unitRenderer.unit.position, this.unit.position) < me.unitRenderer.unit.range);
    //console.log("inrange :" + this.inRangeToAttack);
     if (computedIsInRange == this.inRangeToAttack) {
        return; // no need to update !
      }
      this.inRangeToAttack = computedIsInRange;

      this.marker.getPopup().setContent(this.buildPopupContent());
    };
    
    this.buildPopupContent = function() {

    var customText;

    if (me && me.unitRenderer.unit.ID == this.unit.ID) {
      customText = "That's you !"
    }
    else {
      customText = this.inRangeToAttack ? "<button onclick='attack(" + u.ID + ");'>attack</button>" : "too far to attack!";
    }
    return "<b>" + u.pseudo + "</b><br />id: " + this.unit.ID + " ; v" + this.incr++  + "<br />" + customText;
  };
  this.delete = function() {
    this.map.removeLayer(this.marker);
    if (this.circleRange) {
      this.map.removeLayer(this.circleRange);
    }
  }
}

module.exports = UnitRenderer;