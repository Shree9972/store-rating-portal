import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import userApi from "../../api/userApi";
import "./styles/RateStore.css";

const RateStore = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState("");
    const [existingRating, setExistingRating] = useState(null);
    const [storeName, setStoreName] = useState("");

    const [loadingStore, setLoadingStore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadStoreAndRating = async () => {
            try {
                setLoadingStore(true);
                setError("");

                // Get store information
                const storeResponse = await userApi.getStoreById(storeId);

                if (!storeResponse.success) {
                    setError(
                        storeResponse.message || "Unable to load store"
                    );
                    return;
                }

                const store = storeResponse.data?.store;

                if (!store) {
                    setError("Store not found");
                    return;
                }

                setStoreName(store.name);

                // Get current user's rating for this store
                try {
                    const ratingResponse =
                        await userApi.getMyRating(storeId);

                    if (
                        ratingResponse.success &&
                        ratingResponse.data?.rating
                    ) {
                        const userRating =
                            ratingResponse.data.rating;

                        setExistingRating(userRating);
                        setRating(String(userRating.rating));
                    }
                } catch (error) {
                    setExistingRating(null);
                    setRating("");
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Unable to load store"
                );
            } finally {
                setLoadingStore(false);
            }
        };

        loadStoreAndRating();
    }, [storeId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!rating) {
            setError("Please select a rating");
            return;
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            setError("Rating must be between 1 and 5");
            return;
        }

        try {
            setLoading(true);

            let response;

            if (existingRating) {
                response = await userApi.updateRating(
                    storeId,
                    numericRating
                );
            } else {
                response = await userApi.submitRating(
                    storeId,
                    numericRating
                );
            }

            if (!response.success) {
                setError(
                    response.message || "Unable to save rating"
                );
                return;
            }

            navigate(`/stores/${storeId}`);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to save rating"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingStore) {
        return (
            <div className="rate-store-page">
                <div className="rate-store-message">
                    Loading store...
                </div>
            </div>
        );
    }

    if (error && !storeName) {
        return (
            <div className="rate-store-page">
                <div className="rate-store-message error">
                    <h1>Unable to load store</h1>
                    <p>{error}</p>

                    <Link to="/stores">
                        Back to Stores
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rate-store-page">
            <div className="rate-store-card">
                <Link
                    className="rate-store-back"
                    to={`/stores/${storeId}`}
                >
                    ← Back to Store
                </Link>

                <div className="rate-store-header">
                    <p>Store Rating</p>

                    <h1>
                        {existingRating
                            ? "Update Rating"
                            : "Rate Store"}
                    </h1>

                    <h2>{storeName}</h2>
                </div>

                {existingRating && (
                    <div className="current-rating">
                        Your current rating:{" "}
                        <strong>{existingRating.rating}/5</strong>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="rating">
                        Rating
                    </label>

                    <select
                        id="rating"
                        value={rating}
                        onChange={(event) =>
                            setRating(event.target.value)
                        }
                    >
                        <option value="">
                            Select rating
                        </option>

                        <option value="1">
                            1 - Very Poor
                        </option>

                        <option value="2">
                            2 - Poor
                        </option>

                        <option value="3">
                            3 - Average
                        </option>

                        <option value="4">
                            4 - Good
                        </option>

                        <option value="5">
                            5 - Excellent
                        </option>
                    </select>

                    {error && (
                        <p className="rate-store-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : existingRating
                            ? "Update Rating"
                            : "Submit Rating"}
                    </button>
                </form>

                <Link
                    className="cancel-link"
                    to={`/stores/${storeId}`}
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
};

export default RateStore;