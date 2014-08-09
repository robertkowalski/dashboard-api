var p = require("peanuts").blockr,
    env = process.env

exports.register = function Main (plugin, opts, next) {
  const BTC_ADDRESSES = opts.btcWallets || env.BTC_ADRESSES.split(",")
  const LTC_ADRRESSES = opts.ltcWallets || env.LTC_ADRESSES.split(",")
  const blockOpts = opts.blockchainOptions || {}

  plugin.route({
    path: "/",
    method: "GET",
    handler: function (request, reply) {
      p("btc", BTC_ADDRESSES, blockOpts, function (err, btc) {
        p("ltc", LTC_ADRRESSES, blockOpts, function (er, ltc) {

          reply({"ltc": ltc, "btc": btc})
        })
      })
    }
  })

  next()
}

exports.register.attributes = {
  name: "dashboard-main"
}
