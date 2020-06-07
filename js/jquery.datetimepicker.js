<script type="text/javascript">
// これを再生
function playthis(key){
	media.pause();
	media.src = dir + list[key];
	media.play();
	for(var i=1;i<length;i++) document.getElementById("list"+i).innerHTML = document.getElementById("list"+i).innerHTML.replace(now,"");
	document.getElementById("list"+key).innerHTML += now;
}

// 次を再生
function playnext(objsrc) {
	var objsrc = decodeURI(objsrc);
	objsrc = objsrc.replace("http://"+location.hostname,"");
	objsrc = objsrc.replace("https://"+location.hostname,"");
	for (var i=1;i<length;i++) {
		var listsrc = dir + list[i];
		if(objsrc===listsrc){
			if(length==i+1){
				// 再生終了
				document.getElementById("list"+i).innerHTML = document.getElementById("list"+i).innerHTML.replace(now,"");
				// 先頭を再生
				// playthis(1);
			}else{
				playthis(i+1);
			}
			break;
		}
	}
}

// クッキーの発行
function setCookie(name, value, domain, path, expires, secure) {
	if (!name) return;
	domain = location.hostname;
	path = "/";
	expires = 30;

	var str = name + "=" + escape(value);
	if (domain) {
		if (domain == 1) domain = location.hostname.replace(/^[^\.]*/, "");
		str += "; domain=" + domain;
	}
	if (path) {
		if (path == 1) path = location.pathname;
		str += "; path=" + path;
	}
	if (expires) {
		var nowtime = new Date().getTime();
		expires = new Date(nowtime + (60 * 60 * 24 * 1000 * expires));
		expires = expires.toGMTString();
		str += "; expires=" + expires;
	}
	if (secure && location.protocol == "https:") {
		str += "; secure";
	}

	document.cookie = str;
}
</script>