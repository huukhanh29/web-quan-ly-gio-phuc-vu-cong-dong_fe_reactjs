import { configureStore } from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import authReducer from "./authSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import thunk from "redux-thunk";
import persistStore from "redux-persist/es/persistStore";
const persistConfig = {
    key: "app",
    storage,
    whitelist: ["token"],
    stateReconciler: autoMergeLevel2
}
const persistedReducer = persistReducer(persistConfig, authReducer)
export const store = configureStore({
  reducer: {
    auth: persistedReducer  // Khai báo 1 slide tên là user với giá trị là userReducer được export ở file userSlice
    // Có thể khai báo nhiều slide khác tương tự
  },
  middleware: [thunk]
});
export const persistor = persistStore(store)
