var passport = require('passport');

// views
var rootView = require('./views/rootView');
var userIndexView = require('./views/user/indexView');
var userShowView = require('./views/user/showView');
var userSkillIndexView = require('./views/user/skillIndexView');
var userSkillAddView = require('./views/user/skillAddView');
var userSkillDeleteView = require('./views/user/skillDeleteView');


// handlers
var loginHandler = require('./handlers/loginHandler');
var logoutHandler = require('./handlers/logoutHandler');

// middleware
var requireAuth = require('./middleware/requireAuth');
var requireAdminPermission = require('./middleware/requireAdminPermission');
var requireApiPermission = require('./middleware/requireApiPermission');
var requireIdMatch = require('./middleware/requireIdMatch');


module.exports = function (app) {

  app.all('/api/*', requireAuth/*, requireApiPermission*/);
  app.all(/^[/]app(?=$|[/])/, requireAuth, rootView);


  app.post('/login', passport.authenticate('local'), loginHandler);
  app.post('/logout', logoutHandler);

  // API
  // Users
  app.get('/api/users', requireAdminPermission, userIndexView);
  app.get('/api/users/:id', requireIdMatch, userShowView);
  app.get('/api/users/:id/skills', requireIdMatch, userSkillIndexView);
  app.post('/api/users/:id/skills', requireIdMatch, userSkillAddView);
  app.delete('/api/users/:id/skills', requireIdMatch, userSkillDeleteView);

  // catch everything except the explicitly defined routes above
  // this must be the last route in the file
  // serve rootView for all routes so the single page app can do its thang
  app.get('*', rootView);

};
