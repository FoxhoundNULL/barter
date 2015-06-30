var ProposalModel = Backbone.Model.extend({

  stateMap: {
    'rejected': -1,
    'pending': 0,
    'accepted': 1,
    '-1': 'rejected',
    '0': 'pending',
    '1': 'accepted'
  },

  urlRoot: '/api/proposals',

  setState: function (state) {
    this.set('state', this.stateMap[state]);
    return $.ajax({
      url: '/api/proposals/' + this.get('id') + '/state',
      method: 'POST',
      data: {
        state: this.get('state')
      }
    });
  }

});

module.exports = ProposalModel;
