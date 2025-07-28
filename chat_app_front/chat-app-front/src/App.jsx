import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginComponent from './Login'

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from './Home'


function App() {
  
  useEffect(()=> {
    console.log('login ')
  },[])

  return (
    <>
          <BrowserRouter basename="">
            <Routes>
              <Route
                path="*"
                element={<Navigate to="" />}
              />
              <Route
                path=""
                element={<LoginComponent/>}
              />
              <Route
                path="/home"
                element={<Home/>}
              />

            </Routes>
            </BrowserRouter>
    </>
  )
}

export default App
