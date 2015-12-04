var restify = require('restify');
var server = restify.createServer();
var fs = require('fs'),
    socketio = require('socket.io')(),
    jwt = require('jwt-simple'),
    moment = require('moment-timezone');
var db = require('./app/db');
    db.initialize("http://localhost:3000");  // TODO server.address must call after listening
var User = require('./app/user'),
    Match = require('./app/match'),
    Assistance = require('./app/assistance'),
    config = require('./config'),
    matching = require('./app/matching.js'),
    scheduledTasks = require('./app/scheduledTasks.js');

moment.tz.setDefault('Europe/Madrid');

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

//sockets

// User
server.post("api/users/login", User.login);
server.get("api/users", User.getAll);
// server.post("api/users", User.create);

// Assistance
server.get("api/matches/:matchId/assistance", Match.injectMatch, Assistance.getAssistance);
server.put("api/matches/:matchId/assistance/:userId", Match.injectMatch, User.injectUser, Assistance.updateAssistance);
server.post("api/matches/:matchId/guests", Match.injectMatch, Assistance.addGuest);
server.del("api/matches/:matchId/guests/:guestId", Match.injectMatch, Assistance.deleteGuest);

//Matching
server.get("api/matches/:matchId", Match.injectMatch, Match.getMatch);
server.get("api/matches/:matchId/teams", Match.injectMatch, matching.getTeams);
server.get("api/matches/:matchId/teams/players", Match.injectMatch, matching.getTeamsPlayers);
server.get("api/socket", matching.checkConnection);
scheduledTasks.initialize(server);

//assets
server.get(/.*/, restify.serveStatic({
  directory: __dirname, // TODO restrict only the public folder
  default: "photo.png"
}));

var port = process.env.PORT || 3000;
server.listen(process.env.OPENSHIFT_NODEJS_PORT || port, process.env.OPENSHIFT_NODEJS_IP, function (err) {
    if (err){
        console.error(err);
    }else{
        console.log('App is ready at : ' + port);
    }
});


if (process.env.environment == 'production'){
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
    });
}
