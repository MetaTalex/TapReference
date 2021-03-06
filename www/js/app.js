// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var TapReference = angular.module('starter', ['ionic', 'starter.controllers', 'firebase'])

var fb = null;

TapReference.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	fb = new Firebase("https://tapreference.firebaseio.com/");
  });
})

TapReference.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
		    templateUrl: 'templates/tabs.html',
		    controller: 'NavCtrl',
  })

  // Each tab has its own nav history stack:
  
  .state('tab.profile', {
    url: '/profile/:uid',
    views: {
      'profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      },
		reload:true
    },
  })

  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      }
    })
	
.state('tab.login', {
    url: '/login',
      cache: false,
    views: {
      'login': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      },
		reload:true
    },
  })

	.state('tab.register', {
		url: '/register?mail',
		params: {
			pass: "",
		},
	views: {
		'register': {
			templateUrl: 'templates/register.html',
			controller: 'RegisterCtrl'
		},
		reload:true
	}
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

});

