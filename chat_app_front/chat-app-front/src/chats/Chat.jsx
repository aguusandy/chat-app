
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
    AlertTitle,
    Grid,
    CardHeader,
    Stack,
    CircularProgress,
    Divider,
    Avatar,
    Chip,
    InputBase
  } from '@mui/material'
import apiRequest from '../Apis'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ForumIcon from '@mui/icons-material/Forum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import MoodIcon from '@mui/icons-material/Mood';

function Chat({ chatData, onClose }) {
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchChat = async () => {
    const response = await apiRequest(`chats/${chatData.chat_id}`, 'GET');
    console.log('chats ',response)
    if( response.status === 200 ){
        setChat(response)
        setLoading(false);
    }
  }

  const handleNewChat = () => {
    console.log('handle new chat')
  }

  const handleOpenChat = () => {
    console.log('handle open chat')
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }

  useEffect(() => {
    if( loading ){
        fetchChat();
    }
  },[])

  return (
      <Grid item xs={12}>
        <Card sx={{ 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", 
          minWidth:'45vw', 
          borderRadius: 2,
          height: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ForumIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {chatData.chat_name || "Chat"}
                </Typography>
              </Box>
            }
            sx={{ 
              backgroundColor: "#5a4b8a",
              color: "white",
              py: 1.5,
              '& .MuiCardHeader-title': {
                color: 'white'
              }
            }}
            action={
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Cerrar"
                  size="small"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                    },
                  }}
                  onClick={onClose}
                >
                  ×
                </IconButton>
              </Stack>
            }
          />
          
          <CardContent
            sx={{
              flex: 1,
              p: 0,
              display: "flex",
              flexDirection: "column",
              overflow: 'hidden'
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
                { chat?.messages.map( (message) => (
                    <Message message={message} />
                    ))                
                }
                
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
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                  sx={{ 
                    bgcolor: '#5a4b8a', 
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
          </CardContent>
        </Card>
      </Grid>
  )
}

export default Chat;

const Message = ({ message }) => {
    const user = JSON.parse(sessionStorage.userData)
    console.log('message', message)

    return(
        <>
        { message.user_sender == user['username'] ?
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Paper sx={{ 
                bgcolor: '#5a4b8a',
                color: 'white',
                borderRadius: '12px 12px 4px 12px',
                p: 1.5,
                maxWidth: '80%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                {message.body}
                </Typography>
                <Box
                    sx={{
                        display:'flex',
                        direction:'row',
                        width:'100%'
                    }}
                >
                    <Typography variant="caption" sx={{ color: 'lightgray', textAlign: 'right', display: 'block', mt: 0.5, mr:2, fontStyle:'italic' }}>
                    {!message.is_edited && 'edited'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'lightgray', ml:'auto', display: 'block', mt: 0.5 }}>
                    {message.date_send}
                    </Typography>
                </Box>
            </Paper>
        </Box>
        :
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Paper sx={{ 
            bgcolor: 'white',
            borderRadius: '12px 12px 12px 4px',
            p: 1.5,
            maxWidth: '80%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontSize:'17px', fontWeight:'bold' }}>
            {message.user_sender}
            </Typography>
            <Typography variant="body2">
            {message.body}
            </Typography>
            <Box
                sx={{
                    display:'flex',
                    direction:'row',
                    width:'100%'
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'right', display: 'block', mt: 0.5, mr: 2, fontStyle:'italic' }}>
                {!message.is_edited && 'edited'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', ml:'auto', display: 'block', mt: 0.5 }}>
                {message.date_send}
                </Typography>
            </Box>
        </Paper>
        </Box>
        }
        </>
    );
}