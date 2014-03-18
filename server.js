var express = require('express'),
	app = express(),
	colors = require('colors'),
	anyDB = require('any-db'),
	engines = require('consolidate');

var conn = anyDB.createConnection('sqlite3://chatroom.db');

app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');

app.use(express.bodyParser());
app.use('/javascripts', express.static(__dirname + '/javascripts'));
app.use('/stylesheets', express.static(__dirname + '/stylesheets'));

app.listen(8080, function(){
	console.log('- SERVER LISTENING ON PORT 8080'.grey);
});

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