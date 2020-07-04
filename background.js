var ports = [];

console.log("running background.js");

update();

var sound = new Audio();
sound.src = "Notification.mp3";

// update everytime the storage changes (i.e. everytime a new deadline to count down to is set)
chrome.storage.onChanged.addListener(update);
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.msg == 'call update') {
		update();
	}
});

function update() {
	console.log("something in storage changed");

	var stored_datetime;
	chrome.storage.sync.get(["datetime", "extra_alert"], function(result) {
		console.log("result: ", result);
		var stored_datetime = result.datetime;

		// You can then set upn the proper popup for the next click or even switch to it
		console.log("stored data: ", stored_datetime);
		if (typeof stored_datetime !== 'undefined') {
			// chrome.runtime.sendMessage({datetime_data: stored_datetime});
			chrome.browserAction.setPopup({popup: "popup_countingdown.html"});
			console.log("switching to popup progress.html");

			var deadline = new Date(stored_datetime);
	        var now = new Date().getTime();
	        var t = deadline - now;

			chrome.alarms.create("countdown timer", {delayInMinutes: t / 60000});

			// set 10 seconds remaining notification
			if (result.extra_alert === "yes" && t > (10 * 1000)) {
				console.log("10 sec warming created");
				chrome.alarms.create("extra alert", {delayInMinutes: (t - (10 * 1000)) / 60000});
			}

		} else {
			chrome.browserAction.setPopup({popup: "popup_startpage.html"});
		}

	});
}

chrome.alarms.onAlarm.addListener(countdown_notification);

function countdown_notification(alarm) {

	chrome.storage.sync.remove("datetime");

	chrome.storage.sync.get(["alert_type", "sound"], function(items) {
		console.log("items: ", items);

		if (items["sound"] == "on") {
			sound.play();
		}

		if (alarm.name === "extra alert") {
			console.log("display 10 sec notificaiotn");
			// CHROME NOTIFICATION
			var options = {
			    type:"basic",
			    title: "Timer",
			    message: "10 seconds remaining (Click to dismiss)",
			    iconUrl: "images/colab_reconnect32.png"
			  }
			  chrome.notifications.create("Countdown almost ending notification", options, function() {});
			  chrome.notifications.onClicked.addListener(function() {
			    chrome.notifications.clear("Countdown almost ending notification", function() {});
			  });
		}

		if (alarm.name === "countdown timer") {
			if (items["alert_type"] == "alert") {
				// ALERT BOX NOTIFICATION
				alert("Countdown complete! \n" + (new Date()).toLocaleString() + " has arrived!" );
			} else { // otherwise, show notification that countdown expired
				// CHROME NOTIFICATION
				var options = {
				    type:"basic",
				    title: "Timer",
				    message: "Timer ended (Click to dismiss)",
				    iconUrl: "images/colab_reconnect32.png"
				  }
				  chrome.notifications.create("Countdown ended notification", options, function() {});
				  chrome.notifications.onClicked.addListener(function() {
				    chrome.notifications.clear("Countdown ended notification", function() {});
				  });
			}

		}

	});


}
