import { useEffect, useState } from "react";

import ownerApi from "../../api/ownerApi";
import "./styles/OwnerDashboard.css";

const OwnerDashboard = () => {
    const [stores, setStores] = useState([]);
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [ratings, setRatings] = useState([]);

    const [loadingStores, setLoadingStores] = useState(true);
    const [loadingRatings, setLoadingRatings] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadStores = async () => {
            try {
                setLoadingStores(true);
                setError("");

                const response = await ownerApi.getMyStores();

                if (!response.success) {
                    setError(
                        response.message || "Unable to load stores"
                    );
                    return;
                }

                setStores(response.data?.stores || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Unable to load stores"
                );
            } finally {
                setLoadingStores(false);
            }
        };

        loadStores();
    }, []);

    const handleViewRatings = async (storeId) => {
        try {
            setLoadingRatings(true);
            setError("");

            setSelectedStoreId(storeId);

            const response =
                await ownerApi.getStoreRatings(storeId);

            if (!response.success) {
                setError(
                    response.message ||
                        "Unable to load ratings"
                );
                return;
            }

            setRatings(response.data?.ratings || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load ratings"
            );
        } finally {
            setLoadingRatings(false);
        }
    };

    if (loadingStores) {
        return (
            <div className="owner-page">
                <div className="owner-message">
                    Loading stores...
                </div>
            </div>
        );
    }

    return (
        <div className="owner-page">
            <div className="owner-container">
                <header className="owner-header">
                    <p>Owner Dashboard</p>
                    <h1>My Stores</h1>
                    <span>
                        View your stores and the ratings submitted by customers.
                    </span>
                </header>

                {error && (
                    <div className="owner-message error" role="alert">
                        {error}
                    </div>
                )}

                {stores.length === 0 ? (
                    <div className="owner-message">
                        You don't have any stores yet.
                    </div>
                ) : (
                    <div className="owner-stores">
                        {stores.map((store) => (
                            <section className="owner-card" key={store.id}>
                                <div className="owner-card-header">
                                    <div>
                                        <h2>{store.name}</h2>
                                        <p>{store.email}</p>
                                    </div>

                                    <div className="owner-rating">
                                        <strong>
                                            {Number(
                                                store.average_rating
                                            ).toFixed(2)}
                                            /5
                                        </strong>
                                        <span>
                                            {store.total_ratings} ratings
                                        </span>
                                    </div>
                                </div>

                                <div className="owner-details">
                                    <div>
                                        <span>Address</span>
                                        <p>{store.address}</p>
                                    </div>

                                    <div>
                                        <span>Total Ratings</span>
                                        <p>{store.total_ratings}</p>
                                    </div>
                                </div>

                                <button
                                    className="owner-button"
                                    type="button"
                                    onClick={() =>
                                        handleViewRatings(store.id)
                                    }
                                    disabled={
                                        loadingRatings &&
                                        selectedStoreId === store.id
                                    }
                                >
                                    {loadingRatings &&
                                    selectedStoreId === store.id
                                        ? "Loading..."
                                        : "View Ratings"}
                                </button>

                                {selectedStoreId === store.id && (
                                    <div className="owner-ratings">
                                        <h3>Ratings</h3>

                                        {loadingRatings ? (
                                            <p>Loading ratings...</p>
                                        ) : ratings.length === 0 ? (
                                            <p>
                                                No ratings found for this
                                                store.
                                            </p>
                                        ) : (
                                            ratings.map((rating) => (
                                                <div
                                                    className="owner-rating-item"
                                                    key={rating.id}
                                                >
                                                    <strong>
                                                        {rating.user_name}
                                                    </strong>

                                                    <p>
                                                        Rating:{" "}
                                                        {rating.rating}/5
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;