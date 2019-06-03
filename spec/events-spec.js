const request = require("request");

const api = request.defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true
});

describe('Events API Test', function () {

  jwtWebToken = "";
  userId = "";

  beforeAll(function (done) {
    api.post({
      url: '/login',
      body: {
        username: 'jdoe2',
        password: 'abcd'
      },
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      jwtWebToken = body.token;
      done();
    });
  });

  it('Api test for Creating an Event', function (done) {
    api.post({
      url: '/events',
      headers: {
        Authorization: "Bearer " + jwtWebToken
      },
      body: {
        "organizedBy": {
          "id": '56955ca46063c5600627f393'
        },
        "startDate": "2018-11-01T07:00:00.000Z",
        "endDate": "2018-11-01T07:00:00.000Z",
        "eventName": "SciCafe from Jasmine"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(201);
      done();
    });
  });

  it('Api test for Approving or Rejecting an Event', function (done) {
    api.put({
      url: '/events/56955ca46063c5600627f396/approveOrReject/56955ca46063c5600627f393',
      headers: {
        Authorization: "Bearer " + jwtWebToken
      },
      body: {
        "posted": false
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('Api test for getting attendees of an Event', function (done) {
    api.get({
      url: '/events/56955ca46063c5600627f396/attendees/56955ca46063c5600627f393',
      headers: {
        Authorization: "Bearer " + jwtWebToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('Api test for Adding an attendee to an Event', function (done) {
    api.put({
      url: '/events/56955ca46063c5600627f397/attendee/56955ca46063c5600627f393',
      headers: {
        Authorization: "Bearer " + jwtWebToken
      },
      body: {
        "userId": "56955ca46063c5600627f398"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });


});
