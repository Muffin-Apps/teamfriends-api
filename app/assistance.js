var db = require('./db').AssistanceModel,
    UserModel = require('./db').UserModel,
    badRequestError = require('restify').BadRequestError,
    invalidContentError = require('restify').InvalidContentError,
    moment = require('moment-timezone');

exports.getAssistance = function(req, res, next){
    Promise.all([
        UserModel.findAll(),
        db.findAll({
            where : {
                matchId : req.context.matchId
            }
        })
    ]).then(function(result){
        var users = result[0] || [],
            assistance = result[1] || [],
            response = {
                assisting : [],
                notAssisting : [],
                unknown : []
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
