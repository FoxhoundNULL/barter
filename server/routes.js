var passport = require('passport');

// views
var rootView = require('./views/rootView');
var userIndexView = require('./views/user/indexView');
var userShowView = require('./views/user/showView');
var userSkillIndexView = require('./views/user/skillIndexView');

var requestIndexView = require('./views/request/indexView');
var requestShowView = require('./views/request/showView');
var requestCreateView = require('./views/request/createView');

var commentCreateView = require('./views/comment/createView');

var proposalMineView = require('./views/proposal/mineView');
var proposalCreateView = require('./views/proposal/createView');
var proposalUpdateView = require('./views/proposal/updateView');
var proposalSetStateView = require('./views/proposal/setStateView');

var submissionShowView = require('./views/submission/showView');
var submissionCreateView = require('./views/submission/createView');
var submissionSetStateView = require('./views/submission/setStateView');

// handlers
var loginHandler = require('./handlers/loginHandler');
var logoutHandler = require('./handlers/logoutHandler');
var registerHandler = require('./handlers/registerHandler');
var avatarUploadHandler = require('./handlers/avatarUploadHandler');

// middleware
var requireAuth = require('./middleware/requireAuth');
var requireAdminPermission = require('./middleware/requireAdminPermission');
var requireApiPermission = require('./middleware/requireApiPermission');
var requireIdMatch = require('./middleware/requireIdMatch');


module.exports = function (app) {

  app.all('/api/*', requireAuth/*, requireApiPermission*/);
  app.all(/^[/]app(?=$|[/])/, requireAuth, rootView);


  app.post('/login', passport.authenticate('local'), loginHandler);
  app.post('/register', registerHandler);
  app.post('/logout', logoutHandler);
  app.post('/avatar', requireAuth, avatarUploadHandler);

  // API
  // User
  app.get('/api/users', requireAdminPermission, userIndexView);
  app.get('/api/users/:id', requireIdMatch, userShowView);
  app.get('/api/users/:id/skills', requireIdMatch, userSkillIndexView);

  // Request
  app.get('/api/requests', requestIndexView);
  app.get('/api/requests/:id', requestShowView);
  app.post('/api/requests', requestCreateView);

  // Comment
  app.post('/api/comments', commentCreateView);

  // Proposal
  app.post('/api/proposals', proposalCreateView);
  app.get('/api/proposals/mine', proposalMineView);
  app.put('/api/proposals/:id', requireAdminPermission, proposalUpdateView);
  app.post('/api/proposals/:id/state', proposalSetStateView);

  // Submission
  app.get('/api/submissions/:id', submissionShowView);
  app.post('/api/submissions', submissionCreateView);
  app.post('/api/submissions/:id/state', submissionSetStateView);

  // catch everything except the explicitly defined routes above
  // this must be the last route in the file
  // serve rootView for all routes so the single page app can do its thang
  app.get('*', rootView);

};
