/* Charklr
 * idk yet
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
	res.writeHead(200, {'Content-Type': 'text/html'});
	var sessionid;

	if (req.headers["cookie"]) {
		var d = req.headers["cookie"].match(/D\=([^\s|^\;]+)\;?/);
		sessionid = d ? d[1] : "";
	}

	var s = sessionid.split(",");

	database.query("SELECT * from users WHERE id='" + parseInt(s[0]) + "'", function(err, rows){
		if(rows[0].authkey != s[1] || rows[0].rank < 50){
			res.write("NOPE");
			res.end();
			return;
		}

		if(requesturi.pathname == '/api/users'){
			database.query("SELECT id, username, displayname, email, rank, mutetime FROM users", function(err, rows){
				res.write(JSON.stringify(rows));
				res.end();
			});
			return;
		}
		else if(requesturi.pathname == '/api/posts'){
			database.query("SELECT id, `from`, message FROM timeline ORDER BY id DESC LIMIT 100", function(err, rows){
				res.write(JSON.stringify(rows));
				res.end();
			});
			return;	
		}
		else if(requesturi.pathname == '/api/delete'){
			database.query("DELETE FROM timeline WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
				res.end(200);
			});
			return;
		}
		else if(requesturi.pathname == '/api/ban'){
			database.query("UPDATE users SET rank = '-1' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
				res.end(200);
			});
			return;
		}
		else if(requesturi.pathname == '/api/unban'){
			database.query("UPDATE users SET rank = '0' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
				res.end(200);
			});
			return;
		}
		else if(requesturi.pathname == '/api/mute'){
			console.log((new Date).getTime());
			database.query("UPDATE users SET mutetime = '" + (new Date).getTime() / 1000 + "' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
				res.end(200);
			});
			return;
		}
		else if(requesturi.pathname == '/api/unmute'){
			database.query("UPDATE users SET mutetime = '0' WHERE id = '" + parseInt(requesturi.query.id) + "'", function(err, rows){
				res.end(200);
			});
			return;
		}

		res.write(index);
		res.end();
	});
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

