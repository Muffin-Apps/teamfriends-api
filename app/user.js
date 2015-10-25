var db = require('./db').UserModel,
    badRequestError = require('restify').BadRequestError,
    invalidContentError = require('restify').InvalidContentError,
    notFoundError = require('restify').NotFoundError;

exports.getAll = function(req, res, next){
    db.findAll().then(function (users) {
        users.forEach(function(user){
            delete user.password;
        });
        res.json(users);
    }, function(error){
        return next(new badRequestError(error.message));
    });
};

exports.create = function(req, res, next){
    db.create(req.body).then(function(user){
        res.json(user);
    }, function(error){
        return next(new invalidContentError(error.message));
    });
};

exports.injectUser = function(req, res, next){
    var context = req.context;

    if(context && context.userId){
        db.findById(context.userId).then(function(user){
            if(user){
                context.user = user;
                next();
            }else{
                return next(new notFoundError("User with id " + context.userId + " not found"));
            }
        });
    }else{
        next();
    }
};
