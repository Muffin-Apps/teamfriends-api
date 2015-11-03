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

var Match = sequelize.define('match', {
  date:{
    type : Sequelize.DATE,
    allowNull : false,
    validate : {
        notEmpty: true
    }
  }
},{
  freezeTableName: true // Model tableName will be the same as the model name
});

var MatchingTeam = sequelize.define('matchingTeam', {
  team:{
    type : Sequelize.ENUM,
    values : ['black', "green"],
    allowNull : false,
    validate : {
        notEmpty: true
    }
  },
  players:{
    type: Sequelize.STRING
  },
  captain:{
    type: Sequelize.INTEGER,
    allowNull : false,
    validate : {
        notEmpty: true
    }
  }
},{
  freezeTableName: true // Model tableName will be the same as the model name
});
//Foreign key to Match
MatchingTeam.belongsTo(Match);

var Assistance = sequelize.define('assistance', {
    status : {
        type : Sequelize.ENUM,
        values : ["assisting", "unknown", "notAssisting"],
        allowNull : false,
        validate : {
            notEmpty: true
        }
    }
},{
  freezeTableName: true // Model tableName will be the same as the model name
});

User.belongsToMany(Match, {through: Assistance, as : "Assistance"});
Match.belongsToMany(User, {through: Assistance});

// Insert data

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    password : "123",
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
      password : "123",
      firstName: 'Alvaro',
      lastName: 'Fernandez',
      nickName : "drums, guitar... PAYANO",
      email : "payano@solyalas.com",
      phone : "",
      address : "",
      role : "standard",
      position : "md"
    });
}).then(function(){
    return User.create({
      password : "123",
      firstName: 'Alberto',
      lastName: 'Casares',
      nickName : "Il Pota",
      email : "pota@solyalas.com",
      phone : "",
      address : "",
      role : "standard",
      position : "df"
    });
}).then(function(){
    return User.create({
      password : "123",
      firstName: 'Ruben',
      lastName: 'Ruiz',
      nickName : "ruben",
      email : "ruben@solyalas.com",
      phone : "",
      address : "",
      role : "standard",
      position : "gk"
    });
}).then(function(){
    return User.create({
      password : "123",
      firstName: 'Antonio',
      lastName: 'Lozano',
      nickName : "mercadona",
      email : "antonio@solyalas.com",
      phone : "",
      address : "",
      role : "standard",
      position : "gk"
    });
}).then(function(){
    return User.create({
      password : "123",
      firstName: 'Paco',
      lastName: 'Ruiz',
      nickName : "paco",
      email : "paco@solyalas.com",
      phone : "",
      address : "",
      role : "standard",
      position : "at"
    });
}).then(function(){
    return User.create({
      password : "123",
      firstName: 'Rafa',
      lastName: 'Porcel',
      nickName : "Karim",
      email : "rafa@solyalas.com",
      phone : "",
      address : "",
      role : "standard",
      position : "at"
    });
});

Match.sync({force: true}).then(function () {
  // Table created
  return Match.create({
    date : new Date(2015, 10, 1)
  });
})

MatchingTeam.sync({force: true}).then(function () {
  // Table created
  return MatchingTeam.create({
    team : "black",
    matchId: 1,
    captain: 1,
  });
}).then(function(){
  return MatchingTeam.create({
    team : "green",
    matchId: 1,
    captain: 2
  });
});

Assistance.sync({force : true});

exports.UserModel = User;
exports.MatchModel = Match;
exports.AssistanceModel = Assistance;
exports.MatchingTeamModel = MatchingTeam;
