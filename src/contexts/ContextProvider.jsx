import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    sessionExpired: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
    setSessionExpired: () => {}
});

export const ContextProvider = ({children}) => {
    const [user, setUser ] = useState({});
    const [notification, _setNotification] = useState('')
    const [token, _setToken ] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [sessionExpired , setSessionExpired] = useState(false);

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('')
        }, 5000 )
    }

    const setToken = (token) => {
        _setToken(token)
        if (token){
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }
    return (
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            notification,
            sessionExpired,
            setNotification,
            setSessionExpired
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)