var Lab = require("lab"),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    before = lab.before,
    after = lab.after,
    it = lab.test,
    assert = require("assert"),
    request = require("request"),
    Hapi = require("hapi"),
    hock = require("hock")

const PORT = 1337
const MOCK_BLOCKCHAIN_PORT = 1338
var server

before(function (done) {
  server = Hapi.createServer(PORT)
  server.pack.register([{
      plugin: require('../plugins/main.js'),
      options: {
        blockchainOptions: {
          url: "http://localhost:" + MOCK_BLOCKCHAIN_PORT + "/"
        },
        btcWallets: [1, 2],
        ltcWallets: [1, 2]
      }
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

function createMockServer (url, cb) {
  hock.createHock(MOCK_BLOCKCHAIN_PORT, function (err, hockServer) {
    hockServer
        .get(url)
        .many()
        .reply(200, {
          "status": "success",
          "data": [
            {
              "address": "1",
              "balance": 42,
              "balance_multisig": 0
            },
            {
              "address": "2",
              "balance": 23,
              "balance_multisig": 0
            }
          ],
          "code": 200,
          "message": ""
        })
    cb(null, hockServer)
  })
}

describe("API", function () {
  it("returns a 200 on /", function (done) {
    createMockServer("/1,2", function (er, s) {
      request({
        uri: "http://localhost:" + PORT + "/",
        json: true
      }, function (err, res, body) {
        assert.equal(res.statusCode, 200)
        s.close()
        done()
      })
    })
  })
  it("returns wallet data", function (done) {
    createMockServer("/1,2", function (er, s) {
      request({
        uri: "http://localhost:" + PORT + "/",
        json: true
      }, function (err, res, body) {
        assert.ok(body.ltc[0])
        assert.ok(body.btc[0])
        s.close()
        done()
      })
    })
  })
})
