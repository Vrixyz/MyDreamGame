var Player = require('./Player');
var Util = require('util');

function PlayerBot(id) {
    Player.call(this, id); // super call
    
   // this.battleEnded = function(battleDefinitionForPlayer){}; // TODO: delete 'this'
};

PlayerBot.prototype = Object.create(Player.prototype, {
        battleStarted : {
            value : function(battleDefinitionForPlayer){}
        },
        roundEnded : { 
            value: function(battleDefinitionForPlayer) {
                //Player.prototype.roundEnded.apply(this, battleDefinitionForPlayer); // call super
                
                var incentiveToAttack = Math.random() * this.ammo;
                if (incentiveToAttack > 0.5) {
                    this.status = Player.statusEnum.attacking;
                }
                else if (Math.random() > 0.5) {
                    this.status = Player.statusEnum.defending;
                }
                else {
                    this.status = Player.statusEnum.reloading;
                }
                Util.log("Bot set status to " + this.status);
          }
       },
       battleEnded :  {
           value: function(battleDefinitionForPlayer){ 
                // delete the object 'this' 
                //Player.prototype.battleEnded.apply(this, battleDefinitionForPlayer);
            }
        }
    });

PlayerBot.prototype.constructor = PlayerBot;

module.exports = PlayerBot;