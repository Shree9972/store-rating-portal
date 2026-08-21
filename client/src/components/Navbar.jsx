import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if(!user) 
    {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (

        <nav>
            <div>
                <Link to="/">Store Rating Platform</Link>
            </div>

            <div>
                <span>
                    Welcome, {user.name}
                </span>

                <span>
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

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;