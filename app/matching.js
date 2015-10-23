var io = socketio.listen(server.server);
var socketNamespace = io.of('io/matching');
var matchingModel = require('./db').MatchingTeamModel;

exports.initMatching = function(idUserA, idUserB){
  socketNamespace.on('connection', function(socket){
    socketNamespace.emit('priority-info', { hello: 'world' });

    socket.on('player-chosen', function(msg){

      socketNamespace.emit('echo', msg);
    });
  });
}
