const apiKey = '0931440815af90642e50c2441d6de6cd'

async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }
        const data = await response.json();
        console.log(data);
        // console.log(data.main.temp);
        // console.log(data.name);
        // console.log(data.wind.speed);
        // console.log(data.main.humidity);
        // console.log(data.visibility);
        updateWeatherUI(data);
    } catch (error) {
        console.error(error);
    }
}

const cityElement = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");

const descriptionText = document.querySelector(".description-text");
const date = document.querySelector(".date");
const descriptionIcon = document.querySelector(".description i");

// fetchWeatherData();

function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${data.visibility / 1000} km`;
    descriptionText.textContent = data.weather[0].description;

    const currentDate = new Date();
    date.textContent = currentDate.toDateString();
    const weatherIconName = getWeatherIconName(data.weather[0].main);
    descriptionIcon.innerHTML = `<i class="material-icons">${weatherIconName}</i>`;

    if (descriptionText.textContent == 'haze') {
        document.body.style.backgroundImage = "url('haze.jpg')";
        
    }else if (descriptionText.textContent == 'overcast clouds') {
        document.body.style.backgroundImage = "url('overcast cloud.jpg')";
        
    }else if (descriptionText.textContent == 'few clousd') {
        document.body.style.backgroundImage = "url('clouds2.jpg')";
        
    }else if (descriptionText.textContent == 'scattered clouds') {
        document.body.style.backgroundImage = "url('clouds.jpg')";
        
    }else if (descriptionText.textContent == 'broken clouds') {
        document.body.style.backgroundImage = "url('broken cloud.jpg')";
        
    }else if (descriptionText.textContent == 'fog') {
        document.body.style.backgroundImage = "url('fog.jpg')";
        
    }else if (descriptionText.textContent == 'snow') {
        document.body.style.backgroundImage = "url('snow3.jpg')";
        
    }else if (descriptionText.textContent == 'heavy snow') {
        document.body.style.backgroundImage = "url('snow.jpg')";
        
    }else if (descriptionText.textContent == 'rain and snow') {
        document.body.style.backgroundImage = "url('snow2.jpg')";
        
    }else if (descriptionText.textContent == 'rain') {
        document.body.style.backgroundImage = "url('rain.jpg')";
        
    }else if (descriptionText.textContent == 'very heavy rain') {
        document.body.style.backgroundImage = "url('rain2.jpg')";
        
    }else if (descriptionText.textContent == 'clear sky') {
        document.body.style.backgroundImage = "url('clear.jpg')";
        
    }else if (descriptionText.textContent == 'thunderstorm') {
        document.body.style.backgroundImage = "url('thunderstrom3.jpg.jpg')";
        
    }else if (descriptionText.textContent == 'heavy thunderstorm') {
        document.body.style.backgroundImage = "url('thunderstorm.jpg')";
        
    }else if (descriptionText.textContent == 'thunderstorm with heavy rain') {
        document.body.style.backgroundImage = "url('thunderstrom2.jpg.jpg')";
        
    }else if (descriptionText.textContent == 'thunderstorm with rain') {
        document.body.style.backgroundImage = "url('thunderstrom4.jpg.jpg')";
        
    }else if (descriptionText.textContent == 'light rain') {
        document.body.style.backgroundImage = "url('rain.jpg')";
        
    }
}

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".city-input");

formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = inputElement.value;
    if (city !== "") {
        fetchWeatherData(city);
        inputElement.value = "";
    }
});

function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };

    return iconMap[weatherCondition] || "help";
}