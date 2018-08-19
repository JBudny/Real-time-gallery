const express = require('express');
const app = express();
const fs = require('file-system');
const dir = './public/assets/images';
const $ = require('jQuery');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const chokidar = require('chokidar');
const allowedExtensions = [
  './public/assets/images/*.jpeg',
  './public/assets/images/*.jpg',
  './public/assets/images/*.jpe',
  './public/assets/images/*.jif',
  './public/assets/images/*.jfif',
  './public/assets/images/*.jfi',
  './public/assets/images/*.png',
  './public/assets/images/*.gif',
  './public/assets/images/*.bmp',
  './public/assets/images/*.svg',
  './public/assets/images/*.ico',
  './public/assets/images/*.dib'
]
const watcher = chokidar.watch(allowedExtensions, {
  persistent: true,
  ignoreInitial: true
});
const imagesOnPage = 10;
const port = 80;
let nrOfImages = 0;
let nrOfPages = 0;
let emitSwitched = false;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})
app.use('/static/', express.static(__dirname + '/public/css'))
  .use('/gallery/', express.static(__dirname + '/public/assets/images'))
  .use('/js/', express.static(__dirname + '/src/scripts'))

http.listen(port, function() {
  console.log('listening on '+port);
});

let data = {};
let loadImagesData = () => {
  fs.readdir(dir, (err, files) => {
    let imageList = [];
    files.forEach(file => {
      imageList.push(file);
    });

    imageList = imageList.filter(item => (/\....$/g).test(item));
    nrOfImages = imageList.length;
    nrOfPages = Math.ceil(nrOfImages / 10);
    data = {
      imageList: imageList,
      nrOfPages: nrOfPages,
      nrOfImages: nrOfImages
    }
    io.sockets.emit('galleryUpdated', data);
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
  });
}

sendGalleryData();

let sendUpdatedData = (data) => {
  io.sockets.emit('galleryUpdated', data);
}

watcher
  .on('add', function(path) {
    let newFile = path.substring(path.lastIndexOf("\\") + 1, path.length);
    let newIndex = data.imageList.length;
    data.imageList[newIndex] = newFile;
    data.nrOfImages = data.imageList.length;
    data.nrOfPages = Math.ceil(data.nrOfImages / 10);
    sendUpdatedData(data);
  })
  .on('change', function(path) {
    console.log('File '+path+' has been changed');
    io.sockets.emit('galleryUpdated', data);
  })
  .on('unlink', function(path) {
    let unlinkedFile = path.substring(path.lastIndexOf("\\") + 1, path.length);
    let unlinkedIndex = data.imageList.indexOf(unlinkedFile);
    data.imageList.splice(unlinkedIndex,1);
    data.nrOfImages = data.imageList.length;
    data.nrOfPages = Math.ceil(data.nrOfImages / 10);
    sendUpdatedData(data);
  })
  .on('error', function(error) {
    console.log('error');
    loadImagesData();
  })
