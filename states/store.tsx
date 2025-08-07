import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import reduxStorage from "./storage";
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage: reduxStorage,
  whitelist: ["user", "cart"], // các slice cần lưu vào storage
  blacklist: [], // nếu không có thì có thể bỏ dòng này
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE],
      },
    }),
});

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
