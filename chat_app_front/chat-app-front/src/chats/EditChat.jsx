
import { Autocomplete, Box, Button, Card, CardContent, CardHeader, CircularProgress, FormHelperText, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react'
// import moment from 'moment';
import ForumIcon from '@mui/icons-material/Forum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import apiRequest from '../Apis';
import _ from 'lodash';

function EditChat({ chatData, onClose, setRefresh }) {

  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const [newChatName, setNewChatName] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [newParticipants, setNewParticipants] = useState([]);
  const [userAutocomplete, setUserAutocomplete] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedParticipants, setDeletedParticipants] = useState([]);

  const fetchChat = async () => {
    try {
      if( chatData && chatData.chat_id ){
        setChat(chatData)
        setNewChatName(chatData.chat_name)
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  }


  const fetchUserOptions = useCallback(
    _.debounce(async (value) => {
      try {
        const response = await apiRequest('api/user_search?', 'GET', `q=${value}`);
        if (response && response.length > 0) {
          const userList = response.map((user) => ({
            username: user.username,
            user_id: user.user_id,
            email: user.email,
          }));
          console.log('options ',userList)
          setUserOptions(userList);
          setError(false);
        } else {
          setUserOptions([]);
          setErrorMessage('No users found');
          setError(true);
        }
      } catch (e) {
        console.error('Error fetching user options:', e);
        setUserOptions([]);
        setErrorMessage('Error fetching users');
        setError(true);
      }
    }, 300),
    []
  );

  const handleChange = (event, value) => {
    console.log
    if( !newParticipants.find(participant => participant.user_id === value.user_id) && !chat.participants.find(participant => participant.user.user_id === value.user_id) ){
      setNewParticipants([...newParticipants, value]);
    }
    setError(false);
  };

  const handleDeleteParticipant = async (participant) => {
    console.log('Delete participant:', participant);
    if( !deletedParticipants.find(p => p.user_id === participant.user.user_id) && !deletedParticipants.find(p => p.user_id === participant.user_id) ){
      setDeletedParticipants([...deletedParticipants, participant]);
     
    }
  }

  const deleteNewParticipant = (participant) => {
    setNewParticipants(newParticipants.filter(p => p.user_id !== participant.user_id));
  };

  const handleSaveChat = async () => {
    console.log('Saving chat:', chat);

    try {
      let participants = [];
      if (newParticipants.length > 0) {
        participants = participants.concat(newParticipants);
      }
      if (deletedParticipants.length > 0) {
        participants = participants.concat(deletedParticipants);
      }
      const data = {
        chat_name: newChatName || chat.chat_name,
        participants
      }
      const response = await apiRequest(`chats/${chat.chat_id}/upload_participants/`, 'POST', data);
      if (response.status === 201) {
        console.log('Chat updated successfully:', response);
        setChat(response);
        setNewChatName('');
        setUserAutocomplete(null);
        setUserOptions([]);
        setNewParticipants([]);
        setDeletedParticipants([]);
        onClose();
        setRefresh(true);
      }
      console.log('Chat updated successfully:', response);
    } catch (error) {
      console.error('Error updating chat:', error);
    }
  }

  useEffect(() => {
    console.log('chatData ',chatData)
    setLoading(true);
    fetchChat();
    setLoading(false);
  }, []);

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
                <ForumIcon sx={{ mr: 1, fontSize: 20, color: '#764ba2' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#764ba2' }}>
                  Edit Chat: {chatData.chat_name || "Chat"}
                </Typography>
              </Box>
            }
            sx={{ 
              backgroundColor: '#f3eafd',
              color: "#764ba2",
              py: 1.5,
              '& .MuiCardHeader-title': {
                color: '#764ba2'
              }
            }}
            action={
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  sx={{
                    color: "#764ba2",
                    bgcolor: "rgba(118,75,162,0.08)",
                    "&:hover": {
                      bgcolor: "rgba(118,75,162,0.18)",
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Cerrar"
                  size="small"
                  sx={{
                    color: "#764ba2",
                    bgcolor: "rgba(118,75,162,0.08)",
                    "&:hover": {
                      bgcolor: "rgba(118,75,162,0.18)",
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
              overflow: 'hidden',
            }}
          >
            { loading ? 
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
              }}>
                <CircularProgress size={150} thickness={5} sx={{ color:'#764ba2' }} />
              </Box>
              :
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', gap: 2, p: 2, overflowY: 'auto' }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#764ba2' }}>
                    Chat Name:
                  </Typography>
                  <TextField
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    fullWidth
                    sx={{ mt: 1, background: '#f3eafd', borderRadius: 1 }}
                  />
                </Box>
                <Box sx={{ width: '100%', border: 1, borderColor: '#764ba2', borderRadius: 1, p: 1, background: '#f8f3ff', mt: 2 }}>
                  <Typography sx={{ color: '#764ba2' }}>
                    Created at: {chat.created_at}{/*moment(chat.created_at).format('DD/MM/YYYY hh:mm')*/}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#764ba2', mt: 1 }}>
                    Participants:
                  </Typography>
                  { chat?.participants.map((participant) => (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #e1d5f7', py: 0.5 }}>
                      {participant.user?.username} - Joined at: {participant.date_joined} {/*moment(participant.date_joined).format('DD/MM/YYYY hh:mm')*/}
                      <DeleteForeverIcon
                          sx={{ '&:hover': { backgroundColor: 'white', color: '#5a4b8a', borderRadius:1 }, color: '#764ba2', ml: 1 }} 
                          onClick={() => handleDeleteParticipant(participant.user)}
                      />
                    </Typography>
                  ))
                  }
                </Box>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#764ba2' }}>
                    Add a new participant:
                  </Typography>
                  <Autocomplete
                    id="user-autocomplete"
                    fullWidth
                    value={userAutocomplete}
                    options={userOptions}
                    getOptionLabel={(user) => user?.username ? `${user.username}` : ''}
                    noOptionsText=""
                    onInputChange={(event, value) => {
                      if (value === '') {
                        setUserAutocomplete(null);
                      }
                      if (value) {
                        fetchUserOptions(value);
                      }
                    }}
                    disablePortal
                    onChange={handleChange}
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiInputBase-root': { height: 40, padding: 0, display: 'flex', alignItems: 'center' },
                      '& .MuiAutocomplete-input': { fontSize: '14px', padding: '0 14px', height: '100%', boxSizing: 'border-box' }
                    }}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          sx={{
                            '& .MuiInputLabel-root': { fontSize: '14px', top: '50%', left: '2%', transform: 'translate(0, -50%)', lineHeight: '1.2' },
                            '& .MuiInputLabel-shrink': { fontSize: '13px', top: -5, transform: 'translate(0, 0)' },
                          }}
                        />
                        {error && <FormHelperText error>{errorMessage}</FormHelperText>}
                      </>
                    )}
                  />
                </Box>

                { newParticipants.length > 0 &&
                  <Box sx={{ width: '100%', border: 1, borderColor: '#764ba2', borderRadius: 1, p: 1, background: '#f8f3ff', mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#764ba2' }}>
                      New Participants:
                    </Typography>
                    { newParticipants.map((participant) => (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #e1d5f7', py: 0.5 }}>
                        {participant.username}
                        <DeleteForeverIcon
                          sx={{ '&:hover': { backgroundColor: 'white', color: '#5a4b8a', borderRadius:1 }, color: '#764ba2', ml: 1 }}
                          onClick={() => deleteNewParticipant(participant)}
                        />
                      </Typography>
                    ))
                    }
                  </Box>
                }

                { deletedParticipants.length > 0 &&
                  <Box sx={{ width: '100%', border: 1, borderColor: '#764ba2', borderRadius: 1, p: 1, background: '#f8f3ff', mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#764ba2' }}>
                      Removed Participants:
                    </Typography>
                    { deletedParticipants.map((participant) => (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #e1d5f7', py: 0.5 }}>
                        {participant.username}
                      </Typography>
                    ))
                    }
                  </Box>
                }
              </Box>
            }
            <Stack direction="row" sx={{ width: '100%', justifyContent: 'space-between', mt:'auto', px:4 }} >
              <Button
                onClick={onClose}
                sx={{
                  bgcolor: "lightgray",
                  color: "black",
                  "&:hover": { bgcolor: "lightgray", color: "black" },
                }}
              >
                Back
              </Button>
              <Button 
                onClick={handleSaveChat}
                sx={{
                  width: '20%', 
                  ml: 'auto',
                  backgroundColor: '#764ba2',
                  borderColor: '#764ba2',
                  color: 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#764ba2',
                    borderColor: '#764ba2',
                    color: 'white',
                  }
                }}
              >
                Save
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
  )
}


export default EditChat;