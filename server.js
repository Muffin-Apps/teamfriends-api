var restify = require('restify'),
    fs = require('fs'),
    User = require('./app/user'),
    Match = require('./app/match'),
    Assistance = require('./app/assistance'),
    socketio = require('socket.io')(),
    jwt = require('jwt-simple'),
    config = require('./config'),
    matching = require('./app/matching.js');


var server = restify.createServer();

exports.createToken = function(user) {
  var payload = {
    sub: user.id
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

exports.getIdToken = function(token){
  return jwt.decode(token, config.TOKEN_SECRET).sub;
}

server
    .use(restify.fullResponse())
    .use(restify.bodyParser());

// Article Start
server.get("api/users", User.getAll);
server.post("api/users", User.create);

// Assistance
server.get("api/matches/:matchId/assistance", Match.injectMatchId, Assistance.getAssistance);
server.put("api/matches/:matchId/assistance/:userId", Match.injectMatchId, Assistance.updateAssistance);

var port = process.env.PORT || 3000;
server.listen(process.env.OPENSHIFT_NODEJS_PORT || port, process.env.OPENSHIFT_NODEJS_IP, function (err) {
    if (err){
        console.error(err);
    }else{
        console.log('App is ready at : ' + port);
    }
});

matching.initMatching(server, 1, 1, 2, 1);

if (process.env.environment == 'production'){
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
    });
}
