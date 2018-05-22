const Twitter = require('twitter')
const { Readable, Transform, Writable } = require('stream')
const http = require('http')
const fs = require('fs')
const path = require('path')
const io = require('socket.io')
const TwitterStream = require('./streams/TwitterStream')
const StringifyStream = require('./streams/StringifyStream')
const SocketStream = require('./streams/SocketStream')
const FormatStream = require('./streams/FormatStream')
const LocationStream = require('./streams/LocationStream')
const HTMLBuilderStream = require('./streams/HTMLBuilderStream')
const MomentStream = require('./streams/MomentStream')

const cfg = {
    consumer_key: 'kkQLZ7ll1ySuiVffLHtAoKsrb',
    consumer_secret: 'hoAed7PWTlK75GSng3F3dYg5Pd90cvmVzGaLdMPunSG7yJDbRk',
    access_token_key: '2271466346-YQbOGDo2uphWKgW75wMUplUeSJgVwjauMuQeWVJ',
    access_token_secret: 'cLAG5dU8z8TlzeZ4kHWE1GJIGjq1quiqhoaa2TVZE9WNS'
}

const server = http.createServer()

server.on('request', (req, res) => {
    const file = fs.createReadStream(path.resolve(__dirname, 'public', 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    file.pipe(res)
})

const socketIo = io(server)

socketIo.on('connection', (socket) => {
    socket.emit('message', { tweet: 'Connected' })
})

const twitterStream = new TwitterStream({ objectMode: true }, cfg)
const formatStream = new FormatStream({ objectMode: true })
const locationStream = new LocationStream({ objectMode: true })
const htmlBuilderStream = new HTMLBuilderStream({ objectMode: true })
const momentStream = new MomentStream({ objectMode: true })
const socketStream = new SocketStream({ objectMode: true }, socketIo)

twitterStream
    .pipe(formatStream)
    .pipe(locationStream)
    .pipe(momentStream)
    .pipe(htmlBuilderStream)
    .pipe(socketStream)

server.listen(8000, () => {
    console.log('Server listening on port 8000')
})