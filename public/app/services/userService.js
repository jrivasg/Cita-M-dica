angular.module('userService', [])

.factory('User', function($http) {

	// create a new object
	var userFactory = {};

	// get a single user
	userFactory.get = function(nuhsa) {
		return $http({
			url: '/api/user/',
			method: "GET",
			params: {
				nuhsa: nuhsa
			}
		});
	};

	// get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	// create a user
	userFactory.create = function(userData) {
		return $http.post('/api/user/', userData);
	};

	// update a user
	userFactory.update = function(nuhsa, userData) {
		return $http({
			url: '/api/user/',
			method: "PUT",
			params: {
				nuhsa: nuhsa
			},
			data : userData
		});
	};

	// delete a user
	userFactory.delete = function(nuhsa) {
		return $http({
			url: '/api/user/',
			method: "DELETE",
			params: {
				nuhsa: nuhsa
			}
		});
	};

	userFactory.getCenters = function() {
		return $http.get('/api/center/');
	};

	// return our entire userFactory object
	return userFactory;
});