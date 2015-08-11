import template from 'templates/profile/profile.ejs';

const ProfileView = Backbone.View.extend({
  template,

  events: {
  },

  initialize (params) {
    if (!App.user) {
      this.remove();
      return;
    }
    this.size = params.size;

    this.render();
  },

  render () {
    this.$el.html(this.template({
      size: this.size,
      user: App.user
    }));
  }

});

export default ProfileView;
