angular.module('starter.controllers', [])


.controller('LoginCtrl', function($scope, $firebaseAuth, $location, $state) {
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
	    $state.go("tab.register", { user: username, pass: password })
    }
})

.controller('RegisterCtrl', function($scope, $firebaseAuth, $location, $stateParams) {
    $scope.register = function() {
        var fbAuth = $firebaseAuth(fb);
	with ($scope) {
		if (password != confirmPassword)
			throw "Passwords don't match"
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
    }
    $scope.username = $stateParams['user']
    $scope.password = $stateParams['pass']
    $scope.confirmPassword = "";
    $scope.form = {
	    username:
		    function (value) {
			    return arguments.length ? $scope.username = value : $scope.username
		    },
	    password:
		    function (value) {
			    return arguments.length ? $scope.password = value : $scope.password
		    },
	    confirmPassword:
		    function (value) {
			    return arguments.length ? $scope.confirmPassword = value : $scope.confirmPassword
		    }
    }

})

.controller('ProfileCtrl', function($scope) {})

.controller('SearchCtrl', function($scope) {})
