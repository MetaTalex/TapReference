angular.module('starter.controllers', [])

.controller('NavCtrl', function($scope, $state, $ionicPopover) {
	$scope.referrals = null;
	$scope.notifications = null;
	$ionicPopover.fromTemplateUrl('templates/notifications.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.notifications = popover;
	});

	function refreshReferrals() {
		if ($scope.referrals == null) {
			var thisUser = fb.getAuth().uid
			if (fb.getAuth() == null)
			return;
			fb.child("pendingReferrals").child(thisUser).limitToFirst(5).once("value", function(snapshot) {
				$scope.referrals = {};
				snapshot.forEach(function(refSnapshot) {
					var refObject = refSnapshot.val();
					fb.child("users").child(refSnapshot.key()).once("value", function(userSnapshot) {
						var userObject = userSnapshot.val();
						refObject['authorName'] = userObject['First Name'] + " " + userObject['Second Name'];
						refObject['authorEmail'] = userObject['Email'];
						$scope.referrals[refSnapshot.key()] = refObject;
						$scope.$apply();
					});
				});
			});
		}
	}

	$scope.openNotifications = function($event) {
		refreshReferrals();
		$scope.notifications.show($event);
	}

	$scope.classLoggedIn = function() {
		return $scope.isLoggedIn() ? "ng-show" : "ng-hide";
	}

	$scope.logOut = function() {
		console.log(fb.unauth());
		$state.go("tab.login");
	}

	$scope.isOn = function(tab) {
		return $state.current['name'] == tab;
	}

	$scope.isLoggedIn = function() {
		return fb.getAuth() != null;
	}
})

.controller('LoginCtrl', function($scope, $firebaseAuth, $state) {
	if (fb.getAuth())
             $state.go("tab.profile", { uid: fb.getAuth().uid })

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
	if ($scope.password != $scope.confirmPassword)
		throw "Passwords don't match"
	fbAuth.$createUser({email: $scope.email, password: $scope.password}).then(function() {
	    return fbAuth.$authWithPassword({
		email: $scope.email,
		password: $scope.password
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

.controller('ProfileCtrl', function($scope, $state, $stateParams, $firebaseObject, $ionicLoading, $ionicModal) {
	$scope.uid = $stateParams['uid'];
	$scope.referrals = {};
	if ($stateParams['uid'] != "")
		$scope.uid = $stateParams['uid'];
	else if (fb.getAuth() != null)
		$scope.uid = fb.getAuth().uid;
	else {
		$state.go("tab.login");
		return;
	}
				
	$scope.fullName = "No name";
	//this might be wrong I'm totally hypothesizing here
	$scope.incomingReferral;
	//wip
	//$scope.displayedReferralText[] = "";
	//$scope.referralText = "";
	$scope.profileClass = "blur";
	


	$ionicLoading.show({
		template: "<ion-spinner></ion-spinner>",
	});

	function updateReferrals(snapshot) {
		var refObject = snapshot.val();
		fb.child("users").child(snapshot.key()).once("value", function(userSnapshot) {
			var userObject = userSnapshot.val();
			refObject['authorName'] = userObject['First Name'] + " " + userObject['Second Name'];
			refObject['authorEmail'] = userObject['Email'];
			$scope.referrals[snapshot.key()] = refObject;
			$scope.$apply();
		});
	}

	var user = $firebaseObject(fb.child("users").child($scope.uid));
	var recentReferrals = fb.child("referrals").child($scope.uid).orderByChild("timestamp").limitToLast(5);
	user.$loaded().then(function() {
		$scope.showtab = false;
		$scope.fullName = user["First Name"] + " " + user["Second Name"];
		$ionicLoading.hide();
		$scope.profileClass = "";
		recentReferrals.on("child_added", updateReferrals);
		recentReferrals.on("child_changed", updateReferrals);
	});
	
	//referral submit button function
	//needs to send the referral into the appropriate area of the pendingReferrals node in Firebase 
	$scope.refer = function() {
		if (fb.getAuth() == null)
		return;

		var pendingReferral = fb.child("pendingReferrals").child($scope.uid).child(fb.getAuth().uid);
		pendingReferral.child("referralText").set($scope.referralText);
	};
	
	if (fb.getAuth()) {
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
				

	/* 			  fb.child("pendingReferrals").child(thisUser).limitToFirst(1).once("value", function(snapshot) {
				  snapshot.forEach(function(childSnapshot) {
					var a = childSnapshot.key();
					console.log(a);
					$scope.incomingReferral = a;
					});
				  });  */

			});
		
		
			//$scope.incomingReferral;
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
	}
})



.controller('SearchCtrl', function($scope, $state) {
	var term = "", lastTerm = "";
	var users = { }
	$scope.results = { }

	var dbUsers = fb.child("users");
	dbUsers.on("child_added", updateUsers);
	dbUsers.on("child_changed", updateUsers);
	dbUsers.on("child_removed", removeUser);

	$scope.viewProfile = function(uid) {
             $state.go("tab.profile", { uid: uid })
	}

	function updateUsers(snapshot) {
		users[snapshot.key()] = snapshot.val();
		applyFilter();
	}

	function removeUser(snapshot) {
		delete users[snapshot.key()];
		applyFilter();
	}

	function applyFilter() {
		$scope.results = { };
		var terms = term.toLowerCase().split(' ')
		for (var k in users) {
			var match = true;
			for (var i in terms) {
				if (!(users[k]['First Name'].toLowerCase().match(terms[i]) ||
					users[k]['Second Name'].toLowerCase().match(terms[i]))) {
					match = false;
					break;
				}
			}
			if (match)
				$scope.results[k] = users[k];
		}
		$scope.$apply();
	}

	$scope.search = function(value) {
		if (arguments.length > 0) {
			term = value;
			if (term.length >= 3)
				applyFilter();
		}
		return term;
	}

})
