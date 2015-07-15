var Util = require("util");

var Human = require('./Human');

function World() {
  var humans = [];
  this.battleServer = null;

  ///
  /// utils functions

  this.getHuman = function(id) {
    //console.log("humans in local : " + humans);
    for	(index = 0; index < humans.length; index++) {
      if (humans[index].ID == id) {
        return humans[index];
      }
    }
    return null;
  };

  this.kill = function(unit) {
    for	(var index = 0; index < humans.length; index++) {
      if (humans[index].ID == unit.ID) {
        humans.splice(index, 1);
        break;
      }
    }
  };

  this.spawnBotsForHuman = function(amount, human) {
    for (var i = 0; i < amount; i++) {
      // around the player random spawns
      var position = {lat: human.position.lat + (Math.random() - 0.5) * 0.25,
        lng: human.position.lng + (Math.random() - 0.5) * 0.5};
      this.spawnHuman(null, {position: position, pseudo: "bot " + i});
    }
    Util.log("number of humans: " + humans.length);
  };

  ///
  /// refers to commands

  /// (socket, {lat:int, lng:int})
  this.moveHuman = function(human, position) {
    // check obstacles and stuff
    if (human) {
      human.moveHuman(position.lat, position.lng);
      return true;
    }
    return false;
  };

    this.addExistingHuman = function(human_def) {
    //Util.log("number of humans: " + humans.length);
    //Util.log(Util.inspect(human.getData()));
    var h = new Human(null, human_def);
    h.ID = human_def.ID; // force override because we trust it already exists (TODO: to a updateHuman function, updating or adding human depending on known humans)
    humans[humans.length] = h;
    //Util.log("number of humans: " + humans.length);
    return h;
  };
  
  // Should be server only ?

  /// (socket, {lat:int, lng:int})
  this.spawnHuman = function(socket, params) {
    /*    for	(index = 0; index < humans.length; index++) {
     if (humans[index].pseudo == pseudo) {
     return "Pseudo not available"
     }
     }*/
    var human = new Human(socket, params);
    //Util.log("number of humans: " + humans.length);
    //Util.log(Util.inspect(human.getData()));
    humans[humans.length] = human;
    //Util.log("number of humans: " + humans.length);
    return human;
  };

  this.getKnownWorldFor = function(socket, id) {
    var knownHumans = [];
    var me;
    
    //Util.log(humans.length);

    for (var index = 0; index < humans.length; index++) {
        //Util.log("socket " + socket.id);
       // if (humans[index].socket)
         // Util.log("socket " + humans[index].socket.id);
      if (humans[index].socket &&/* humans[index].socket.id == socket.id &&*/ humans[index].ID == id) {
        me = humans[index].getData();
       // Util.log("found " + me.ID);
      } else {
        knownHumans[knownHumans.length] = humans[index].getData();
       // Util.log("there's " + humans[index].ID);
      }
    }
    //Util.log("///endworld///");

    //if (!human) return null;
    return {humans: knownHumans, me: me}; // FIXME: alright he knows all
  };

  // returns true if the battle has begun, false if the battle didn't begin.
  this.attack = function(socket, idAttacking, idToAttack) {
    Util.log(idAttacking + " attacks " + idToAttack);
    this.battleServer.socket.emit("battleStarted", {idAttacker:idAttacking, idAttacked:idToAttack});
    
    return true;
    
    var attacker = this.getHuman(idAttacking, socket);
    // TODO: check if attacked can be attacked.
    var attacked = this.getHuman(idToAttack);
    attacker.status = Human.statusEnum.inBattle;
    attacked.status = Human.statusEnum.inBattle;
    var self = this; // baaaah uglyyy ?
    setTimeout(function(params) {
        var result = Math.random() >= 0.5;
        params.attacker.status = Human.statusEnum.exploring;
        if (result) {
            self.sendAttackUpdateToHuman(params.attacker, {win:true});
            self.sendAttackUpdateToHuman(params.attacked, {win:false});
            params.world.kill(params.attacked);
        }
        else {
            self.sendAttackUpdateToHuman(params.attacker, {win:false});
            self.sendAttackUpdateToHuman(params.attacked, {win:true});
            params.world.kill(params.attacker);
        }
    }, 5000, {world:this, attacker:attacker, attacked:attacked});
    /* if (result) {
      this.kill(attacked);
    }
    else {
      this.kill(attacker);
    }
    return result; */
    return true;
  };

    this.sendAttackUpdateToHuman = function(human, attackUpdate) {
        if (human.socket) {
            human.socket.emit('attack_update', attackUpdate);
        }
    };
  
  this.getStatusForHumanID = function(socket, id) {
    var result = null;
    var human = this.getHuman(id, socket);
    if (human) {
      result = human.status;
    }
    Util.log(id + " wants to get its status: " + result + ".");
    return {status:result};
  };

}

module.exports = World;
