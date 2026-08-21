import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import "./styles/Register.css";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

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
        setSuccess("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.address
        ) {
            setError("All fields are required");
            return;
        }

        try {

            setLoading(true);

            const response = await registerUser(formData);

            if (!response.success) {
                setError(response.message || "Registration failed");
                return;
            }

            setSuccess(
                "Registration successful. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        }
        catch (error)
        {
            setError(
                error.response?.data?.message ||
                "Unable to register. Please try again."
            );
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <h1>Create Account</h1>

                <p className="register-subtitle">
                    Create an account to get started
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="register-field">
                        <label htmlFor="name">Name</label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="address">Address</label>

                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            rows="4"
                        />
                    </div>

                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="register-success">
                            {success}
                        </p>
                    )}

                    <button
                        className="register-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>

                <p className="register-login">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    );
};

export default Register;