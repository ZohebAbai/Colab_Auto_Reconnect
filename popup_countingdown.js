console.log("running popup_progress.js");

update();

chrome.storage.onChanged.addListener(callback);

function callback(changes, type_of_storage) {
  console.log("something changed");
  update();
}

function update() {
  chrome.storage.sync.get(["datetime"], function(result) {
    var stored_data = result.datetime;
    if (typeof stored_data === 'undefined') {
      stored_data = null;
      console.log("none in storage");
    } else {
      console.log("data exists in storage");
      console.log(stored_data);
      var deadline = new Date(stored_data);
    
      var x = setInterval(function() {
          var now = new Date().getTime();
          var t = deadline - now;
          var days = Math.floor(t / (1000 * 60 * 60 * 24));
          var hours = Math.floor((t % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
          var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((t % (1000 * 60)) / 1000);
          document.getElementById("countdown_timer").innerHTML = "<b>" + days + "</b> days <br><b>" + hours + "</b> hours <br><b>" + minutes + "</b> minutes <br><b>" + seconds + "</b> seconds <br>";
          document.getElementById("today").innerHTML = "Current time: " + (new Date()).toLocaleString();
          document.getElementById("deadline").innerHTML = "Count down to: " + deadline.toLocaleString();
          if (t < 0) {
              clearInterval(x);
              document.getElementById("expired").innerHTML = "EXPIRED";
              chrome.storage.sync.remove("datetime");
          }
      }, 1000);
    }
  });
}



document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("reset").addEventListener("click", resetTimer);
  
});

function resetTimer() {
  console.log("clicked reset");
  chrome.storage.sync.remove("datetime");
  chrome.alarms.clearAll(function() {});
  // var backgroundpage = chrome.extension.getBackgroundPage();
  // backgroundpage.update();
  // chrome.browserAction.setPopup({popup: "popup.html"});
  // chrome.extension.sendMessage({msg: 'call update'});

  // document.getElementById("countdown_timer").innerHTML = "";
  // var elements = '<input id="datetime" type="datetime-local">'
  //   + '<button id="countdown">Start countdown</button>';
  // document.getElementById("countdown_timer").innerHTML = elements;
  document.getElementById("reset_confirmation").innerHTML = "Reset confirmed! <br>Refresh to start a new countdown.<br>";
  
}

