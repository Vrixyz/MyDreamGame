/**
 * Created by TiTi on 3/21/2015.
 */
// this files defines every functions callable from html.
// meant to be called only from html for the moment, should only refer to classes and minimal code.

var $ = require('jquery');
var com = require('./ClientCommunication');
// TODO: a Manager (FightManager, and maybe ExplorerManager for the moment) should handle all these actions

global.attackButton = function() {
    if (com) {
        com.setStatusAttack();
    }
};

global.defenseButton = function() {
    if (com) {
        com.setStatusDefense();
    }
};

global.reloadButton = function() {
    if (com) {
        com.setStatusReload();
    }
};

global.authenticateButton = function() {
    if (com) {
        com.authenticate($('#id_input').val());
        $("#popupWaiting").get(0).style.display = 'block';
        $("#popupAuthentication").get(0).style.display = 'none';
    }
};

global.setBattleLayout = function() {
    $("#popupBattle").get(0).style.display = "block";
    $("#popupWaiting").get(0).style.display = "none";
};