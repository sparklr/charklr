var templates = {};

function initTemplates(){
	templates.users = doT.template(document.getElementById('template_users').innerHTML);
	templates.posts = doT.template(document.getElementById('template_posts').innerHTML);
}

function hashChange(){
	var data = location.hash.split('/')[1];
	var div = document.getElementById('content');
	
	ajax('/api/' + data, function(xhr){
		var rows = JSON.parse(xhr);
		div.innerHTML = templates[data](rows);
	});
}

function deletePost(id){
	if(confirm("Are you sure you want to delete this post?")){
		ajax('/api/delete?id=' + id, function(){
			document.getElementById('post_' + id).innerHTML = '';
		});
	}
}

function banUser(id, user){
	var ban = document.getElementById('ban_' + id).innerHTML;

	if(confirm((ban == 'x') ? "Are you sure you want to ban " + user + "?" : "Are you sure you want to unban " + user + "?")){
		ajax((ban == 'x') ? '/api/ban?id=' + id : '/api/unban?id=' + id, function(){
			if(ban == 'x')
				document.getElementById('ban_' + id).innerHTML = 'un';
			else
				document.getElementById('ban_' + id).innerHTML = 'x';
		});
	}
}

function muteUser(id, user){
	var mute = document.getElementById('mute_' + id).innerHTML;

	if(confirm((mute == 'x') ? "Are you sure you want to mute " + user + "?" : "Are you sure you want to unmute " + user + "?")){
		ajax((mute == 'x') ? '/api/mute?id=' + id : '/api/unmute?id=' + id, function(){
			if(mute == 'x')
					document.getElementById('mute_' + id).innerHTML = 'un';
				else
					document.getElementById('mute_' + id).innerHTML = 'x';
		});
	}
}

function ajax(page, callback){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			callback(xhr.responseText);
		}
	}

	xhr.open("GET", page);
	xhr.send(null);
}

window.addEventListener('load', hashChange);
window.addEventListener('hashchange', hashChange);

