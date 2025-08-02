import { useState } from 'react'
import './App.css'
import Landing from './components/landingPage'
import CardsPage from './components/cardsPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
       <Landing/>
       <CardsPage/>
      </div>
     
    </>
  )
}

export default App
