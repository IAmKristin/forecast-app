let now = new Date();
let currentDate = document.querySelector("#todayDate");
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[now.getDay()];
let hour = now.getHours();
let minute = now.getMinutes();
if (minute < 10) {
    minute = `0${minute}`;
}
currentDate.innerHTML = `${day}, ${hour}:${minute}`;

function formatDay (timestamp) {
    let date = new Date(timestamp*1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    return days[day]; 
}

function displayForecast (response){
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`; 
    forecast.forEach(function(forecastDay, index) {
    if (index < 5) {
    forecastHTML = forecastHTML + `
        <div class="col">
            <p class="forecast-day">${formatDay(forecastDay.dt)}</p>
            <p class="temperatureWeekDay">${Math.round(forecastDay.temp.min)}°/<span class="afternoon">${Math.round(forecastDay.temp.max)}°</span>C</p>
            <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt=""width=70 id="forecastIcon">
        </div>
    `;
    }
    })
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML= forecastHTML;   
}

function getForecast(coordinates){
    let apiKey = "49b631c45785fe73d2a88477803dea22";
    let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrlForecast).then(displayForecast);
}



function changeTemperature(response) {
    let temperature = Math.round(response.data.main.temp);
    let newTemp = document.querySelector("#todayTemp");
    newTemp.innerHTML = `${temperature}`;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);


    let myCity = document.querySelector("h1");
    myCity.innerHTML = response.data.name;

    celsiusTemperature = response.data.main.temp;

    getForecast(response.data.coord)
}


function changeCity(city) {
    let h1 = document.querySelector("h1");
    h1.innerHTML = `${city}`;
    let apiKey = "5c3d2fda6a18adb67a425d5e7facf36f";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(`${apiUrl}`).then(changeTemperature);
}

function handleCity(e){
    e.preventDefault()
    let searchInput = document.querySelector("#cityName");
    changeCity(searchInput.value)
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleCity);

changeCity("Berlin")



function seeMyPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let apiKey = "5c3d2fda6a18adb67a425d5e7facf36f";
    let weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(`${weatherApi}`).then(changeTemperature);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(seeMyPosition);
}

let buttonCurrent = document.querySelector("#currentLocation");
buttonCurrent.addEventListener("click", getCurrentPosition);