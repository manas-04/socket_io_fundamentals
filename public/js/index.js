let socket = io();
// This function can be used to perform something after we have made a connection
// socket.on("connect",function (){});
// socket.on("disconnect",function (){});

socket.on("newMessage",(message)=>{
    console.log("New Message : ", message);

    let li = document.createElement('li');
    li.innerText = `${message.from} : ${message.text}`;

    document.querySelector('body').appendChild(li);

})

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