import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import userApi from "../../api/userApi";
import "./styles/StoreDetails.css";

const StoreDetails = () => {
    const { storeId } = useParams();

    const [store, setStore] = useState(null);
    const [myRating, setMyRating] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStore = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await userApi.getStoreById(storeId);

                if (response.success) {
                    const storeData = response.data?.store;

                    setStore(storeData);
                    setMyRating(storeData?.userRating || null);
                } else {
                    setError(response.message || "Unable to load store");
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Unable to load store"
                );
            } finally {
                setLoading(false);
            }
        };

        loadStore();
    }, [storeId]);

    if (loading) {
        return (
            <div className="store-details-page">
                <div className="store-message" role="status">
                    Loading store...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="store-details-page">
                <div className="store-message error" role="alert">
                    <h1>Unable to load store</h1>
                    <p>{error}</p>

                    <Link className="store-button" to="/stores">
                        ← Back to Stores
                    </Link>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="store-details-page">
                <div className="store-message">
                    <h1>Store not found</h1>
                    <p>
                        The store you are looking for could not be found.
                    </p>

                    <Link className="store-button" to="/stores">
                        ← Back to Stores
                    </Link>
                </div>
            </div>
        );
    }

    const averageRating = store.ratingSummary?.averageRating ?? 0;
    const totalRatings = store.ratingSummary?.totalRatings ?? 0;

    return (
        <div className="store-details-page">
            <div className="store-details-container">
                <Link className="back-link" to="/stores">
                    ← Back to Stores
                </Link>

                <section className="store-header">
                    <div className="store-title">
                        <div className="avatar">
                            {store.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div>
                            <p>Store Details</p>
                            <h1>{store.name}</h1>
                            <span>
                                View store information and manage your rating.
                            </span>
                        </div>
                    </div>

                    <div className="rating-summary">
                        <strong>
                            {totalRatings > 0 ? `★ ${averageRating}` : "—"}
                        </strong>
                        <span>
                            {totalRatings > 0
                                ? `${totalRatings} ${
                                      totalRatings === 1
                                          ? "rating"
                                          : "ratings"
                                  }`
                                : "No ratings yet"}
                        </span>
                    </div>
                </section>

                <div className="details-grid">
                    <section className="details-card">
                        <p>Information</p>
                        <h2>Store Information</h2>

                        <div className="info">
                            <div>
                                <span>Email</span>
                                <strong>{store.email}</strong>
                            </div>

                            <div>
                                <span>Owner</span>
                                <strong>{store.owner_name}</strong>
                            </div>

                            <div>
                                <span>Address</span>
                                <strong>{store.address}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="details-card">
                        <p>Your feedback</p>
                        <h2>My Rating</h2>

                        {myRating ? (
                            <div className="rating-content">
                                <h3>Your rating: {myRating.rating}/5</h3>

                                <p>
                                    You rated this store{" "}
                                    <strong>{myRating.rating}/5</strong>.
                                </p>

                                <Link
                                    className="store-button"
                                    to={`/stores/${store.id}/rate`}
                                >
                                    Update Rating →
                                </Link>
                            </div>
                        ) : (
                            <div className="rating-content">
                                <h3>Share your experience</h3>

                                <p>
                                    You have not rated this store yet. Your
                                    rating helps provide useful feedback.
                                </p>

                                <Link
                                    className="store-button"
                                    to={`/stores/${store.id}/rate`}
                                >
                                    Rate This Store →
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StoreDetails;