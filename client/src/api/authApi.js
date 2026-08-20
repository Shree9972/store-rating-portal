import api from "./axios";

export const registerUser = async (userData) => {

    const response = await api.post("/auth/register", userData);
    return response.data;

};

export const loginUser = async (credentials) => {

    const response = await api.post("/auth/login", credentials);
    return response.data;

};

//the user who is currently logged in 
export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.patch("/auth/change-password", passwordData);
    return response.data;
};