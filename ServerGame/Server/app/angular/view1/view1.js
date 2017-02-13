
'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'app/angular/view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', ['$scope', '$window', function($scope, $window) {
    $scope.googleConnect = function () {
      $window.location.href = '/auth/google';
    };

    $scope.isAuthenticated = function () {
      // TODO: ask a service if the user is connected
      return false;
    };
  }]);