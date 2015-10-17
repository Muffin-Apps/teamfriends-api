var Sequelize = require('sequelize');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('./database.sqlite');

var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: './database.sqlite'
});
var User = sequelize.define('user', {
    password : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    nickName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull : false,
        validate : {
            notEmpty: true
        }
    },
    phone: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    role : {
        type : Sequelize.ENUM,
        values : ['standard', "manager"],
        allowNull : false,
        validate : {
            notEmpty: true
        }
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
      password : "d03m10190",
    firstName: 'Jahiel',
    lastName: 'Jeronimo',
    nickName : "Jero navajero",
    email : "jero@solyalas.com",
    phone : "",
    address : "",
    role : "standard",
    position : "md"
  });
}).then(function(){
    return User.create({
        password : "d03m10190",
      firstName: 'Alvaro',
      lastName: 'Fernandez',
      nickName : "drums, guitar... PAYANO",
      email : "payano@solyalas.com",
      phone : "",
      address : "",
      role : "standard",
      position : "md"
    });
});



exports.UserModel = User;
