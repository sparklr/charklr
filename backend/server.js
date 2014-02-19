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

	if(requesturi.pathname == '/api/users'){
		database.query("SELECT id, username, displayname, email FROM users", function(err, rows){
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

	console.log("requesting: " + requesturi.pathname);

	res.write(index);
	res.end();
}).listen(1337, '127.0.0.1');

function handleRequests(request, response){
	var requesturi = url.parse(request.url, true);
	var sessionid;

	console.log("requesturi : " + requesturi.pathname);

	if(request.headers['cookie']){
		var d = request.headers['cookie'].match(/D\=([^\s|^\;]+)\;?/);
		sessionid = d ? d[1] : '';
	}

	if(!request.headers['x-scheme'] && requesturi.pathname.indexOf('/rb') !== -1){
		var s = requesturi.pathname.split('/');
		console.log("egdfsg");
		process.send('R:' + s[2]);
		response.end();
	}

	/*
	if(requesturi.pathname.indexOf('/api') !== -1 || requesturi.pathname.indexOf('/beacon') !== -1){
		Api.run(request, response, requesturi, sessionid);
	}
	else{
		if(sessionid != null && sessionid != ''){
			var s = sessionid.split(',');

			User.verifyAuth(s[0], s[1], function(success, userobj){
				if(success)
					Frontend.run(userobj, request, response, sessionid);
				else
					Frontend.showExternalPage(request, response);
			});
		}
		else{
			Frontend.showExternalPage(request, response);
		}
	}
	*/
}

console.log('Server running at http://127.0.0.1:1337/');

