angular.module('appointmentService', [])

.factory('App', function($http) {

	// Obejto sobre el que guardara todos los métodos de peticiones
	var appFactory = {};

	// Obtner todas las citas de un día concreto
	appFactory.day = function(day) {
		return $http({
			url: '/api/appointments/day',
			method: "GET",
			params: {
				day: day
			}
		});
	};

	appFactory.all = function() {
		return $http.get('/api/appointments/');
	};
	// Borrar cita concluida
	appFactory.delete = function(nuhsa, date) {
		return $http({
			url: '/api/user/appointment',
			method: "DELETE",
			params: {
				nuhsa: nuhsa,
				date: date
			}
		});
	};

	appFactory.update = function(date, userData) {
		return $http({
			url: '/api/user/appointment',
			method: "PUT",
			params: {
				date: date
			},
			data : userData
		});
	};

	appFactory.hour = function(nuhsa, date, hourData) {
		return $http({
			url: '/api/hour',
			method: "DELETE",
			params: {
				date: date,
				nuhsa: nuhsa
			},
			data : hourData
		});
	};

	// return our entire userFactory object
	return appFactory;
});