import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project-imports
import Search from './Search';
import Message from './Message';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import FullScreen from './FullScreen';
import { useDispatch, useSelector } from 'react-redux';
import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/Dashboard/Drawer/DrawerHeader';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const { menuOrientation } = useConfig();
  const currentUser = useSelector(selectCurrentUser);
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <div style={{ display: 'flex', width: '250px', textTransform: 'capitalize' }}>Welcome, {currentUser?.username}</div>
      {/* <Notification /> */}
      <FullScreen />
      {/* <Message /> */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
