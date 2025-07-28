import { useEffect, useState } from 'react'
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
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


function Home() {
  const userData = JSON.parse(sessionStorage.userData)
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchChats = async () => {

    const response = await apiRequest('chats', 'GET');
    if( response.status === 200 ){
        setChats(response.chats)
    }
    console.log('chats ',response)
  }

  useEffect(() => {

    if( !loading ){
        fetchChats();
    }
    
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
            maxWidth: '75vw',
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
                gap: 2
              }}
            >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: '18px',
                  color: 'text.primary',
                  marginBottom: 1,
                  mx:'auto',
                  textDecoration: 'underline'
                }}
              >
                Welcome {userData.username}
              </Typography>

              <Box
                sx={{
                    display: 'flex', direction: 'row', my:'auto', gap:1, mx:'auto'
                }}
              >
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                    fontWeight: '17px',
                    color: 'text.primary',
                    my:'auto'
                    }}
                >
                    Select a chat or 
                </Typography>
                <Button 
                    sx={{
                    color: '#764ba2',
                    borderColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border:1,
                    backgroundColor:'white',
                    fontSize: "17px",
                    textAlign: "right",
                    transition: 'all 1s linear',
                    "&:hover": { color: "white", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                    }}
                >
                    Start a new
                </Button>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: '#6a4190',
                  marginBottom: 1,
                  textDecoration: 'underline'
                }}
              >
                Chat List
              </Typography>
              { chats?.length > 0 ?
                <Box
                    sx={{
                        // border: 1,
                        // borderColor: '#5a3b7a', 
                        borderRadius:3,
                        minHeight:'50vh', 
                        maxHeight: '60vh',
                        overflowY:'auto'
                    }}
                >
                {
                    chats.map((chat, index) => (
                        <Box
                            key={index}
                            sx={{
                                border: 2,
                                borderColor: '#5a4b8a',
                                borderRadius: 4,
                                padding: 2,
                                margin: 1,
                                cursor: 'pointer',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: '#5a4b8a',
                                    color: 'white',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    display:'flex', 
                                    direction:'row'
                                }}    
                            >
                                <Typography
                                    className="chat-name"
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: 1,
                                        width:'82%',
                                        fontSize: '1.2rem',
                                        '&:hover': {
                                            backgroundColor: '#5a4b8a',
                                            color: 'white',
                                        }
                                    }}
                                >
                                    {chat.chat_name}
                                </Typography>
                                <Box sx={{ display:'flex', gap:1 }}>
                                    <SendIcon 
                                        sx={{ '&:hover': { backgroundColor: 'white', color: '#5a4b8a', borderRadius:1 } }} 
                                        onClick={() => handleOpenChat(chat)}
                                    />
                                    <BorderColorIcon 
                                        sx={{ '&:hover': { backgroundColor: 'white', color: '#5a4b8a', borderRadius:1 } }} 
                                        onClick={() => handleEditChat(chat)}
                                    />
                                    <DeleteForeverIcon
                                        sx={{ '&:hover': { backgroundColor: 'white', color: '#5a4b8a', borderRadius:1 } }} 
                                        onClick={() => handleDeleteChat(chat)}
                                    />
                                </Box>
                            </Box>  
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                Users:
                                {chat.participants?.map((participant, pIndex) => (
                                    <Typography
                                        key={pIndex}
                                        className="participant-badge"
                                        variant="body2"
                                        sx={{
                                            color: 'black',
                                            backgroundColor: 'white',
                                            border:1,
                                            borderColor: '#5a4b8a',
                                            padding: '4px 8px',
                                            borderRadius: 1,
                                            fontSize: '0.9rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {participant.user}
                                    </Typography>
                                ))}
                            </Box>

                        
                        </Box>
                    ))
                }
                </Box>
                :
                <Box
                    sx={{
                        border: 1,
                        borderColor: '#764ba2',
                        borderRadius:3,
                        eight:'20vh', 
                        width:'100%',
                        display:'flex',
                        direction:'row',
                        paddingY: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#6a4190',
                            marginBottom: 1,
                            textDecoration: 'underline',
                            justifyContent:'center',
                            m:'auto'
                        }}
                    >
                        Your list of charts is empty... 
                        <SentimentVerySatisfiedIcon fontSize="medium" sx={{ my:'auto' }}/>
                    </Typography>
                </Box>
              }


            </CardContent>
          </Card>
        </Paper>
      </Container>
    </Box>
  )
}

export default Home;