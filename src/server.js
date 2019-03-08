#!/usr/bin/env node
require('dotenv').config()
const { serveHTTP } = require("stremio-addon-sdk")
const IMDB = require('./imdb')
const addonInterface = require('./addon')

const { PORT, CACHE_INTERVAL } = process.env
const imdb = new IMDB()

function refreshServer(serve = false) {
    imdb.init().then(res => {
        console.log(res)
        if (serve) serveHTTP(addonInterface, { port: PORT, static: '/static' })
    }).catch(e => {
        console.error(e)
    })
}

setInterval(() => {
    refreshServer()
}, CACHE_INTERVAL)

refreshServer(true)