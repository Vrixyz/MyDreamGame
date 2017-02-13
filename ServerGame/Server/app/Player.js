/**
 * Created by TiTi on 2/28/2015.
 */

function Player() {

  this.init = function(ur) {
    this.unitRenderer = ur;
  };
}

var _playerInstance = new Player();

module.exports = _playerInstance;