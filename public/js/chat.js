let socket = io();
let userIdsList = [];
function scrollToBottom() {
  let messages = document.querySelector('#messages').lastElementChild;
  messages.scrollIntoView();
}

socket.on('connect', function() {
  console.log("shocket connection");
  let params;
  socket.on('newmember',function (newmemberData){
    params = newmemberData
    console.log(params);
  socket.emit('join', params, function(err) {
    if(err){
      alert(err);
      window.location.href = '/';
    }else {
      console.log('No Error');
    }
  });
  })
  console.log(socket.id);
  socket.on('connectionError', function(error){
    alert("connection error occured please reconnect");
    window.location.href = '/';
  })
});

  
socket.on('disconnect', function() {
  console.log('disconnected from server.');
});

socket.on('updateUsersList', function (users) {
  let ol = document.createElement('ol');

  users.forEach(function (user) {
    let li = document.createElement('li');
    li.innerHTML = user.name;
    ol.appendChild(li);
  });
  userIdsList = users
  let usersList = document.querySelector('#users');
  usersList.innerHTML = "";
  usersList.appendChild(ol);
})

socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#message-template').innerHTML;
  const newMessageTemplate = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = newMessageTemplate

  document.querySelector('#messages').appendChild(div);
  scrollToBottom();
});

document.querySelector('#submit-btn').addEventListener('click', function(e) {
  e.preventDefault();

  socket.emit("createMessage", {
    text: document.querySelector('input[name="message"]').value
  }, function() {
    document.querySelector('input[name="message"]').value = '';
  })
})



