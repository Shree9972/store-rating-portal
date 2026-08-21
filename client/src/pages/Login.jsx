import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/Login.css";

const Login = () => {
    const { login, user } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // if(user) 
    // {
    //     return <Navigate to="/" replace />;
    // }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            //cakll the login functionality form here
            const response = await login(formData);

            if (!response.success) {
                setError(response.message || "Login failed");
                return;
            }

            const role = response.data.user.role;

            //change the dashboard according to the role we have 
            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "owner") {
                navigate("/owner/dashboard");
            } else {
                navigate("/stores");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Login</h1>

                <p className="login-subtitle">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;