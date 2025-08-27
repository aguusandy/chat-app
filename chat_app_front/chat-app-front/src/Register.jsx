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
  AlertTitle,
  CircularProgress,
  Link
} from '@mui/material'
import './App.css'
import apiRequest from './Apis'
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

function Register() {
  useEffect(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
  }, []);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [register, setRegister] = useState(false);
  
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const checkFields = () => {
    let validationErrors = [];
    if (!firstname) validationErrors.push('First name is required.');
    if (!lastname) validationErrors.push('Last name is required.');
    if (!username) validationErrors.push('Username is required.');
    if (!email) validationErrors.push('Email is required.');
    if (!password) validationErrors.push('Password is required.');
    if (!repeatPassword) validationErrors.push('Repeat password is required.');
    if (password && repeatPassword && password !== repeatPassword) validationErrors.push('Passwords do not match.');
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return false;
    }
    setErrors([]);
    return true;
  }

  const handleRegister = async () => {
    setRegister(true);
    if (!checkFields()) return;

    const body = {
      username: username,
      password: password,
      email: email,
      first_name: firstname,
      last_name: lastname
    }

    try {
      const response = await apiRequest('api/register/', 'POST', body);
      console.log('response ',response)
      if( response.status === 201 ){
        setSuccess(true);
        setCountdown(3);
      }else{
        setErrors(['Error at register.']);
      }
    } catch (error) {
      console.error('Error at register:', error);
      setErrors(['Error at register.']);
    }
    setRegister(false);
  }

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      // navigate('/home');
    }
  }, [success, countdown, navigate]);

  return (
    <Box
      sx={{
        minHeight: '95vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingX: 2, 
      }}
    >
      <Container maxWidth="sm">
        {success ? (
          <Card sx={{ borderRadius: 3, p: 4, background: 'rgba(255,255,255,0.97)', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'green', mb: 2 }}>
                Successful Sign Up!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You will be redirected to the home page in {countdown} second{countdown !== 1 ? 's' : ''}.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
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
                  paddingTop: 3,
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
                  Chat App Register
                </Typography>             
                <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row', gap:1 }}>
                  <TextField
                    width="50%"
                    label="First Name"
                    variant="outlined"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <TextField
                    width="50%"
                    label="Last Name"
                    variant="outlined"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
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
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <TextField
                  fullWidth
                  label="Repeat Password"
                  type="password"
                  variant="outlined"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                { errors.length > 0 && 
                  <Collapse in={errors.length > 0}>
                    <Alert
                      severity="error"
                      variant="outlined"
                      action={
                        <IconButton
                          aria-label="close"
                          color='inherit'
                          onClick={() => {
                            setErrors([]);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      <AlertTitle>Registration Error</AlertTitle>
                      <ul style={{margin:0, paddingLeft: '1.2em'}}>
                        {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                      </ul>
                    </Alert>
                  </Collapse>
                }            
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleRegister}
                  sx={{
                    borderRadius: 2,
                    padding: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                    },
                    gap: 1
                  }}
                >
                  Sign Up
                  { register ? 
                    <CircularProgress color="white" size='1.5rem'/>
                    :
                    <PersonAddAlt1Icon />
                  }
                </Button>
              </CardContent>
            </Card>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default Register;