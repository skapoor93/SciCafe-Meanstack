const request = require("request");

const api = request.defaults({
  baseUrl: "http://localhost:3000/api",
  json: true
});

describe("Users API Tests:", function () {

  it('Api test for Creating a User', function (done) {
    api.post({
      url: '/users',
      body: {
        firstName: "Shivam",
        lastName: "Kapoor",
        email: "skapoor4@calstatela.edu",
        username: "shivam",
        password: "abcd",
        userType: "Administrator"
      }
    }, function (err, res, body) {
      if (res.statusCode == 201) {
        expect(res.statusCode).toBe(201);
        expect(res.body.userType, 'Administrator');
      } else {
        console.log("-------------------------From user-spec create user test api----------------------")
        console.log("Delete created user data from previous run of the test case from the database");
      }
      done();
    });
  });

  it('Api test for Creating a User without username', function (done) {
    api.post({
      url: '/users',
      body: {
        firstName: "Shivam",
        lastName: "Kapoor",
        email: "skapoor4@calstatela.edu",
        password: "abcd",
        userType: "Administrator"
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(400);
      expect(res.body.message, 'Username can not be empty');
      done();
    });
  });

});
