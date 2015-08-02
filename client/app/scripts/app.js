Backbone.$ = $;
import '../../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss';
import '../styles/variables.scss';
import '../styles/main.scss';
import '../styles/widgets.scss';
import '../styles/header.scss';
import '../styles/profile.scss';
import '../styles/request.scss';
import '../styles/comment.scss';
import '../styles/proposal.scss';
import '../styles/submission.scss';
import '../styles/tag.scss';
import '../styles/offer.scss';
import '../styles/markdown.scss';
import '../styles/buttons.scss';
import '../styles/modal.scss';
import '../styles/alert.scss';
import '../styles/lists.scss';
import '../styles/pagination.scss';

let Router = require('./router');
let Api = require('./api');
let Utils = require('./utils');

$(() => { // document ready
  App.API = Api;
  App.Router = new Router();
  Backbone.history.start({
    pushState: true,
    root: '/'
  });

  Utils.initializeGlobalHandlers();
});
