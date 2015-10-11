var Sequelize = require('sequelize');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('db/database.sqlite');

var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'db/database.sqlite'
});
var User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    nickName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    role : {
        type : Sequelize.ENUM,
        values : ['standard', "manager"]
    },
    position : {
        type : Sequelize.ENUM,
        values : ['gk', "df", "md", "at"]
    }

}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'Jahiel',
    lastName: 'Jeronimo',
    nickName : "Jero navajero",
    email : "",
    phone : "",
    address : "",
    role : "standard",
    position : "md"
  });
}).then(function(){
    return User.create({
      firstName: 'Alvaro',
      lastName: 'Fernandez',
      nickName : "drums, guitar... PAYANO",
      email : "",
      phone : "",
      address : "",
      role : "standard",
      position : "md"
    });
});



exports.UserModel = User;
