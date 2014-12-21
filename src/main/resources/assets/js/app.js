var myApp = angular.module('myApp', ['ngResource','ui.bootstrap','angular-loading-bar', 'ngAnimate','duScroll','ngRoute']);

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/user-list.html',
        controller: 'UserListCtrl'
      }).when('/:id', {
        templateUrl: 'partials/user-details.html',
        controller: 'UserDetailsCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  }]);

myApp.factory('UsersResource', function ($resource) {
  return $resource('/api/users/:id');
});

myApp.controller('AppCtrl', function($scope, $log){
  
  $scope.alerts = [];
  $scope.alertsBetweenPages = [];
  
  $scope.$on('addMessage', function (event, error) {
    $log.log(error); // 'Data to send'
    if(error.status === 422) {
      $scope.alerts.push({type:'danger', message: "Data is not valid."});
    } else if(error.data && error.data.message && error.data.type) {
      $scope.alerts.push(error.data);
    } else if (error.message && error.type) {
      $scope.alerts.push(error);
    } else if (error.status === 500) {
      $scope.alerts.push({type:'danger', message: "Could not process request."});
    } else {
      $scope.alerts.push({type:'danger', message: "Could not process request."});
    }
  });
  
  $scope.$on('addMessageBetweenPages', function (event, error) {
    $log.log(error); // 'Data to send'
    if(error.status === 422) {
      $scope.alertsBetweenPages.push({type:'danger', message: "Data is not valid."});
    } else if(error.data && error.data.message && error.data.type) {
      $scope.alertsBetweenPages.push(error.data);
    } else if (error.message && error.type) {
      $scope.alertsBetweenPages.push(error);
    } else if (error.status === 500) {
      $scope.alertsBetweenPages.push({type:'danger', message: "Could not process request."});
    } else {
      $scope.alertsBetweenPages.push({type:'danger', message: "Could not process request."});
    }
  });
  
  $scope.$on('newPageLoaded', function () {
    $scope.alerts = [];
    $scope.alerts = $scope.alertsBetweenPages;
    $scope.alertsBetweenPages = [];
  });
  
  
  $scope.$on('clearMessages', function () {
    $scope.alerts = [];
  });
  
})

myApp.controller('UserDetailsCtrl', function($scope, $http, UsersResource, $q, cfpLoadingBar, $location, $document, $routeParams) {
  
  $scope.$emit('newPageLoaded');
  $scope.userForm = {};
  $scope.id =  $routeParams.id;
  $scope.label = $scope.id == -1  ? 'Create' : 'Update';
  $scope.isNew = $scope.id == -1;

  $scope.loadUser = function(id) {
    if(id == -1) return;
    cfpLoadingBar.start();
    $scope.$emit('clearMessages');
    UsersResource.get({id:id}).$promise.then(function(result) {
      $scope.userForm.model = result.payload;
    }, function (error) {
      $location.path('/');
      $scope.$emit('addMessageBetweenPages', error);
    }).finally(function() {
      cfpLoadingBar.complete();
    });
  }
  
  $scope.saveUser = function(user) {
    cfpLoadingBar.start();
    $scope.$emit('clearMessages');
    UsersResource.save(user).$promise.then(function(result) {
      $scope.$emit('addMessage', result);
      $scope.userForm.model = result.payload;
      
      $scope.id = result.payload.id;
      $scope.label = $scope.id == -1  ? 'Create' : 'Update';
      $scope.isNew = $scope.id == -1;
      
    }, function (error) {
      $scope.$emit('addMessage', error);
    }).finally(function() {
      $document.scrollTopAnimated(4);
      cfpLoadingBar.complete();
    });
  }
  
  $scope.delete = function(user) {
    cfpLoadingBar.start();
    $scope.$emit('clearMessages');
    UsersResource.remove({id:user.id}).$promise.then(function(result) {
      cfpLoadingBar.complete();
      $scope.$emit('addMessageBetweenPages', result);
      $location.path('/');
    }, function (error) {
      cfpLoadingBar.complete();
      $scope.$emit('addMessage', error);
    });
  }
  
  $scope.loadUser($scope.id);
  
});


myApp.controller('UserListCtrl', function($scope, $http, UsersResource, $q, cfpLoadingBar, $document) {
  
  $scope.$emit('newPageLoaded');
  
  $scope.users = [];
  
  $scope.getUsers = function() {
    cfpLoadingBar.start();
    UsersResource.get().$promise.then(function(result) {
      $scope.users = result.payload;
    }, function (error) {
      $scope.$emit('addMessage', error);
    }, function() {
      cfpLoadingBar.complete();
    });
  }
  
  $scope.delete = function(user) {
    cfpLoadingBar.start();
    $scope.$emit('clearMessages');
    UsersResource.remove({id:user.id}).$promise.then(function(result) {
      $document.scrollTopAnimated(4).then(function(){
        $scope.getUsers();
        $scope.$emit('addMessage', result);
        cfpLoadingBar.complete();
      });
    }, function (error) {
      $scope.$emit('addMessage', error);
      cfpLoadingBar.complete();
    });
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
