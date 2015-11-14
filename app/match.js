var db = require('./db').MatchModel,
    notFoundError = require('restify').NotFoundError,
    moment = require('moment');

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

exports.getMatch = function(req, res, next){
  var match = req.context.match;
  match.dataValues.date = moment(match.dataValues.date).valueOf();
  res.json(match)
}

exports.create = function(date){
  return db.create({date: date});
}
