var db = require('./db').MatchModel;

exports.injectMatchId = function(req, res, next){
    var context = req.context;

    if(context && context.matchId === "next"){
        db.findOne({
            order : [['date', 'DESC']]
        }).then(function(match){
            context.matchId = match.id;
            next();
        });
    }else{
        next();
    }
};
