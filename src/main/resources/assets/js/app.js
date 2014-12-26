var myApp = angular.module('myApp', ['ngResource', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'duScroll', 'ngRoute']);
myApp.config(function ($routeProvider, USER_ROLES, $provide, $httpProvider) {
  var checkRight = function (right) {
    return function ($q, AuthService) {
      var retDef = $q.defer();
      if (AuthService.isAuthorized(right)) {
        retDef.resolve();
      } else {
        retDef.reject({invalidRights: true, rightRequired: right});
      }
      return retDef.promise;
    }
  }
  $routeProvider.whenHasRight = function (right, path, route) {
    route.resolve = route.resolve || {};
    route.resolve.hasRight = checkRight(right);
    return $routeProvider.when(path, route);
  };
  $routeProvider.
    whenHasRight(USER_ROLES.admin, '/', {
      templateUrl: 'partials/user-list.html',
      controller: 'UserListCtrl'
    }).whenHasRight(USER_ROLES.admin, '/user/:id', {
      templateUrl: 'partials/user-details.html',
      controller: 'UserDetailsCtrl',
      resolve: {
        user: function ($route, UsersResource) {
          debugger;
          var id = $route.current.params.id;
          if (id && id > 0) {
            return UsersResource.get({id: $route.current.params.id}).$promise;
          } else {
            return {payload: null}
          }
        }
      }
    }).when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginController'
    }).otherwise({
      redirectTo: '/'
    });
