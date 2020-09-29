let socket = io();
// window.roomId;
// window.editors = [];
//function used
function scrollToBottom() {
  let messages = document.querySelector('#messages').lastElementChild;
  messages.scrollIntoView();
}
function initialiseAdmin(){
  $.getScript('/js/adminWindow.js', function() {
    console.log("Admin script loaded");
  });
}
function encode(str) {
  return btoa(unescape(encodeURIComponent(str || "")));
}

function decode(bytes) {
  var escaped = escape(atob(bytes || ""));
  try {
      return decodeURIComponent(escaped);
  } catch {
      return unescape(escaped);
  }
}

//socket code
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

socket.on("giveCode",function(data){
  var to = data.senderId;
  var from = socket.id;
  var codeString = encode(sourceEditor.getValue());
  // alert("code demanded by admin");
  codeData = {
    to,from,codeString
  }
  socket.emit("sendCode",codeData);
  // console.log("user send code: ",codeData);
})

socket.on("gotCode", function(data){
  // check mocha docs for getting data from jquery element
  var newItemConfig = {
    title: `${data.user.name}`,
    type: 'component',
    componentName: `${data.user.id}`,
    isClosable: true,
    componentState: { 
        readOnly : false
    }
  };
  newCode = data.codeData.codeString;
  editorId = data.user.id;

  if(layout.root.contentItems[0].getComponentsByName( editorId )[0]){
    console.log(layout.root.contentItems[0].getComponentsByName( editorId )[0]);
    console.log("editor alredy exist");
  }else{
    layout.registerComponent(`${editorId}`, function(container, state){
        studentId = data.user.id;
        container.getElement().html(`<button class="send-btn" style="float:right; padding:2px !important" id="${studentId}" onclick='sendCode(this)'>Send Code<button>`);
      let newEditor = monaco.editor.create(container.getElement()[0], {
          automaticLayout: true,
          theme: "vs-dark",
          scrollBeyondLastLine: true,
          readOnly: state.readOnly,
          language: "cpp",
          minimap: {
              enabled: false
          },
          rulers: [80, 120]
        });
        newEditor.setValue(decode(data.codeData.codeString));
        
        // editorData = {editorId, newEditor};
        // editors.push(editorData);
        });
      
      layout.root.contentItems[0].contentItems[0].addChild( newItemConfig );
    }
})

function raiseHand(){
  socketID = socket.id;
  socket.emit("raiseHand",socketID)
}