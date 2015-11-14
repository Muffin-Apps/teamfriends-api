var schedule = require('node-schedule');
var Match = require('./app/match');
var moment = require('moment');
var Matching = require('./app/matching.js');

exports.initialize = function(){
  schedule.scheduleJob('* 12 * * 7', function(){
    Match.create(moment()).then(function(match){
      // Matching.initMatching(server, match.id, 1, 2, 1);
    });
  });
}
