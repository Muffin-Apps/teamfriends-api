var db = require('./db').MatchModel,
    notFoundError = require('restify').NotFoundError;

exports.injectMatch = function(req, res, next){
    var context = req.context;

    if(context && context.matchId){
        if(context.matchId === "next"){
            db.findOne({
                order : [['date', 'DESC']]
            }).then(function(match){
                context.match = match;
                context.matchId = match.id;
                next();
            });
        }else{
            db.findById(context.matchId).then(function(match){
                if(match){
                    context.match = match;
                    next();
                }else{
                    return next(new notFoundError("Match with id " + context.matchId + " not found"));
                }
            });
        }
    }else{
        next();
    }
};
