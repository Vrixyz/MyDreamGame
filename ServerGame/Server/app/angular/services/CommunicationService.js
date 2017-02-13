/**
 * Created by TiTi on 27/08/15.
 */

var communicationService = angular.module('communicationService', []);

// TODO: communication with battle server and mapServer should be services too
communicationService.factory('authentication', function() {
  var authenticationServiceInstance;
  // factory function body that constructs shinyNewServiceInstance

  // TODO: retrieve real id from authentication server

  return authenticationServiceInstance;
});