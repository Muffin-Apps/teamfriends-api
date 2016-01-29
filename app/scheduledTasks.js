var schedule = require('node-schedule');
var Sequelize = require('sequelize');
var Match = require('./match');
var moment = require('moment-timezone');
var Matching = require('./matching.js');
var AssistanceModel = require('./db').AssistanceModel;
var UserModel = require('./db').UserModel;
var MatchingTeamModel = require('./db').MatchingTeamModel;
var GuestModel = require('./db').GuestModel;
var selectCaptain;

/*
assisting
*/

exports.initializeTask = function(req, res, next){
  console.log("esperando a iniciar tarea....", req.body.minute+' '+req.body.hour+' * * *')
  var server = req.server;
  schedule.scheduleJob(req.body.minute+' '+req.body.hour+' * * *', function(){
    // Before close last connection
    Matching.closeConnection();
    // and create new match and the new task schedule
    console.log("Tarea ejecutada", moment().format())
    Match.create(moment()).then(function(match){
      GuestModel.create({
          userId : 1,
          firstName : "Ismael",
          lastName: "Cervantes",
          position: "df",
          matchId : match.id
      }).then(function(createdGuest){
        AssistanceModel.sync({force : true}).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 3
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 1
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 2
          });
        })
        .then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 5
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 6
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 7
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 8
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 9
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 10
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 11
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 12
          });
        }).then(function(){
          match.date = moment(match.date);
          schedule.scheduleJob(new Date(moment(match.date).add(1, "minutes").format()), function(param){
            selectCaptain(param.server, param.matchId);
          }.bind(null,{server:server, matchId: match.id}));
        })
      });
    });
  });
}
exports.initialize = function(server){
  console.log("esperando a iniciar tarea....")
  schedule.scheduleJob('31 20 * * *', function(){
    // Before close last connection
    Matching.closeConnection();
    // and create new match and the new task schedule
    console.log("Tarea ejecutada", moment().format())
    Match.create(moment()).then(function(match){
      GuestModel.create({
          userId : 1,
          firstName : "Ismael",
          lastName: "Cervantes",
          position: "df",
          matchId : match.id
      }).then(function(createdGuest){
        AssistanceModel.sync({force : true}).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 3
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 1
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 2
          });
        })
        .then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 5
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 6
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 7
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 8
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 9
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 10
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 11
          });
        }).then(function () {
          // Table created
          return AssistanceModel.create({
            status: "assisting",
            matchId: match.id,
            userId : 12
          });
        }).then(function(){
          match.date = moment(match.date);
          schedule.scheduleJob(new Date(moment(match.date).add(1, "minutes").format()), function(param){
            selectCaptain(param.server, param.matchId);
          }.bind(null,{server:server, matchId: match.id}));
        })
      });
    });
  });

  // // by test
  // setTimeout(function(){
  //   // Before close last connection
  //   Matching.closeConnection();
  //   // and create new match and the new task schedule
  //   Match.create(moment()).then(function(match){
  //     setTimeout(function(){
  //       AssistanceModel.sync({force : true}).then(function(){
  //         for (var i = 1; i <= 16; i++) {
  //           AssistanceModel.create(
  //             {userId : i, matchId : match.id, status : "assisting"}
  //           );
  //         }
  //       })
  //     }, 2000);
  //     // schedule.scheduleJob(new Date(moment().add({days:6, hours:8}).format()), function(param){
  //     console.log("Hora de elegir", match.date, new Date(moment(match.date).subtract(4, "hours").format()))
  //     schedule.scheduleJob(new Date(moment().format()), function(param){
  //       selectCaptain(param.server, param.matchId);
  //     }.bind(null,{server:server, matchId: match.id}));
  //   });
  // }, 5000);
}

var checkAssistance = function(listAssistants, user){
  for (var j = 0; j < listAssistants.length; j++) {
    if(user.id==listAssistants[j].userId)
      return true;
  }
  return false;
}

selectCaptain = function(server, matchId){
  Promise.all([
      UserModel.findAll({order: '`nCaptain` ASC'}),
      AssistanceModel.findAll({
          where : {
              matchId : matchId,
              status : "assisting"
          }
      })
  ]).then(function(result){
    if(result[1].length>=5){
      var users = result[0] || [],
          assistance = result[1] || [];
      var minCaptain = 0;
      var result = [{}, {}];

      for (var i = 0; i < users.length; i++) {
        if(users[i].position!=="ref" && checkAssistance(assistance, users[i])){
          minCaptain = i;
          break;
        }
      }
      result[0] = users[minCaptain];

      for(var i=minCaptain+1; i<users.length; i++){
        if(users[i].position===users[minCaptain].position && checkAssistance(assistance, users[i])){
          result[1] = users[i];
          break;
        }
      }
      //if there are no players in that position then we choose the player with the lowest number of any position
      if(Object.keys(result[1]).length==0){
        for(var i=minCaptain+1; i<users.length; i++){
          if(checkAssistance(assistance, users[i])){
            result[1] = users[i];
            break;
          }
        }
      }
      UserModel.update({
        nCaptain: result[0].nCaptain+1,
      }, {
        where: {
          id: result[0].id
        }
      })
      UserModel.update({
        nCaptain: result[1].nCaptain+1,
      }, {
        where: {
          id: result[1].id
        }
      })
      MatchingTeamModel.create({
        team : "black",
        matchId: matchId,
        players: ''+result[0].id,
        captain: result[0].id
      }).then(function(){
        MatchingTeamModel.create({
          team : "green",
          matchId: matchId,
          players: ''+result[1].id,
          captain: result[1].id
        }).then(function(){
          Matching.initMatching(server, matchId, result[0].id, result[1].id, result[0].id);
        })
      })
    }
  }, function(err){
    console.log(err)
  });
}
