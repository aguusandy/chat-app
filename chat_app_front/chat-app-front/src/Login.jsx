import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  Collapse,
  IconButton,
  AlertTitle
} from '@mui/material'
import './App.css'
import apiRequest from './Apis'
import CloseIcon from '@mui/icons-material/Close';

function LoginComponent() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('Login attempt:', { username, password })
    const body = {
      username: username,
      password: password
    }

    try {
      const response = await apiRequest('api/login/', 'POST', body);
      console.log('response ',response)
      if( response.status === 200 ){
        if( response.token ){
          sessionStorage.setItem('token', response.token)
        }
        if( response.user_data ){
          sessionStorage.setItem('userData', JSON.stringify(response.user_data))
        }
        navigate('/home');
      }else{
        setErrors(true);
      }

      // return response;
    } catch (error) {
      console.error('Error at login:', error);
    }
  }

  useEffect(() => {
    console.log('login app')
  },[])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            // maxHeight: '75vh',
            maxWidth: '50vw',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  marginBottom: 1,
                  textDecoration: 'underline'
                }}
              >
                Chat App
              </Typography>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  marginBottom: 1
                }}
              >
                Log In
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  marginBottom: 3,
                  textAlign: 'center'
                }}
              >
                To use the message service please login with you account.
              </Typography>

              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              { errors && 
                <Collapse in={errors}>
                  <Alert
                    severity="error"
                    variant="outlined"
                    action={
                      <IconButton
                        aria-label="close"
                        color='inherit'
                        onClick={() => {
                          setErrors(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    <AlertTitle>Incorrect username or password.</AlertTitle>
                  </Alert>
                </Collapse>
              }

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{
                  borderRadius: 2,
                  padding: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                  }
                }}
              >
                Log In
              </Button>

            </CardContent>
          </Card>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginComponent