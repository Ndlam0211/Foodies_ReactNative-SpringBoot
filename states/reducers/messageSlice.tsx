import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MessageType = "info" | "success" | "warning" | "error";

export interface Message {
  id: string;
  message: string;
  type: MessageType;
  autoHide?: boolean;
  autoHideDuration?: number;
  position?: "top" | "center" | "bottom";
  showCloseButton?: boolean;
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

let messageId = 0;

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    showMessage: (state, action: PayloadAction<Omit<Message, "id">>) => {
      const message: Message = {
        id: `msg_${messageId++}_${Date.now()}`,
        autoHide: true,
        autoHideDuration: 4000,
        position: "top",
        showCloseButton: true,
        ...action.payload,
      };

      // Remove existing message of same type if position is the same
      state.messages = state.messages.filter(
        (msg) =>
          !(msg.type === message.type && msg.position === message.position)
      );

      state.messages.push(message);
    },

    hideMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },

    hideAllMessages: (state) => {
      state.messages = [];
    },

    hideMessagesByType: (state, action: PayloadAction<MessageType>) => {
      state.messages = state.messages.filter(
        (msg) => msg.type !== action.payload
      );
    },
  },
});

export const { showMessage, hideMessage, hideAllMessages, hideMessagesByType } =
  messageSlice.actions;

export default messageSlice.reducer;
