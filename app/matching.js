var schedule = require('node-schedule');
var matchingModel = require('./db').MatchingTeamModel;
var userModel = require('./db').UserModel;
var socketio = require('socket.io')();
var keyStore = 'initIdMatching';
var keyTimeout = 'timeout';
var playerSelected,
    initId;
var io;
var socketNamespace;

exports.initMatching = function(server, idMatch, idUserA, idUserB, initIdMatching){
  io = socketio.listen(server.server);
  socketNamespace = io.of('io/matching');

  // io.set( 'origins', '*:*' );

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

exports.closeConnection = function(){
  if(io){
    io.server.close();
    socketNamespace = undefined;
  }
}

exports.checkConnection = function(req, res, next){
  var response = {status: (socketNamespace!=undefined && socketNamespace!=null)}
  res.json(response);
}


exports.getTeams = function (req, res, next) {
  userModel.findAll({
    include: [{
        model: UserModel,
        where: { id: Sequelize.col('matchingTeam.id'), matchId: req.context.matchId }
    }]
  }).then(function(users){
    res.json(users);
  });
}
