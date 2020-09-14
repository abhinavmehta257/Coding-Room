$("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: "/css/admin.css"
}).appendTo("body");
  
//remove user
function removeUser(btn){
    userId = btn.id;
    senderId = socket.id;
    console.log(userId);
    data = {userId, senderId}
    let removeUser = confirm(`Do you want to remove the user`);
    if(removeUser){
        socket.emit('removeUser',data);
    }
};

function sendQuestion(){
    question = $("#question").val();
    console.log(question);
}
