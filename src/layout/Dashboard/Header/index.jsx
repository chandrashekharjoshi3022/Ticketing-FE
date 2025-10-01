import { useMemo } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// project-imports
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH, MenuOrientation, ThemeMode } from 'config';

// assets
import { HambergerMenu } from 'iconsax-react';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { mode, menuOrientation } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColorOpen = mode === ThemeMode.DARK ? 'background.paper' : 'secondary.200';
  const iconBackColor = mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  // common header
  const mainHeader = (
    <Toolbar sx={{ px: { xs: 2, sm: 4, lg: 4 } }}>
      {!isHorizontal ? (
        <IconButton aria-label="open drawer" onClick={() => handlerDrawerOpen(!drawerOpen)} edge="start" color="secondary">
          <HambergerMenu />
        </IconButton>
      ) : null}
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    elevation: 0,
    sx: {
      // bgcolor: '#B1C9DD',
      // background:
      //   'linear-gradient(180deg, rgba(204,220,235,1) 25%, rgba(197,215,232,1) 50%, rgba(187,207,227,1) 75%, rgba(176,199,221,1) 88%)',
      background: '#A7AAE1',

      backdropFilter: 'blur(8px)',
      // zIndex: 9999,
      width: isHorizontal
        ? '100%'
        : { xs: '100%', lg: drawerOpen ? `calc(100% - ${DRAWER_WIDTH - 25}px)` : `calc(100% - ${MINI_DRAWER_WIDTH - 25}px)` },
      height: '50px',
      display: 'flex',
      justifyContent: 'center'
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}
