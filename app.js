
'use strict';

function Config($stateProvider, $urlRouterProvider, USER_ROLES) {

    $urlRouterProvider.otherwise('/login');
    $stateProvider
     .state('home', {
         url: '/home',
         templateUrl: '/app/views/home.html'
     })
     .state('about', {
         url: '/about',
         templateUrl: '../app/views/about.html'
     })
     .state('contact', {
         url: '/contact',
         templateUrl: '../app/views/contact.html'
     })
     .state('login', {
         url: '/login',
         templateUrl: '../app/views/login.html',
         controller: 'LoginCtrl'
     })
     .state('dashboard', {
         url: '/Dashboard',
         templateUrl: '../app/views/dashboard.html',
         controller: 'CandidateCtrl',
         data: {
             authorizedRoles: [USER_ROLES.candidate]
         }
     })
    .state('questions', {
        url: '/questions',
        templateUrl: '../app/views/questions.html',
        controller: 'QuestionCtrl',
        data: {
            authorizedRoles: [USER_ROLES.candidate]
        }
    })
    .state('information', {
        url: '/information',
        params: {
            errorMsg: null,
            timeOutMsg: null
        },
        templateUrl: '../app/views/information.html',
        controller: 'InformationCtrl',
        data: {
            authorizedRoles: [USER_ROLES.candidate]
        }
    })
    .state('thankyou', {
        url: '/thankyou',
        params: {
            errorMsg: null,
            timeOutMsg: null
        },
        templateUrl: '../app/views/thankYou.html',
        controller: 'ThankyouCtrl'
    })
    .state('candidate', {
        url: '/candidate',
        templateUrl: '../app/views/candidate.html',
        controller: 'CandidateCtrl',
        data: {
            authorizedRoles: [USER_ROLES.candidate]
        }
    })
}

var app = angular.module('spi', [

  'ngCookies',
  'ngSanitize',
  'ngProgressLite',
  'spi.services',
  'spi.directives',
  'spi.controllers',
  'LocalStorageModule',
  'ui.router'
])

 .config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', Config])

 .constant('configuration', {
     API_URL: 'http://localhost:6990/api/'
 })

 .constant('AUTH_EVENTS', {
     loginSuccess: 'auth-login-success',
     loginFailed: 'auth-login-failed',
     logoutSuccess: 'auth-logout-success',
     sessionTimeout: 'auth-session-timeout',
     notAuthenticated: 'auth-not-authenticated',
     notAuthorized: 'auth-not-authorized'
 })

 .constant('USER_ROLES', {
     all: '*',
     admin: 'admin',
     reviewer: 'reviewer',
     candidate: 'candidate'
 })

 .run([
  '$rootScope', '$state', '$stateParams', '$window', 'AUTH_EVENTS', 'AuthService', 'USER_ROLES',
  function ($rootScope, $state, $stateParams, $window, AUTH_EVENTS, authService, USER_ROLES) {

      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;

      $rootScope.$on(AUTH_EVENTS.notAuthenticated, authenticationFailed);
      $rootScope.$on(AUTH_EVENTS.notAuthorized, authenticationFailed);

      function authenticationFailed() {
          $state.go('login');
      };

      $rootScope.$on('$stateChangeStart', function (event, next) {
          if (!next.data || !next.data.authorizedRoles)
              return;
          if (next.data.authorizedRoles[0] === USER_ROLES.any) {
              if (!authService.isAuthenticated()) {
                  event.preventDefault();
                  // user is not allowed
                  $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
              }
          } else {
              var authorizedRoles = next.data.authorizedRoles;
              if (!authService.isAuthorized(authorizedRoles)) {
                  event.preventDefault();
                  if (authService.isAuthenticated()) {
                      // user is not allowed
                      $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                  } else {
                      // user is not logged in
                      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                  }
              }
          }

      });
  }
 ])

var directiveModule = angular.module('spi.directives', []);
var controllerModule = angular.module('spi.controllers', []);
var serviceModule = angular.module('spi.services', []);