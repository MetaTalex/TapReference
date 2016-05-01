angular.module('starter.controllers', [])


.controller('LoginCtrl', function($scope, $firebaseAuth, $state) {
    $scope.login = function(email, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: email,
            password: password
        }).then(function(authData) {
             $state.go("tab.profile", { uid: authData.uid })
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    /*$scope.register = function(email, password) {
	    $state.go("tab.register", { mail: email, pass: password })
    }*/
})

.controller('RegisterCtrl', function($scope, $firebaseAuth, $state, $stateParams) {
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

			var user = fb.child("users").child(authData.uid);
			user.child("Email").set(email);
			user.child("First Name").set(firstName);
			user.child("Second Name").set(secondName);
			$state.go("tab.profile", { uid: authData.uid });
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

.controller('ProfileCtrl', function($scope, $stateParams, $firebaseObject, $ionicLoading) {
	$scope.uid = $stateParams['uid'];
	$scope.fullName = "No name";

	$ionicLoading.show({
		template: "<ion-spinner></ion-spinner>",
	});

	var user = $firebaseObject(fb.child("users").child($scope.uid));
	user.$loaded().then(function() {
		$scope.fullName = user["First Name"] + " " + user["Second Name"];
		$ionicLoading.hide();
	})
})



.controller('SearchCtrl', function($scope) {})
