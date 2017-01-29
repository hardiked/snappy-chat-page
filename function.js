function click(elementId,fn){
   var element=document.getElementById(elementId);

   if(element){
     element.addEventListener("click",fn);
   }
}

function redirect(path){
  window.location=path;
  return false;
}


function loginWithGoogle(){
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
   //  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log(user);
  createUser(user.uid,user.displayName,user.email);

//  console.log(user);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  //create user if it doesn't exist
  console.log(error);

});
}


function logInUser(){
  //log in with google usign firebase
  loginWithGoogle();

}



function logInUser(){
  loginWithGoogle();
}

function createUser(uid,uname,uemail){
  var database=firebase.database();
  var usersRef=database.ref("users");

  var user={
    id:uid,
    name:uname,
    email:uemail

  };
  usersRef.child(uid).set(user).then(function(){
    redirect("chat.html");
  });
}

function ifUserIsLoggedIn(fn){
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    window.currentUser={
      id:user.uid,
      name:user.displayName,
      email:user.email
    };

    fn();
  } else {
    // No user is signed in.
  }
});
}
function getElement(id){
  return document.getElementById(id);
}
function updateUserData(){
  var usernameElement=getElement("username");
  //console.log(window.currentUser);
  usernameElement.textContent=window.currentUser.name;
}


function loadUser(fn){
  var database=firebase.database();
  var usersRef=database.ref("users");
  usersRef.on('value',function(snapshot){
    var users=snapshot.val();
    fn(users);
  });
}

function renderUser(user){
  var uid=user.id;
  var chat_id=getChatId(window.currentUser.id,uid)
  var name=user.name;

  var html = '<div id="'+chat_id+'" class="member">'+name+'</div>';
  return html;
}


function getChatId(id1,id2){
  if(id1>id2){
    return id1+""+id2;
  }
  return id2+""+id1;
}


function onClickMultiple(className, func) {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains(className)) {
            func(event.target);
        }
    });
}

function loadMessages(chat_id,fn){
  var database=firebase.database();
  var chatsRef=database.ref("chats");

  chatsRef.child(chat_id).on('value',function(snapshot){
    var messages=snapshot.val();
    fn(messages);
  });
}

function renderMessage(message){
  var text = message.text;
  var msgClass="";
  if(message.sender_id==window.currentUser.id){
    msgClass="message by-user";
  }
  var html='<div class="'+msgClass+'">'+text+'</div>';
  return html;
}



function sendMessage(chat_id,text){
  var message={
    text:text,
    sender_id:window.currentUser.id
  };
  var database=firebase.database();
  var chatsRef=database.ref("chats");
  var chat=chatsRef.child(chat_id);
  var newMessageId=chatsRef.push().key;
  chat.child(newMessageId).set(message);
}


function logout(){
  firebase.auth().signOut().then(function() {
    console.log('logout');
    redirect("index.html");
  // Sign-out successful.
}, function(error) {
  // An error happened.


});
}
