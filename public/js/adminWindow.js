$("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "/css/admin.css"
}).appendTo("body");
  
//remove user
function removeUser(btn){
    userId = btn.id;
    senderId = socket.id;
    // console.log(userId);
    data = {userId, senderId}
    let removeUser = confirm(`Do you want to remove the user`);
    if(removeUser){
        socket.emit('removeUser',data);
    }
};

function getCode(btn){
    userId = btn.id;
    senderId = socket.id;
    data = {userId, senderId}
    socket.emit("getCode",data)
}

function sendCode(btn){
    var to = btn.id;
    // console.log(to);
    to.trim();
  var from = socket.id;
  console.log(to);
  
  activeEditorname = layout.root.contentItems[ 0 ].contentItems[0].getActiveContentItem().componentName
  activeEditor = editors.filter((editor)=>editor.name == activeEditorname);
    if(activeEditor){
        codeString = encode(activeEditor[0].newEditor.getValue());
    }else{
     codeString = encode(sourceEditor.getValue());
    }
  codeData = {
    to,from,codeString
  }
  socket.emit("sendCode",codeData);
}