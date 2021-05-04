function hideSideMenu(){
	document.getElementById('side-menu-container').style.display='none';
}

function showSideMenu(){
	document.getElementById('side-menu-container').style.display='block';
}

function hideMenuButton(){
	document.getElementById('side-menu-link').style.visibility='hidden';
}

function showMenuButton(){
	document.getElementById('side-menu-link').style.visibility='visible';
}

//debug method	
function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    alert(out);
}

//method for printing error messages
function displayErrorMessage(msg){
	alert(msg);
}

