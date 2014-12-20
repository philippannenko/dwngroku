var myApp = angular.module('myApp', ['ngResource']);


myApp.factory('UsersResource', function ($resource) {
  return $resource('/api/users/:id');
});

myApp.controller('AppCtrl', function($scope, $http, UsersResource, $q, $log) {
  
  $scope.users = [];
  $scope.alerts = [];
  
  $scope.getUsers = function() {
    UsersResource.get().$promise.then(function(result) {
      $scope.users = result.payload;
    }, function (error) {
      
      if(error.data && error.data.message && error.data.type) {
        $scope.alerts.push(args.data);
      } else if (error.message && error.type) {
        $scope.alerts.push(args);
      }
    });
  }
  
  $scope.editUser = function(user) {
  }
  
  $scope.delete = function(user) {
    UsersResource.remove({id:user.id}).$promise.then(function(result) {
      $log.log(user + " deleted");
      $scope.getUsers();
    }, function (error) {
      
      if(error.data && error.data.message && error.data.type) {
        $scope.alerts.push(args.data);
      } else if (error.message && error.type) {
        $scope.alerts.push(args);
      }
      error.type = "danger";
    });
  }
  
  $scope.saveUser = function(user) {
    if(!user) { 
      $log.log("cannot save null user");
      return; 
    }
    UsersResource.save(user).$promise.then(function(result) {
      $log.log(user + " saved");
      $scope.getUsers();
    }, function (error) {
      debugger;
      if(error.data && error.data.message && error.data.type) {
        $scope.alerts.push(args.data);
      } else if (error.message && error.type) {
        $scope.alerts.push(args);
      }
      
      error.type = "danger";
    });
  }
  $scope.log = function() {
    $log.log($scope.userForm.$error);
    debugger;
  }
  $scope.getUsers();
});

myApp.directive('dwngrokuInput',function($compile) {
  
  return {
    restrict: "A",
    require: "^form",
    priority: 0,
    replace: true,
    templateUrl: 'templateUrl/dwngrokuInput.html',
    link: function($scope, el, attrs, ctrl) {
      debugger;
      var formName = el.parent().controller('form').$name;
      var html = el.html().replace(/attrs.name/g, attrs.dwngrokuInput)
        .replace(/attrs.label/g, attrs.label)
        .replace(/attrs.form/g, formName)
        .replace(/attrs.model/g, formName + '.model');
      $compile(html)($scope,function(_el){ 
        el.replaceWith(_el); 
      });    
    }
  }
});
