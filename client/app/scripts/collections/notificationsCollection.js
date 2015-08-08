import PaginatedCollection from './_paginatedCollection';
import Notification from 'scripts/models/notificationModel';

const NotificationsCollection = PaginatedCollection.extend({
  model: Notification,

  url: '/api/notifications',

  setAllSeen () {
    return $.ajax({
      url: `${ this.url }/allStates`,
      method: 'POST',
      data: {
        state: 1
      }
    });
  }
});

export default NotificationsCollection;
