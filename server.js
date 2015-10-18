var restify = require('restify'),
    fs = require('fs'),
    User = require('./app/user'),
    socketio = require('socket.io')();


var server = restify.createServer(),
    io = socketio.listen(server.server);

server
    .use(restify.fullResponse())
    .use(restify.bodyParser());

// Article Start
server.get("api/users", User.getAll);
server.post("api/users", User.create);

var port = process.env.PORT || 3000;
server.listen(process.env.OPENSHIFT_NODEJS_PORT || port, process.env.OPENSHIFT_NODEJS_IP, function (err) {
    if (err){
        console.error(err);
    }else{
        console.log('App is ready at : ' + port);
    }
});

var socketNamespace = io.of('io/matching');

socketNamespace.on('connection', function(socket){
  socket.on('echo', function(msg){
    socketNamespace.emit('echo', msg);
  });
});

if (process.env.environment == 'production'){
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
    });
}
