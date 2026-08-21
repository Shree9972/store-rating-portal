import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../api/adminApi";

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

            if(response.success) 
            {
                setStores(response.data.stores || []);
            } 
            else 
            {
                setError( response.message || "Unable to load stores" );
            }
        } 
        catch(error) 
        {
            setError( error.response?.data?.message || "Unable to load stores" );
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
        <h1>Manage Stores</h1>

        <Link to="/admin/stores/create">
            Create Store
        </Link>

        <hr />

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

        <div>
            <label>

                Sort by:{" "}

            <select value={sortBy} onChange={(event) => setSortBy(event.target.value) } >

                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="created_at">
                    Created Date
                </option>

            </select>

            </label>

            <button
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
            <table>
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
        )}

        </div>
  );
};

export default AdminStores;