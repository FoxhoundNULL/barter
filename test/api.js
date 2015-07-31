require('dotenv').load(); // environment variables in .env
var assert = require('chai').assert;
var request = require('supertest');
var testUser = require('superagent').agent();
var _ = require('lodash');

var url = 'http://localhost:' + process.env.PORT;

function status200Html (route, done) {
  request(url)
    .get(route)
    .end(function (err, res) {
      assert.equal(res.status, 200, 'status should be 200');
      assert.isTrue(res.text.indexOf('</html>') > -1, 'response body should contain closing html tag');
      done();
    });
}

function status302RedirectToLogin (route, done) {
  request(url)
    .get(route)
    .end(function (err, res) {
      assert.equal(res.status, 302, 'status should be 302');
      assert.equal(res.header.location, '/login', 'user should be redirected to /login');
      done();
    });
}

describe('Server Routes', function () {

  describe('Unauthenticated user', function () {
    it('reqs to / should return 200 with expected html', function (done) {
      status200Html('/', done);
    });
    it('reqs to /api/* should be redirected to /login', function (done) {
      status302RedirectToLogin('/api/', done);
    });
    it('reqs to /app/* should be redirected to /login', function (done) {
      status302RedirectToLogin('/app/', done);
    });
  });

  describe('Authenticated user', function () {
    // this test should be run before any other test requiring authentication
    // since it sets up the `testUser` object with all the auth cookies
    it('test user can authenticate', function (done) {
      var USERNAME = 'tommy';
      var PASSWORD = 'tpass';
      testUser.post(url + '/login')
        .send({ username: USERNAME, password: PASSWORD })
        .end(function (err, res) {
          _.extend(testUser, res.body);
          assert.equal(res.status, 200, 'status should be 200');
          assert.equal(res.body.username, USERNAME, 'correct username should be returned');
          done();
        });
    });

    describe('Requests', function () {
      it('indexView default', function (done) {
        testUser.get(url + '/api/requests')
          .end(function (err, res) {
            assert.equal(res.status, 200, 'status should be 200');
            assert(res.body.items.length > 1 && res.body.total > 1, 'should return items array and total');
            done();
          });
      });
      it('indexView mine', function (done) {
        testUser.get(url + '/api/requests?mine=true')
          .end(function (err, res) {
            var allMine = _.every(res.body.items, function (item) { return item.UserId === testUser.id; });
            assert.equal(res.status, 200, 'status should be 200');
            assert(allMine, 'each item should belong to the user');
            done();
          });
      });
    });

    describe('Sortable views', function () {
      it('ascending order', function (done) {
        testUser.get(url + '/api/requests?sort=offer')
          .end(function (err, res) {
            var ascending = true;
            _.each(res.body.items, function (item, i) {
              if (i && res.body.items[i - 1].offer > item.offer) { ascending = false; }
            });
            assert.equal(res.status, 200, 'status should be 200');
            assert(ascending, 'items should be sorted in ascending order.');
            done();
          });
      });
      it('descending order', function (done) {
        testUser.get(url + '/api/requests?sort=-offer')
          .end(function (err, res) {
            var descending = true;
            _.each(res.body.items, function (item, i) {
              if (i && res.body.items[i - 1].offer < item.offer) { descending = false; }
            });
            assert.equal(res.status, 200, 'status should be 200');
            assert(descending, 'items should be sorted in descending order.');
            done();
          });
      });
    });

    describe('Paginated views', function () {
      it('Limit should be honored', function (done) {
        var limit = 15;
        testUser.get(url + '/api/requests?limit=' + limit)
          .end(function (err, res) {
            assert.equal(res.status, 200, 'status should be 200');
            assert.equal(res.body.items.length, limit, 'number of items should be the same as the limit');
            done();
          });
      });
    });

  });

});
