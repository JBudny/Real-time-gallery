const express = require('express')
const app = express()
const fs = require('file-system');
const dir = './public/assets/images';
const $ = require('jQuery');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {res.sendFile(__dirname + '/views/index.html');})
app.use('/static/', express.static(__dirname + '/public/css'))
app.use('/static/', express.static(__dirname + '/public/assets/images'))

http.listen(3003, function(){
  console.log('listening on *:3000');
});

fs.readdir(dir, (err, files) => {
  console.log(files.length);
});

let createGallery = (socket) => {
  let codeToInsert = '<div class="card"><figure><img src="static/100x100.png" alt="100x100 image"><figcaption>100x100 image</figcaption></figure></div>';
  io.sockets.on('connection', function (socket) {
    socket.emit('init', {
        my: codeToInsert
    });
  });


}

createGallery();
