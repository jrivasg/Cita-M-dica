angular.module('userCtrl', ['userService'])

.controller('userController', function(User) {

    var vm = this;

    // Variable de procesos para mostrar la carga de elementos
    vm.processing = true;

    // Se obtienen todos los usuarios para mostrarlos conjuntamente
    User.all()
        .success(function(data) {
            // Cuando se obtienen todos los usuarios, se cambia la variable de carga
            vm.processing = false;
            // Se vuelcan los datos obtenido a la variable de entorno users
            vm.users = data;
        });

    // función para borrar un usuario
    vm.deleteUser = function(nuhsa) {
        vm.processing = true;

        User.delete(nuhsa)
            .success(function(data) {
                // Cuando se elimina un usuario se obtiene la lista actualizada
                User.all()
                    .success(function(data) {
                        vm.processing = false;
                        vm.users = data;
                    });

            });
    };

})

// controller aplicado a la página de creación de usuario
.controller('userCreateController', function(User) {

    var vm = this;

    // variable para diferenciar cuando se está en la página de crear o editar
    vm.type = 'create';

    var vm = this;
    User.getCenters()
        .success(function(data) {
            vm.centers = data;
        });

    // function to create a user
    vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';
        // vm.userData.medicalCenterLocation = vm.currentCenter;
        // console.log(userData.medicalCenterLocation);
        vm.userData.birthDate = vm.userData.birthDate.getTime();
        vm.userData.medicalCenterLocation = vm.currentCenter;
        console.log(vm.userData);

        // Obtenemos la lista estática de centros de salud existentes
        User.create(vm.userData)
            .success(function(data) {
                vm.processing = false;
                vm.userData = {};
                vm.message = data.message;
            });

    };

})

// controller aplicado a la página de edición de usuario
.controller('userEditController', function($routeParams, User) {

    var vm = this;
    // variable para diferenciar cuando se está en la página de crear o editar
    vm.type = 'edit';
    // Obtiene el usuario concreto a editar
    // $routeParams es la forma de obtener los datos enviados en la url (nuhsa de usario)
    User.get($routeParams.nuhsa)
        .success(function(data) {
            vm.userData = data;
            // Obtenemos la fecha de nacimiento en formato miliseconds y lo pasamos a objeto Date
            // para mostrar la fecha formateada por pantalla
            vm.userData.birthDate = new Date(data.birthDate);

            // Obtenemos la lista estática de centros de salud existentes
            User.getCenters()
                .success(function(data) {
                    // Se vuelva la lista de centros a la variable de entorno
                    vm.centers = data;
                    // se crea una variable temporal para comparar el actual centro asignado al 
                    // usuario con la lista de centros
                    //var center = vm.userData.medicalCenterLocation.id;
                    for (var i = 0; i < vm.centers.length; i++) {
                        if (vm.centers[i]._id == vm.userData.medicalCenterLocation._id) {
                            // Se asigna el centro del usuario a la variable de entorno
                            // para ser la mostrada por defecto en el desplegable
                            vm.currentCenter = vm.centers[i];
                            //pos = i-1;
                            break;
                        }
                    }
                });
        });

    // Función que guarda el usuario con las modificaciones realizadas
    vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';
        // Se obtiene la fecha en milliseconds para guardar en base de datos
        vm.userData.birthDate = vm.userData.birthDate.getTime();
        vm.userData.medicalCenterLocation = vm.currentCenter;

        // se llama al servicio para hacer update al usuario
        User.update($routeParams.nuhsa, vm.userData)
            .success(function(data) {
                vm.processing = false;

                // se deja en blanco el formulario de actualización
                // vm.userData = {};

                // bind del mensage devuelto por el servidor a la variable vm.message
                vm.message = data;
            });
    };

});
