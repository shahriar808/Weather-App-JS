const apiKey = '23858ecd13cb46c58b5190326241410';  
const searchBtn = document.querySelector('button');  
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const forecastContainer = document.getElementById('forecast');

// Fetch weather data
const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p class="error">${error.message}</p>`;
  }
};

// Display basic weather data
const displayWeather = (data) => {
  const { location, current } = data;

  // Display current weather info
  weatherInfo.innerHTML = `
    <div class="weather-card">
      <div class="header">
        <h2>${location.name}, ${location.country}</h2>
        <p>${new Date().toLocaleString()}</p>
      </div>
      <div class="current-weather">
        <h2>Current Weather</h2>
        <p><strong>Temperature: </strong><span id="currentTemp">${current.temp_c}°C</span></p>
        <p><strong>Feels Like:</strong> <span id="feelsLike">${current.feelslike_c}°C</span></p>
        <p><strong>Condition: </strong><span id="currentCondition">${current.condition.text}</span></p>
        <div class="img-container">
          <img src="${current.condition.icon}" alt="${current.condition.text}">
        </div>
        <button id="moreInfoBtn">See More Info</button>
        <div id="moreInfo" style="display:none;" class="more-info">
          <div class="info-grid">
            <div class="info-row">
              <p><strong>Humidity:</strong> <span id="humidity">${current.humidity}%</span></p>
              <p><strong>Wind Speed:</strong> <span id="windSpeed">${current.wind_kph} km/h</span></p>
              <p><strong>Wind Direction:</strong> <span id="windDirection">${current.wind_dir}</span></p>
            </div>
            <div class="info-row">
              <p><strong>Visibility:</strong> <span id="visibility">${current.vis_km} km</span></p>
              <p><strong>Pressure:</strong> <span id="pressure">${current.pressure_mb} mb</span></p>
              <p><strong>UV Index:</strong> <span id="uvIndex">${current.uv}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // See More Info
  const moreInfoBtn = document.getElementById('moreInfoBtn');
  moreInfoBtn.addEventListener('click', () => {
    const moreInfoDiv = document.getElementById('moreInfo');
    if (moreInfoDiv.style.display === 'none') {
      moreInfoDiv.style.display = 'block';
      moreInfoBtn.textContent = 'See Less Info';  
    } else {
      moreInfoDiv.style.display = 'none';
      moreInfoBtn.textContent = 'See More Info';  
    }
  });

  fetchForecastData(location.name);
};

// Fetch forecast data
const fetchForecastData = async (city) => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
    if (!response.ok) {
      throw new Error('Forecast data not found');
    }
    const data = await response.json();
    displayForecast(data.forecast.forecastday);
  } catch (error) {
    forecastContainer.innerHTML = `<p class="error">${error.message}</p>`;
  }
};

// Display 5-day forecast
const displayForecast = (forecastDays) => {
  forecastContainer.innerHTML = '';
  
  forecastDays.forEach(day => {
    forecastContainer.innerHTML += `
      <div class="forecast-day">
        <h4>${new Date(day.date).toLocaleDateString()}</h4>
        <p>Max: ${day.day.maxtemp_c}°C</p>
        <p>Min: ${day.day.mintemp_c}°C</p>
        <p>Condition: ${day.day.condition.text}</p>
        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
      </div>
    `;
  });
};


searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city !== '') {
    weatherInfo.innerHTML = ''; 
    forecastContainer.innerHTML = ''; 
    fetchWeatherData(city);
  }
});

cityInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city !== '') {
      weatherInfo.innerHTML = ''; 
      forecastContainer.innerHTML = ''; 
      fetchWeatherData(city);
    }
  }
});


