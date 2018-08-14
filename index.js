const express = require('express')
const app = express()
const fs = require('file-system');
const dir = './public/assets/images';
const $ = require('jQuery');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const imagesOnPage = 10;
const port = 3001;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})
app.use('/static/', express.static(__dirname + '/public/css'))
.use('/static/', express.static(__dirname + '/public/assets/images'))
.use('/js/', express.static(__dirname + '/src/scripts'))

http.listen(port, function() {
  console.log('listening on *:3000');
});

let createGallery = (socket) => {
  let imageList = [];
  let nrOfImages = 0;
  let nrOfPages = 0;
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      imageList.push(file);
    });
    nrOfImages = files.length;
    nrOfPages = Math.ceil(nrOfImages / 10);
  })
  io.sockets.on('connection', function(socket) {
    socket.emit('init', {
      imageList: imageList,
      nrOfPages: nrOfPages,
      nrOfImages: nrOfImages,
    });
  });
}

createGallery();
