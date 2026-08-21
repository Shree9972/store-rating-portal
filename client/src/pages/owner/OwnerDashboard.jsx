import { useEffect, useState } from "react";

import ownerApi from "../../api/ownerApi";

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
    return <p>Loading stores...</p>;
  }

  return (
    <div>
      <h1>Owner Dashboard</h1>

      {error && <p>{error}</p>}

      <h2>My Stores</h2>

      {stores.length === 0 ? (
        <p>You don't have any stores yet.</p>
      ) : (
        stores.map((store) => (
          <div key={store.id}>
            <h3>{store.name}</h3>

            <p>
              <strong>Email:</strong>{" "}
              {store.email}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {store.address}
            </p>

            <p>
              <strong>Average Rating:</strong>{" "}
              {Number(store.average_rating).toFixed(2)}/5
            </p>

            <p>
              <strong>Total Ratings:</strong>{" "}
              {store.total_ratings}
            </p>

            <button
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
              <div>
                <h4>Ratings</h4>

                {loadingRatings ? (
                  <p>Loading ratings...</p>
                ) : ratings.length === 0 ? (
                  <p>
                    No ratings found for this store.
                  </p>
                ) : (
                  ratings.map((rating) => (
                    <div key={rating.id}>
                      <p>
                        <strong>
                          {rating.user_name}
                        </strong>
                      </p>

                      <p>
                        Rating: {rating.rating}/5
                      </p>

                      <hr />
                    </div>
                  ))
                )}
              </div>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerDashboard;