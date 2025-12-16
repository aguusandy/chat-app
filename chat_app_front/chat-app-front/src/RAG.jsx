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
    LinearProgress,
    styled,
    Stack,
    FormHelperText,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableRow
  } from '@mui/material'
import './App.css'
import apiRequest from './Apis'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BackupIcon from '@mui/icons-material/Backup';
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import SeeFile from './components/SeeFIle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { set } from 'lodash';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
  // type:'file'
});


function RAG() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [listMessages, setListMessages] = useState([]);

  const [files, setFiles] = useState([]);
  const [filesLoaded, setFilesLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [fileSelected, setFileSelected] = useState(null);
  const [openModalFile, setOpenModalFile] = useState(false);
  const [newFilesToLoad, setNewFilesToLoad] = useState(false);

  const [validatedFiles, setValidatedFiles] = useState([]);

  const fileTypes = [
    "application/doc",
    "application/docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/msword", // doc
    "application/pdf"
  ];


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



  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if( file && !files.some(f => f.name === file.name) ){
      if( fileTypes.includes(file.type) ){
        const newFiles = [...files, file];
        setFiles(newFiles);
        setError(false);
        setErrorMessage('');
        setNewFilesToLoad(true);
        // setFilesLoaded(true);
      }else{
        setError(true);
        setErrorMessage(`The type of the file "${file.name}" is not allowed.`);
      }
    }else{
      setError(true);
      setErrorMessage('The file could not be loaded. It may already be loaded.');
    }
  };

  const handleCloseModal = () => {
    setOpenModalFile(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if ( message /*message.trim()*/ ) {
      sendMessage(chatData.chat_id, message);
    }
  };

  const handleSeeFile = (file) => {
    setFileSelected(file);
    setOpenModalFile(true);
  };

  const handleDelete = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSelectFile = () => {
  }

  const handleSaveFiles = async () => {
    const formData = new FormData();
    const filesFiltered = files.filter(file => !validatedFiles.includes(file.name));
    for (let i = 0; i < filesFiltered.length; i++) {
      formData.append('files', filesFiltered[i]);
    }
    
    try {
      const response = await apiRequest('filesuser/', 'POST', formData);
      
      if (response.status === 200 || response.status === 201) {
        const newValidatedFiles = response.files.map(f => f.filename);
        setValidatedFiles([...validatedFiles, ...newValidatedFiles]);
        setError(false);
        setErrorMessage('');
        setFilesLoaded(true);
        setNewFilesToLoad(false);
      } else {
        setError(true);
        setErrorMessage('Error saving files.' + (response.detail ? response.detail : ''));
      }
    } catch (error) {
      console.log('Error saving files:', error);
      setError(true);
      setErrorMessage('Error saving files.' + (error.detail ? error.detail : ''));
      return;
    }
  };


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
    <Container maxWidth="md">
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
                paddingX: 4,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '60vh'
              }}
            >
            <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontSize: '1.5rem',
                  marginBottom: 1,
                  mx:'auto',
                  textDecoration: 'underline',
                  color:'#764ba2',
                  fontWeight:450
                }}
              >
                Welcome {userData.username} to the RAG section
              </Typography>
                <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 'auto',
                      gap: 2,
                      mx: 'auto',
                      height: '8vh',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      {files.length === 0 ? (
                        <Typography
                          sx={{
                            fontWeight: '16px',
                            color: 'text.primary',
                            mb: 0.5,
                          }}
                        >
                          No files loaded yet.
                        </Typography>
                      ) : 
                      ( newFilesToLoad &&
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                          <Button
                            sx={{
                              height: '6vh',
                              border: 2,
                              color: '#764ba2',
                              borderRadius: 4,
                              cursor: 'pointer',
                              mr: 1,
                              backgroundColor: 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              '&:hover': {
                                backgroundColor: '#764ba2',
                                borderColor: '#764ba2',
                                color: 'white',
                              },
                            }}
                            onClick={handleSaveFiles}
                          >
                            <BackupIcon />
                            Save
                          </Button>
                          <Typography
                            sx={{
                              color: 'text.primary',
                              ml: 1,
                              fontWeight:'bold'
                            }}
                          > 
                            {files.filter(file => !validatedFiles.includes(file.name)).length} files
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Button
                      sx={{
                        height: '6vh',
                        border: 2,
                        color: '#764ba2',
                        borderRadius: 4,
                        mx: 1,
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          backgroundColor: '#764ba2',
                          borderColor: '#764ba2',
                          color: 'white',
                        },
                      }}
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                    >
                      <AttachFileIcon />
                      Load Files
                      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                    </Button>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography
                        component="h1"
                        sx={{
                          fontWeight: '16px',
                          color: 'text.primary',
                          mb: 0.5,
                        }}
                      >
                        Or
                      </Typography>
                      <Button
                        sx={{
                          height: '6vh',
                          border: 2,
                          color: '#764ba2',
                          borderRadius: 4,
                          ml: 1,
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            backgroundColor: '#764ba2',
                            borderColor: '#764ba2',
                            color: 'white',
                          },
                        }}
                        onClick={handleSelectFile}
                      >
                        <PictureAsPdfIcon />
                        Select File
                      </Button>
                    </Box>
                  </Box>
                <Stack>
                  <Box
                    sx={{
                      borderBottom: 1, 
                      p: 1,
                      borderColor:'lightgray'
                    }}
                  >
                    { files && files.length > 0 &&
                      <TableContainer
                        style={{ maxHeight: "15vh", overflowY: "auto" }}
                      >
                        <Table aria-label="simple table">
                          <TableBody>
                            { files.map((file, index) => (
                              <TableRow key={index} sx={{ border:2, borderColor:'#764ba2' }}>
                                  <TableCell 
                                    align="left" 
                                    sx={{ color:'#764ba2', cursor:'pointer', maxHeight: '5vh', height: '5vh', overflow: 'hidden', py: 0, px:2 }}
                                    onClick={() => handleSeeFile(file)}
                                  >
                                    {file.name}
                                  </TableCell>
                                  { !filesLoaded && !validatedFiles.includes(file.name) &&
                                    <TableCell 
                                      align="right"
                                      sx={{ maxHeight: '5vh', height: '5vh', overflow: 'hidden', padding: 0 }}
                                    >
                                      <CloseIcon
                                        sx={{ color: "red", cursor:'pointer' }}
                                        onClick={() => handleDelete(index)}
                                      />
                                    </TableCell>
                                  }
                                  { validatedFiles.includes(file.name) &&
                                    <TableCell 
                                      align="right"
                                      sx={{ maxHeight: '5vh', height: '5vh', overflow: 'hidden', padding: 0, mr:2 }}
                                    >
                                      <CheckCircleIcon
                                        sx={{ color: "green", cursor:'pointer' }}
                                        onClick={() => handleDelete(index)}
                                      />
                                    </TableCell>
                                  }
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    }
                    {error && <FormHelperText error sx={{ textAlign:'center' }}>{errorMessage}</FormHelperText>}
                  </Box>
                </Stack>
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
                        height: '50vh',
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
                            height: '41vh',
                        }}
                    >
                    { loading ? 
                        <Box sx={{ 
                          flex: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                          }}
                        >
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

      <Modal open={openModalFile} onClose={handleCloseModal}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
           position: 'absolute',
           width: '100%',
           height: '100%', 
           bgcolor: 'rgba(0, 0, 0, 0.5)', 
           zIndex: 9999, 
          }}
         >
           <Grid item xs={10} sm={8} md={6} lg={4}> 
            <Box
             sx={{
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 10
             }}
             >
              <SeeFile fileSelected={fileSelected} onClose={handleCloseModal}/>
            </Box>
           </Grid>
         </Grid>       
      
      </Modal>

    </Box>
  )
}

export default RAG;