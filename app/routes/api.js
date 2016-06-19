var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var fs = require('fs');
var healthCenter = require('/home/rivas/Escritorio/user-crm/app/models/healthCenter.json');
var fileName = '/home/rivas/Escritorio/user-crm/app/models/hours.json';
//var fileName = '/Users/FabLab/Dropbox/ProyectoDAM/user-crm/app/models/hours.json';
//var healthCenter = require('/Users/FabLab/Dropbox/ProyectoDAM/user-crm/app/models/healthCenter.json');
var file = require(fileName);
var User = require('../models/user');
var Admin = require('../models/admin');
var Appointment = require('../models/appointment');
var gmaputil = require('googlemapsutil');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

    var apiRouter = express.Router();

    // route to generate sample admin
    apiRouter.post('/sample', function(req, res) {

        // look for the admin named chris
        Admin.findOne({ 'adminName': 'Admin' }, function(err, admin) {

            if (!admin) {
                var adminUser = new Admin();

                adminUser.name = 'Admin';
                adminUser.adminName = 'Admin';
                adminUser.password = 'pass';

                adminUser.save();
            } else {
                // if there is an admin, update his password
                admin.password = 'pass';
                admin.save();
            }

        });

    });

    //**********Seccion que habilita la autenticación por Token de usuarios (inhabilitada de momento)*****************//
    /*	// route to authenticate an admin (POST http://localhost:8080/api/authenticate)
    	apiRouter.post('/authenticate', function(req, res) {

    	  // find the admin
    	  Admin.findOne({
    	    adminName: req.body.adminName
    	  }).select('name adminName password').exec(function(err, admin) {

    	    if (err) throw err;

    	    // no admin with that adminname was found
    	    if (!admin) {
    	      res.json({ 
    	      	success: false, 
    	      	message: 'Authentication failed. admin not found.' 
    	    	});
    	    } else if (admin) {

    	      // check if password matches
    	      var validPassword = admin.comparePassword(req.body.password);
    	      if (!validPassword) {
    	        res.json({ 
    	        	success: false, 
    	        	message: 'Authentication failed. Wrong password.' 
    	      	});
    	      } else {

    	        // if admin is found and password is right
    	        // create a token
    	        var token = jwt.sign({
    	        	name: admin.name,
    	        	adminName: admin.adminName
    	        }, superSecret, {
    	          expiresInMinutes: 1440 // expires in 24 hours
    	        });

    	        // return the information including token as JSON
    	        res.json({
    	          success: true,
    	          message: 'Enjoy your token!',
    	          token: token
    	        });
    	      }   

    	    }

    	  });
    	});

    	// route middleware to verify a token
    	apiRouter.use(function(req, res, next) {
    		// do logging
    		console.log('Somebody just came to our app!');

    	  // check header or url parameters or post parameters for token
    	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

    	  // decode token
    	  if (token) {

    	    // verifies secret and checks exp
    	    jwt.verify(token, superSecret, function(err, decoded) {      

    	      if (err) {
    	        res.status(403).send({ 
    	        	success: false, 
    	        	message: 'Failed to authenticate token.' 
    	    	});  	   
    	      } else { 
    	        // if everything is good, save to request for use in other routes
    	        req.decoded = decoded;
    	            
    	        next(); // make sure we go to the next routes and don't stop here
    	      }
    	    });

    	  } else {

    	    // if there is no token
    	    // return an HTTP response of 403 (access forbidden) and an error message
       	 	res.status(403).send({ 
       	 		success: false, 
       	 		message: 'No token provided.' 
       	 	});
    	    
    	  }
    	});

    	// test route to make sure everything is working 
    	// accessed at GET http://localhost:8080/api
    	apiRouter.get('/', function(req, res) {
    		res.json({ message: 'Api funcionando correctamente' });	
    	});*/

    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /admin                        //
    //                                                     //
    // ----------------------------------------------------//

    apiRouter.route('/admin')


    // get the admin (accessed at GET http://localhost:8080/api/admin)
    .get(function(req, res) {
        Admin.findOne({
            adminName: 'Admin'
        }, function(err, admin) {
            if (err) res.send(err);
            // return the admin
            res.json(admin);
        });
    });

    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /users                        //
    //                                                     //
    // ----------------------------------------------------//

    apiRouter.route('/users')


    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);
            // return the users
            res.json(users);
        });
    });

    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /user 			               //
    //                                                     //
    // ----------------------------------------------------//
    apiRouter.route('/user/')
        // get the user with that nuhsa
        // (accessed at GET http://localhost:8080/api/user
        .get(function(req, res) {
            var nuhsa = req.query.nuhsa || req.body.nuhsa || req.params.nuhsa;
            User.findOne({
                nuhsa: nuhsa
            }, function(err, user) {
                if (err) res.send(err);
                // return that user
                res.json(user);
            });
        })

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
        // create a new instance of the User model
        var user = new User();
        // set the users information (comes from the request)
        user.completeName = req.body.completeName;
        user.nuhsa = req.body.nuhsa;
        user.regCode = randomString(7, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        user.medicalCenterLocation.address = req.body.medicalCenterLocation.address;
        user.medicalCenterLocation.latitude = req.body.medicalCenterLocation.latitude;
        user.medicalCenterLocation.longitude = req.body.medicalCenterLocation.longitude;
        user.medicalCenterLocation.center = req.body.medicalCenterLocation.center;
        user.medicalCenterLocation._id = req.body.medicalCenterLocation._id;
        user.doctor = req.body.doctor;
        user.birthDate = req.body.birthDate;
        user.dni = req.body.dni;

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }

        // save the user and check for errors
        user.save(function(err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({
                        success: false,
                        message: 'A user with that nuhsa already exists. '
                    });
                else
                    return res.send(err);
            }
            res.send(
                'Usuario Registrado'
            );
        });
    })

    // update the user with this nuhsa
    .put(function(req, res) {
        // use our user model to find the user we want
        var nuhsa = req.query.nuhsa || req.body.nuhsa || req.params.nuhsa;
        User.findOne({
            nuhsa: nuhsa
        }, function(err, user) {
            if (err) res.send(err);

            // update the users info only if its new
            if (req.body.nuhsa) user.nuhsa = req.body.nuhsa;
            if (req.body.medicalCenterLocation.address) user.medicalCenterLocation.address = req.body.medicalCenterLocation.address;
            if (req.body.medicalCenterLocation.latitude) user.medicalCenterLocation.latitude = req.body.medicalCenterLocation.latitude;
            if (req.body.medicalCenterLocation.longitude) user.medicalCenterLocation.longitude = req.body.medicalCenterLocation.longitude;
            if (req.body.medicalCenterLocation.center) user.medicalCenterLocation.center = req.body.medicalCenterLocation.center;
            if (req.body.medicalCenterLocation._id) user.medicalCenterLocation._id = req.body.medicalCenterLocation._id;
            if (req.body.dni) user.dni = req.body.dni;
            if (req.body.doctor) user.doctor = req.body.doctor;
            if (req.body.birthDate) user.birthDate = req.body.birthDate;
            if (req.body.completeName) user.completeName = req.body.completeName;
            // save the user
            user.save(function(err) {
                if (err) res.send(err);
                // return a message
                res.send('Usuario Modificado');
            });
        });
    })

    // delete the user with this nuhsa
    .delete(function(req, res) {
        var nuhsa = req.query.nuhsa || req.body.nuhsa || req.params.nuhsa;
        User.find({
            nuhsa: nuhsa
        }).remove(function(err) {
            if (err) return res.send(err);
            res.send('Usuario elminado');
        });
    });


    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /appointments                 //
    //                                                     //
    // ----------------------------------------------------//
    apiRouter.route('/appointments')

    // Se obtienen todas las citas
    .get(function(req, res) {
        Appointment.find({}).sort({
            date: 1
        }).exec(function(err, appointments) {
            if (err) res.send(err);
            // return the appointments
            res.json(appointments);
        });
    })


    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /user/appointments            //
    //                                                     //
    // ----------------------------------------------------//
    // Se obtienen todas las citas de un paciente
    apiRouter.route('/user/appointments')
        .get(function(req, res) {

            var nuhsa = req.query.nuhsa || req.body.nuhsa || req.params.nuhsa;
            Appointment.find({
                nuhsa: nuhsa
            }).sort({
                date: 1
            }).exec(function(err, appointment) {
                if (err) return handleError(err);
                res.json(appointment);
            })
        });

    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /appointments/day             //
    //                                                     //
    // ----------------------------------------------------//
    // Se obtienen todas las citas para un día
    apiRouter.route('/appointments/day')
        // Se obtienen todas las citas de un dia
        .get(function(req, res) {

            var day = req.query.day || req.body.day || req.params.day;
            Appointment.find({
                day: day
            }).sort({
                date: 1
            }).exec(function(err, appointment) {
                if (err) return handleError(err);
                res.json(appointment);
            })
        });



    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /user/appointment/            //
    //                                                     //
    // ----------------------------------------------------//
    // Se obtienen todas las citas de un usario
    apiRouter.route('/user/appointment')
        // get the appointment with that nuhsa and date
        .get(function(req, res) {

            var nuhsa = req.query.nuhsa || req.body.nuhsa || req.params.nuhsa;
            var date = req.query.date || req.body.date || req.params.date;
            Appointment.find({
                nuhsa: nuhsa,
                date: date
            }, function(err, appointment) {
                if (err) return handleError(err);
                res.json(appointment);
            })
        })
        // create am appointment (accessed at POST http://localhost:8080/api/appointments)
        .post(function(req, res) {
            // create a new instance of the Appointments model
            var appointment = new Appointment();
            // set the appointments information (comes from the request)
            var date = req.body.date;
            appointment.date = date;
            appointment.dateDayTime = date;
            appointment.createAt = Date.now();
            appointment.examinationRoom = Math.floor(Math.random() * 5) + 1;
            appointment.nuhsa = req.body.nuhsa;

            var dateFormated = new Date(parseInt(date));
            dateFormated.setMinutes(0);
            dateFormated.setHours(0);
            appointment.day = dateFormated.getTime();


            // save the appointments and check for errors
            appointment.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({
                            success: false,
                            message: 'A appointments with that id already exists. '
                        });
                    else
                        return res.send(err);
                } else {

                    Appointment.find({
                        nuhsa: appointment.nuhsa
                    }).sort({
                        date: 1
                    }).exec(function(err, appointment) {
                        if (err) return handleError(err);
                        res.json(appointment);
                    })
                }
            });


        })

    // update the appointment with this nuhsa and date
    .put(function(req, res) {
        // use our appointment model to find the appointment we want
        var date = req.query.date || req.body.date || req.params.date;

        var dateDayTime = req.query.dateDayTime || req.body.dateDayTime || req.params.dateDayTime;
        Appointment.findOne({
            date: date
        }, function(err, appointment) {
            if (err) res.send(err);
            // update the appointment info only if its new
            if (req.body.date) appointment.date = req.body.date;
            if (req.body.createAt) appointment.createAt = Date.now();
            if (req.body.dateDayTime) appointment.dateDayTime = req.body.dateDayTime;
                    console.log(req.body.dateDayTime);
                    console.log(new Date(req.body.dateDayTime));


            // save the appointment
            appointment.save(function(err) {
                if (err) res.send(err);
                // return a message
                res.send('Cita Modificada');
            });
        });
    })

    // delete the Appointment with this nuhsa and date
    .delete(function(req, res) {
        var nuhsa = req.query.nuhsa || req.body.nuhsa || req.params.nuhsa || req.headers.nuhsa;
        var date = req.query.date || req.body.date || req.params.date || req.headers.date;

        Appointment.find({
            nuhsa: nuhsa,
            date: date
        }).remove(function(err) {
            if (err) res.send(err);
            // return a message
            res.send('Cita Eliminada');
        });
    });


    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /hours                        //
    //                                                     //
    // ----------------------------------------------------//
    apiRouter.route('/hours')

    .get(function(req, res) {
            res.json(file);
        })
        .post(function(req, res) {

            var parseFile = JSON.parse(fs.readFileSync(fileName).toString());
            var year = parseInt(req.body.year);
            var day = parseInt(req.body.day);
            var month = parseInt(req.body.month);
            var hour = parseInt(req.body.hour);
            var minute = parseInt(req.body.minute);
            var dayExists = false;
            var hourExists = false;
            var minuteExists = false;
            var write = false;
            var message;
            var posInhoursArray;
            var posInfilesArray;

            loop1:
                for (var i = 0; i < parseFile.length; i++) {

                    if (year === parseFile[i].year && month === parseFile[i].month &&
                        day === parseFile[i].day) {

                        dayExists = true;
                        posInfilesArray = i;
                        // El día existe por lo que se itera sobre el array de horas.
                        if (dayExists) {
                            loop2: for (var j = 0; j < parseFile[i].hours.length; j++) {

                                if (hour === parseFile[i].hours[j].hour) {
                                    hourExists = true;
                                    // El minuto NO esta contenido en el array de minutos.
                                    if (parseFile[i].hours[j].minutes.indexOf(minute) != -1) {
                                        minuteExists = true;
                                        message = 'Cita no disponible'
                                        res.send(
                                            message
                                        );
                                    } else {
                                        posInhoursArray = j;
                                    }
                                    break loop2;
                                }
                            }
                        }
                        break loop1;
                    }
                }

            if (!dayExists) {
                write = true;
                parseFile.push({
                    "year": year,
                    "month": month,
                    "day": day,
                    "hours": [{
                        "hour": hour,
                        "minutes": [minute]
                    }]
                });
                message = 'Día y hora añadido'

            } else {
                if (!hourExists) {
                    write = true;
                    parseFile[posInfilesArray].hours.push({
                        "hour": hour,
                        "minutes": [minute]
                    });
                    message = 'Hora añadida';
                } else {
                    if (!minuteExists) {
                        write = true;
                        parseFile[posInfilesArray].hours[posInhoursArray].minutes.push(minute);
                        message = 'Minuto añadido';
                    }
                }
            }

            if (write) {

                fs.writeFile(fileName, JSON.stringify(parseFile, null, 2), function(err) {
                    if (err) return console.log(err);
                    res.send(
                        message
                    );
                });
            }
        });

    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /hour                         //
    //                                                     //
    // ----------------------------------------------------//

    apiRouter.route('/hour')
        .get(function(req, res) {

            var parseFile = JSON.parse(fs.readFileSync(fileName).toString());
            var year = parseInt(req.headers.year);
            var day = parseInt(req.headers.day);
            var month = parseInt(req.headers.month);
            var exists = false;
            var dayPos;

            for (var i = 0; i < parseFile.length; i++) {

                if (year === parseFile[i].year && month === parseFile[i].month &&
                    day === parseFile[i].day) {
                    dayPos = i;
                    exists = true;
                    break;
                }
            }

            if (exists) {
                res.json(parseFile[i].hours);
            } else {
                res.json([]);
            }
        })
        .delete(function(req, res) {

            var parseFile = file;
            var year = parseInt(req.headers.year);
            var day = parseInt(req.headers.day);
            var month = parseInt(req.headers.month);
            var hour = parseInt(req.headers.hour);
            var minute = parseInt(req.headers.minute);
            var message;
            var minuteZero = false;
            var hourZero = false;
            var minutepos = -1;
            var dayPos = -1;
            var hourpos = -1;


            loop1:
                for (var i = 0; i < parseFile.length; i++) {

                    if (year === parseFile[i].year && month === parseFile[i].month &&
                        day === parseFile[i].day) {
                        // El día existe por lo que se itera sobre el array de horas.
                        loop2: for (var j = 0; j < parseFile[i].hours.length; j++) {
                            if (hour === parseFile[i].hours[j].hour) {
                                if (parseFile[i].hours[j].minutes.indexOf(minute) != -1) {
                                    dayPos = i;
                                    hourpos = j;
                                    minutepos = parseFile[i].hours[j].minutes.indexOf(minute);
                                    // ver si el array de minutos queda vacio
                                    if (parseFile[i].hours[j].minutes.length == 1) {
                                        minuteZero = true;
                                        // ver si el array de horas queda vacio
                                        if (parseFile[i].hours.length == 1) {
                                            hourZero = true;
                                        }
                                    }
                                }
                            }
                        }

                            break loop1;
                    }
                }

            if (hourZero) {
                parseFile.splice(parseFile[dayPos], 1);
            } else if (minuteZero) {
                parseFile[dayPos].hours[hourpos].minutes.splice(minutepos, 1);
            } else {
                parseFile[dayPos].hours.splice(parseFile[dayPos].hours[hourpos], 1);
            }

            fs.writeFile(fileName, JSON.stringify(parseFile, null, 2), function(err) {
                if (err) return console.log(err);
                res.send(
                    message
                );
            });
        });

    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /route                        //
    //                                                     //
    // ----------------------------------------------------//
    apiRouter.route('/route')
        .get(function(req, res) {

            var latitude = req.headers.latitude;
            var longitude = req.headers.longitude;
            var lat = req.headers.lat;
            var lng = req.headers.lng;

            // call api from class object
            var cb = function(err, result) {
                if (err) {
                    console.log(err);
                }
                var jsonObject = JSON.parse(result);
                var duration = jsonObject.routes[0].legs[0].duration.text;
                res.send(duration);
            };

            gmaputil.directions({ lat: latitude, lng: longitude }, { lat: lat, lng: lng }, null, cb);

        });


    // ----------------------------------------------------//
    //                                                     //
    // on routes that end in /center                       //
    //                                                     //
    // ----------------------------------------------------//

    apiRouter.route('/center')
        .get(function(req, res) {
            res.json(healthCenter);
        });

    return apiRouter;
};
