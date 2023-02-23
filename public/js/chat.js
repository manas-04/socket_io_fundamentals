let socket = io();
// This function can be used to perform something after we have made a connection
socket.on("connect",function (){
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href = "/";
        }else{
            console.log('No Error');
        }
    });

});

socket.on('disconnect', function() {
    console.log('disconnected from server.');
});

function scrollToBottom (){
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

socket.on('updatedUserList',function(users){
    let ol = document.createElement('ol');

    users.forEach(element => {
        let li = document.createElement('li');
        li.innerHTML = element;
        ol.appendChild(li);
    });

    let userList = document.querySelector('#users');
    userList.innerHTML = "";
    userList.appendChild(ol);

});

socket.on("newMessage",(message)=>{
    const formattedDate = moment(message.createdAt).format('LT');
    const template = document.querySelector("#message-template").innerHTML;

    const html = mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formattedDate
    })

    const div = document.createElement('div');
    div.innerHTML = html;

    document.querySelector("#messages").appendChild(div);
    scrollToBottom();

    // console.log("New Message : ", message);
    // let li = document.createElement('li');
    // li.innerText = `${message.from} ${formattedDate} : ${message.text}`;
    // document.querySelector('body').appendChild(li);

});

socket.on("newLocationMessage",(message)=>{
    
    const formattedDate = moment(message.createdAt).format('LT');
    const template = document.querySelector("#location-message-template").innerHTML;

    const html = mustache.render(template,{
        from:message.from,
        url:message.url,
        createdAt:formattedDate
    })

    const div = document.createElement('div');
    div.innerHTML = html;

    document.querySelector("#messages").appendChild(div);
    scrollToBottom();
    // console.log("New Location Message : ", message);

    // let li = document.createElement('li');
    // let a = document.createElement('a');
    // li.innerText = `${message.from} ${formattedDate} : `;
    // a.setAttribute('target','_blank');
    // a.setAttribute('href',message.url);
    // a.innerText = "My Current Location";
    // li.appendChild(a);

    // document.querySelector('body').appendChild(li);

});

// socket.emit('createMessage',{
//     from:"ABC",
//     text:"Its random !!",
// }, function (message){
//     console.log("Got it. ", message);
// });

document.querySelector("#submit-btn").addEventListener("click",
    function (e){
        e.preventDefault();
        socket.emit("createMessage",{
            from:"User",
            text:document.querySelector('input[name="message"]').value,
        },
        function(){
        }
    )
});

document.querySelector('#location').addEventListener("click",function(e){
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by your Browswer.");
    }
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        socket.emit('createLocationMessage',{
            lat: position.coords.latitude,
            long: position.coords.longitude
        });
    },function (){  
        alert('Unable to fetch loaction.');
    });
});