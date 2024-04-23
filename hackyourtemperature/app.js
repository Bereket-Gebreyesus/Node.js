import express from 'express';
import fetch from 'node-fetch';
import {keys} from './sources/keys.js';

const app = express();

app.use(express.json());

//GET route to sent message
app.get('/', async (req, res)=>{
  res.send('hello from backend to frontend!');
});

//POST route to handle weather data
// app.post('/weather', async(req, res)=> {
//   const cityName = req.body.cityName;
//   const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${keys.API_KEY}`;
//   try {
//     const response = await fetch(apiUrl);
//     if (!response.ok) {
//       throw new Error('Failed to fetch weather data');
//     }
//     const weatherData = await response.json();
//     res.json(weatherData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
  
// });
app.post('/weather', async (req, res) => {
  const cityName = req.body.cityName;

  // Check if cityName is provided
  if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${keys.API_KEY}`;
  try {
      const response = await fetch(apiUrl);

      // Check if response is successful
      if (!response.ok) {
          // Handle specific error cases (e.g., city not found)
          if (response.status === 404) {
              return res.status(404).json({ error: 'City not found' });
          }
          throw new Error('Failed to fetch weather data');
      }

      const weatherData = await response.json();
      res.json(weatherData);
  } catch (error) {
      // Handle generic server error
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default app;