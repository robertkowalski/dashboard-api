var Lab = require("lab"),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    before = lab.before,
    after = lab.after,
    it = lab.test,
    assert = require("assert"),
    request = require("request"),
    Hapi = require("hapi")

const PORT = 1337

var server
before(function (done) {
  server = Hapi.createServer(PORT)
  server.pack.register([{
      plugin: require('../plugins/main.js')
    }], function (err) {
      if (err) throw err
      server.start(function () {
        done()
      })
    })
})

after(function (done) {
  server.stop(done)
})

describe("API", function () {
  it("should returns a 200 on /", function (done) {
    request({
      uri: "http://localhost:" + PORT + "/",
      json: true
    }, function (err, res, body) {
      assert.equal(res.statusCode, 200)
      done()
    })
  })
})
