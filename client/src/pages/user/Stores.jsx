import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import userApi from "../../api/userApi";

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

        if(response.success) 
        {
            setStores(response.data?.stores || []);
        } 
        else 
        {
            setError( response.message || "Unable to load stores" );
        }
        } 
        catch (error) 
        {
            setError( error.response?.data?.message || "Unable to load stores"  );
        } 
        finally 
        {
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
        <div>
        <h1>Stores</h1>

        <form onSubmit={handleSearch}>
            <input
            type="text"
            placeholder="Search by store name, email or address"
            value={search}
            onChange={(event) =>
                setSearch(event.target.value)
            }
            />

            <button type="submit">
            Search
            </button>
        </form>

        <div>
            <label htmlFor="sortBy">
            Sort by:
            </label>

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
            <option value="created_at">
                Created Date
            </option>
            </select>

            <button
            type="button"
            onClick={() =>
                setSortOrder((previous) =>
                previous === "ASC" ? "DESC" : "ASC"
                )
            }
            >
            {sortOrder === "ASC"
                ? "Ascending"
                : "Descending"}
            </button>
        </div>

        {loading && <p>Loading stores...</p>}

        {error && <p>{error}</p>}

        {!loading && stores.length === 0 && (
            <p>No stores found.</p>
        )}

        {!loading && stores.length > 0 && (

            <div>

                {stores.map((store) => (

                <div key={store.id}>

                    <h2>{store.name}</h2>

                    <p>Address: {store.address}</p>

                    <p>
                        Rating:{" "}
                        {store.totalRatings > 0
                            ? store.averageRating
                            : "No ratings yet"}
                    </p>

                    <p>Total Ratings: {store.totalRatings}</p>

                    <Link to={`/stores/${store.id}`}>
                    View Store
                    </Link>

                </div>

                ))}

            </div>
            )}

        </div>
    );
};

export default Stores;