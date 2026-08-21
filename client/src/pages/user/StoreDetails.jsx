import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import userApi from "../../api/userApi";

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

        if(response.success) 
        {
          const storeData = response.data?.store;

          setStore(storeData);
          setMyRating(storeData?.userRating || null);

        } 
        else 
        {
          setError( response.message || "Unable to load store" );
        }
      } 
      catch (error) 
      {
        setError(
          error.response?.data?.message ||
            "Unable to load store"
        );
      } 
      finally 
      {
        setLoading(false);
      }
    };

    loadStore();
  }, [storeId]);

  if (loading) {
    return <p>Loading store...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <Link to="/stores">
          Back to Stores
        </Link>
      </div>
    );
  }

  if (!store) {
    return (
      <div>
        <p>Store not found.</p>

        <Link to="/stores">
          Back to Stores
        </Link>
      </div>
    );
  }

  const averageRating = store.ratingSummary?.averageRating ?? 0;

  const totalRatings = store.ratingSummary?.totalRatings ?? 0;

  return (
    <div>
      <h1>{store.name}</h1>

      <p>
        <strong>Email:</strong> {store.email}
      </p>

      <p>
        <strong>Address:</strong> {store.address}
      </p>

      <p>
        <strong>Owner:</strong> {store.owner_name}
      </p>

      <p>
        <strong>Average Rating:</strong>{" "}
        {totalRatings > 0
          ? averageRating
          : "No ratings yet"}
      </p>

      <p>
        <strong>Total Ratings:</strong>{" "}
        {totalRatings}
      </p>

      <hr />

      <h2>My Rating</h2>

      {myRating ? (
        <div>
          <p>
            You rated this store:{" "}
            <strong>{myRating.rating}/5</strong>
          </p>

          <Link to={`/stores/${store.id}/rate`}>
            Update Rating
          </Link>
        </div>
      ) : (
        <div>
          <p>
            You have not rated this store yet.
          </p>

          <Link to={`/stores/${store.id}/rate`}>
            Rate This Store
          </Link>
        </div>
      )}

      <br />

      <Link to="/stores">
        Back to Stores
      </Link>
    </div>
  );
};

export default StoreDetails;