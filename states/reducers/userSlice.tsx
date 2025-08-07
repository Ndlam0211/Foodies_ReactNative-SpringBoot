import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Định nghĩa kiểu dữ liệu cho state
interface UserState {
  user: any; 
  isVegMode: boolean;
}

// State khởi tạo ban đầu
const initialState: UserState = {
  user: {},
  isVegMode: false,
};

// Tạo slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
    setVegMode: (state, action: PayloadAction<boolean>) => {
      state.isVegMode = action.payload;
    },
  },
});

// Export action
export const { setUser, setVegMode } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user?.user;
export const selectVegMode = (state: RootState) => state.user?.isVegMode;
