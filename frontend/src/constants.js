import axios from "axios";

export const cAxios = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});
