import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import adminApi from "../../api/adminApi";
import "./styles/AdminStores.css";

const AdminStores = () => {
    const [stores, setStores] = useState([]);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("ASC");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStores = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.getStores({
                search: search || undefined,
                sortBy,
                sortOrder,
            });

            if (response.success) {
                setStores(response.data.stores || []);
            } else {
                setError(
                    response.message || "Unable to load stores"
                );
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load stores"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, [sortBy, sortOrder]);

    const handleSearch = (event) => {
        event.preventDefault();
        loadStores();
    };

    return (
        <div className="admin-stores-page">
            <div className="admin-stores-container">
                <header className="admin-stores-header">
                    <div>
                        <p>Store Management</p>
                        <h1>Manage Stores</h1>
                        <span>
                            View and manage all stores in the system.
                        </span>
                    </div>

                    <Link
                        className="admin-stores-create"
                        to="/admin/stores/create"
                    >
                        Create Store
                    </Link>
                </header>

                <section className="admin-stores-controls">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search stores..."
                        />

                        <button type="submit">
                            Search
                        </button>
                    </form>

                    <div className="admin-stores-sort">
                        <label htmlFor="admin-sort">
                            Sort by
                        </label>

                        <select
                            id="admin-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="address">Address</option>
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
                    <div className="admin-stores-message">
                        Loading stores...
                    </div>
                )}

                {error && (
                    <div
                        className="admin-stores-message error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {!loading && stores.length === 0 && (
                    <div className="admin-stores-message">
                        No stores found.
                    </div>
                )}

                {!loading && stores.length > 0 && (
                    <div className="admin-stores-table-wrapper">
                        <table className="admin-stores-table">
                            <thead>
                                <tr>
                                    <th>Store Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Owner</th>
                                    <th>Owner Email</th>
                                    <th>Created</th>
                                </tr>
                            </thead>

                            <tbody>
                                {stores.map((store) => (
                                    <tr key={store.id}>
                                        <td>{store.name}</td>
                                        <td>{store.email}</td>
                                        <td>{store.address}</td>

                                        <td>
                                            {store.owner_name || "N/A"}
                                        </td>

                                        <td>
                                            {store.owner_email || "N/A"}
                                        </td>

                                        <td>
                                            {store.created_at
                                                ? new Date(
                                                      store.created_at
                                                  ).toLocaleDateString()
                                                : "N/A"}
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

export default AdminStores;