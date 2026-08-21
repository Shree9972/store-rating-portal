import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import userApi from "../../api/userApi";
import "./styles/Stores.css";

const Stores = () => {
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

            const response = await userApi.getStores({
                search,
                sortBy,
                sortOrder,
            });

            if (response.success) {
                setStores(response.data?.stores || []);
            } else {
                setError(response.message || "Unable to load stores");
            }
        } catch (error) {
            setError(
                error.response?.data?.message || "Unable to load stores"
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
        <div className="stores-page">
            <div className="stores-container">
                <header className="stores-header">
                    <p>Store Directory</p>
                    <h1>Stores</h1>
                    <span>Browse stores and explore their ratings.</span>
                </header>

                <section className="stores-controls">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by name, email or address"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search stores"
                        />

                        <button type="submit" disabled={loading}>
                            Search
                        </button>
                    </form>

                    <div className="sort-controls">
                        <label htmlFor="sortBy">Sort by</label>

                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="address">Address</option>
                            <option value="created_at">Created Date</option>
                        </select>

                        <button
                            type="button"
                            onClick={() =>
                                setSortOrder((previous) =>
                                    previous === "ASC" ? "DESC" : "ASC"
                                )
                            }
                        >
                            {sortOrder === "ASC" ? "↑ Ascending" : "↓ Descending"}
                        </button>
                    </div>
                </section>

                {loading && <p className="message">Loading stores...</p>}

                {error && <p className="message error">{error}</p>}

                {!loading && stores.length === 0 && (
                    <div className="empty">
                        <h2>No stores found</h2>
                        <p>Try changing your search and try again.</p>
                    </div>
                )}

                {!loading && stores.length > 0 && (
                    <section>
                        <div className="results-header">
                            <h2>Available Stores</h2>
                            <span>{stores.length} stores</span>
                        </div>

                        <div className="stores-grid">
                            {stores.map((store) => (
                                <article className="store-card" key={store.id}>
                                    <div className="store-title">
                                        <div className="avatar">
                                            {store.name?.charAt(0)?.toUpperCase() || "S"}
                                        </div>

                                        <h3>{store.name}</h3>
                                    </div>

                                    <p className="address">
                                        {store.address}
                                    </p>

                                    <div className="rating">
                                        <div>
                                            <strong>
                                                {store.totalRatings > 0
                                                    ? `★ ${store.averageRating}`
                                                    : "No ratings yet"}
                                            </strong>
                                            <span>Average rating</span>
                                        </div>

                                        <div>
                                            <strong>{store.totalRatings}</strong>
                                            <span>Ratings</span>
                                        </div>
                                    </div>

                                    <Link
                                        className="view-link"
                                        to={`/stores/${store.id}`}
                                    >
                                        View Store →
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Stores;