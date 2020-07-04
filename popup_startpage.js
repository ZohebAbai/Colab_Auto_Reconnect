console.log("running popup.js");

// Add listener after whole HTML document has been loaded
document.addEventListener('DOMContentLoaded', function() {
	console.log("DOMcontentedLoaded");
	document.getElementById("countdown_btn").addEventListener("click", validateInputs);
	document.getElementById("switch_mode").addEventListener("click", switchMode);
});

// Add listenter after entire page (HTML, CSS stylesheets, etc.) has been loaded
// window.addEventListener("load", function() {
//   console.log("loaded");
//   document.getElementById("countdown_btn").addEventListener("click", startTimer);
// });

function validateInputs() {
	console.log("validating inputs");
	if (document.getElementById("event_countdown_mode").style.display === "block") { // if in countdown mode
		var datetime_input = document.getElementById("datetime").value;
		if (datetime_input && !isNaN(new Date(datetime_input))) { // if value exists
			var deadline = new Date(datetime_input);
			startTimer(deadline);
		} else {
			document.getElementById("error_msg").innerHTML = "Please enter a valid date and time";
		}
	} else { // otherwise, we are in timer mode
	  	var time_value_input = document.getElementById("time_value").value;
	  	var deadline = new Date();
		if (time_value_input.length != 0) { // if value exists
			if (document.getElementById("time_measure").value === 'minutes') {
				var time_in_ms = (time_value_input) * 60 * 1000;
				deadline.setTime(deadline.getTime() + time_in_ms);
			} else { // else, time_measure === 'hours'
				var time_in_ms = (time_value_input) * 60 * 60 * 1000;
				deadline.setTime(deadline.getTime() + time_in_ms);
			}
			startTimer(deadline);
		} else {
			document.getElementById("error_msg").innerHTML = "Please enter a valid date and time";
		}
	}
}

// The showTimer function also must go in a .js file
function startTimer(deadline) {
	console.log("start timer");

	// Info to calculate is input date/time is valid (is not a past date/time)
	var now = new Date().getTime();
	var t = deadline - now;

	if (t > 0) {
		chrome.storage.sync.set({datetime: deadline.toString()});

		var x = setInterval(function() {
			var now = new Date().getTime(); 	// needed for dynamically showing countdown
			var t = deadline - now; 			// ""
			var days = Math.floor(t / (1000 * 60 * 60 * 24));
			var hours = Math.floor((t % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
			var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((t % (1000 * 60)) / 1000);

			document.getElementById("countdown_display").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
			document.getElementById("countdown_confirmation").innerHTML = "Countdown started";

			document.getElementById("countdown_btn").disabled = true;
			document.getElementById("datetime").disabled = true;
			document.getElementById("time_value").disabled = true;
			document.getElementById("time_measure").disabled = true;
			document.getElementById("switch_mode").disabled = true;

			if (t < 0) {
				clearInterval(x);
				document.getElementById("countdown_display").innerHTML = "EXPIRED";
				chrome.storage.sync.remove("datetime");
			}
		}, 1000);
	} else {
		document.getElementById("error_msg").innerHTML = "Invalid date and time:<br>Input must be a future date and time";
	}
}


// Source: https://stackoverflow.com/questions/35501515/switching-between-two-div-elements-using-javascript
function switchMode() {
	document.getElementById("error_msg").innerHTML = "";

	var event_countdown_mode = document.getElementById("event_countdown_mode");
	var timer_mode = document.getElementById("timer_mode");

	event_countdown_mode.style.display = (
		event_countdown_mode.style.display == "none" ? "block" : "none");
	timer_mode.style.display = (
		timer_mode.style.display == "none" ? "block" : "none");
}
