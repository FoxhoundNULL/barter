
var ProposalsView = Backbone.View.extend({
  template: require('../../templates/proposal/proposals.ejs'),

  events: {
  },

  initialize: function (params) {
    this.render();

    this.listenTo(this.collection, 'sync change add', this.render);
  },

  render: function () {
    this.$el.html(this.template({
      proposals: this.collection
    }));
  }

});

module.exports = ProposalsView;
