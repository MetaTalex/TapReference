angular.module('starter.controllers', [])


.controller('LoginCtrl', function($scope, $firebaseAuth, $location) {
    $scope.login = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $location.path("/tab/profile");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
    }
})

.controller('RegisterCtrl', function($scope) {
    $scope.register = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser({email: username, password: password}).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $location.path("/tab/profile");
        }).catch(function(error) {
            console.error("ERROR " + error);
        });
    }
    $scope.alert = alert;
})

.controller('ProfileCtrl', function($scope) {})

.controller('SearchCtrl', function($scope) {})
