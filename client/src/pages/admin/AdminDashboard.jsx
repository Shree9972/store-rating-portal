import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../api/adminApi";

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

                if (response.success) 
                {
                    setStats(response.data.dashboard);
                } 
                else 
                {
                    setError(response.message || "Unable to load dashboard");
                }
            } 
            catch (error) 
            {
                setError(
                error.response?.data?.message ||
                    "Unable to load dashboard"
                );
            } 
            finally 
            {
                setLoading(false);
            }
        };

        loadDashboard();

    }, []);

    if(loading) 
    {
        return <div>Loading dashboard...</div>;
    }

    return (

    <div>

        <h1>Admin Dashboard</h1>

        {error && <p>{error}</p>}

        <div>

            <div>
                <h2>Total Users</h2>
                <p>{stats.totalUsers}</p>
            </div>

            <div>
                <h2>Total Stores</h2>
                <p>{stats.totalStores}</p>
            </div>

            <div>
                <h2>Total Ratings</h2>
                <p>{stats.totalRatings}</p>
            </div>
            
        </div>

        <hr />

        <div>
            <h2>Management</h2>

            <Link to="/admin/users">
                Manage Users
            </Link>

            {" | "}

            <Link to="/admin/stores">
                Manage Stores
            </Link>

            {" | "}

            <Link to="/admin/users/create">
                Create User
            </Link>

            {" | "}

            <Link to="/admin/stores/create">
                Create Store
            </Link>

        </div>

    </div>
  );
};

export default AdminDashboard;