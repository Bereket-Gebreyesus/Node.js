import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(express.json());

//GET route to sent message
app.get('/', async (req, res)=>{
  res.send('hello from backend to frontend!');
});

//POST route to handle weather data
app.post('/weather', (req, res)=> {
  const cityName = req.body.cityName;
  res.send(cityName);
});

app.listen(PORT,()=>{
  console.log('Server is running on port', PORT);
});