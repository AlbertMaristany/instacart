const express = require('express')
const app = express()
const router = require('./src/router')
const errorHandler = require('./src/middleware/error-handler')

app.use('/docs', express.static(__dirname + '/docs'))
router.route(app)
app.use(errorHandler)

app.listen(3170, () => console.log('Belvo server running on port 3170'))