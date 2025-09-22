import { useCallback, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project import
import IconButton from 'components/@extended/IconButton';
import { ThemeMode } from 'config';

// assets
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';

// ==============================|| HEADER CONTENT - FULLSCREEN ||============================== //

export default function FullScreen() {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
    if (document && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'background.paper' : 'secondary.200';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title={open ? ' Fullscreen' : 'Exit Fullscreen'}>
        <IconButton onClick={handleToggle}>{open ? <FullscreenExit /> : <Fullscreen />}</IconButton>
      </Tooltip>
    </Box>
  );
}
