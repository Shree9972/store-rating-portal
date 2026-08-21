import api from "./axios";

const getStores = async ({ search, sortBy = "name", sortOrder = "ASC" } = {}) => {

    const response = await api.get("/user-stores", {

        params: {
            search: search || undefined,
            sortBy,
            sortOrder,
        },

    });

    return response.data;
};

const getStoreById = async (storeId) => {

  const response = await api.get(`/stores/${storeId}`);

  return response.data;
};

const getMyRating = async (storeId) => {
  const response = await api.get(`/ratings/${storeId}/me`);

  return response.data;
};

const submitRating = async (storeId, rating) => {

  const response = await api.post(`/ratings/${storeId}`, {
    rating,
  });

  return response.data;
};

const updateRating = async (storeId, rating) => {

  const response = await api.post(`/ratings/${storeId}`, {
    rating,
  });

  return response.data;
};

const userApi = {
  getStores,
  getStoreById,
  submitRating,
  updateRating,
  getMyRating,
};

export default userApi;