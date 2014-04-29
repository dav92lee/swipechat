var express = require('express'),
	app = express(),
	colors = require('colors'),
	http = require('http'),
	anyDB = require('any-db'),
	engines = require('consolidate'),
	server = http.createServer(app);

var conn = anyDB.createConnection('sqlite3://chatroom.db');

app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');

app.use(express.bodyParser());
app.use('/javascripts', express.static(__dirname + '/javascripts'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));

app.listen(8080, function(){
	console.log('- SERVER LISTENING ON PORT 8080'.grey);
});

// io.sockets.on('connection', function(socket){
//     // clients emit this when they join new rooms
//     socket.on('join', function(roomName, nickname, callback){
//         socket.join(roomName); // this is a socket.io method
//         socket.nickname = nickname; // yay JavaScript! see below

//         // get a list of messages currently in the room, then send it back
//         var messages = [...];
//         callback(messages);
//     });

//     // this gets emitted if a user changes their nickname
//     socket.on('nickname', function(nickname){
//         socket.nickname = nickname;
//     });

//     // the client emits this when they want to send a message
//     socket.on('message', function(message){
//         // process an incoming message (don't forget to broadcast it to everyone!)

//         // note that you somehow need to determine what room this is in
//         // io.sockets.manager.roomClients[socket.id] may be of some help, or you
//         // could consider adding another custom property to the socket object.

//         // Note that io.sockets.manager.roomClients[socket.id] is a hash mapping
//         // from room name to true for all rooms that the socket is in, that room
//         // names are prefixed with a "/", and that every socket is in a global room
//         // with name '' (the empty string). Thus, to get the room name, you might
//         // have to use something like this:
//         var rooms = Object.keys(io.sockets.manager.roomClients[socket.id]);
//         var roomName = (rooms[0] == '') ? rooms[1].substr(1) : rooms[0].substr(1);
//     });

//     // the client disconnected/closed their browser window
//     socket.on('disconnect', function(){
//         // Leave the room!
//     });
// });

app.get('/checkRoom/:roomName.json', function(request, response){
	console.log('- checkroom request', request.method.underline, request.url.blue);
	var roomName = request.params.roomName;
	var isNotNewRoom = false;

	var q = conn.query("SELECT * FROM messages WHERE room='" + roomName + "'");
	q.on('row', function(row){
		isNotNewRoom = true;
	}).on('error', function(error){
		console.log("check: db error checking room");
	});
	q.on('end', function(){
		response.send(isNotNewRoom);
	}).on('error', function(error){
		console.log("check: problems sending response to client");
	});

});

app.post('/:roomName/messages', function(request, response){
	console.log('- chatroom message request:', request.method.underline, request.url.blue);

	var roomName = request.params.roomName;	//'ABC123'
	var nickName = request.body.nickname; //'Username'
	var message = request.body.message;	//'Message'
	
	var sql = 'INSERT INTO messages (room, nickname, body, time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)';

	var query = conn.query(sql, [roomName, nickName, message]);

	response.redirect('/' + request.params.roomName);
});

app.get('/:roomName/messages.json', function(request, response){
	console.log('- chatroom message request:', request.method.underline, request.url.blue);

	var roomName = request.params.roomName;	//'ABC123'
	var nickname = request.body.nickname; //'Username'
	var message = request.body.message;	//'Message'

	var q = conn.query("SELECT * FROM messages WHERE room='"+roomName+"'");
	var messages = [];
	q.on('row', function(row){
		var message = {};
		message['id'] = row.id;
		message['room'] = row.room;
		message['nickname'] = row.nickname;
		message['body'] = row.body;
		message['time'] = row.time;
		messages.push(message);	
	}).on('error', function(error){
		console.log("error loading messages");
	});
	q.on('end', function(){
	    response.json(messages);
	}).on('error', console.error);
});

app.post('/:roomName/:nickName', function(request,response){
	console.log('- chatroom request:', request.method.underline, request.url.blue);
	var rname = request.params.roomName; //'ABC123'
	var nname = request.params.nickName;
	response.render('room.html', {roomName: rname, nickName: nname});
});

app.get('/:roomName', function(request,response){
	console.log('- chatroom request:', request.method.underline, request.url.blue);
	var name = request.params.roomName; //'ABC123'
	response.render('room.html', {roomName: name});
});

app.get('/', function(request, response){
	console.log('- index page request:', request.method.underline, request.url.blue);
	response.render('index.html');
})

app.get('*', function(request, response){
	console.log('- default page request:', request.method.underline, request.url.blue);
})