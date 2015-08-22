require('dotenv').load(); // environment variables in .env
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer'); // for file uploads
var session = require('express-session');
var passport = require('passport'); // authentication


// app level requires
var models = require('./models');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public')); // public dir
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'bartersecret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({ dest: './server/uploads/' })); // temp foler for file uploads

app.set('view engine', 'ejs'); // use ejs templates
app.set('views', './server/templates/'); // set view template folder

require('./config/passport')(passport); // pass passport for configuration
require('./routes')(app); // initialize routes

// command line args
var resetData = process.argv[2] === 'reload-data';

//                             set to true to overwrite db
models.sequelize.sync({ force: resetData }).then(function () {

  if (resetData) {
    require('./scripts/addTestData.js')();
  }

  app.listen(app.get('port'), function () {
    console.log('barter server running in ' + process.env.NODE_ENV + ', listening on port ' + app.get('port'));
  });
});
