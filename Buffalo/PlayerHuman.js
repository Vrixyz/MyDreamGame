var Player = require('./Player');
//var Human = require('./Human');

 var statusEnum = Player.statusEnum;

function PlayerHuman(id, _socket) {
    Player.call(this, id); // super call
    
    var socket = socket;
    
};

PlayerHuman.prototype = Object.create(Player.prototype, {
    battleStarted : {
        value : function(battleDefinitionForPlayer) {
            this.socket.emit("battleStarted", battleDefinitionForPlayer);
        }
    },
    roundEnded : { 
        value: function(battleDefinitionForPlayer) {
            this.socket.emit("roundEnded", battleDefinitionForPlayer);
        }
    },
    battleEnded : {
        value : function(battleDefinitionForPlayer){ 
            this.socket.emit("battleEnded", battleDefinitionForPlayer);        
        }
    }
});


PlayerHuman.prototype.constructor = PlayerHuman;

module.exports = PlayerHuman;