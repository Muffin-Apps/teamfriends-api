var db = require('./db').AssistanceModel,
    UserModel = require('./db').UserModel,
    badRequestError = require('restify').BadRequestError;

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

            response[status].push(user);
        });

        res.json(response);
    }, function(error){
        return next(new badRequestError(error.message));
    });
};
