var myApp = angular.module('myApp', ['ngResource']);


myApp.factory('UsersResource', function ($resource) {
  return $resource('/api/users/:id');
});

myApp.controller('AppCtrl', function($scope, $http, UsersResource, $q) {
  
  $scope.users = [];
  
  $scope.getUsers = function() {
    UsersResource.get().$promise.then(function(result) {
      debugger;
      $scope.users = result.payload;
    }, function (error) {
      debugger;
      error.type = "danger";
      $scope.$broadcast("myEvent", error);
    });
  }
  
  $scope.getUsers();
});
