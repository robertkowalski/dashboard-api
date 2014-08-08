exports.register = function Main (plugin, options, next) {

  plugin.route({
    path: "/",
    method: "GET",
    handler: function (request, reply) {
      reply({"ok": true})
    }
  })

  next()
}

exports.register.attributes = {
  name: "dashboard-main"
}
