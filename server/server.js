const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');
const { exit } = require('process');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


let newmember;
// Access the parse results as request.body
app.post('/chat.html', function(request, response){
  // console.log(request.body);
  newmember = request.body;
  response.redirect('/chat.html')
}) 

io.on('connection', (socket) => {
  // console.log("A new user just connected");
  console.log("A new user just connected: ",newmember);
  socket.emit('newmember',newmember, ()=>{});
  newmember = null;
  
   socket.on('join', (params, callback) => {
    try {
      if(!isRealString(params.name)){
        return callback('Name and room are required');
      }
  
      socket.join(params.roomId);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.roomId);
  
      io.to(params.roomId).emit('updateUsersList', users.getUserList(params.roomId));
      socket.emit('newMessage', generateMessage('Admin', `Welocome 😊`));
  
      // socket.broadcast.to(params.roomId).emit('newMessage', generateMessage('Admin', "New User Joined!"));
  
      callback();
    } catch (error) {
      socket.emit('connectionError',{error:"connection Error"});
      users.removeUser(socket.id);
      socket.disconnect();
    }
    });
  

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
        io.to(user.roomId).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback('This is the server:');
  })

  
  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if(user){
      io.to(user.roomId).emit('updateUsersList', users.getUserList(user.roomId));
      //  io.to(user.roomId).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.roomId} chat room.`))
    }
  });
});    

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
})
