// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const inputElement = document.querySelector(".search-box");

// App data
const weather = {};

// API key
const key = "906c0adb77e48bd9ebd68cc1378c3a13";

// check if browser supports geulocation, if it does not then show error message
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// get the user location
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

// error message if there is a problem with the geolocation service
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// to convert kelvin to C or F
const KELVIN = 273;

weather.temperature = {
  unit: "celsius",
};

// get the current weather from the provider
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}

// display the weather in a new location
inputElement.addEventListener("keypress", newLocationResults);

function newLocationResults(evt) {
  if (evt.keyCode == 13) {
    newResults(inputElement.value);
  }
}
function newResults(cityName) {
  let newApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;

  fetch(newApi)
    .then(function (response) {
      let newData = response.json();
      return newData;
    })
    .then(function (newData) {
      weather.temperature.value = Math.floor(newData.main.temp - KELVIN);
      weather.description = newData.weather[0].description;
      weather.iconId = newData.weather[0].icon;
      weather.city = newData.name;
      weather.country = newData.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}

// display weather in the browser
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

// change C to F if you click on the temperature
tempElement.addEventListener("click", function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
