import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import MessageIcon from '@mui/icons-material/Message';
import InsertPageBreakIcon from '@mui/icons-material/InsertPageBreak';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useState } from 'react';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

function ResponsiveAppBar({ showAvatar, setShowAvatar }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function stringAvatar(name) {
    let username = name;
    if( name !== "User" ){
        username = JSON.parse(name)['username']
    }
    
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${username.split(' ')[0][0]}`.toUpperCase(),
    };
  }

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  const changePage = (path) => {
    setOpen(false);
    navigate(path);
  }


  const logOut = () => {
    if( sessionStorage.token ){
        sessionStorage.removeItem('token')
    }
    if( sessionStorage.user_data ){
    sessionStorage.removeItem('userData')
    }
    setShowAvatar(false);
    handleDrawerClose();
    navigate('');
  }

  return (
    <>
        <AppBar position="fixed" open={open} sx={{ backgroundColor:"#121212" }}>
        <Toolbar>
          <ChatIcon />
          <Typography variant="h5" noWrap component="div" flex={1} mx={8}>
            Chat APP
          </Typography>
          { showAvatar &&
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                open && { display: 'none' },
                ]}
            >
                <Avatar {...stringAvatar( sessionStorage.userData || 'User')} />
            </IconButton>
          }
        </Toolbar>
      </AppBar>
      { open &&
        <Drawer
            sx={{
            width: '20vw',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: '20vw',
                boxSizing: 'border-box',
                backgroundColor:'#121212',
                color:'white'
            },
            }}
            anchor="right"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon sx={{  color:'white' }}/>
                </IconButton>
                <Typography variant="h7" noWrap component="div" flex={1}>
                    Chat APP
                </Typography>
            </DrawerHeader>
            <Divider />
            <List >
              <ListItem key={0} disablePadding>
                <ListItemButton onClick={() => changePage('/home')}>
                    <ListItemIcon>
                      <MessageIcon sx={{  color:'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary={"Chats"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={0} disablePadding>
                <ListItemButton onClick={() => changePage('/rag')}>
                    <ListItemIcon>
                      <InsertPageBreakIcon sx={{  color:'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary={"RAG"} />
                </ListItemButton>
              </ListItem>
              <ListItem key={0} disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                      <HelpIcon sx={{  color:'white' }}/>
                    </ListItemIcon>
                    <ListItemText primary={"About"} />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem key={1} disablePadding onClick={ () => logOut() }>
                <ListItemButton>
                  <ListItemIcon>
                    <ExitToAppIcon sx={{  color:'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary={"Log out"} />
                </ListItemButton>
              </ListItem>
            </List>
        </Drawer>
      }
    </>
  );
}
export default ResponsiveAppBar;