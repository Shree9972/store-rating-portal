import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import adminApi from "../../api/adminApi";
import "./styles/AdminUserDetails.css";

const AdminUserDetails = () => {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getUserById(userId);

                console.log(response);

                if (response.success) {
                    setUser(response.data.user);
                } else {
                    setError(
                        response.message || "Unable to load user"
                    );
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Unable to load user"
                );
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [userId]);

    if (loading) {
        return (
            <div className="admin-user-page">
                <div className="admin-user-container">
                    <div className="admin-user-message">
                        Loading user...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-user-page">
                <div className="admin-user-container">
                    <div className="admin-user-message error">
                        <p>{error}</p>

                        <Link
                            className="admin-user-back"
                            to="/admin/users"
                        >
                            ← Back to Users
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="admin-user-page">
                <div className="admin-user-container">
                    <div className="admin-user-message">
                        <p>User not found.</p>

                        <Link
                            className="admin-user-back"
                            to="/admin/users"
                        >
                            ← Back to Users
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-user-page">
            <div className="admin-user-container">
                <Link
                    className="admin-user-back"
                    to="/admin/users"
                >
                    ← Back to Users
                </Link>

                <header className="admin-user-header">
                    <p>User Management</p>
                    <h1>User Details</h1>
                    <span>
                        View the user's account information and stores.
                    </span>
                </header>

                <section className="admin-user-card">
                    <h2>Account Information</h2>

                    <div className="admin-user-info">
                        <div>
                            <span>Name</span>
                            <strong>{user.name}</strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>{user.email}</strong>
                        </div>

                        <div>
                            <span>Address</span>
                            <strong>{user.address}</strong>
                        </div>

                        <div>
                            <span>Role</span>
                            <strong className="admin-user-role">
                                {user.role}
                            </strong>
                        </div>
                    </div>
                </section>

                {user.role === "owner" && (
                    <section className="admin-user-card">
                        <h2>Store Information</h2>

                        {user.stores && user.stores.length > 0 ? (
                            <div className="admin-user-table-wrapper">
                                <table className="admin-user-table">
                                    <thead>
                                        <tr>
                                            <th>Store</th>
                                            <th>Email</th>
                                            <th>Address</th>
                                            <th>Rating</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {user.stores.map((store) => (
                                            <tr key={store.id}>
                                                <td>{store.name}</td>
                                                <td>{store.email}</td>
                                                <td>{store.address}</td>
                                                <td>
                                                    {store.average_rating ??
                                                        "No ratings"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="admin-user-empty">
                                This owner has no stores.
                            </p>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};

export default AdminUserDetails;