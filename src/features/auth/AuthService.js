import API from "../../api/axios";

const login = async (userData) => {
  const res = await API.post("/auth/login", userData); // backend should set cookie
  return res.data; // { user: {...} }
};

const logout = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data; // { user: {...} }
};

const AuthService = { login, logout, getMe };
export default AuthService;
