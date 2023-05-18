import { configureStore } from "@reduxjs/toolkit";
import { articleApi } from "./article";


// See docs: https://redux-toolkit.js.org/api/configureStore

// A store is a Global State, that saves the entire information of our App
export const store = configureStore({
    // Reducer allows us to get a specific part of the Global State
    reducer: {
        [articleApi.reducerPath]: articleApi.reducer
    },
    // Middleware allows us to do something with the state before we get it.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(articleApi.middleware)
})