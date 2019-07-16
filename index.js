const express = require('express');
const app = express();
const fs = require('file-system');
const dir = './public/assets/images/gallery';
const $ = require('jquery');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const chokidar = require('chokidar');
const allowedExtensions = [
  './public/assets/images/gallery/*.jpeg',
  './public/assets/images/gallery/*.jpg',
  './public/assets/images/gallery/*.jpe',
  './public/assets/images/gallery/*.jif',
  './public/assets/images/gallery/*.jfif',
  './public/assets/images/gallery/*.jfi',
  './public/assets/images/gallery/*.png',
  './public/assets/images/gallery/*.gif',
  './public/assets/images/gallery/*.bmp',
  './public/assets/images/gallery/*.svg',
  './public/assets/images/gallery/*.ico',
  './public/assets/images/gallery/*.dib'
]
const watcher = chokidar.watch(allowedExtensions, {
  persistent: true,
  ignoreInitial: true
});
const imagesOnPage = 10;
const port = 3000;
let emitSwitched = false;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})
app.use('/static/', express.static(__dirname + '/public/css/'))
  .use('/gallery/', express.static(__dirname + '/public/assets/images/gallery/'))
  .use('/textures/', express.static(__dirname + '/public/assets/images/textures/'))
  .use('/js/', express.static(__dirname + '/src/scripts/'))

http.listen(port, function() {
  console.log('listening on '+port);
});

let imageList = [];
let loadImagesData = () => {
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      imageList.push(file);
    });
    imageList = imageList.filter(item => (/\....$/g).test(item));
    io.sockets.emit('galleryUpdated', imageList);
  });
};

let sendGalleryData = (socket) => {
  emitSwitched = false;
  loadImagesData();
  io.on('connection', function(socket) {
    console.log('Users connected: %s', io.engine.clientsCount);
    socket.emit('init', imageList);
    socket.on('disconnect', function() {
      console.log('User disconnected');
      console.log('Users connected: %s', io.engine.clientsCount);
    });
  });
}

sendGalleryData();

let sendUpdatedData = (imageList) => {
  io.sockets.emit('galleryUpdated', imageList);
}

watcher
  .on('add', function(path) {
    let newFile = path.split( /\/|\\/ ).pop();
    let newIndex = imageList.length;
    imageList[newIndex] = newFile;
    sendUpdatedData(imageList);
  })
  .on('change', function(path) {
    io.sockets.emit('galleryUpdated', imageList);
  })
  .on('unlink', function(path) {
    let unlinkedFile = path.split( /\/|\\/ ).pop();
    let unlinkedIndex = imageList.indexOf(unlinkedFile);
    imageList.splice(unlinkedIndex,1);
    sendUpdatedData(imageList);
  })
  .on('error', function(error) {
    console.log('error');
    loadImagesData();
  })
