// app/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import userLoggedReducer, { setUser } from "./slice/userLoggedSlice";
import showModalReducer from "./slice/showModalSlice";
import themeReducer from "./slice/themeSlice";

const rootReducer = combineReducers({
    userLogged: userLoggedReducer,
    showModal: showModalReducer,
    theme: themeReducer
});

export type RootState = {
    userLogged: ReturnType<typeof userLoggedReducer>;
    showModal: ReturnType<typeof showModalReducer>;
    theme: ReturnType<typeof themeReducer>;
};

const store = configureStore({
    reducer: rootReducer,
});


export const initializeStore = () => {
    if (typeof window !== 'undefined') {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                store.dispatch(setUser(user));
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error);
            }
        }
    }
};

export default store;
