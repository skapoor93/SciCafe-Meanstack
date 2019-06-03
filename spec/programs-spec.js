const request = require("request");

const api = request.defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true
});

describe('Programs API test', function () {

  it('Create a Program', function (done) {
    api.post({
      url: '/programs/56955ca46063c5600627f393',
      body: {
        programName: "abcd123",
        programFullName: "abcd123",
        programDescription: "abcd123"
      }
    }, function (err, res, body) {
      if (res.statusCode == 201) {
        expect(res.statusCode).toBe(201);
        expect(res.body.programName, 'abcd123');
      } else {
        console.log("-------------------------From program-spec create program test api----------------------")
        console.log("Delete created program data from previous run of the test case from the database");
      }
      done();
    });
  });

  it('Create a new program from Unauthorized user', function (done) {
    api.post({
      url: '/programs/56955ca46063c5600627f392',
      body: {
        programName: "abcd123",
        programFullName: "abcd123",
        programDescription: "abcd123"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      expect(res.body.message, 'Unauthorized User');
      done();
    });
  });

  it('Edit A Program', function (done) {
    api.put({
      url: '/programs/56955ca46063c5600627f394/edit/56955ca46063c5600627f393',
      body: {
        //programName: "abcd123",
        programFullName: "LSAMP from Jasmine",
        programDescription: "LSAMP from Jasmine"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('Get A Program by id', function (done) {
    api.get({
      url: '/programs/56955ca46063c5600627f394',
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('Get All Programs', function (done) {
    api.get({
      url: '/programs/',
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

});
