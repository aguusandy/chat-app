import {
  THEME_ID,
  unstable_createMuiStrictModeTheme,
} from "@mui/material/styles";

// Crear el tema base
const theme = unstable_createMuiStrictModeTheme();

// Colores personalizados en la paleta
theme.palette.primary.main = '#764ba2'; // Violeta principal
theme.palette.primary.secondary = '#667eea'; // Violeta claro
theme.palette.primary.info = '#C3D9FF'; // Azul claro (puedes ajustar si quieres otro tono)
theme.palette.secondary.main = '#667eea'; // Violeta claro
theme.palette.text.primary = '#213547';
theme.palette.text.secondary = '#535bf2';
theme.palette.background.default = '#f3f4f6';
theme.palette.background.paper = '#fff';
theme.palette.common.black = '#121212';
theme.palette.common.white = '#fff';

// Propiedades personalizadas fuera de la paleta
theme.accent = '#5a4b8a'; // Violeta intermedio
theme.border = '#e1d5f7';
theme.grayDark = '#242424';
theme.backgroundGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
theme.backgroundGradientAlt = 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)';

export default theme;
