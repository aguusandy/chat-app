import { useEffect, useRef, useState } from 'react'
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
    Modal,
    Grid,
    InputBase,
    LinearProgress
  } from '@mui/material'
import './App.css'
import apiRequest from './Apis'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BackupIcon from '@mui/icons-material/Backup';
import Chat from './chats/Chat';
import EditChat from './chats/EditChat.jsx';
import NewChat from './chats/NewChat.jsx';
import DeleteChat from './chats/DeleteChat.jsx';


function RAG() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [listMessages, setListMessages] = useState([]);

  const [files, setFiles] = useState([]);
  const [filesLoaded, setFilesLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');

  const fetchChats = async () => {

    try {
      const response = await apiRequest('chats', 'GET');
      console.log('chats ',response)
      if( response.status === 200 ){
          setChats(response.chats)
      }
    } catch (error) {
      console.log('Error fetching chats:', error);
    }
  }

  const handleNewChat = () => {
    console.log('handle new chat')
    setOpenNewChat(true);
  }

  const handleOpenChat = (chat) => {
    console.log('handle open chat', chat)
    setChatSelected(chat)
    setOpenChat(true);
  } 

  const handleCloseChat = (setFunction) => {
    setChatSelected(false);
    setFunction(false);
  }

  const handleEditChat = (chat) => {
    console.log('edit chat', chat)
    setChatSelected(chat)
    setOpenEditChat(true);
  }

  const handleDeleteChat = (chat) => {
    console.log('delete chat')
    setChatSelected(chat);
    setOpenDeleteChat(true);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }

  const handleSendMessage = () => {
    if ( message /*message.trim()*/ ) {
      sendMessage(chatData.chat_id, message);
    }
  }

  useEffect(() => {
    if( !userData ){
      setUserData(JSON.parse(sessionStorage.userData));
    }
    if( !loading || refresh){
      setLoading(true);
      fetchChats();
      setLoading(false);
      if (refresh) {
        setRefresh(false);
      }
    }
  },[refresh])


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
        paddingTop: 4
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
                gap: 2,
                minHeight: '60vh'
              }}
            >
            <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontSize: '1.8rem',
                  marginBottom: 1,
                  mx:'auto',
                  textDecoration: 'underline',
                  color:'#764ba2',
                  fontWeight:450
                }}
              >
                Welcome {userData.username} to the RAG section
              </Typography>
              { !filesLoaded ?
                <Box
                    sx={{
                        display: 'flex', direction: 'row', mb:'auto', gap:1, mx:'auto'
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
                        No files loaded yet.
                    </Typography>
                    <Button 
                        sx={{
                        border: 2,
                        color: '#764ba2',
                        borderRadius: 4,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: '#764ba2',
                            borderColor: '#764ba2',
                            color: 'white',
                        }
                        }}
                        onClick={ handleNewChat }
                    >
                        <BackupIcon />
                        Load Files
                    </Button>
                </Box>
                :
                <>
                List of files
                </>
              }
              { loading &&
                <Box sx={{ width: '100%', mb:'auto' }}>
                  <LinearProgress color="secondary" sx={{ backgroundColor:'#764ba2' }} />
                </Box>
              }
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        backgroundColor:'#764ba2',
                        borderRadius: 2,
                        height: '60vh',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            textAlign: 'center',
                            fontSize: '1.3rem',
                            marginBottom: 1,
                            mx:'auto',
                            textDecoration: 'underline',
                            color:'white',
                            fontWeight:450
                        }}
                    >
                        { filesLoaded ? 'Ask your documents anything' : 'Load some files to get started!' }
                    </Typography>
                    <Box
                        sx={{
                            flex: 1,
                            p: 0,
                            display: "flex",
                            flexDirection: "column",
                            overflow: 'hidden',
                            backgroundColor: '#e5e7eb',
                            borderRadius: 2,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.85)',
                            height: '50vh',
                        }}
                    >
                    { loading ? 
                        <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                        }}>
                        <CircularProgress size={150} thickness={5} sx={{ color:'#764ba2' }} />
                        </Box>
                        :
                        <>
                        {/* Messages Container */}
                        <Box 
                            sx={{ 
                            flex: 1, 
                            overflowY: 'auto', 
                            p: 2, 
                            bgcolor: '#f3f4f6',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                            }}
                        >
                            { listMessages?.length > 0 && 
                            listMessages.map( (message) => (
                                <Message message={message} deleteMessage={handleDeleteMessage} editMessage={handleEditMessage} />
                            ))                
                            }
                            <div ref={messagesEndRef} />
                        </Box>
            
                        {/* Message Input */}
                        <Box sx={{ 
                            mt: 2, 
                            bgcolor: 'white', 
                            borderRadius: 2, 
                            p: 1, 
                            mx: 2, 
                            mb: 2,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.85)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {/* <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'grey.100' } }}>
                            <AddIcon fontSize="small" />
                            </IconButton> */}
                            <InputBase
                            value={message}
                            placeholder= { filesLoaded ? "Type a message..." : "Load files to start chatting!" }
                            disabled={ !filesLoaded }
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            sx={{ 
                                flex: 1, 
                                px: 1.5, 
                                py: 1,
                                '& input': {
                                border: 'none',
                                outline: 'none'
                                }
                            }}
                            />
                            {/* <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'grey.100' } }}>
                            <MoodIcon fontSize="small" />
                            </IconButton> */}
                            <IconButton 
                            size="small" 
                            disabled={ !filesLoaded }
                            sx={{ 
                                bgcolor: '#764ba2', 
                                color: 'white', 
                                ml: 0.5,
                                '&:hover': { 
                                bgcolor: '#4a3b7a' 
                                } 
                            }}
                            onClick={handleSendMessage}
                            >
                            <SendIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        </>
                        }
                    </Box>         
                </Box>

            </CardContent>
          </Card>
        </Paper>
      </Container>

    </Box>
  )
}

export default RAG;