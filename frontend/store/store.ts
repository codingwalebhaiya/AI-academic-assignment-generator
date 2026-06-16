// redux store 

import { configureStore } from "@reduxjs/toolkit";
import assignmentReducer from './slices/assignmentSlice';
import websocketReducer from './slices/websocketSlice';


export const store = configureStore({
    reducer: {
        assignment: assignmentReducer,
        websocket: websocketReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 