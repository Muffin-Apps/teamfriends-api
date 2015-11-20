var schedule = require('node-schedule');
var Sequelize = require('sequelize');
var Match = require('./match');
var moment = require('moment-timezone');
var Matching = require('./matching.js');
var AssistanceModel = require('./db').AssistanceModel;
var UserModel = require('./db').UserModel;
var MatchingTeamModel = require('./db').MatchingTeamModel;
var selectCaptain;

exports.initialize = function(server){
  schedule.scheduleJob('* 12 * * 7', function(){
    // Before close last connection
    Matching.closeConnection();
    // and create new match and the new task schedule
    Match.create(moment()).then(function(match){
      schedule.scheduleJob(new Date(moment().add({days:6, hours:8}).format()), function(param){
        selectCaptain(param.server, param.matchId);
      }.bind(null,{server:server, matchId: match.id}));
    });
  });
}

selectCaptain = function(server, matchId){
  Promise.all([
      UserModel.findAll({order: '`nCaptain` ASC'}),
      AssistanceModel.findAll({
          where : {
              matchId : matchId,
              status : 1
          }
      })
  ]).then(function(result){
      var users = result[0] || [],
          assistance = result[1] || [];
      var minCaptain = 0;
      var result = [{}, {}];
      result[0] = users[0];
      for(var i=1; i<users.length; i++){
        if(users[i].position===users[0].position){
          result[1] = users[i];
          break;
        }
      }
      //if there are no players in that position then we choose the player with the lowest number of any position
      if(Object.keys(result[1]).length==0){
        result[1] = users[1];
      }
      MatchingTeamModel.create({
        team : "black",
        matchId: matchId,
        captain: result[0].id
      }).then(function(){
        MatchingTeamModel.create({
          team : "green",
          matchId: matchId,
          captain: result[1].id
        }).then(function(){
          Matching.initMatching(server, matchId, result[0], result[1], result[0]);
        })
      })
  }, function(err){
    console.log(err)
  });
}
