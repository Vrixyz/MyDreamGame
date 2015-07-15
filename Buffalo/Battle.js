var $ = require('jquery');
var Util = require("util");
var Player = require("./Player");

function Battle(mapServerSocket) {
    var self = this;
    this.server = {socket: mapServerSocket};
    this.over = true;
    
    this.start = function startBattle(attacker, attacked) {
        Util.log("Battle starting.");
        self.attacked = attacked;
        self.attacker = attacker;        
        
        self.attacker.battleStarted({"ennemyID":self.attacked.id});
        self.attacked.battleStarted("battleStarted", {"ennemyID":self.attacker.id});
        
        Util.log("Battle started.");
        Util.log("attackerID: " + self.attacker.id);
        Util.log("attackedID: " + self.attacker.id);
        self.over = false;
    };
    
    this.endBattle = function(winner) {
        var winnerID = winner ? winner.id : null;
        self.attacker.battleEnded(winnerID);
        self.attacked.battleEnded(winnerID);
        self.server.socket.emit("battleOver",  {attacker: self.attacker.id, attacked:self.attacked.id, winner: winnerID});
        self.over = true;
    };

    this.endRoundBattle = function() {
        //Util.log("End round battle: " + this.attacker.id + " vs " + this.attacked.id);
        
        computePlayerAttack(this.attacker, this.attacked);
        computePlayerAttack(this.attacked, this.attacker);
        Util.log("attacker: " + Util.inspect(this.attacker));
        Util.log("attacked: " + Util.inspect(this.attacked));

        if (this.attacker.life <= 0 && this.attacked.life <= 0) {
            self.endBattle(); // no winner :o
        } else if (this.attacker.life <= 0) {
            self.endBattle(this.attacked);
        } else if (this.attacked.life <= 0) {
            self.endBattle(this.attacker);
        } else {
            self.attacker.roundEnded();
            self.attacked.roundEnded();
        }
    };

    var intervalID = setInterval(function() {
        self.endRoundBattle();
        if (self.over) {
            clearInterval(intervalID);
        }
    }, 5000);

    function computePlayerAttack(attacker, attacked) {
        if (attacker.status == Player.statusEnum.attacking && attacker.ammo > 0) {
            attacker.ammo = attacker.ammo - 1;
            if (attacked.status == Player.statusEnum.defending && attacked.armor > 0) {
                    attacked.armor = attacked.armor - 1;
            } else {
                    attacked.life = attacked.life - 1;
            }
        }
        else if (attacker.status == Player.statusEnum.reloading) {
            attacker.ammo = attacker.ammo + 1;
        }
    };
};

function _endRoundBattle(s){
    Util.log("s: " + Util.inspect(s));
    s.endRoundBattle();
}

module.exports = Battle;