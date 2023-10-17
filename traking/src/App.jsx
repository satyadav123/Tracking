import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserTrackingComponent from './component/usertracking'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  
 <UserTrackingComponent/>
    </>
  )
}

export default App
