/**
 * Created by TiTi on 2/28/2015.
 */

Human._id = 0;
Human.statusEnum = Object.freeze({exploring:"exploring", inBattle:"in battle"});

var Util = require("util");

function Human(socket, p) {
  this.ID = Human._id++;
  
  this.range = 10;
  this.getData = function() {
    return {ID:this.ID, pseudo: this.pseudo, position: this.position, status:this.status};
  };

  this.pseudo = "TiTi";
  this.position = {lat: 0, lng:0};
  this.socket = socket; // FIXME: this shouldn't be here (it's used server-side)
  
  this.moveHuman = function (lat, lng) {
    this.position.lat = lat;
    this.position.lng = lng;
    return true;
  };
  this.update = function(p) {
      if (!p) return;
      this.pseudo = p.pseudo;
      if (p.position) {
        this.position = {lat: p.position.lat, lng: p.position.lng};
      }
      this.status = p.status ? p.status : Human.statusEnum.exploring;
  };
    this.update(p);  
}

module.exports = Human;
