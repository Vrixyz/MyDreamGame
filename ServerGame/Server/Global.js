/**
 * Created by TiTi on 3/21/2015.
 */
// this files defines every functions callable from html.
// meant to be called only from html for the moment, should only refer to classes and minimal code.

var com = require('./ClientCommunication');
var me = require('./Player');
var Human = require('./Human');
var FightManager = require('./Fight/FightManager');
var $ = require('jquery');

// TODO: a Manager (FightManager, and maybe ExplorerManager for the moment) should handle all these actions

function attackResponse(response) {
  // TODO: I should put all popup references to a state machine which handles interface (or at least popups
  if (response == false) { // if battle failed to launch, just hide the popup eh..
    $("#popupBattleInProgress").get(0).style.display='none';
  }
  else {
    // set refreshing
    if (response.result.status != Human.statusEnum.inBattle) {
        $("#popupBattleInProgress").get(0).style.display = 'none';
    }
  }
}
com.attack_answer = function(answer) {
    if (response.result == false) { // if battle failed to launch, just hide the popup eh..
        $("#popupBattleInProgress").get(0).style.display='none';
    }
        else {
        // set refreshing
    }
}

com.attack_update = function(update) {
    $("#popupBattleInProgress").get(0).style.display = 'none';
    if (update.win) {
        $("#popupBattleResultWin").get(0).style.display='block';
    } else {
        $("#popupBattleResultLoss").get(0).style.display='block';
    }
    if (me.unitRenderer)
        me.unitRenderer.unit.status = Human.statusEnum.exploring;
};
/*
function getHumanStatusResponse(response) {
  // TODO: I should put all popup references to a state machine which handles interface (or at least popups
  if (me.unitRenderer)
    me.unitRenderer.unit.status = response.result.status;
  console.log("status: " + response.result.status);
  if (response.result.status != Human.statusEnum.inBattle) {
    $("#popupBattleInProgress").get(0).style.display = 'none';
  }
  if (response.result.status == Human.statusEnum.exploring) {
    $("#popupBattleResultWin").get(0).style.display='block';
  }
  else if (response.result.status == null) {
    $("#popupBattleResultLoss").get(0).style.display='block';
  }
}*/

global.attack = function(idToAttack) {
    if (com) {
        me.unitRenderer.unit.status = Human.statusEnum.inBattle;
        FightManager.displayFightPopup();
        com.attack(me.unitRenderer.unit.ID, idToAttack);
    }
};

global.refreshStatus = function() {
  if (com && me.unitRenderer) {
    com.postRequest("getHumanStatus", {id: me.unitRenderer.unit.ID}, getHumanStatusResponse);
  }
  else {
    getHumanStatusResponse({result:{}});
  }
};

global.refreshStatusWithCallback = function(callback) {
  if (com && me.unitRenderer) {
    com.postRequest("getHumanStatus", {id: me.unitRenderer.unit.ID}, callback);
  }
  else {
    callback({result:{}});
  }
};