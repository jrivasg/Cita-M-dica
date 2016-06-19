angular.module('appointmentCtrl', ['appointmentService', 'userService'])

.controller('appController', function(App, User) {

    var vm = this;

    // Obtenemos el día que se quiere consultar
    vm.day = new Date();

    // Se obtienen todas las citas para mostrarlas conjuntamente
    vm.getAppointments = function() {

        // Variable de procesos para mostrar la carga de elementos
        vm.processing = true;

        var dayformat = new Date(vm.day.getFullYear(), vm.day.getMonth(), vm.day.getDate(), 0, 0, 0, 0);
        vm.dayMillisecond = dayformat.getTime();

        App.day(vm.dayMillisecond)
            .success(function(data) {
                // Cuando se obtienen todos las citas, se cambia la variable de carga
                vm.processing = false;
                // Se vuelcan los datos obtenido a la variable de entorno users
                vm.apps = data;
            });
    };

    // De inicio se cargan las citas del día actual 
    if (vm.day != null) {
        vm.getAppointments();
    }


    // función para borrar un usuario
    vm.finishAppointment = function(appointment) {
        vm.processing = true;
        var now = new Date();
        now.setSeconds(0);
        now.setMilliseconds(0);
        now = now.getTime();

        for (var i = 0; i < vm.apps.length - 1; i++) {
            if (vm.apps[i]._id == appointment._id) {
                vm.apps.splice(i, 1);
            }
        }

        App.delete(appointment.nuhsa, appointment.date)
            .success(function(data) {
                // Se elimina la hora del archivo hour.json para que vuelva a ser seleccionable en el calendario

                // Se recalcula el tiempo hasta la cita para cada usuario, se obtiene la hora actual y
                // se añade al resto, por orden, 15 minutos.
                for (var i = 0; i < vm.apps.length; i++) {
                    var newHour = now + (900000 * (i + 1));
                    vm.apps[i].dateDayTime = newHour;
                    pos = i;

                    if (pos < vm.apps.length) {
                        App.update(vm.apps[i].date, vm.apps[i])
                            .success(function(data) {
                                vm.processing = false;
                                if (pos == vm.apps.length - 1) {
                                    App.day(vm.dayMillisecond)
                                        .success(function(data) {
                                            // Cuando se obtienen todos las citas, se cambia la variable de carga
                                            vm.processing = false;
                                            // Se vuelcan los datos obtenido a la variable de entorno users
                                            vm.apps = data;
                                        });
                                }
                            });
                    }
                };

            });
    };
});
