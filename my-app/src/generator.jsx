import React, { useState } from 'react';
import axios from 'axios';

const Generator = () => {
  const [inputMode, setInputMode] = useState('upload');
  const [themePrompt, setThemePrompt] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gifs, setGifs] = useState([]);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleGenerate = async () => {
    if (inputMode !== 'upload') {
      alert('Only upload mode supported in current prototype.');
      return;
    }

    if (!videoFile || !themePrompt) {
      alert('Please provide both a theme prompt and a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('prompt', themePrompt);

    setLoading(true);
    setGifs([]);

    try {
      const response = await axios.post('http://localhost:5005/api/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setGifs(response.data.gifs);
    } catch (err) {
      console.error(err);
      alert('Something went wrong while generating GIFs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">GIF Theme Prompt</h2>
      <input
        type="text"
        placeholder="e.g., 'funny moments', 'epic fails', 'inspirational quotes'"
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
        value={themePrompt}
        onChange={(e) => setThemePrompt(e.target.value)}
      />

      <div className="flex rounded-md overflow-hidden border border-gray-300">
        <button
          className={`w-1/2 px-4 py-2 flex items-center justify-center gap-2 ${inputMode === 'youtube' ? 'bg-gray-200 font-medium' : 'bg-white'}`}
          onClick={() => setInputMode('youtube')}
        >
          <span>📹</span> YouTube URL
        </button>
        <button
          className={`w-1/2 px-4 py-2 flex items-center justify-center gap-2 ${inputMode === 'upload' ? 'bg-gray-200 font-medium' : 'bg-white'}`}
          onClick={() => setInputMode('upload')}
        >
          <span>⏫</span> Upload Video
        </button>
      </div>

      {inputMode === 'youtube' ? (
        <input
          type="text"
          placeholder="Paste YouTube URL here"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload MP4 File</label>
          <input
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Note: For this prototype, only uploaded videos are supported.
      </p>

      <button
        onClick={handleGenerate}
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? '⏳ Generating...' : '⚡ Generate GIFs'}
      </button>

      {gifs.length > 0 && (
        <div className="pt-4">
          <h3 className="text-md font-medium mb-2">Generated GIFs:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gifs.map((gif, i) => (
              <img
                key={i}
                src={`http://localhost:5005${gif}`}
                alt={`gif-${i}`}
                className="rounded shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
