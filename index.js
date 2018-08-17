const express = require('express');
const app = express();
const fs = require('file-system');
const dir = './public/assets/images';
const $ = require('jQuery');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const chokidar = require('chokidar');
const watcher = chokidar.watch('./public/assets/images/', {
  persistent: true
});
const imagesOnPage = 10;
const port = 3000;
let nrOfImages = 0;
let nrOfPages = 0;
let emitSwitched = false;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})
app.use('/static/', express.static(__dirname + '/public/css'))
  .use('/static/', express.static(__dirname + '/public/assets/images'))
  .use('/js/', express.static(__dirname + '/src/scripts'))

http.listen(port, function() {
  console.log('listening on *:3000');
});

let data = {};
let loadImagesData = () => {
  fs.readdir(dir, (err, files) => {
    let imageList = [];
    files.forEach(file => {
      imageList.push(file);
    });
    nrOfImages = files.length;
    nrOfPages = Math.ceil(nrOfImages / 10);
    data = {
      imageList: imageList,
      nrOfPages: nrOfPages,
      nrOfImages: nrOfImages
    }
    if (emitSwitched) {
      io.sockets.emit('switched', data);
    }
  });
};

let sendGalleryData = (socket) => {
  emitSwitched = false;
  loadImagesData();
  io.on('connection', function(socket) {
    console.log('Users connected: %s', io.engine.clientsCount);
    socket.emit('init', data);
    socket.on('disconnect', function() {
      console.log('User disconnected');
      console.log('Users connected: %s', io.engine.clientsCount);
    });
    socket.on('switch', function(socket) {
      emitSwitched = true;
      loadImagesData();
    });
  });
}

sendGalleryData();


watcher
  .on('add', function(path) {
    loadImagesData();
  })
  .on('change', function(path) {
    loadImagesData();
  })
  .on('unlink', function(path) {
    loadImagesData();
  })
  .on('error', function(error) {
    loadImagesData();
  })
