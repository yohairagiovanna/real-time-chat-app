
const fs = require('fs');
module.exports = function (io) {
  let nicknames = [];
  
io.on('connection', socket => {
    console.log('new user connected');

    socket.on('new user', (data, cb) => {
      console.log(data);
      if (nicknames.indexOf(data) != -1) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        updateNicknames();
      }
    });

    socket.on('send message', data => {
      io.sockets.emit('new message', {
        msg: data,
        nick: socket.nickname,
        timestamp: new Date().toLocaleTimeString() // Añade la hora actual  
      });


      // Añade el nuevo mensaje al archivo HTML
  let htmlMessage = '<p><b>' + socket.nickname + '</b>: ' + data + ' <span class="timestamp">' + new Date().toLocaleTimeString() + '</span></p>\n';
  fs.appendFile('chatHistory.html', htmlMessage, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});


    

    socket.on('send image', data => {
      io.sockets.emit('new image', { 
        image: data, 
        nick: socket.nickname, 
        timestamp: new Date().toLocaleTimeString() // Añade la hora actual
      });
    });


    socket.on('disconnect', data => {
      if(!socket.nickname) return;
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
      updateNicknames();
  });

  function updateNicknames() {
    io.sockets.emit('usernames', nicknames);
}

socket.on('mark as read', data => {
  // Aquí puedes guardar la hora en que fue leído el mensaje
  console.log(`El mensaje ${data.id} fue leído a las ${data.timestamp}`);
   // Aquí puedes agregar el código para guardar la hora en el archivo HTML
  let htmlMessage = `<p>El mensaje ${data.id} fue leído a las ${data.timestamp}</p>\n`;
  fs.appendFile('chatHistory.html', htmlMessage, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});
});
}






