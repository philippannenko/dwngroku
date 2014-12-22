var myApp = angular.module('myApp', ['ngResource','ui.bootstrap','angular-loading-bar', 'ngAnimate','duScroll','ngRoute']);

myApp.config(['$routeProvider', 'USER_ROLES', function($routeProvider, USER_ROLES) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/user-list.html',
      controller: 'UserListCtrl',
      authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
    }).when('/user/:id', {
      templateUrl: 'partials/user-details.html',
      controller: 'UserDetailsCtrl',
      authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
    }).when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginController'
    }).otherwise({
      redirectTo: '/'
    });
}]);

myApp.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

myApp.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

// ////////////// FACTORIES ///////////// //

myApp.factory('UsersResource', function ($resource) {
  return $resource('/api/users/:id');
});

myApp.factory('AuthService', function ($http, Session, $q) {
  var authService = {};
  
  authService.logout = function () {
    Session.destroy();
  }
  
  authService.getAuthUser = function () {
    return {id: Session.userId, name:Session.userName, userRole: Session.userRole};
  }
 
  authService.login = function (credentials) {
    
    var deferred = $q.defer();
    
    setTimeout(function() {
      Session.create(1, 'name','admin');
      deferred.resolve({id:1,name:'name',userRole:'admin'});
    }, 1000);

    return deferred.promise;
  };
 
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
})

// ////////////// SERVICES ///////////// //

myApp.service('Session', function () {
  this.create = function (userId, userName, userRole) {
    this.userId = userId;
    this.userName = userName;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.userId = null;
    this.userName = null;
    this.userRole = null;
  };
  return this;
})



// ////////////// CONTROLERS ///////////// //

myApp.controller('AppCtrl', function($scope, AUTH_EVENTS, $rootScope, $log, USER_ROLES, AuthService, $location){
  
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
  
  $scope.currentUser = AuthService.getAuthUser();
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
  
  $scope.$on(AUTH_EVENTS.notAuthenticated, function() {$location.path("\login")});
  $scope.$on(AUTH_EVENTS.sessionTimeout, function() {$location.path("\login")});
  $scope.$on(AUTH_EVENTS.loginSuccess, function() {$location.path('/')});
  
  $scope.$on('$routeChangeStart', function routeAuthorized(scope, next) {
    var route = next || $route.current;
    var authorizedRoles = route.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
  
  $scope.logout = function() {
    AuthService.logout();
    $scope.setCurrentUser(null);
    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    $scope.$emit('addMessageBetweenPages', {type:'info',message:'Logout success'});
  }

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

myApp.controller('LoginController', function ($location, $scope, $rootScope, AUTH_EVENTS, AuthService) {
  $scope.$emit('newPageLoaded');
  
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (user) {
      $scope.setCurrentUser(user);
      $scope.$emit('addMessageBetweenPages', {type:'info',message:'Login success'});
      $scope.$emit(AUTH_EVENTS.loginSuccess);
    }, function () {
      $scope.$emit(AUTH_EVENTS.loginFailed);
    });
  };
  
})

// ////////////// DIRECTIVES ///////////// //

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
