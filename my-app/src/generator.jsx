import React, { useState } from 'react';

const Generator = () => {
  const [inputMode, setInputMode] = useState('youtube'); // 'youtube' or 'upload'
  const [themePrompt, setThemePrompt] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState('');

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">GIF Theme Prompt</h2>
      <input
        type="text"
        placeholder="e.g., 'funny moments', 'epic fails', 'inspirational quotes'"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        value={themePrompt}
        onChange={(e) => setThemePrompt(e.target.value)}
      />

      <div className="flex rounded-md overflow-hidden border border-gray-300">
        <button
          className={`w-1/2 px-4 py-2 flex items-center justify-center gap-2 ${
            inputMode === 'youtube' ? 'bg-gray-200 font-medium' : 'bg-white'
          }`}
          onClick={() => setInputMode('youtube')}
        >
          <span>📹</span> YouTube URL
        </button>
        <button
          className={`w-1/2 px-4 py-2 flex items-center justify-center gap-2 ${
            inputMode === 'upload' ? 'bg-gray-200 font-medium' : 'bg-white'
          }`}
          onClick={() => setInputMode('upload')}
        >
          <span>⏫</span> Upload Video
        </button>
      </div>

      {inputMode === 'youtube' ? (
        <input
          type="text"
          placeholder="Paste YouTube URL here"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Note: For this prototype, file upload processing is simulated. Transcript generation will use a default video if a file is uploaded.
      </p>

      <button
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
      >
        ⚡ Generate GIFs
      </button>
    </div>
  );
};

export default Generator;
