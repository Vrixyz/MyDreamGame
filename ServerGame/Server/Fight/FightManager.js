/**
 * Created by TiTi on 3/21/2015.
 */

var com = require('../ClientCommunication');
var me = require('../Player');
var Human = require('../Human');

var $ = require('jquery');

function FightManager() {

  this.init = function() {
  };
  this.displayFightPopup = function() {
    $("#popupBattleInProgress").get(0).style.display='block';
  };

  this.hideFightPopup = function() {
    $("#popupBattleInProgress").get(0).style.display='none';
  };
}

var _fightManagerInstance = new FightManager();

module.exports = _fightManagerInstance;