// https://react-redux.js.org/using-react-redux/usage-with-typescript
// https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/
import { configureStore } from "@reduxjs/toolkit";

// persist
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

import userReducer from "./userSlice";

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, userReducer);

// defualt store without persistence
// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
// export default store;
