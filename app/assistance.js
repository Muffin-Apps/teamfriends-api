var db = require('./db').AssistanceModel,
    UserModel = require('./db').UserModel,
    GuestModel = require('./db').GuestModel,
    badRequestError = require('restify').BadRequestError,
    notFoundError = require('restify').NotFoundError,
    invalidContentError = require('restify').InvalidContentError,
    moment = require('moment-timezone');

exports.getAssistance = function(req, res, next){
    Promise.all([
        UserModel.findAll(),
        db.findAll({
            where : {
                matchId : req.context.matchId
            }
        }),
        GuestModel.findAll({
            where : {
                matchId : req.context.matchId
            }
        })
    ]).then(function(result){
        var users = result[0] || [],
            assistance = result[1] || [],
            guests = result[2] || [],
            response = {
                assisting : [],
                notAssisting : [],
                unknown : [],
                guests : []
            };

        users.forEach(function(user){
            var status;

            assistance.forEach(function(userAssistance){
                if(userAssistance.userId === user.id){
                    status = userAssistance.status;
                }
            });

            status = status || 'unknown';

            delete user.password;

            response[status].push(user);

            guests.forEach(function(guest){
                if(guest.userId === user.id){
                    response.guests.push({
                        user : user,
                        id : guest.id,
                        name : guest.name
                    });
                }
            });
        });

        res.json(response);
    }, function(error){
        return next(new badRequestError(error.message));
    });
};

exports.updateAssistance = function(req, res, next){
    if(!req.body || !req.body.status){
        return next(new invalidContentError("Invalid body"));
    }

    var listClosedTime = moment(req.context.match.date).subtract(4, "hours"),
        currentTime = moment();

    if(currentTime.isAfter(listClosedTime)){
        return next(new badRequestError("The assistance list for this match is closed"));
    }

    db.findOne({
        where : {
            userId : req.context.userId,
            matchId : req.context.matchId
        }
    }).then(function(assistance){
        var resFn = function(){
            res.json(req.body);
        };

        if(assistance){
            assistance.updateAttributes({
                status : req.body.status
            }).then(resFn);
        }else{
            db.create({
                userId : req.context.userId,
                matchId : req.context.matchId,
                status : req.body.status
            }).then(resFn);
        }
    });
};

exports.addGuest = function(req, res, next){
    if(!req.body || !req.body.userId || !req.body.name){
        return next(new invalidContentError("Invalid body"));
    }

    var listClosedTime = moment(req.context.match.date).subtract(4, "hours"),
        currentTime = moment();

    if(currentTime.isAfter(listClosedTime)){
        return next(new badRequestError("The assistance list for this match is closed"));
    }

    GuestModel.create({
        userId : req.body.userId,
        name : req.body.name,
        matchId : req.context.matchId
    }).then(function(createdGuest){
        res.json(createdGuest);
    }, function(error){
        return next(new badRequestError(error.message));
    });
};

exports.deleteGuest = function(req, res, next){
    var listClosedTime = moment(req.context.match.date).subtract(4, "hours"),
        currentTime = moment();

    if(currentTime.isAfter(listClosedTime)){
        return next(new badRequestError("The assistance list for this match is closed"));
    }

    GuestModel.findById(req.context.guestId).then(function(guest){
        if(guest){
            return guest.destroy();
        }else{
            return next(new notFoundError("Guest with id " + req.context.guestId + " not found"));
        }
    }).then(function(){
        res.send(204);
    }, function(error){
        return next(new badRequestError(error.message));
    });
};
