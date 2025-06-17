// server/process.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');
require('dotenv').config();
const uuid = require('uuid').v4;
const extractAudio = require('./utils/extractAudio');
const transcribeAudio = require('./utils/transcribeAudio');

async function callGroqForCaptions(prompt, transcript) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that extracts 2–3 interesting or emotional lines from a transcript based on a user theme prompt.',
        },
        {
          role: 'user',
          content: `Theme prompt: "${prompt}"
Transcript:
${transcript}

Give 2-3 caption-worthy sentences with timestamps if possible.`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}

function extractSegments(transcriptResponse) {
  const lines = transcriptResponse.split('\n').filter(Boolean);
  return lines
    .map((line, i) => {
      const match = line.match(/\[(.*?)\]\s?(.*)/);
      if (match) {
        const [, time, text] = match;
        return { id: i, time, text };
      } else {
        return null;
      }
    })
    .filter(Boolean);
}

function cutGifFromVideo(videoPath, outputFolder, segment, index) {
  const outputPath = path.join(outputFolder, `gif${index}-${uuid()}.gif`);
  const [h = '00', m = '00', s = '00'] = segment.time.split(':');
  const startTime = `${h}:${m}:${s}`;
  const duration = '3';

  const safeText = segment.text.replace(/:/g, '\\:').replace(/'/g, "\\'");
  const filter = `fps=10,scale=320:-1:flags=lanczos,drawtext=fontfile=/Library/Fonts/Arial.ttf:text='${safeText}':fontcolor=white:fontsize=18:borderw=1:bordercolor=black:x=(w-text_w)/2:y=h-40`;

  execSync(
    `ffmpeg -y -ss ${startTime} -t ${duration} -i "${videoPath}" -vf "${filter}" -gifflags +transdiff "${outputPath}"`
  );

  return `/gifs/${path.basename(outputPath)}`;
}

async function processVideo(videoPath, prompt) {
  try {
    const audioPath = await extractAudio(videoPath);
    const transcript = await transcribeAudio(audioPath);
    const groqResponse = await callGroqForCaptions(prompt, transcript);
    const segments = extractSegments(groqResponse);

    const outputDir = path.join(__dirname, 'gifs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const gifPaths = segments.slice(0, 3).map((segment, i) => cutGifFromVideo(videoPath, outputDir, segment, i));

    return gifPaths;
  } catch (err) {
    console.error('Error processing video:', err);
    return [];
  }
}

module.exports = { processVideo };
