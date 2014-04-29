/*
    room.js
    Client Side Javascript for the room
*/

// var socket = io.connect();
var id_dictionary = {};


window.addEventListener('load', function(){
    var messageForm = document.getElementById('messageForm');
    messageForm.addEventListener('submit', sendMessage, false);


    // socket.on('message', function(nickname, message, time){
    //     // display a newly-arrived message
    // });

    // // handle room membership changes
    // socket.on('membershipChanged', function(members){
    //     // display the new member list
    // });

    // // get the nickname
    // var nickname = prompt('Enter a nickname:');

    // // join the room
    // socket.emit('join', meta('roomName'), nickname, function(messages){
    //     // process the list of messages the server sent back
    // });

}, false);

function sendMessage(e) {
    // prevent the page from redirecting
    e.preventDefault();

    var meta = document.querySelector('meta[name=roomName]');
    var roomName = meta.content;

    // create a FormData object from our form
    var fd = new FormData(document.getElementById('messageForm'));
    socket.emit('message', meta(fd), nickname, function(messages){
        // process the list of messages the server sent back
    });

    // send it to the server
    // var request = new XMLHttpRequest();
    // request.open('POST', '/' + roomName + '/messages', true);
    // request.send(fd);

    // requestData();
};

// function requestData(){
//     var request = new XMLHttpRequest();
//     var meta = document.querySelector('meta[name=roomName]');
//     var roomName = meta.content;

//     request.open("GET", "/" + roomName + "/messages.json", false);
//     request.send();
//     //parsing JSON
//     var content = request.responseText;
//     data = JSON.parse(content);
//     append_messages(data);
// };

function append_messages(data){
	var message_list = document.getElementById("message_ul");
	for (var i=0; i<data.length; i++){
        if (id_dictionary[data[i].id] ===1){

        }else{
            id_dictionary[data[i].id] = 1;
    		var current_message = document.createElement("li");
    		current_message.setAttribute("id", "message_li");

            var current_message_body = document.createElement("div");
            var current_message_nickname = document.createElement("div");
            var current_message_time = document.createElement("div");
            var current_message_info_wrapper = document.createElement("div");

            current_message_body.setAttribute("id", "message_body");
            current_message_nickname.setAttribute("id", "message_nickname");
            current_message_time.setAttribute("id", "message_time");
            current_message_info_wrapper.setAttribute("id", "current_message_info_wrapper");


            current_message_body.innerHTML = data[i].body.substring(0,250) + "..." ;
            current_message_nickname.innerHTML = data[i].nickname;
            current_message_time.innerHTML = data[i].time;

            current_message_info_wrapper.appendChild(current_message_nickname);
            current_message_info_wrapper.appendChild(current_message_time);

            current_message.appendChild(current_message_info_wrapper);
            current_message.appendChild(current_message_body);
            
            message_list.insertBefore(current_message, message_list.firstChild);
        }
	};
}