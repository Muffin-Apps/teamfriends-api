var Sequelize = require('sequelize');
var sqlite3 = require("sqlite3").verbose();

exports.initialize = function (server) {
  // var address = server.address().address+(server.address().port ? ":"+server.address().port: "");
  var address = server; // TODO temporarily
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
          defaultValue: "3e093daad02b2a65183da5760a511a5dd6ce589f",
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
          values : ['gk', "df", "md", "at", "ref"]
      },
      nCaptain : {
          type: Sequelize.INTEGER,
          defaultValue: "0",
          allowNull : false,
          validate : {
              notEmpty: true
          }
      },
      photo : {
          type: Sequelize.STRING,
          defaultValue: address+"/public/photo.png",
          allowNull : false,
          validate : {
              notEmpty: true
          }
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

  var Guest = sequelize.define('guest', {
      name : {
          type : Sequelize.STRING,
          allowNull : false,
          validate : {
              notEmpty : true
          }
      }
  },{
    freezeTableName: true // Model tableName will be the same as the model name
  });

  Guest.belongsTo(Match);
  Guest.belongsTo(User);

  Guest.sync({force : true});

  var oldFindById = Guest.findById,
      oldFindAll = Guest.findAll,
      oldCreate = Guest.create;

  Guest.findById = function(id){
      return oldFindById.apply(Guest, [parseInt(id.replace('gu_', ''))])
  }

  Guest.findAll = function(options){
      return oldFindAll.apply(Guest, [options]).then(function(result){
          if(result){
              result.forEach(function(guest){
                  guest.dataValues.id = 'gu_' + guest.dataValues.id
              })
          }

          return result;
      })
  }

  Guest.create = function(newGuest){
      return oldCreate.apply(Guest, [newGuest]).then(function(createdGuest){
          if(createdGuest){
              createdGuest.dataValues.id = 'gu_' + createdGuest.dataValues.id;
          }

          return createdGuest;
      })
  }

  // Insert data

  User.sync({force: true}).then(function () {
    // Table created
    return User.create({
      firstName: 'Jahiel',
      lastName: 'Jeronimo',
      nickName : "Jero",
      email : "jerojjr@gmail.com",
      phone : "",
      address : "",
      role : "standard",
      position : "md"
    });
  }).then(function(){
      return User.create({
        firstName: 'Alvaro',
        lastName: 'Fernandez',
        nickName : "Payano",
        email : "payano@solyalas.com",
        phone : "",
        address : "",
        role : "standard",
        position : "md"
      });
  }).then(function(){
      return User.create({
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
        firstName: 'Ruben',
        lastName: 'Gallegos',
        nickName : "",
        email : "ruben_450_@hotmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "gk"
      });
  }).then(function(){
      return User.create({
        firstName: 'Antonio',
        lastName: 'Lozano',
        nickName : "",
        email : "antonio@solyalas.com",
        phone : "",
        address : "",
        role : "standard",
        position : "gk"
      });
  }).then(function(){
      return User.create({
        firstName: 'Francisco',
        lastName: 'Ruiz',
        nickName : "Paco",
        email : "paco_ruiz_7@hotmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "at"
      });
  }).then(function(){
      return User.create({
        firstName: 'Rafa',
        lastName: 'Porcel',
        nickName : "Karim",
        email : "rporcel@lanjatrans.com",
        phone : "",
        address : "",
        role : "standard",
        position : "at"
      });
  }).then(function(){
      return User.create({
        firstName: 'Francisco',
        lastName: 'Ruiz',
        nickName : "Paquillo",
        email : "paquillo.94@hotmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "at"
      });
  }).then(function(){
      return User.create({
        firstName: 'Antonio',
        lastName: 'Ledesma',
        nickName : "Bolas",
        email : "ledesma.rubio@hotmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "ref"
      });
  }).then(function(){
      return User.create({
        firstName: 'Raul',
        lastName: 'Muñoz',
        nickName : "",
        email : "raulete937@hotmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "md"
      });
  }).then(function(){
      return User.create({
        firstName: 'David',
        lastName: 'Calvo',
        nickName : "",
        email : "adcalvo92@gmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "md"
      });
  }).then(function(){
      return User.create({
        firstName: 'Pablo',
        lastName: 'Muñoz',
        nickName : "",
        email : "pablo.71098@gmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "df"
      });
  }).then(function(){
      return User.create({
        firstName: 'Ignacio Javier',
        lastName: 'Alcalá',
        nickName : "",
        email : "naivelna@hotmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "df"
      });
  }).then(function(){
      return User.create({
        firstName: 'Manuel',
        lastName: 'Esteban',
        nickName : "Cuco",
        email : "5828@icagr.es",
        phone : "",
        address : "",
        role : "standard",
        position : "md"
      });
  }).then(function(){
      return User.create({
        firstName: 'Alfredo',
        lastName: 'Molina',
        nickName : "",
        email : "alfredmol@hotmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "at"
      });
  }).then(function(){
      return User.create({
        firstName: 'Jose Ignacio',
        lastName: 'Rabaza',
        nickName : "",
        email : "ignacio.rab@gmail.com",
        phone : "",
        address : "",
        role : "standard",
        position : "md"
      });
  });

  // Match.sync({force: true}).then(function () {
  //   // Table created
  //   return Match.create({
  //     date : new Date(2015, 11, 19)
  //   });
  // });

  Assistance.sync({force : true});

  exports.UserModel = User;
  exports.MatchModel = Match;
  exports.AssistanceModel = Assistance;
  exports.MatchingTeamModel = MatchingTeam;
  exports.GuestModel = Guest;
}
