var swap = 0;

function meta(name){
	var tag = document.querySelector('meta[name=' + name + ']');
	if (tag != null){
		return tag.content;
	}
	return '';
}


window.addEventListener('load', function(){
	var newChat_Form = document.getElementById('new-chat_form');
	var joinChat_Form = document.getElementById('join-chat_form');
	var swap_button = document.getElementById('swap_button');
	var newRoom_Id = newRoomIdentifier();
	newChat_Form.action = "/" + newRoom_Id + "/" + randomUser();
	joinChat_Form.action = "/" + newRoom_Id + "/" + randomUser();

	//swapping form
	swap_button.addEventListener("click", function(e){
		e.preventDefault();
		if (swap === 0){
			//switch to join room
			swap_button.innerHTML = "Click for New Chat Instead";
			newChat_Form.style.display = 'none';
			joinChat_Form.style.display = 'block';
			swap = 1;
		}else{
			swap_button.innerHTML = "Click to Join Chat Instead";
			newChat_Form.style.display = 'block';
			joinChat_Form.style.display='none';
			swap = 0;
			//switch to new room
		}
	});

	$('#nicknameField').bind('input', function(){
		newChat_Form.action = "/" + newRoom_Id + "/" + $(this).val();
	});

	$('#nicknameField2').bind('input', function(){
		console.log("HEY");
		joinChat_Form.action = "/" + $('#roomnameField2').val() + "/" + $(this).val();
	});

	$('#roomnameField2').bind('input', function(){
		joinChat_Form.action = "/" + $(this).val() + "/" + $('#nicknameField2').val();
	});

}, false);

function randomUser(){
	return 'Alien';
}

function newRoomIdentifier(){
	var isNotNewRoom = true;
	while (isNotNewRoom){
		result = generateRoomIdentifier();
		var req = new XMLHttpRequest();
		req.open("GET", "/checkRoom/" + result + '.json', false);
		req.send();
		var content = req.responseText;
		if (content === "false"){
			isNotNewRoom = false;
		}
	}
	return result;
}

function generateRoomIdentifier() {
	var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
	var result = '';
	for (var i=0; i<6; i++){
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}