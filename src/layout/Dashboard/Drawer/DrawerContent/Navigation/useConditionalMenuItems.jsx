// hooks/useConditionalMenuItems.js
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../../../../features/auth/authSlice';
import menuItem from '../../../../../menu-items';

const useConditionalMenuItems = () => {
  const userRole = useSelector(selectUserRole);


  console.log('User Role here it is :', userRole); // Debugging line to check user role
console.log('User menuItem here it is :', menuItem);

  const conditionalMenuItems = useMemo(() => {
    // If user is 'user' or 'executive', filter out MasterTabMenu
    if (userRole === 'user' || userRole === 'executive') {
      return {
        items: menuItem.items.filter(item => 
          item.id !== 'OPR' // Adjust this based on your actual MasterTabMenu id
        )
      };
    }
    
    // For other roles, return all menu items
    return menuItem;
  }, [userRole]);

  return conditionalMenuItems;
};

export default useConditionalMenuItems;