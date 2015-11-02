var matchingModel = require('./db').MatchingTeamModel;
var storage = require('node-persist');
var socketio = require('socket.io')();
var keyStore = 'initIdMatching';
var keyTimeout = 'timeout';
var playerSelected;

storage.init({dir:'../../../persist'});

exports.initMatching = function(server, idMatch, idUserA, idUserB, initIdMatching){
  var io = socketio.listen(server.server);
  var socketNamespace = io.of('io/matching');
  storage.setItem(keyStore,initIdMatching);

  socketNamespace.on('connection', function(socket){
    socketNamespace.emit('info-matching', { idUser: storage.getItem(keyStore), idMatch: idMatch, idPlayer: playerSelected});

    socket.on('player-chosen', function(data){
      console.log("Nuevo mensaje", data);
      var idItem = storage.getItem(keyStore);
      var newData = data;
      if(idItem==data.idUser){
        var timeoutToChoose = storage.getItem(keyTimeout);
        if(timeoutToChoose){
          clearTimeout(timeoutToChoose);
        }
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
          console.log("Equipo seleccionado: "+selectedTeam);
          console.log("Otro capitan : "+otherCaptain);
          matchingModel.update({
            players: selectedTeam.toString(),
          }, {
            where: {
              matchId: data.idMatch,
              captain: data.idUser
            }
          });
          storage.setItem(keyStore, otherCaptain);
          playerSelected = data.player;
          socketNamespace.emit('info-matching', {idMatch: idMatch, idUser: otherCaptain, idPlayer: data.player});
          // timeoutToChoose = setTimeout(function () {
          //   socketNamespace.emit('priority-info', {idMatch: idMatch, idUser: otherCaptain});
          // }, 30000);
          storage.setItem(keyTimeout,timeoutToChoose);
        });

      }
    });
  });
}
