import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //check if the token is valid and if valid then get particular user here
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) 
        {
            setLoading(false);
            return;
        }

        const loadUser = async () => {

            try 
            {
                const response = await getCurrentUser();
                setUser(response.data.user);
                console.log(response);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                
            } 
            catch(error)
            {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } 
            finally 
            {
                setLoading(false);
            }
        };

        loadUser();

    }, []);

    const login = async (credentials) => {

        const response = await loginUser(credentials);
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        return response;
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    const changePassword = async (passwordData) => {

        return await authApi.changePassword(passwordData);

    };

    return (

        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: Boolean(user),changePassword}}>
            {children}
        </AuthContext.Provider>

    );
};

export const useAuth = () => useContext(AuthContext);