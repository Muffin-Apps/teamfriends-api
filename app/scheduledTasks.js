var schedule = require('node-schedule');
var Match = require('./app/match');
var moment = require('moment');
var Matching = require('./app/matching.js');
var AssistanceModel = require('./db').AssistanceModel;
var UserModel = require('./db').UserModel;

exports.initialize = function(req, res, next){
  // schedule.scheduleJob('* 12 * * 7', function(){
    Match.create(moment()).then(function(match){
      // Matching.initMatching(server, match.id, 1, 2, 1);
      Promise.all([
          UserModel.findAll({order: [sequelize.fn('min', sequelize.col('nCaptain'))]}),
          AssistanceModel.findAll({
              where : {
                  matchId : req.context.matchId,
                  status : 1
              }
          })
      ]).then(function(result){
          var users = result[0] || [],
              assistance = result[1] || [];
          var minCaptain = 0;
          var result = [0, 0];
              users.forEach(function(user){
                  assistance.forEach(function(userAssistance){
                      if(userAssistance.userId === user.id){

                      }
                  });
              });
      });
    });
  // });
}
