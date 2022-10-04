import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export const getAllUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get(USERS_URL);
    return response.data
  }
);


const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action)=> {
      return action.payload;
    })
  }
})

export const selectAllUsers = (state) => state.users

export default userSlice.reducer
