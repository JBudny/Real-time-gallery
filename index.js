const express = require('express')
const app = express()
const fs = require('file-system');
const dir = './public/assets/images';

app.get('/', (req, res) => {res.sendFile(__dirname + '/views/index.html');})
app.use('/static/', express.static(__dirname + '/public/css'))
app.use('/static/', express.static(__dirname + '/public/assets/images'))

app.listen(3002, () => console.log('Example app listening on port 3000!'))

fs.readdir(dir, (err, files) => {
  console.log(files.length);
});
