import './App.css'
import Generator from './generator'
import Home from './home'
import Result from './result'

function App() {
  return (
    <>
      <div className='items-center flex flex-col justify-start h-screen bg-gray-300 w-[100vw] p-0 m-0'>
        <Home />
        <Generator />
        <Result />
      </div>
    </>
  )
}

export default App