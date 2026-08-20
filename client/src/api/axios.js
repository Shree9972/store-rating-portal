import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" }

});

//it would be run before making request to backend
api.interceptors.request.use((config) => {

        const token = localStorage.getItem("token");

        //no token fo r functionality where we dont need token like login and registration
        if(token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)

);

//it catches te backend response here and intercepts the error
api.interceptors.response.use( (response) => response, (error) => {

        //this is error when the token expird or invalid
        if(error.response?.status === 401)
        {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        return Promise.reject(error);
    }
);

export default api;