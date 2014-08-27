var request      = require('supertest');
var shared       = require('../shared-specs');
var passwordHash = require('password-hash');

var args;
var serialToken;

describe('EntranceController', function() {
  shared.shoudRequestNotFoundOnGet('/entrance');

  describe('POST /entrance', function() {
    beforeEach(function(done) {
      args = {flashband: '1234'};

      User.create({password: '123123123'}, function(err, user) {
        serialToken = passwordHash.generate(user.id);
        user.tokens.add({ token: serialToken });
        user.save(done);
      });
    });

    it('should register a valid flashband', function (done) {
      Flashband.create({uid: '1234', serial: 1}, function() {
        request(sails.hooks.http.app)
          .post('/entrance')
          .send({flb: args.flashband})
          .expect(201)
          .set('Authorization', 'Token token='.concat(serialToken))
          .end(done);
      });
    });

    it('should reject duplicated flashband', function (done) {
      Entrance.create({flb: args.flashband}, function(err, entranceModel) {
        request(sails.hooks.http.app)
          .post('/entrance')
          .send({flb: args.flashband})
          .expect(403, 'Duplicated entrance.')
          .set('Authorization', 'Token token='.concat(serialToken))
          .end(done);
      });
    });
  });
});
