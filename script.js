const apiKey = '0931440815af90642e50c2441d6de6cd';

const bgLayer1 = document.querySelector('.bg-layer-1');
const bgLayer2 = document.querySelector('.bg-layer-2');
let activeBgLayer = bgLayer1;
let inactiveBgLayer = bgLayer2;
let audioContext = null;
let activeSoundNodes = [];

function ensureAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function stopCurrentSound() {
    activeSoundNodes.forEach(node => {
        if (node && typeof node.stop === 'function') {
            try {
                node.stop(0);
            } catch (_) {}
        }
        if (node && typeof node.disconnect === 'function') {
            node.disconnect();
        }
    });
    activeSoundNodes = [];
}

function playTone(frequency, duration, type = 'sine', volume = 0.12) {
    ensureAudioContext();
    const gain = audioContext.createGain();
    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.gain.value = volume;
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    activeSoundNodes = [oscillator, gain];
}

function playRainSound() {
    ensureAudioContext();
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
        output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    const gain = audioContext.createGain();
    gain.gain.value = 0.12;

    noise.connect(filter).connect(gain).connect(audioContext.destination);
    noise.start();
    noise.stop(audioContext.currentTime + 2.2);
    activeSoundNodes = [noise, filter, gain];
}

function playWindSound() {
    ensureAudioContext();
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
        output[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;

    const gain = audioContext.createGain();
    gain.gain.value = 0.08;

    noise.connect(filter).connect(gain).connect(audioContext.destination);
    noise.start();
    noise.stop(audioContext.currentTime + 2.5);
    activeSoundNodes = [noise, filter, gain];
}

function playThunderSound() {
    ensureAudioContext();
    playTone(60, 0.24, 'triangle', 0.14);
    setTimeout(() => playTone(140, 0.15, 'sawtooth', 0.08), 180);
}

function playWeatherSound(description) {
    stopCurrentSound();
    if (!description) return;
    const soundDesc = description.toLowerCase();
    if (soundDesc.includes('rain') || soundDesc.includes('drizzle')) {
        playRainSound();
    } else if (soundDesc.includes('thunderstorm')) {
        playThunderSound();
    } else if (soundDesc.includes('snow')) {
        playTone(320, 0.9, 'triangle', 0.08);
    } else if (soundDesc.includes('cloud')) {
        playWindSound();
    } else if (soundDesc.includes('haze') || soundDesc.includes('fog') || soundDesc.includes('mist')) {
        playTone(460, 1.2, 'sine', 0.08);
    } else {
        playTone(660, 0.7, 'sine', 0.12);
    }
}

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
        fetchForecastData(city);
    } catch (error) {
        console.error(error);
        alert('Could not fetch weather data. Please check the city name and try again.');
    }
}

function setBackgroundImage(url) {
    inactiveBgLayer.style.backgroundImage = `url('${url}')`;
    inactiveBgLayer.style.opacity = '1';
    activeBgLayer.style.opacity = '0';
    [activeBgLayer, inactiveBgLayer] = [inactiveBgLayer, activeBgLayer];
}

function toTitleCase(text) {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getBackgroundImage(description) {
    const imageMap = {
        haze: 'haze.jpg',
        'overcast clouds': 'overcast cloud.jpg',
        'few clouds': 'clouds2.jpg',
        'scattered clouds': 'clouds.jpg',
        'broken clouds': 'broken cloud.jpg',
        fog: 'fog.jpg',
        snow: 'snow3.jpg',
        'heavy snow': 'snow.jpg',
        'rain and snow': 'snow2.jpg',
        rain: 'rain.jpg',
        'very heavy rain': 'rain2.jpg',
        'clear sky': 'clear.jpg',
        thunderstorm: 'thunderstrom3.jpg.jpg',
        'heavy thunderstorm': 'thunderstorm.jpg',
        'thunderstorm with heavy rain': 'thunderstrom2.jpg.jpg',
        'thunderstorm with rain': 'thunderstrom4.jpg.jpg',
        'light rain': 'rain.jpg'
    };

    return imageMap[description] || '240_F_681725529_8BCKQWToEgRajmFp9qG1sWqAQivie05X.jpg';
}

async function fetchForecastData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
            throw new Error('Unable to fetch forecast data');
        }
        const forecastData = await response.json();
        updateForecastUI(forecastData);
    } catch (error) {
        console.error(error);
    }
}

function updateForecastUI(data) {
    const forecastCards = Array.from(document.querySelectorAll('.forecast-card'));
    let filtered = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    if (filtered.length < 3) {
        filtered = [data.list[0], data.list[8], data.list[16]].filter(Boolean);
    }
    forecastCards.forEach((card, index) => {
        const item = filtered[index];
        if (!item) return;
        const forecastDay = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short'
        });
        card.querySelector('.forecast-day').textContent = forecastDay;
        card.querySelector('.forecast-desc').textContent = toTitleCase(item.weather[0].description);
        card.querySelector('.forecast-icon').textContent = getWeatherIconName(item.weather[0].main);
        card.querySelector('.forecast-temp').textContent = `${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°`;
    });
}

const cityElement = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");

const descriptionText = document.querySelector(".description-text");
const dateElement = document.querySelector(".date");
const descriptionIcon = document.querySelector(".description i");

// fetchWeatherData();

function updateWeatherUI(data) {
    cityElement.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    const weatherDescription = data.weather[0].description.toLowerCase();
    descriptionText.textContent = toTitleCase(weatherDescription);
    dateElement.textContent = new Date().toDateString();
    descriptionIcon.textContent = getWeatherIconName(data.weather[0].main);

    setBackgroundImage(getBackgroundImage(weatherDescription));
    playWeatherSound(weatherDescription);
}

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".city-input");

formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = inputElement.value.trim();
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