import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ muda automaticamente entre local e produção
  withCredentials: true, // ✅ envia cookies (JWT HTTP-only)
});

export default api;
