const socket = io();

// DOM Elements:
const $msgForm = document.getElementById("msg-form");
const $msgFormInput = document.getElementById("input_text");
const $msgFormBtn = $msgForm.querySelector("button");
const $geoLocationBtn = document.getElementById("send-location");
const $messages = document.getElementById("messages");
// Templates:
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;

socket.on("message", (msg) => {
  const outputHTML = Mustache.render(messageTemplate, {
    message: msg.text,
    createdAt: moment(msg.createdAt).format("HH:mm:ss"),
  });
  $messages.insertAdjacentHTML("beforeend", outputHTML);
});

socket.on("locationMessage", (msg) => {
  const outputHTML = Mustache.render(locationTemplate, {
    url: msg.url,
    createdAt: moment(msg.createdAt).format("HH:mm:ss"),
  });
  $messages.insertAdjacentHTML("beforeend", outputHTML);
});

$msgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  $msgFormBtn.setAttribute("disabled", "disabled");

  if ($msgFormInput.value.length) {
    socket.emit("sendMsg", $msgFormInput.value, () => {
      $msgFormBtn.removeAttribute("disabled");
      $msgFormInput.value = "";
      $msgFormInput.focus();
    });
  } else {
    alert("Type your message first!!");
    $msgFormBtn.removeAttribute("disabled");
  }
});

$geoLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser!");
  }
  $geoLocationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setTimeout(() => {
      socket.emit("sendLocation", location, () => {
        $geoLocationBtn.removeAttribute("disabled");
        console.log("Location shared!");
      });
    }, 200);
  });
});
