function hashChange(){
	var data = location.hash.split('/')[1];
	var div = document.getElementById('content');
	var xhr = new XMLHttpRequest();
	var html;
	var tr;
	
	if(data == 'users')
		html = '<table><thead><tr><th>ID</th><th>Username</th><th>Displayname</th><th>Email</th><th>Mute</th><th>Ban</th></tr>';
	else if(data == 'posts')
		html = '<table><thead><tr><th>ID</th><th>User</th><th>Post</th><th>Delete</th></tr>';

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var rows = JSON.parse(xhr.responseText);

			for(var i = 0; i < rows.length; i++){
				var r = rows[i];
				var td = '</td><td>';
				if(data == 'users')
					tr = r.username + td + r.displayname + td + r.email + td + 'x' + td;
				else if(data == 'posts')
					tr = r.from + td + r.message + td;

				html += '<tr><td>' + r.id + td + tr + 'x</td></tr>';
			}
			html += '</table>';

			div.innerHTML = html;
		}
	}

	xhr.open("GET", '/api/' + data);
	xhr.send(null);
}

window.addEventListener('load', hashChange);
window.addEventListener('hashchange', hashChange);
