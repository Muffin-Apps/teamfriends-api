var schedule = require('node-schedule');
var Sequelize = require('sequelize');
var matchingModel = require('./db').MatchingTeamModel;
var userModel = require('./db').UserModel;
var socketio = require('socket.io')();
var keyStore = 'initIdMatching';
var keyTimeout = 'timeout';
var playerSelected,
    initId;
var io;
var socketNamespace;

var closeConnection = function(){
  if(io){
    io.server.close();
    socketNamespace = null;
  }
}

exports.initMatching = function(server, idMatch, idUserA, idUserB, initIdMatching){
  io = socketio.listen(server.server);
  socketNamespace = io.of('io/matching');

  // io.set( 'origins', '*:*' );

  playerSelected = null;
  initId = initIdMatching;

  socketNamespace.on('connection', function(socket){
    console.log("Usuario conectado")
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
            closeConnection();
          }else
            socketNamespace.emit('info-matching', {idMatch: idMatch, idUser: otherCaptain, idPlayer: data.player});
        });
      }
    });
  });
}

exports.closeConnection = function(){
  closeConnection();
}

exports.checkConnection = function(req, res, next){
  var response = {status: (socketNamespace!=undefined && socketNamespace!=null)}
  res.json(response);
}

exports.getTeams = function(req, res, next){
  matchingModel.findAll({
    where:{
      matchId: req.context.matchId
    }
  }).then(function(teams){
    res.json(teams);
  }, function(){
    return next(new notFoundError("Still they have not been created teams for this match"));
  })

}

exports.getTeamsPlayers = function (req, res, next) {
  Promise.all([
      userModel.findAll(),
      matchingModel.findAll({
          where : {
              matchId : req.context.matchId
          }
      })
  ]).then(function(result){
    var team1 = [],
        team2 = [],
        users = result[0] || [],
        teams = result[1] || [];
        if(teams.length==2){
          teams[0].players = teams[0].players.split(",");
          teams[1].players = teams[1].players.split(",");
          teams[0].players.forEach(function(player){
            users.forEach(function(user){
              if(user.id === parseInt(player))
                return team1.push(user);
            })
          })
          teams[1].players.forEach(function(player){
            users.forEach(function(user){
              if(user.id === parseInt(player))
                return team2.push(user);
            })
          });
          teams[0].players = team1;
          teams[1].players = team2;

          res.json(teams);
        }else{
          return next(new internalServerError("There has been an error retrieving equipment"));
        }

  }, function(){
    return next(new notFoundError("Still they have not been created teams for this match"));
  })
}
