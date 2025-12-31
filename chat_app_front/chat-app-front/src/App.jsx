import { useState } from 'react'
import './App.css'
import LoginComponent from './user/Login'
import Register from './user/Register'

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from './Home'
import ResponsiveAppBar from './ResponsiveAppBar'
import { Stack } from '@mui/material'
import RAG from './rag/RAG'
import UserAccount from './user/UserAccount';


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
            <Route path="/user" element={<UserAccount />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Stack>
      </BrowserRouter>
    </>
  )
}

export default App
