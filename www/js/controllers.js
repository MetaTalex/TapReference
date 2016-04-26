angular.module('starter.controllers', [])


.controller('LoginCtrl', function($scope, $firebaseAuth, $location, $state) {
    $scope.login = function(email, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: email,
            password: password
        }).then(function(authData) {
            $location.path("/tab/profile");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(email, password) {
	    $state.go("tab.register", { mail: email, pass: password })
    }
})

.controller('RegisterCtrl', function($scope, $firebaseAuth, $location, $stateParams) {
    $scope.register = function() {
        var fbAuth = $firebaseAuth(fb);
	with ($scope) {
		if (password != confirmPassword)
			throw "Passwords don't match"
		fbAuth.$createUser({email: email, password: password}).then(function() {
		    return fbAuth.$authWithPassword({
			email: email,
			password: password
		    });
		}).then(function(authData) {

			//$scope.firstName = $stateParams['fName']
			//$scope.secondName = $stateParams['sName']
			var user = fb.child("users").child(authData.uid);
			user.child("Email").set(email);
			user.child("First Name").set(firstName);
			user.child("Second Name").set(secondName);
			
			
			user.once("value", function(snapshot) {
			console.log(snapshot.val());
			});

		    $location.path("/tab/profile");
			
		}).catch(function(error) {
		    console.error("ERROR " + error);
		});
	}
    }
	$scope.email = $stateParams['mail']
	$scope.password = $stateParams['pass']
	$scope.firstName = "";
	$scope.secondName = "";
	$scope.confirmPassword = "";
	$scope.form = {
	    email:
		    function (value) {
			    return arguments.length ? $scope.email = value : $scope.email
		    },
	    firstName:
		    function (value) {
			    return arguments.length ? $scope.firstName = value : $scope.firstName
		    },
	    secondName:
		    function (value) {
			    return arguments.length ? $scope.secondName = value : $scope.secondName
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
