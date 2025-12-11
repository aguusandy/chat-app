import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginComponent from './Login'
import Register from './Register'

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from './Home'
import ResponsiveAppBar from './ResponsiveAppBar'
import { Stack } from '@mui/material'
import RAG from './RAG'


function App() {
  
  const [showAvatar, setShowAvatar] = useState( (sessionStorage.token && sessionStorage.userData)|| false);

  return (
    <>
      <BrowserRouter basename="">
        <ResponsiveAppBar showAvatar={showAvatar} setShowAvatar={setShowAvatar}/>
        <Stack sx={{ marginTop:4 }}>
          <Routes>
            <Route path="/" element={<LoginComponent setShowAvatar={setShowAvatar} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rag" element={<RAG />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Stack>
      </BrowserRouter>
    </>
  )
}

export default App
