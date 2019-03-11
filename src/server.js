#!/usr/bin/env node
require('dotenv').config()
const { serveHTTP } = require("stremio-addon-sdk")
const addonInterface = require('./addon')
const IMDB = require('./imdb')

const imdb = new IMDB();
const { PORT, CACHE_INTERVAL } = process.env

imdb.cacheDataset().then(() => {
    serveHTTP(addonInterface, { port: PORT, static: '/static' })
});

setInterval(() => {
    imdb.cacheDataset()
}, CACHE_INTERVAL)
