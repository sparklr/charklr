/* Charklr
 * Server
 */

var url = require('url');
var http = require('http');
var fs = require('fs');

var config = require('./config');
var database = require('./database');
var index = fs.readFileSync('../index.html').toString();

index = index.replace(/\{STATIC\}/g, config.staticHost);

database.init();
 
http.createServer(function (req, res) {
	var requesturi = url.parse(req.url, true);
	var sessionid;
	res.writeHead(200, {'Content-Type': 'text/html'});

	if (req.headers["cookie"]) {
		var d = req.headers["cookie"].match(/D\=([^\s|^\;]+)\;?/);
		sessionid = d ? d[1] : "";
	}

	if(!sessionid){
		res.write("NOPE");
		res.end();
		return;
	}

	var s = sessionid.split(",");

	database.query("SELECT * from users WHERE id='" + parseInt(s[0]) + "'", function(err, rows){
		if(rows[0].authkey != s[1] || rows[0].rank < 50){
			res.write("NOPE");
			res.end();
			return;
		}

		switch(requesturi.pathname){
			case '/api/users' :
				database.query("SELECT id, username, displayname, email, rank, mutetime FROM users", function(err, rows){
					res.write(JSON.stringify(rows));
					res.end();
				});
				return;
			case '/api/posts' :
				database.query("SELECT id, `from`, message FROM timeline ORDER BY id DESC LIMIT 100", function(err, rows){
					res.write(JSON.stringify(rows));
					res.end();
				});
				return;	
			case '/api/delete' :
				database.query("DELETE FROM timeline WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
					res.end();
				});
				return;
			case '/api/ban' :
				database.query("UPDATE users SET rank = '-1' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
					res.end();
				});
				return;
			case '/api/unban' :
				database.query("UPDATE users SET rank = '0' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
					res.end();
				});
				return;
			case '/api/mute' :
				database.query("UPDATE users SET mutetime = '" + (new Date).getTime() / 1000 + "' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
					res.end();
				});
				return;
			case '/api/unmute' :
				database.query("UPDATE users SET mutetime = '0' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
					res.end();
				});
				return;
		}

		res.write(index);
		res.end();
	});
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

