// content
// @name Colab Auto Reconnect
// @version 1.1.0
// @description Automatically reconnects to Colab's ongoing session without manually clicking.
// @author Zoheb Abai
// @license MIT

//Define MutationObserver to automatically reconnect
window.onload=function(){
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

let interval = setInterval(function(){
    let ok = document.getElementById('ok');
    if(typeof(ok) != 'undefined' && ok != null)
	{
		console.log('reconnecting...');
	 	ok.click();
	}
}, 60000); //checks every minute

var observer = new MutationObserver(function(mutations, observer){});

observer.observe(document.body, {
  subtree: true,
  attributes: true
});
}
