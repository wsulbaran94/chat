import React from "react";
const { useState, useEffect } = require("react");
const { verifyToken } = require("../Auth/Auth");
import {  alertService } from '../Alert/Alert'


const AuthContext = React.createContext();
const { Provider } = AuthContext;


const AuthProvider = ({children}) => {

    const [verified, setVerified] = useState(false);
    
    
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('user'));
        const verify = async  (token) => {
            await verifyToken(token.data[1].token)
            .then(response => {
                setVerified(response.data[0])
            })
            .catch(error => {
                if (!error.data[0]) {
                    setVerified(error.data[0])
                    alertService.error(error.data[1]);
                    localStorage.removeItem('user');
                }
            }) 
        };

        verify(token);                

    }, []);
    
    const isUserAuthenticated = () => {
        if (!verified) {
            return false;
        }
    };

    return (
        <Provider
            value={{
                verified,
                setAuthState: (userAuthInfo) => setUserAuthInfo(userAuthInfo),
                isUserAuthenticated,
            }}
        >
            {children}
        </Provider>
    )
    
}

export { AuthContext, AuthProvider };

