var myApp = angular.module('myApp', ['ngResource']);


myApp.factory('UsersResource', function ($resource) {
  return $resource('/api/users/:id');
});

myApp.controller('AppCtrl', function($scope, $http, UsersResource, $q, $log) {
  
  $scope.users = [];
  $scope.selectedUser;
  
  $scope.getUsers = function() {
    UsersResource.get().$promise.then(function(result) {
      $scope.users = result.payload;
    }, function (error) {
      error.type = "danger";
      $log.log(user + " saved");
    });
  }
  
  $scope.editUser = function(user) {
    $scope.selectedUser = user;
  }
  
  $scope.saveUser = function(user) {
    debugger;
    $log.log(user + " saved");
    $scope.selectedUser = null;
  }
  
  $scope.getUsers();
});

myApp.directive('dwngrokuInput',function($compile) {
  
  return {
    restrict: "A",
    require: "^form",
    replace: true,
    scope: {
      myDirVar : '='    
    },
    templateUrl: 'templateUrl/dwngrokuInput.html',
    compile: function(tElem, tAttrs){
      var html = tElem.html().replace(/attrs.name/g, tAttrs.name);
      html = html.replace(/attrs.propLabelName/g, tAttrs.propLabelName);
      html = html.replace(/attrs.propModel/g, tAttrs.propModel);
      tElem.html(html);
    }
  }
});
