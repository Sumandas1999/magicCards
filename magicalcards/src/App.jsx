import { useState } from 'react'
import './App.css'
import Landing from './components/landingPage'
import CardsPage from './components/cardsPage'
import Select from './components/SelectStackPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      
       <Select/>
      </div>
     
    </>
  )
}

export default App
