import React from 'react';
const Home = () => {
  return (
    <>
        <div className='flex flex-col items-center justify-center w-[90%] bg-gray-200 m-[5%] p-5 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>Welcome to the Gif Generator</h2>
            <p className='color-blue-700 mb-6'>
            Enter a theme, provide a video, and let AI craft perfect captioned GIFs for you!
            </p>
        </div>
    </>
  )
}

export default Home
