import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import userApi from "../../api/userApi";

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
        } 
        catch(error) 
        {
          setExistingRating(null);
          setRating("");
        }
      } 
      catch(error) 
      {
        setError(
          error.response?.data?.message ||
            "Unable to load store"
        );
      } 
      finally 
      {
        setLoadingStore(false);
      }
    };

    loadStoreAndRating();

  }, [storeId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if(!rating) 
    {
      setError("Please select a rating");
      return;
    }

    const numericRating = Number(rating);

    if(  !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) 
    {
      setError("Rating must be between 1 and 5");
      return;
    }

    try {
      setLoading(true);

      let response;

      if (existingRating) 
      {
        response = await userApi.updateRating(
          storeId,
          numericRating
        );

      } 
      else 
      {
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
    return <p>Loading...</p>;
  }

  if (error && !storeName) {
    return (
      <div>
        <p>{error}</p>

        <Link to="/stores">
          Back to Stores
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>
        {existingRating
          ? "Update Rating"
          : "Rate Store"}
      </h1>

      <h2>{storeName}</h2>

      {existingRating && (
        <p>
          Your current rating:{" "}
          <strong>{existingRating.rating}/5</strong>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
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
        </div>

        {error && <p>{error}</p>}

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

      <br />

      <Link to={`/stores/${storeId}`}>
        Cancel
      </Link>
    </div>
  );
};

export default RateStore;