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
  
  $scope.delete = function(user) {
    $log.log(user + " delete");
    UsersResource.remove({id:user.id}).$promise.then(function(result) {
      $scope.selectedUser = null;
      $scope.getUsers();
    }, function (error) {
      error.type = "danger";
      $log.log(user + " saved");
    });
  }
  
  $scope.saveUser = function(user) {
    $log.log(user + " saved");
    UsersResource.save(user).$promise.then(function(result) {
      $scope.getUsers();
    }, function (error) {
      error.type = "danger";
      $log.log(user + " saved");
    });
  }
  
  $scope.getUsers();
});

myApp.directive('dwngrokuInput',function($compile) {
  
  return {
    restrict: "A",
    require: "^form",
    replace: true,
    scope: {
      form : '='    
    },
    templateUrl: 'templateUrl/dwngrokuInput.html',
    compile: function(tElem, tAttrs){
      var html = tElem.html().replace(/attrs.name/g, tAttrs.name);
      html = html.replace(/attrs.labelName/g, tAttrs.labelName);
      html = html.replace(/attrs.model/g, tAttrs.model);
      tElem.html(html);
    }
  }
});
