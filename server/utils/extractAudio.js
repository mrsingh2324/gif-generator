const path = require('path');
const { execSync } = require('child_process');

async function extractAudio(videoPath) {
  const audioPath = videoPath.replace(/\.\w+$/, '.mp3');
  execSync(`ffmpeg -i ${videoPath} -vn -acodec libmp3lame -ar 44100 -ac 2 -ab 192k -f mp3 ${audioPath}`);
  return audioPath;
}

module.exports = extractAudio;
