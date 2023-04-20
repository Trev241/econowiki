import axios from "axios";

export const isDev = process.env.NODE_ENV === "development";

export const cAxios = axios.create({
  baseURL: isDev
    ? "http://localhost:5001"
    : "https://monstadev13.pythonanywhere.com",
  withCredentials: true,
});

export const UserType = {
  ADMINISTRATOR: "ADMINISTRATOR",
  MODERATOR: "MODERATOR",
  MEMBER: "MEMBER",
};

export const LogType = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export const modYears = 5;
