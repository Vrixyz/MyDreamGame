'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'app/angular/view2/view2.html',
    controller: 'View2Ctrl',
    controllerUrl: 'app/angular/view1/view2.js'
  });
}])

.controller('View2Ctrl', [function() {

}]);