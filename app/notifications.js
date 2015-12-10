var Parse = require('node-parse-api').Parse;

var options = {
    app_id:'9oQpIQonajhCGy93Zscfzn9xT61vfAsvR0cIh6ZI',
    master_key: '6pukWYBp7mwoaDjtJgA3D69tlnW1LfUSMwFB2GKA',
    api_key:'1bI6u7QwvSQZN7lW3LZrRH6I3HkGHXBgdxGhhG9H'
}

var appNot = new Parse(options);

console.log("app notifications", appNot)
// appNot.insertInstallationData("android", "AIzaSyDN-1TDcw_9lObg6Qqqsohs8P9zGQbfdpA", function(err, response){
//   if (err) {
//     console.log("error install parse",err);
//   } else {
//     console.log("notifications",response);
//   }
// });

exports.send = function(req, res, next){
  var notification = {
    channels: [''],
    data: {
      alert: "sending too many push notifications is obnoxious"
    }
  };
  appNot.sendPush(notification, function(err, resp){
    console.log(err, resp);
    res.send();
  });
}
