let socket = io();

function scrollToBottom() {
  let messages = document.querySelector('#messages').lastElementChild;
  messages.scrollIntoView();
}

socket.on('connect', function() {
  let searchQuery = window.location.search.substring(1);
  console.log("shocket connection");
  console.log(window.location.origin);
  // params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
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
  // console.log(params);
  // socket.emit('join', params, function(err) {
  //   if(err){
  //     alert(err);
  //     window.location.href = '/';
  //   }else {
  //     console.log('No Error');
  //   }
  // });
});

  const invite_btn = document.querySelector('#invite') 
    invite_btn.addEventListener('click', function(){
    if (navigator.Share) {
      navigator.share({
        title: `Invite to ${param.room}`,
        url: `${window.location.origin}/?room=${params.room}`
      }).then(() => {
        console.log('Thanks for sharing!');
        alert("sharing")
      })
      .catch(console.error);
    } else {
       copy(`${window.location.origin}/?room=${params.room}`);
    }

    })

socket.on('disconnect', function() {
  console.log('disconnected from server.');
});

socket.on('updateUsersList', function (users) {
  let ol = document.createElement('ol');

  users.forEach(function (user) {
    let li = document.createElement('li');
    li.innerHTML = user;
    ol.appendChild(li);
  });

  let usersList = document.querySelector('#users');
  usersList.innerHTML = "";
  usersList.appendChild(ol);
})

socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

  document.querySelector('#messages').appendChild(div);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('LT');
  console.log("newLocationMessage", message);

  const template = document.querySelector('#location-message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

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



function copy(txt){
  var cb = document.getElementById("cb");
  cb.value = txt;
  cb.style.display='block';
  cb.select();
  document.execCommand('copy');
  cb.style.display='none';

  alert("room link is copied")
 }
