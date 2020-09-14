
let participent_list_open = false
let chat_open = false
function participentListToggle(){
    if(participent_list_open){
        participentListClose();
    }
    else{
        participentListOpen();
        if(chat_open){
            chatClose();
        }
    }
} 
function chatToggle(){
    if(chat_open){
        chatClose();
    }
    else{
        chatOpen();
        if(participent_list_open){
            participentListClose();
        }
    }
} 


function participentListOpen(){
    $(`.chat__sidebar`).animate({left:'0'});
    $('#sidebar-collapser').animate({left:'+=260px'});
    participent_list_open = true;
}

function participentListClose(){
    $(`.chat__sidebar`).animate({left:'-260'});
    $('#sidebar-collapser').animate({left:'-=260px'});
    participent_list_open = false;
}

function chatClose(){
    $(`.chat__main`).animate({left:'-260'});
    $('#chat-collapser').animate({left:'-=260px'});
    chat_open = false;
}

function chatOpen(){
    $(`.chat__main`).animate({left:'0'});
    $('#chat-collapser').animate({left:'+=260px'});
    chat_open = true;
}

const invite_btn = document.querySelector('#invite')
    invite_btn.addEventListener('click', function(){
        console.log('invie btn clicked');
        link = `${window.location.origin}/joinRoom.html?roomId=${window.roomId}`;
        copy(link);  
    });

function copy(txt){
    console.log("copy called");
  var cb = document.getElementById("cb");
  cb.value = txt;
  cb.style.display='block';
  cb.select();
  document.execCommand('copy');
  cb.style.display='none';
  alert("room link is copied")
 }


 