import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {
    const { changePassword } = useAuth();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
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

        setMessage("");
        setError("");

        if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
        ) {
        setError("All fields are required");
        return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        return;
        }

        try {
        setLoading(true);

        const response = await changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        });

        if (!response.success) {
            setError(response.message || "Unable to change password");
            return;
        }

        setMessage("Password changed successfully");

        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        } catch (error) {
        setError(
            error.response?.data?.message ||
            "Unable to change password. Please try again."
        );
        } finally {
        setLoading(false);
        }
    };

    return (
        <div>
        <h1>Change Password</h1>

        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="currentPassword">
                Current Password
            </label>

            <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
            />
            </div>

            <div>
            <label htmlFor="newPassword">
                New Password
            </label>

            <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
            />
            </div>

            <div>
            <label htmlFor="confirmPassword">
                Confirm New Password
            </label>

            <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
            />
            </div>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            <button type="submit" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
            </button>
        </form>
        </div>
    );
};

export default ChangePassword;