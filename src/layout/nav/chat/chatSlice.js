import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVICE_URL } from 'config.js';

const initialState = {
  status: 'idle',
  items: [],
};

const chatSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationsLoading(state) {
      state.status = 'loading';
    },
    notificationsLoaded(state, action) {
      state.items = action.payload;
      state.status = 'idle';
    },
  },
});

export const { notificationsLoading, notificationsLoaded } = chatSlice.actions;

export const fetchNotifications = () => async (dispatch) => {
  dispatch(notificationsLoading());
  const response = await axios.get(`${SERVICE_URL}/notifications`);
  dispatch(notificationsLoaded(response.data));
};

const notificationReducer = chatSlice.reducer;
export default notificationReducer;
