var Hapi = require("hapi"),
    assert = require("assert"),
    PORT = process.env.DASHBOARD_PORT

var server = Hapi.createServer(PORT || 1337)

server.pack.register([{
    plugin: require('./plugins/main.js')
  }], function (err) {
    if (err) throw err

    server.start(function () {
      console.log('Hapi server started @ ' + server.info.uri)
    })
})
