var Request = require('../models/requestModel');
var Tags = require('../collections/tagsCollection');
var Tag = require('../models/tagModel');
var TagsView = require('../views/tagsView');

var CreateRequestView = Backbone.View.extend({
  template: require('../../templates/request/createRequest.ejs'),

  events: {
    'click [data-action="submit"]': 'submitClicked',
    'keydown input[data-attr="tags"]': 'tagsKeydown'
  },

  initialize: function (params) {
    this.model = new Request();
    this.tags = new Tags();
    this.render();
  },

  render: function () {
    this.$el.html(this.template());
    new TagsView({
      collection: this.tags,
      el: this.$('.tagsContainer'),
      editable: true
    });
  },

  submitClicked: function (evt) {
    evt.preventDefault();
    var title = this.$('[data-attr="title"]').val();
    var body = this.$('[data-attr="body"]').val();
    var offer = this.$('[data-attr="offer"]').val();

    this.model.set({
      title: title,
      body: body,
      offer: offer,
      tags: _.map(this.tags.models, function (model) { return model.toJSON().name; })
    });
    this.model.save();
  },

  tagsKeydown: function (evt) {
    if (_.contains([188, 13, 9], evt.which)) {
      evt.preventDefault();
      var tag = this.$('[data-attr="tags"]').val();
      this.$('[data-attr="tags"]').val('').focus();
      this.tags.add(new Tag({ name: tag }));
    }
  }

});

module.exports = CreateRequestView;
