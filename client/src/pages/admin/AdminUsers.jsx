import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import adminApi from "../../api/adminApi";
import "./styles/AdminUsers.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("ASC");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.getUsers({
                search: search || undefined,
                sortBy,
                sortOrder,
            });

            if (response.success) {
                setUsers(response.data.users || []);
            } else {
                setError(
                    response.message || "Unable to load users"
                );
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [sortBy, sortOrder]);

    const handleSearch = (event) => {
        event.preventDefault();
        loadUsers();
    };

    const handleDelete = async (userId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await adminApi.deleteUser(userId);

            if (!response.success) {
                setError(
                    response.message || "Unable to delete user"
                );
                return;
            }

            setUsers((previous) =>
                previous.filter((user) => user.id !== userId)
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to delete user"
            );
        }
    };

    return (
        <div className="admin-users-page">
            <div className="admin-users-container">
                <header className="admin-users-header">
                    <div>
                        <p>User Management</p>
                        <h1>Manage Users</h1>
                        <span>
                            View, search and manage users in the system.
                        </span>
                    </div>

                    <Link
                        className="admin-users-create"
                        to="/admin/users/create"
                    >
                        Create User
                    </Link>
                </header>

                <section className="admin-users-controls">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search users..."
                        />

                        <button type="submit">
                            Search
                        </button>
                    </form>

                    <div className="admin-users-sort">
                        <label htmlFor="admin-user-sort">
                            Sort by
                        </label>

                        <select
                            id="admin-user-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="address">Address</option>
                            <option value="role">Role</option>
                            <option value="created_at">
                                Created Date
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={() =>
                                setSortOrder((previous) =>
                                    previous === "ASC"
                                        ? "DESC"
                                        : "ASC"
                                )
                            }
                        >
                            {sortOrder === "ASC"
                                ? "Ascending"
                                : "Descending"}
                        </button>
                    </div>
                </section>

                {loading && (
                    <div className="admin-users-message">
                        Loading users...
                    </div>
                )}

                {error && (
                    <div
                        className="admin-users-message error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {!loading && users.length === 0 && (
                    <div className="admin-users-message">
                        No users found.
                    </div>
                )}

                {!loading && users.length > 0 && (
                    <div className="admin-users-table-wrapper">
                        <table className="admin-users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td className="admin-users-role">
                                            {user.role}
                                        </td>

                                        <td className="admin-users-actions">
                                            <Link
                                                to={`/admin/users/${user.id}`}
                                            >
                                                View
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        user.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;