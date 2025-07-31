import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginComponent from './Login'

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from './Home'
import ResponsiveAppBar from './ResponsiveAppBar'
import { Stack } from '@mui/material'


function App() {
  
  const [showAvatar, setShowAvatar] = useState( (sessionStorage.token && sessionStorage.userData)|| false);

  useEffect(()=> {
    console.log('login ')
  },[])

  return (
    <>
      <BrowserRouter basename="">
        <ResponsiveAppBar showAvatar={showAvatar} setShowAvatar={setShowAvatar}/>
        <Stack sx={{ marginTop:4 }}>
          <Routes>
            <Route
              path="*"
              element={<Navigate to="" />}
            />
            <Route
              path=""
              element={<LoginComponent setShowAvatar={setShowAvatar} />}
            />
            <Route
              path="/home"
              element={<Home/>}
            />

          </Routes>
        </Stack>
      </BrowserRouter>
    </>
  )
}

export default App
