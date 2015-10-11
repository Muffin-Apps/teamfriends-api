var db = require('./db').UserModel;

exports.getAll = function(req, res, next){
    db.findAll().then(function (users) {
        res.json(users);
    });
};

exports.create = function(req, res, next){
    db.create({
        firstName: 'Jahiel',
        lastName: 'Jeronimo',
        nickName : "Jero navajero",
        email : "",
        phone : "",
        address : "",
        role : "standard",
        position : "md"
    }).then(function(user){
        res.json(user);
    });
}
