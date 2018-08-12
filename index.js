const express = require('express')
const app = express()

app.get('/', (req, res) => {res.sendFile(__dirname + '/views/index.html');})
app.use('/static/', express.static(__dirname + '/public/css'))
app.use('/static/', express.static(__dirname + '/public/assets/images'))

app.listen(3002, () => console.log('Example app listening on port 3000!'))
