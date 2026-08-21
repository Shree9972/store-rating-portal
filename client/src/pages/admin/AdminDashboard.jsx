import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import adminApi from "../../api/adminApi";
import "./styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getDashboardStats();

                if (response.success) {
                    setStats(response.data.dashboard);
                } else {
                    setError(
                        response.message ||
                            "Unable to load dashboard"
                    );
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-message">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                <header className="admin-header">
                    <p>Administration</p>
                    <h1>Admin Dashboard</h1>
                    <span>
                        Overview of users, stores, ratings and management options.
                    </span>
                </header>

                {error && (
                    <div className="admin-message error" role="alert">
                        {error}
                    </div>
                )}

                <section className="admin-stats">
                    <div className="admin-stat">
                        <span>Total Users</span>
                        <strong>{stats.totalUsers}</strong>
                    </div>

                    <div className="admin-stat">
                        <span>Total Stores</span>
                        <strong>{stats.totalStores}</strong>
                    </div>

                    <div className="admin-stat">
                        <span>Total Ratings</span>
                        <strong>{stats.totalRatings}</strong>
                    </div>
                </section>

                <section className="admin-management">
                    <h2>Management</h2>

                    <div className="admin-links">
                        <Link to="/admin/users">
                            Manage Users
                        </Link>

                        <Link to="/admin/stores">
                            Manage Stores
                        </Link>

                        <Link to="/admin/users/create">
                            Create User
                        </Link>

                        <Link to="/admin/stores/create">
                            Create Store
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;