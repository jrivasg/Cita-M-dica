angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// check to see if a Admin is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();	

		// get Admin information on page load
		Auth.getAdmin()
			.then(function(data) {
				vm.admin = data.data;
			});	
	});	

	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';
		$location.path('/users');
		/*Auth.login(vm.loginData.adminName, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;			

				// if a admin successfully logs in, redirect to admins page
				if (data.success)			
					$location.path('/users');
				else 
					vm.error = data.message;
				
			});*/
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.admin = '';
		
		$location.path('/login');
	};

	vm.createSample = function() {
		Auth.createSampleAdmin();
	};

});
