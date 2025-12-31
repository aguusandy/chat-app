import React, { useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Box,
  IconButton,
  Button,
} from "@mui/material";

import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const SeeFile = ({ fileSelected, onClose }) => {

  const [file, setFile] = useState(fileSelected);
  const [fileSRC, setFileSRC] = useState(URL.createObjectURL(fileSelected));

  const [isFullSize, setIsFullSize] = useState(false);

  const handleFullSize = () => {
    setIsFullSize(!isFullSize);
  };

  const handleClose = () => {
    onClose();
  };

  // variables para hacer un zoom: solo esta contemplado en las imagenes, ya que el embed
  // al mostrar el pdf ya muestra esa opcion de hacer zoom
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.5, 3)); // Limitar el zoom máximo a 3x
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.5, 0.5)); // Limitar el zoom mínimo a 0.5x
  };


  return (
    <Card sx={{ boxShadow: "none", width: '100%' ,}}>
      <CardHeader
        title="File to upload"
        disableTypography={false}
        titleTypographyProps={{ fontSize: 20, textAlign: "center" }}
        sx={{ backgroundColor: '#764ba2', color: "white", height: "35px" }}
        action={
          <Stack justifyContent="space-between" direction="row" px={1}>
            <Box width={8} />
            <IconButton
              aria-label="Close"
              sx={{
                bgcolor: '#764ba2',
                color: "white",
                padding: "2px",
                "&:hover": {
                  bgcolor: '#764ba2',
                  color: "white",
                },marginTop: "-17px"
              }}
              onClick={handleClose}
            >
              x
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
      <Grid
        sx={{
          width: window.innerWidth * 0.9,
          height: isFullSize ? window.innerHeight*0.85 : window.innerHeight * 0.8,
          p: 0,
          overflowY:'auto',
          display: 'grid',
          placeItems: 'center',
          position: isFullSize ? 'relative' : 'relative',
          top: isFullSize ? 0 : 'auto',
          left: isFullSize ? 0 : 'auto',
          zIndex: isFullSize ? 1300 : 'auto', 
          bgcolor: isFullSize ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
        }}
      >
        <embed
          src={fileSRC}
          type={file.type}
          alt={file.name ? file.name : "File"}
          style={{
            maxWidth: '100%',
            minWidth: file.type === "application/pdf" ? '100%' : 'auto',
            height: file.type === "application/pdf" ? 
              (isFullSize ? '100vh' : window.innerHeight * 0.8) 
              : 
              (isFullSize ? window.innerHeight : 'auto'),
            maxHeight: file.type !== "application/pdf" && (isFullSize ? '100%' : window.innerHeight * 0.8),
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Grid>
      <Grid sx={{ mx: "auto", my: 1, display: 'flex', justifyContent: "space-between", width: isFullSize ? '100%' : '80%' }}>
        <Button
          onClick={handleClose}
          sx={{
            bgcolor: "lightgray",
            color: "black",
            "&:hover": { bgcolor: "lightgray", color: "black" },
          }}
        >
          Close
        </Button>
        {file.type !== "application/pdf" &&
          <Stack direction="row" spacing={1} justifyContent="center" mt={1} my={'auto'}>
            <Button variant="contained" onClick={handleZoomOut}
              sx={{ paddingX: 0.5, minWidth: "auto", width: "fit-content", height: "fit-content" }}>
              <ZoomOutIcon />
            </Button>
            <Button variant="contained" onClick={handleZoomIn}
              sx={{ paddingX: 0.5, minWidth: "auto", width: "fit-content", height: "fit-content" }}>
              <ZoomInIcon />
            </Button>
            <Button variant="contained" onClick={handleFullSize}
              sx={{ paddingX: 0.5, minWidth: "auto", width: "fit-content", height: "fit-content" }}>
              {isFullSize ? <FullscreenExitIcon/> : <FullscreenIcon />}
            </Button>
          </Stack>
        }
      </Grid>
      </CardContent>
    </Card>
  );
};

export default SeeFile;