//Intercept http calls.
  $provide.factory('MyHttpInterceptor', function (cfpLoadingBar, $q) {
    return {
      // On request success
      request: function (config) {
        cfpLoadingBar.start();
        console.log(config); // Contains the data about the request before it is sent.
        // Return the config or wrap it in a promise if blank.
        return config || $q.when(config);
      },
      // On request failure
      requestError: function (rejection) {
        cfpLoadingBar.complete();
        console.log(rejection); // Contains the data about the error on the request.
        // Return the promise rejection.
        return $q.reject(rejection);
      },
      // On response success
      response: function (response) {
        cfpLoadingBar.complete();
        console.log(response); // Contains the data from the response.
        // Return the response or promise.
        return response || $q.when(response);
      },
      // On response failture
      responseError: function (rejection) {
        cfpLoadingBar.complete();
        console.log(rejection); // Contains the data about the error.
        // Return the promise rejection.
        return $q.reject(rejection);
      }
    };
  });
  // Add the interceptor to the $httpProvider.
  $httpProvider.interceptors.push('MyHttpInterceptor');
});
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
    return Session.getUserAuthenticated();
  }
  authService.login = function (credentials) {
    var deferred = $q.defer();
    setTimeout(function () {
      Session.create({id: 1, name: 'name', userRole: 'admin'});
      deferred.resolve({id: 1, name: 'name', userRole: 'admin'});
    }, 1000);
    return deferred.promise;
  };
  authService.isAuthenticated = function () {
    return !!Session.getUserAuthenticated();
  };
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
    authorizedRoles.indexOf(Session.getUserAuthenticated().userRole) !== -1);
  };
  Session.initUserAuthenticated();
  return authService;
})
// ////////////// SERVICES ///////////// //
myApp.service('Session', function ($window) {
  this.setUserAuthenticated = function (userInfo) {
    $window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.userAuthenticated = userInfo;
  };
  this.getUserAuthenticated = function () {
    return this.userAuthenticated;
  };
  this.removeUserAuthenticated = function () {
    $window.sessionStorage.removeItem('userInfo');
    this.userAuthenticated = undefined;
  };
  this.initUserAuthenticated = function () {
    var userInfo = $window.sessionStorage.getItem("userInfo");
    if (userInfo) {
      this.setUserAuthenticated(JSON.parse(userInfo));
    }
  };
  this.create = function (userInfo) {
    this.setUserAuthenticated(userInfo);
  };
  this.destroy = function () {
    this.removeUserAuthenticated();
  };
  return this;
})
// ////////////// CONTROLERS ///////////// //
myApp.controller('AppCtrl', function ($scope, AUTH_EVENTS, $rootScope, $log, USER_ROLES, AuthService, $location) {
  $scope.alerts = [];
  $scope.alertsBetweenPages = [];
  $scope.$on('addMessage', function (event, error) {
    $log.log(error); // 'Data to send'
    if (error.status === 422) {
      $scope.alerts.push({type: 'danger', message: "Data is not valid."});
    } else if (error.data && error.data.message && error.data.type) {
      $scope.alerts.push(error.data);
    } else if (error.message && error.type) {
      $scope.alerts.push(error);
    } else if (error.status === 500) {
      $scope.alerts.push({type: 'danger', message: "Could not process request."});
    } else {
      $scope.alerts.push({type: 'danger', message: "Could not process request."});
    }
  });
  $scope.$on('addMessageBetweenPages', function (event, error) {
    $log.log(error); // 'Data to send'
    if (error.status === 422) {
      $scope.alertsBetweenPages.push({type: 'danger', message: "Data is not valid."});
    } else if (error.data && error.data.message && error.data.type) {
      $scope.alertsBetweenPages.push(error.data);
    } else if (error.message && error.type) {
      $scope.alertsBetweenPages.push(error);
    } else if (error.status === 500) {
      $scope.alertsBetweenPages.push({type: 'danger', message: "Could not process request."});
    } else {
      $scope.alertsBetweenPages.push({type: 'danger', message: "Could not process request."});
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
  $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
    $location.path("\login")
  });
  $scope.$on(AUTH_EVENTS.sessionTimeout, function () {
    $location.path("\login")
  });
  $scope.$on(AUTH_EVENTS.loginSuccess, function () {
    $location.path('/')
  });
  $scope.$on('$locationChangeStart', function (event, next, current) {
//    console.log('chaning location');
//    debugger;
  });
  $scope.$on('$routeChangeStart', function routeAuthorized(scope, next) {
//    var route = next || $route.current;
//    var authorizedRoles = route.authorizedRoles;
//    if (!AuthService.isAuthorized(authorizedRoles)) {
//      event.preventDefault();
//      if (AuthService.isAuthenticated()) {
//        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
//      } else {
//        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
//      }
//    }
  });
  $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
    $scope.$emit('addMessage', rejection);
    $log.log("failed to change routes");
    $location.path('/login');
  });
  $scope.logout = function () {
    AuthService.logout();
    $scope.setCurrentUser(null);
    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    $scope.$emit('addMessageBetweenPages', {type: 'info', message: 'Logout success'});
  }
})
var appCtrl = myApp.controller('UserDetailsCtrl', function ($scope, user, $http, UsersResource, $q, $location, $document, $routeParams, $route) {
  $scope.$emit('newPageLoaded');
  $scope.label = $scope.id == -1 ? 'Create' : 'Update';
  $scope.isNew = $scope.id == -1;
  $scope.model = user.payload;
  $scope.saveUser = function (user) {
    $scope.$emit('clearMessages');
    UsersResource.save(user).$promise.then(function (result) {
      $scope.$emit('addMessageBetweenPages', result);
      $route.reload();
    });
  }
  $scope.delete = function (user) {
    $scope.$emit('clearMessages');
    UsersResource.remove({id: user.id}).$promise.then(function (result) {
      $scope.$emit('addMessageBetweenPages', result);
      $location.path('/');
    });
  }
});
//appCtrl.loadData = function ($q, $timeout) {
//  var deferred = $q.defer();
//  var name = true;
//
//  setTimeout(function() {
//    deferred.notify('About to greet ' + name + '.');
//    if (!name) {
//      deferred.resolve('Hello, ' + name + '!');
//    } else {
//      deferred.reject('Greeting ' + name + ' is not allowed.');
//    }
//  }, 1000);
//
//  return deferred.promise;
//};
myApp.controller('UserListCtrl', function ($scope, $http, UsersResource, $q, $document) {
  $scope.$emit('newPageLoaded');
  $scope.users = [];
  $scope.getUsers = function () {
    UsersResource.get().$promise.then(function (result) {
      $scope.users = result.payload;
    }, function (error) {
      $scope.$emit('addMessage', error);
    }, function () {
    });
  }
  $scope.delete = function (user) {
    $scope.$emit('clearMessages');
    UsersResource.remove({id: user.id}).$promise.then(function (result) {
      $document.scrollTopAnimated(4).then(function () {
        $scope.getUsers();
        $scope.$emit('addMessage', result);
      });
    }, function (error) {
      $scope.$emit('addMessage', error);
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
      $scope.$emit('addMessageBetweenPages', {type: 'info', message: 'Login success'});
      $scope.$emit(AUTH_EVENTS.loginSuccess);
    }, function () {
      $scope.$emit(AUTH_EVENTS.loginFailed);
    });
  };
})
// ////////////// DIRECTIVES ///////////// //
myApp.directive('dwngrokuInput', function ($compile) {
  return {
    restrict: "A",
    require: "^form",
    priority: 0,
    replace: true,
    templateUrl: 'templateUrl/dwngrokuInput.html',
    link: function ($scope, el, attrs, ctrl) {
      var formName = el.parent().controller('form').$name;
      var html = el.html().replace(/attrs.name/g, attrs.dwngrokuInput)
        .replace(/attrs.label/g, attrs.label)
        .replace(/attrs.form/g, formName)
        .replace(/attrs.model/g, 'model');
      $compile(html)($scope, function (_el) {
        el.replaceWith(_el);
      });
    }
  }
});
