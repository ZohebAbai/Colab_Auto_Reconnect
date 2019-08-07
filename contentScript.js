// contentScript
// @name Colab Auto Reconnect
// @version 1.0
// @description Automatically reconnects to Colab's ongoing session without clicking button.
// @author Zoheb Abai
// @license MIT

//Define MutationObserver to automatically reconnect
window.onload=function(){
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var connect = document.getElementById('connect')
var ok = document.getElementById('ok')

function check(){
	if (typeof(connect) != 'undefined' && connect != null)
	{
		if(connect.textContent.includes("Reconnect") || connect.textContent.includes("RECONNECT")){
			console.log('reconnecting...')
			connect.click()
		}
	}
	if(typeof(ok) != 'undefined' && ok != null)
	{
		console.log('reconnecting...')
	 	ok.click()
	}
}


var observer = new MutationObserver(function(mutations, observer) {
	check()
});
observer.observe(document.body, {
  subtree: true,
  attributes: true
});
}
