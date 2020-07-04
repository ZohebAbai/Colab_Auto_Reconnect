console.log("running options.js");

var sound = new Audio();
sound.src = "Notification.mp3";

// Add listener after whole HTML document has been loaded
document.addEventListener('DOMContentLoaded', function() {
	console.log("DOMcontentedLoaded");
	displaySettings();
	document.getElementById("save_btn").addEventListener("click", saveSettings);
	document.querySelector('input[name="sound"][value="on"]').addEventListener("click", function() {
		sound.play();
	});
	document.querySelector('input[name="alert_type"][value="alert"]').addEventListener("click", function() {
		alert("Pop-up alert box example:\nCountdown complete! \n" + (new Date()).toLocaleString() + " has arrived!" );
	});
	document.querySelector('input[name="alert_type"][value="notification"]').addEventListener("click", function() {
		var options = {
		    type:"basic",
		    title: "Timer",
		    message: "Side notification example:\nTimer ended (Click to dismiss)",
		    iconUrl: "Images/colab_reconnect32.png"
		  }
		  chrome.notifications.create("Countdown ended notification", options, function() {});
		  chrome.notifications.onClicked.addListener(function() {
		    chrome.notifications.clear("Countdown ended notification", function() {});
		  });
	});
});



function displaySettings() {
	// Use default values "alert" and "no"
	default_settings = {
		alert_type: "alert",
		extra_alert: "no",
		sound: "on"
	};
	chrome.storage.sync.get(default_settings, function(items) {
		if (items["alert_type"] == "alert") {
			document.querySelector('input[name="alert_type"][value="alert"]').checked = true;
		} else {
			document.querySelector('input[name="alert_type"][value="notification"]').checked = true;
		}

		if (items["extra_alert"] == "yes") {
			document.querySelector('input[name="extra_alert"][value="yes"]').checked = true;
		} else {
			document.querySelector('input[name="extra_alert"][value="no"]').checked = true;
		}

		if (items["sound"] == "on") {
			document.querySelector('input[name="sound"][value="on"]').checked = true;
		} else {
			document.querySelector('input[name="sound"][value="off"]').checked = true;
		}

	});
}


function saveSettings() {
	console.log("saving settings");
	var alert_type_value = document.querySelector('input[name="alert_type"]:checked').value;
	var extra_alert_value = document.querySelector('input[name="extra_alert"]:checked').value;
	console.log("alert type: ", alert_type_value);
	var sound_value = document.querySelector('input[name="sound"]:checked').value;

	chrome.storage.sync.set({
		alert_type : alert_type_value,
		extra_alert: extra_alert_value,
		sound: sound_value
	});
	document.getElementById("save_confirmation").innerHTML = "Settings saved";
}
