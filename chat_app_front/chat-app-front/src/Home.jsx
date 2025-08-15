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
    Modal,
    Grid,
    LinearProgress
  } from '@mui/material'
import './App.css'
import apiRequest from './Apis'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Chat from './chats/Chat';
import EditChat from './chats/EditChat.jsx';
import NewChat from './chats/NewChat.jsx';
import DeleteChat from './chats/DeleteChat.jsx';


function Home() {
  const [userData, setUserData] = useState({});
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatSelected, setChatSelected] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [openEditChat, setOpenEditChat] = useState(false);
  const [openNewChat, setOpenNewChat] = useState(false);
  const [openDeleteChat, setOpenDeleteChat] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
                Welcome {userData.username} to the chat list
              </Typography>

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
                    Select a chat or 
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
                    Start a new
                </Button>
              </Box>
              { loading &&
                <Box sx={{ width: '100%', mb:'auto' }}>
                  <LinearProgress color="secondary" sx={{ backgroundColor:'#764ba2' }} />
                </Box>
              }
              { !loading && chats?.length > 0 ?
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
                                color: '#764ba2',
                                borderRadius: 4,
                                padding: 2,
                                margin: 1,
                                cursor: 'pointer',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: '#764ba2',
                                    color: 'white',
                                }
                            }}
                            onClick={() => handleOpenChat(chat)}
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
                                            backgroundColor: 'inherit',
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
                                        {participant.user?.username}
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

      <Modal
          open={openChat}
          onClose={() => handleCloseChat(setOpenChat)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999,
            }}
          >
            <Grid item xs={12} sm={10} md={9} lg={9}>
              <Box sx={{ bgcolor: "background.paper", boxShadow: 24, borderRadius: 4 }} >
                <Chat chatData={chatSelected} onClose={() => handleCloseChat(setOpenChat)}/>
              </Box>
            </Grid>
          </Grid>
      </Modal>

      <Modal
          open={openEditChat}
          onClose={handleCloseChat}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999,
            }}
          >
            <Grid item xs={12} sm={10} md={9} lg={9}>
              <Box sx={{ bgcolor: "background.paper", boxShadow: 24, borderRadius: 4 }} >
                <EditChat chatData={chatSelected} onClose={() => handleCloseChat(setOpenEditChat)} setRefresh={setRefresh}/>
              </Box>
            </Grid>
          </Grid>
      </Modal>
      <Modal
          open={openNewChat}
          onClose={handleCloseChat}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999,
            }}
          >
            <Grid item xs={12} sm={10} md={9} lg={9}>
              <Box sx={{ bgcolor: "background.paper", boxShadow: 24, borderRadius: 4 }} >
                <NewChat onClose={() => handleCloseChat(setOpenNewChat)} setRefresh={setRefresh}/>
              </Box>
            </Grid>
          </Grid>
      </Modal>
      <Modal
        open={openDeleteChat}
        onClose={handleCloseChat}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
          }}
        >
          <Grid item xs={12} sm={10} md={7} lg={5}>
            <Box sx={{ bgcolor: "background.paper", boxShadow: 24, borderRadius: 4 }} >
              <DeleteChat onClose={() => handleCloseChat(setOpenDeleteChat)} chatData={chatSelected} setRefresh={setRefresh}/>
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </Box>
  )
}

export default Home;