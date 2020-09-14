let socket = io();
window.roomId;
function scrollToBottom() {
  let messages = document.querySelector('#messages').lastElementChild;
  messages.scrollIntoView();
}

socket.on('connect', function() {
  console.log("shocket connected");
  let params;
  socket.on('newmember',function (newmemberData){
    params = newmemberData;
    
    if( newmemberData && !params.isAdmin){
      params.isAdmin = false;
      isAdmin = false;
    }
    if(newmemberData && params.isAdmin){
      initialiseAdmin();
      roomId = params.roomId;
    }
    console.log(params);
  socket.emit('join', params, function(err) {
    if(err){
      alert(err);
      window.location.href = '/';
    }else {
      // console.log('No Error');
    }
  });
  })
  // console.log(socket.id);
  socket.on('connectionError', function(error){
    alert("connection error occured please reconnect");
    window.location.href = '/';
  })
});


socket.on('disconnect', function() {
  alert('disconnected from server.');
  window.location.href = '/';
});

socket.on('updateUsersList', function (users) {
  let ol = document.createElement('ul');
  // console.log(users);
  users.forEach(function (user) {
    const template = document.querySelector('#participent-template').innerHTML;
    const newUserTemplate = Mustache.render(template,{
      User:user
    })
    let li = document.createElement('li');
    li.innerHTML = newUserTemplate;
    ol.appendChild(li);
  });
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

socket.on('youAreNewAdmin',function(isAdmin){
  if(isAdmin){
    initialiseAdmin();
  }else{
    // console.log("wrong person");
  }
});
function initialiseAdmin(){
    $.getScript('/js/adminWindow.js', function() {
      console.log("Admin script loaded");
    });
}



