var templates = {};

function initTemplates(){
	templates.users = doT.template(document.getElementById('template_users').innerHTML);
	templates.posts = doT.template(document.getElementById('template_posts').innerHTML);
}

function hashChange(){
	var data = location.hash.split('/')[1];
	var div = document.getElementById('content');
	var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var rows = JSON.parse(xhr.responseText);
			div.innerHTML = templates[data](rows);
		}
	}

	xhr.open("GET", '/api/' + data);
	xhr.send(null);
}

function deletePost(id){
	var xhr = new XMLHttpRequest();
	
	if(confirm("Are you sure you want to delete this post?")){
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				document.getElementById('post_' + id).innerHTML = '';
			}
		}

		xhr.open("GET", '/api/delete?id=' + id);
		xhr.send(null);
	}
}

function banUser(id, user){
	var xhr = new XMLHttpRequest();
	var ban = document.getElementById('ban_' + id).innerHTML;

	if(confirm((ban == 'x') ? "Are you sure you want to ban " + user + "?" : "Are you sure you want to unban " + user + "?")){
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(ban == 'x')
					document.getElementById('ban_' + id).innerHTML = 'un';
				else
					document.getElementById('ban_' + id).innerHTML = 'x';
			}
		}
	}

	xhr.open("GET", (ban == 'x') ? '/api/ban?id=' + id : '/api/unban?id=' + id);
	xhr.send(null);
}

function muteUser(id, user){
	var xhr = new XMLHttpRequest();
	var mute = document.getElementById('mute_' + id).innerHTML;

	if(confirm((mute == 'x') ? "Are you sure you want to mute " + user + "?" : "Are you sure you want to unmute " + user + "?")){
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(mute == 'x')
					document.getElementById('mute_' + id).innerHTML = 'un';
				else
					document.getElementById('mute_' + id).innerHTML = 'x';
			}
		}
	}

	xhr.open("GET", (mute == 'x') ? '/api/mute?id=' + id : '/api/unmute?id=' + id);
	xhr.send(null);
}

window.addEventListener('load', hashChange);
window.addEventListener('hashchange', hashChange);
