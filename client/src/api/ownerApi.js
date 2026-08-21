import api from "./axios";

const getMyStores = async () => {
  const response = await api.get("/dashboard/my-stores");

  return response.data;
};

const getStoreRatings = async (storeId) => {
  const response = await api.get(`/dashboard/${storeId}`);

  return response.data;
};

const ownerApi = {
  getMyStores,
  getStoreRatings,
};

export default ownerApi;