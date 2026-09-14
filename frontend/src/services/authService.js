import api from "./api";

export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const updateUserProfile = async ({ name, email }) => {
  const { data } = await api.put("/auth/profile", { name, email });
  return data;
};

export const changeUserPassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  const { data } = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return data;
};
