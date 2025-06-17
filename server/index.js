const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { processVideo } = require('./process');


const app = express();
app.use(cors()); // 

const upload = multer({ dest: 'server/uploads/' });

app.use('/gifs', express.static(path.join(__dirname, 'gifs')));

app.post('/process', upload.single('video'), async (req, res) => {
  const prompt = req.body.prompt;
  const videoPath = req.file.path;
  const gifs = await processVideo(videoPath, prompt);
  res.json({ gifs });
});
app.post('/api/process', upload.single('video'), async (req, res) => {
  const { prompt } = req.body;
  const videoPath = req.file.path;

  const gifs = await processVideo(videoPath, prompt);
  res.json({ gifs });
});


app.listen(5005, () => console.log('Server running on http://localhost:5005'));