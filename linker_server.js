const https = require('https');
const API_URL = "api.twicecast.ovh";
const server = require('http').createServer();
const io = require('socket.io')(server);

const config = require('./config');

var colors = require('colors');

var clients = [];

io.on('connection', function(client) {
	console.log("New connection !");
	
    client.uid = -1;
	
	if (!(client in clients)) {
		clients.push(client);
	}
	
	client.on('Auth', function(content) {
		client.uid = content.uid;
	});
	
	client.on('message', function(content) {
		var i = 0;
		while (i < clients.length) {
			if (clients[i].uid == client.uid)
				clients[i].emit('message', content);
			i++;
		}
	});
	
	client.on('disconnect', function(){
		var id = clients.indexOf(client);
		if (id >= 0)
			clients.splice(id, 1);
	});
	
});

var port = config.SERVER_PORT;

if (process.argv.length > 2) {
	try {
		port = parseInt(process.argv[2]);
	} catch (e) {
		
	}
}

console.log('Server listening on ' + port + ' !');

server.listen(port);
