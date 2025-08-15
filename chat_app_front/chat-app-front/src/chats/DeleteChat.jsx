import React from 'react'
import apiRequest from '../Apis';
import { Box, Button, Stack, Typography } from '@mui/material';

function DeleteChat({ chatData, onClose, setRefresh }) {

  const handleDelete = async () => {
    try {
      const body = {
        'chat_id': chatData.chat_id,
        'is_eliminated': true
      }
      const response = await apiRequest(`chats/${chatData.chat_id}/eliminate_chat/`, 'POST', body);
      if (response.status === 200) {
        setRefresh(true);
        onClose();
      }
    } catch (error) {
      console.log('Error deleting chat:', error);
    }
  }

  return (
    <Box 
        sx={{
            px:2,
            pt:3
        }}
    >
        <Typography 
            sx={{
                color:'#764ba2',
                fontWeight: 'bold',
            }}
        >
            Are you sure you want to delete this chat?
        </Typography>
        <Typography
            sx={{
                color:'#764ba2',
                fontWeight: 'bold',
                fontSize:'1.25rem',
                textAlign:'center',
                py:2
            }}
        >
            {chatData.chat_name}
        </Typography>
        <Stack direction="row" sx={{ width: '100%', justifyContent: 'space-between', mt:'auto', px:4, py:2 }} >
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
            onClick={handleDelete}
            sx={{
                width: '25%', 
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
            Delete
            </Button>
        </Stack>
    </Box>
  )
}

export default DeleteChat;