
import { useEffect, useState, useCallback } from 'react'
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
    InputBase,
    Menu,
    MenuItem
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useWebSocket from 'react-use-websocket';

function Chat({ chatData, onClose }) {
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [listMessages, setListMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [messageEditing, setMessageEditing] = useState(null);

  const wsUrl = `ws://localhost:8000/ws/chat/${chatData.chat_id}`;
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState
  } = useWebSocket(wsUrl, {
    share: false,
    shouldReconnect: () => true,
  });

  const fetchChat = async () => {
    try {
      const response = await apiRequest(`chats/${chatData.chat_id}`, 'GET');
      if( response.status === 200 ){
        setChat(response)
        setListMessages(response.messages || []);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  }

  const sendMessageWS = useCallback((chatId, msg) => {
    const user = JSON.parse(sessionStorage.userData);
    sendJsonMessage({
      chat: chatId,
      user_sender: user.username,
      body: msg
    });
    setMessage('');
  }, [sendJsonMessage]);

  const sendMessage = async (chatId, msg) => {
    if (isEditing) {
      try {
        const body = {
          'body': msg,
          'chat': chatId,
          'is_edited': true
        }
        const url = `chats/messages/${messageEditing.message_id}/upload_message/`;
        const response = await apiRequest(url, 'POST', body);
        if (response.status === 201) {
          setListMessages((prevMessages) => [...prevMessages, response.data]);
          setMessage('');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      sendMessageWS(chatId, msg);
    }
  };

  useEffect(() => {
    if (lastJsonMessage) {
      setListMessages((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  const handleSendMessage = () => {
    if ( message /*message.trim()*/ ) {
      sendMessage(chatData.chat_id, message);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }

  const handleEditMessage = (messageEdit) => {
    console.log('Editing message:', messageEdit);
    setMessage(messageEdit.body);
    setMessageEditing(messageEdit);
    setIsEditing(true);
  }

  const handleDeleteMessage = async (message) => {
     try {
      const body = {
        'is_eliminated': true,
        'chat': message.chat_id
      }
      const response = await apiRequest(`chats/messages/${message.message_id}/eliminate_message/`, 'POST', body);
      if (response.status === 201) {
        console.log('Message eliminated successfully:', response.data);      
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  useEffect(() => {
    if( loading ){
      setLoading(true);
      fetchChat();
      setLoading(false);
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
                  {chat.chat_name || "Chat"}
                </Typography>
              </Box>
            }
            sx={{ 
              backgroundColor: '#764ba2',
              color: "white",
              py: 1.5,
              '& .MuiCardHeader-title': {
                color: 'white'
              }
            }}
            action={
              <Stack direction="row" spacing={1}>
                {/* <IconButton
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
                </IconButton> */}
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
                { listMessages?.length > 0 && 
                  listMessages.map( (message) => (
                    <Message message={message} deleteMessage={handleDeleteMessage} editMessage={handleEditMessage} />
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
                  autoFocus
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
          </CardContent>
        </Card>
      </Grid>
  )
}

export default Chat;

const Message = ({ message, deleteMessage, editMessage }) => {
  const user = JSON.parse(sessionStorage.userData);
  const isSender = message.user_sender === user['username'];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditMessage = () => {
    handleMenuClose();
    editMessage(message);
  };

  const handleDeleteMessage = () => {
    handleMenuClose();
    deleteMessage(message);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
      <Paper
        sx={{
          bgcolor: isSender ? '#764ba2' : 'white',
          color: isSender ? 'white' : 'black',
          borderRadius: isSender ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          p: 1.5,
          maxWidth: '80%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'relative'
        }}
      >
        {!isSender && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontSize: '17px', fontWeight: 'bold', pl:1 }}>
            {message.user_sender}
          </Typography>
        )}
        { isSender && (
          <>
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                color: isSender ? 'white' : 'black',
                zIndex: 2
              }}
              onClick={handleMenuClick}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => handleEditMessage()}>Edit</MenuItem>
              <MenuItem onClick={() => handleDeleteMessage()}>Delete</MenuItem>
            </Menu>
          </>
        )}
        <Typography variant="body2" sx={{ color: isSender ? 'white' : 'black', mt: isSender ? 2 : 1, fontStyle: message.is_eliminated ? 'italic' : 'none' }}>
          {message.body}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            direction: 'row',
            width: '100%'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isSender ? 'lightgray' : 'text.disabled',
              textAlign: 'right',
              display: 'block',
              mt: 0.5,
              mr: 2,
              fontStyle: 'italic'
            }}
          >
            {message.is_edited && 'edited'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: isSender ? 'lightgray' : 'text.disabled',
              ml: 'auto',
              display: 'block',
              mt: 0.5
            }}
          >
            {message.date_send}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}