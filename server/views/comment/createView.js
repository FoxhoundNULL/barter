// TODO generalize this for comments on things other than requests
var models = require('../../models');

var handler = function (req, res) {
  models.Comment.create({
    body: req.body.body,
    UserId: req.user.id,
    RequestId: req.body.requestId
  }).then(function (comment) {
    models.Request.findOne({ where: { id: req.body.requestId }}).then(function (request) {
      models.Notification.create({
        actionType: 'Comment',
        actionId: comment.id,
        objectType: 'Request',
        ObjectRequestId: request.id,
        SubjectUserId: req.user.id,
        UserId: request.UserId
      });
      // need to reload to fetch associations
      // until this is implemented https://github.com/sequelize/sequelize/issues/3807
      comment.reload({ include: [models.User] }).then(function (comment) {
        res.status(200).send(comment);
      });
    });
  });
};

module.exports = handler;
