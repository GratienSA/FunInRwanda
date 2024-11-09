
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import userLoggedReducer, { setUser } from "./slice/userLoggedSlice";
import showModalReducer from "./slice/showModalSlice";


const rootReducer = combineReducers({
    userLogged: userLoggedReducer,
    showModal: showModalReducer,
});

export type RootState = {
    userLogged: ReturnType<typeof userLoggedReducer>;
    showModal: ReturnType<typeof showModalReducer>;
   
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
