angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth){

	var vm = this;

	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function(){  //event listener to see if the route is changing
		vm.loggedIn = Auth.isLoggedIn();  // then check if user is logged in
		Auth.getUser() //get user information if the user is logged in 
			.then(function(data){  //then gives a fucntionality perfect for validation - this is some type of call back function

				vm.user = data.data;

			});
	});

	vm.doLogin = function(){  //creating a login function

		vm.processing = true;
		vm.error = '';



		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){  //call back function
				vm.processing = false;

				Auth.getUser() //same as above
					.then(function(data){
						vm.user = data.data;
					});

					if(data.success) //if login is success direct the user to another page
						$location.path('/');
					else
						vm.error = data.message;
			});

	}

	vm.doLogout = function(){

		Auth.logout();
		$location.path('/logout');

	}
//no need to return

});