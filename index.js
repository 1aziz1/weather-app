const axios = require('axios');
const readlineSync = require('readline-sync');

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';
const OPEN_METEO_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Function to get coordinates of a city using Nominatim API
async function getCoordinates(city) {
  try {
    const response = await axios.get(NOMINATIM_API_URL, {
      params: {
        q: city,
        format: 'json',
        limit: 1
      }
    });

    if (response.data.length === 0) {
      console.log('City not found. Please try again.');
      return null;
    }

    const location = response.data[0];
    return {
      latitude: location.lat,
      longitude: location.lon,
      display_name: location.display_name
    };
  } catch (error) {
    console.error('Error fetching city coordinates:', error.message);
    return null;
  }
}

// Function to get weather data using Open-Meteo API
async function getWeather(latitude, longitude) {
  try {
    const response = await axios.get(OPEN_METEO_API_URL, {
      params: {
        latitude: latitude,
        longitude: longitude,
        hourly: 'temperature_2m,precipitation',
        current_weather: true
      }
    });

    const weather = response.data.current_weather;
    console.log(`\nCurrent Weather:\n`);
    console.log(`Temperature: ${weather.temperature}°C`);
    console.log(`Wind Speed: ${weather.windspeed} km/h`);
    console.log(`Weather Code: ${weather.weathercode}`);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
  }
}

// Main function to run the weather app
async function main() {
  const city = readlineSync.question('Enter the name of a city: ');
  const coordinates = await getCoordinates(city);

  if (coordinates) {
    console.log(`\nFetching weather for ${coordinates.display_name}...\n`);
    await getWeather(coordinates.latitude, coordinates.longitude);
  }
}

main();
