const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function processVideo(videoPath, prompt) {
  const outDir = path.join(__dirname, 'gifs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  // 🔧 For prototype: hardcoded 2 clips from timestamps
  const clips = [
    { start: '00:00:01', duration: '3', caption: `${prompt} - Scene 1` },
    { start: '00:00:05', duration: '3', caption: `${prompt} - Scene 2` },
  ];

  const gifs = [];
  for (let i = 0; i < clips.length; i++) {
    const gifName = `gif${Date.now()}_${i}.gif`;
    const gifPath = path.join(outDir, gifName);
    const command = `ffmpeg -ss ${clips[i].start} -t ${clips[i].duration} -i ${videoPath} -vf "drawtext=text='${clips[i].caption}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-40" -y ${gifPath}`;

    await new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) reject(err);
        else resolve();
      });
    });
    gifs.push(gifName);
  }

  return gifs;
}

module.exports = { processVideo };