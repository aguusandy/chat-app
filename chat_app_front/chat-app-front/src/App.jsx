import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginComponent from './Login'

function App() {
  
  useEffect(()=> {
    console.log('login ')
  },[])

  return (
    <>
      <LoginComponent/>
    </>
  )
}

export default App
