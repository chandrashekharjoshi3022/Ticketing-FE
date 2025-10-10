import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import ticketReducer from "../features/tickets/ticketSlice";
import categoryReducer from 'features/categories/categorySlice';
import subcategoriesReducer from 'features/subcategories/subcategorySlice';
import prioritiesReducer from 'features/priorities/prioritySlice';
import usersReducer from 'features/users/usersSlice'; // Add this line
import slaReducer from 'features/sla/slaSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    categories: categoryReducer,
    subcategories: subcategoriesReducer,
    priorities: prioritiesReducer,
    users: usersReducer, // Add this line
    sla: slaReducer

  },
});

export default store;
