var myApp = angular.module('myApp', ['ngResource','ui.bootstrap','angular-loading-bar', 'ngAnimate']);


myApp.factory('UsersResource', function ($resource) {
  return $resource('/api/users/:id');
});

myApp.controller('AppCtrl', function($scope, $http, UsersResource, $q, $log) {
  
  $scope.users = [];
  $scope.alerts = [];
  
  $scope.$on('addMessage', function (event, error) {
    console.log(error); // 'Data to send'
    if(error.status === 422) {
      $scope.alerts.push({type:'danger', message: "Data is not valid"});
    } else if(error.data && error.data.message && error.data.type) {
      $scope.alerts.push(error.data);
    } else if (error.message && error.type) {
      $scope.alerts.push(error);
    }
  });
  
  $scope.$on('clearMessages', function () {
    $scope.alerts = [];
  });
  
  $scope.getUsers = function() {
    UsersResource.get().$promise.then(function(result) {
      $scope.users = result.payload;
    }, function (error) {
      $scope.$emit('addMessage', error);
    });
  }
  
  $scope.editUser = function(user) {
    
  }
  
  $scope.delete = function(user) {
    $scope.$emit('clearMessages');
    UsersResource.remove({id:user.id}).$promise.then(function(result) {
      $log.log(user + " deleted");
      $scope.getUsers();
    }, function (error) {
      $scope.$emit('addMessage', error);
    });
  }
  
  $scope.saveUser = function(user) {
    $scope.$emit('clearMessages');
    UsersResource.save(user).$promise.then(function(result) {
      $log.log(user + " saved");
      $scope.getUsers();
    }, function (error) {
      $scope.$emit('addMessage', error);
    });
  }
  
  $scope.log = function() {
    $log.log($scope.userForm.$error);
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
