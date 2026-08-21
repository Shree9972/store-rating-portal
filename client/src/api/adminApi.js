import api from "./axios";

const getDashboardStats = async () => {
    
  const response = await api.get("/dashboard/admin");

  return response.data;
};

const getUsers = async (params = {}) => {

  const response = await api.get("/users", {
    params,
  });

  return response.data;
};

const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);

  return response.data;
};

const createUser = async (userData) => {
  const response = await api.post("/users", userData);

  return response.data;
};

const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);

  return response.data;
};

const getStores = async (params = {}) => {
  const response = await api.get("/stores", {
    params,
  });

  return response.data;
};

const createStore = async (storeData) => {
  const response = await api.post("/stores", storeData);

  return response.data;
};

const adminApi = {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  getStores,
  createStore,
};

export default adminApi;