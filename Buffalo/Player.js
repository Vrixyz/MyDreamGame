
var maxHealth = 3;
var maxArmor = 9;
var initialAmmo = 2;

var statusEnum = Object.freeze({attacking:"attacking", defending:"defending", reloading: "reloading"});

function Player(id) {
        this.id = id;
        this.life = maxHealth;
        this.armor = maxArmor;
        this.ammo = initialAmmo;
        this.status = Player.statusEnum.reloading;    
};

Player.prototype = {
    battleStarted : {
        value : function(battleDefinitionForPlayer){}
    },
    roundEnded : {
        value : function(battleDefinitionForPlayer){}
    },
    battleEnded : {
        value : function(battleDefinitionForPlayer){}
    }
};

Player.maxHealth = function() {
    return maxHealth;
};
Player.maxArmor = function() {
    return maxArmor;
};

Player.statusEnum = statusEnum;

module.exports = Player;