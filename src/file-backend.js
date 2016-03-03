var path = require('path');
var fs = require('fs');
var socketPort = 3010;

function filebackend(app){
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  var databasePath = path.join(__dirname, '..', 'database');

  http.listen(socketPort, function(){
    console.log('listening on *:' + socketPort.toString());
  });

  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('client:listDirRequest', function(foldername){
      console.log('server: Bouncing listed files in folder '+foldername);
      fs.readdir(path.join(databasePath, foldername), (err, filenames) => {
        if (err) {
          return console.log(err);
        }
        socket.emit('server:listDirResponse'+foldername,filenames);
      });
    });

    socket.on('client:readFileRequest', function(request){
      var requestParsed = JSON.parse(request);
      var folder = requestParsed.folder;
      var filename = requestParsed.filename;

      console.log('server: reading file '+folder+'/'+filename);
      fs.readFile(path.join(databasePath, folder, filename), 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        socket.emit('server:readFileResponse'+filename, data)
      });
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
}

exports.startSocket = filebackend;
exports.socketPort = socketPort;