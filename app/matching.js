var matchingModel = require('./db').MatchingTeamModel;
var socketio = require('socket.io')();
var keyStore = 'initIdMatching';
var keyTimeout = 'timeout';
var playerSelected,
    initId;
var io;
var socketNamespace;

exports.initialize = function(){

}

exports.initMatching = function(server, idMatch, idUserA, idUserB, initIdMatching){
  io = socketio.listen(server.server);
  socketNamespace = io.of('io/matching');

  playerSelected = null;
  initId = initIdMatching;

  socketNamespace.on('connection', function(socket){
    socketNamespace.emit('info-matching', { idUser: initId, idMatch: idMatch, idPlayer: playerSelected});

    socket.on('player-chosen', function(data){
      if(initId==data.idUser){
        teams = matchingModel.findAll({
          where: {
            matchId: data.idMatch
          }
        }).then(function (teams) {
          var selectedTeam;
          var otherCaptain;
          for (var i = 0; i < teams.length; i++) {
            if(teams[i].dataValues.captain==data.idUser){
              if(teams[i].dataValues.players)
                selectedTeam = teams[i].dataValues.players.split(",");
              else
                selectedTeam = [];
              selectedTeam.push(data.player);
            }else{
              otherCaptain = teams[i].dataValues.captain;
            }
          }
          matchingModel.update({
            players: selectedTeam.toString(),
          }, {
            where: {
              matchId: data.idMatch,
              captain: data.idUser
            }
          });
          initId = otherCaptain;
          playerSelected = data.player;
          if(data.finalize){
            socketNamespace.emit('info-matching', {exit: true});
          }else
            socketNamespace.emit('info-matching', {idMatch: idMatch, idUser: otherCaptain, idPlayer: data.player});
        });
      }
    });
  });
}
