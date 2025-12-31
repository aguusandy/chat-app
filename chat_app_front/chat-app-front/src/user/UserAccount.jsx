import React, { useEffect, useState } from 'react'

import {
    Box,
    Card,
    Paper,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Stack
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

import theme from '../Theme';
import apiRequest from '../Apis';
import { set } from 'lodash';

export default function UserAccount() {

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [posting, setPosting] = useState(false);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("*****");
  const [repeatPassword, setRepeatPassword] = useState("*****");
  const [allowEditPassword, setAllowEditPassword] = useState(false);

  const [errors, setErrors] = useState([]);


  const handleEditPassword = () => {
    setAllowEditPassword(!allowEditPassword);
  }

  const fetchUserData = async () => {
    // profile/
    try {
      const response = await apiRequest('api/profile/', 'GET');
      
      if( response.status === 200 ){
        setUserData(response.data);
        setUsername(response.data.username);
        setFirstname(response.data.first_name);
        setLastname(response.data.last_name);
        setEmail(response.data.email);
      }else{
        setErrors(true);
      }

      // return response;
    } catch (error) {
      console.error('Error at login:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    
    if (loading && sessionStorage.userData) {
      fetchUserData();
    }
  }, []);


  return (
    <Box>
    { loading ? 
    <>
    </>
    :
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
     {/* User info: ['username', 'email', 'password', 'first_name', 'last_name']*/}
      <Paper
        elevation={8}
        sx={{
            borderRadius: 3,
            maxWidth: '80vw',
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
                paddingTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                fontWeight: 450,
                color: theme.palette.primary.main,
                marginBottom: 1,
                textDecoration: 'underline'
                }}
            >
                Account Information
            </Typography>
            <Box
                sx={{
                    display:'flex', 
                    justifyContent:'center', 
                    alignItems:'center', 
                    flexDirection:'row', 
                    gap:1, 
                    width:'100%',
                    minHeight: '15vh'
                }}
            >
                <Avatar
                    alt={userData?.username || 'User Avatar'}
                    src={userData?.avatarUrl || ''}
                    sx={{ width: 90, height: 90, bgcolor: theme.palette.primary.main }}
                />
                <TextField
                    fullWidth
                    defaultValue={userData?.username}
                    label="Username"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                    }
                    }}
                />
            </Box>
            <Divider sx={{ width:'100%', color: theme.backgroundGradient, marginY:1 }}/>

            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row', gap:1, width:'100%', mb:2 }}>
                <TextField
                    fullWidth
                    label="First Name"
                    InputLabelProps={{ shrink: true }}
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
                fullWidth
                label="Last Name"
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
            <Divider sx={{ width:'100%', color: theme.backgroundGradient, marginY:1 }}/>
            <Stack sx={{ width:'100%', gap:1 }}>
                <Box
                    sx={{
                        display: 'flex', direction: 'row', mb:'auto'
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h1"
                        sx={{
                        fontWeight: '17px',
                        color: 'text.secondary',
                        my:'auto',
                        mr: 10,
                        ml:2
                        }}
                    >
                        Password
                    </Typography>
                    <Button 
                        sx={{
                        borderRadius: 2,
                        paddingY: 0.5,
                        paddingX: 1,
                        fontSize: '1.1rem',
                        fontWeight: 400,
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                        },
                        gap: 1,
                        color: 'white',
                        }}
                        onClick={ handleEditPassword }
                    >
                        {!allowEditPassword ? <EditIcon/> : <ClearIcon/>}
                        {allowEditPassword ? 'Cancel' : 'Edit Password'}
                    </Button>
                </Box>

                <Box
                    sx={{
                        width:'100%',
                        display:'flex', 
                        justifyContent:'center', 
                        alignItems:'center', 
                        flexDirection:'row', 
                        gap:4, 
                        width:'100%'
                    }}
                >
                    <TextField
                        fullWidth   
                        disabled={ !allowEditPassword }
                        label="Password"
                        InputLabelProps={{ shrink: true }}
                        type="password"
                        variant="outlined"
                        defaultValue={"******"}
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
                        disabled={ !allowEditPassword }
                        label="Repeat Password"
                        InputLabelProps={{ shrink: true }}
                        type="password"
                        variant="outlined"
                        defaultValue={"******"}
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                        }
                        }}
                    />
                </Box>
            </Stack>
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
            <Box 
                sx={{
                display:'flex', 
                justifyContent:'center', 
                alignItems:'center', 
                flexDirection:'row', 
                gap:4, 
                width:'100%', 
                mt:4 
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => console.log('aa')}
                    sx={{
                    borderRadius: 2,
                    paddingY: 1.5,
                    paddingX: 8,
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
                    Save Changes
                    { posting ? 
                    <CircularProgress color="white" size='1.5rem'/>
                    :
                    ""
                    }
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={console.log('aa')}
                    sx={{
                        borderRadius: 2,
                        paddingY: 1.5,
                        paddingX: 8,
                        color: theme.palette.primary.main,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: theme.palette.primary.info,
                        '&:hover': {
                            background: theme.palette.primary.info,
                            color: theme.palette.primary.main
                        },
                        gap: 1
                    }}
                >
                    Cancel
                </Button>
            </Box>            

            </CardContent>
        </Card>
      </Paper>
    </Box>
    }
    </Box>
  )
}
