import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    Store Rating Platform
                </Link>
            </div>

            <div className="navbar-links">
                <span className="navbar-welcome">
                    Welcome, {user.name}
                </span>

                <span className="navbar-role">
                    Role: {user.role}
                </span>

                {user.role === "admin" && (
                    <Link to="/admin/dashboard">
                        Dashboard
                    </Link>
                )}

                {user.role === "owner" && (
                    <Link to="/owner/dashboard">
                        Dashboard
                    </Link>
                )}

                {user.role === "user" && (
                    <Link to="/stores">
                        Stores
                    </Link>
                )}

                <Link to="/change-password">
                    Change Password
                </Link>

                <button
                    className="navbar-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;