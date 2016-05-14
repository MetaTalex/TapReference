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
	if (password != confirmPassword)
		throw "Passwords don't match"
	fbAuth.$createUser({email: email, password: password}).then(function() {
	    return fbAuth.$authWithPassword({
		email: email,
		password: password
	    });
	}).then(function(authData) {

		var user = fb.child("users").child(authData.uid);
		user.child("Email").set($scope.email);
		user.child("First Name").set($scope.firstName);
		user.child("Second Name").set($scope.secondName);
		//fb.child("referrals").child(authData.uid);
		//var referrals = fb.child("referrals").child(authData.uid);
		//referrals.child("Anything").set("words");
		
		$state.go("tab.profile", { uid: authData.uid });
		}).catch(function(error) {
			console.error("ERROR " + error);
		});

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

<<<<<<< Updated upstream
.controller('ProfileCtrl', function($scope, $stateParams, $firebaseObject, $ionicLoading, $ionicModal) {
	$scope.uid = $stateParams['uid'];
=======
.controller('ProfileCtrl', function($scope, $state, $stateParams, $firebaseObject, $ionicLoading) {
	$scope.showtab =true ;
	if ($stateParams['uid'] != "")
		$scope.uid = $stateParams['uid'];
	else if (fb.getAuth() != null)
		$scope.uid = fb.getAuth().uid;
	else {
		$state.go("tab.login");
		return;
	}
				
>>>>>>> Stashed changes
	$scope.fullName = "No name";
	//this might be wrong I'm totally hypothesizing here
	var incomingReferral;
	//wip
	//$scope.displayedReferralText[] = "";
	//$scope.referralText = "";
	$scope.profileClass = "blur";
	


	$ionicLoading.show({
		template: "<ion-spinner></ion-spinner>",
	});

	var user = $firebaseObject(fb.child("users").child($scope.uid));
	user.$loaded().then(function() {
		$scope.showtab = false;
		$scope.fullName = user["First Name"] + " " + user["Second Name"];
		$ionicLoading.hide();
		$scope.profileClass = "";

		var thisUser = fb.getAuth().uid;
		var mpr = fb.child("pendingReferrals").child(thisUser);
		mpr.once("value", function (snapshot) {
			if (snapshot.hasChildren) {
			}
		});

	});
	
	//referral submit button function
	//needs to send the referral into the appropriate area of the pendingReferrals node in Firebase 
	$scope.refer = function() {
		if (fb.getAuth() == null)
		return;

		var pendingReferral = fb.child("pendingReferrals").child($scope.uid).child(fb.getAuth().uid);
		pendingReferral.child("referralText").set($scope.referralText);
		
		console.log($scope.referralText)
	};
	
	var thisUser = fb.getAuth().uid
	console.log(thisUser);
	//var pendingUser = fb.child("pendingReferrals").child(fb.getAuth().uid);
	$scope.referCheck= function(){
		if (fb.getAuth() == null)
		return;

			  fb.child("pendingReferrals").child(thisUser).limitToFirst(1).once("value", function(snapshot) {
			  snapshot.forEach(function(childSnapshot) {
				var a = childSnapshot.key();
				console.log(a);
				});
			  });
	};

	$ionicModal.fromTemplateUrl('templates/pendRefModal.html', {
		scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
		});
	//wot i'm trying to do right now, store the data to a global variable, display the global variable as {{incomingReferral}} and then let
	//user to decide whether to delete it or save it (technically in both instances it's getting deleted in pendingReferrals anyway)
	//also technically this might come first but try to combine elements of the referCheck method w/ the modal yoke so that
	//when we load the modal it know to set the incomingReferral var to the referralText we'll be retrieving.
	//Note to self: haven't got referralText's val yet just the node that precedes it
	
	$scope.referralText = "";
	$scope.form = {
		referralText:
		function (value) {
			return arguments.length ? $scope.referralText = value : $scope.referralText
		}
	};
	
})



.controller('SearchCtrl', function($scope) {})

.controller('TabCtrl', function($scope, $state) {
	$scope.isOn = function(tab) {
		console.log($state.current)
		return $state.current['name'] == tab;
	}
	$scope.isLoggedIn = function() {
		return fb.getAuth() != null;
	}
})
