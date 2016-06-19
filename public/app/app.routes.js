angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// Ruta a la pagina principal
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// Login
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})
		
		// Muestra todos los usuarios
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// Formulario para crear un usuario
		// Misma vista que la de editar
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// Formulario para editar un usuario
		.when('/users/:nuhsa', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// Vista de las citas del día
		.when('/appointments/', {
			templateUrl: 'app/views/pages/appointments.html',
			controller: 'appController',
			controllerAs: 'app'
		});

	$locationProvider.html5Mode(true);

});
