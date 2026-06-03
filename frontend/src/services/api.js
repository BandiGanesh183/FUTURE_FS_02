import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token/user if needed
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");

  if (user) {
    config.headers.Authorization = `Bearer ${user}`;
  }

  return config;
});

export default api;