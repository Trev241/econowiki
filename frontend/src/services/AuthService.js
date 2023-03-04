import axios from "axios";

const API_URL = "http://localhost:5001/auth";

class AuthService {
  login(nameOrEmail, password) {
    return axios.post(
      `${API_URL}/signin`,
      {
        nameOrEmail,
        password,
      },
      {
        withCredentials: true,
      }
    );
  }

  register(email, username, password) {
    return axios.post(
      `${API_URL}/signup`,
      {
        email,
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
  }
}

const authService = new AuthService();
export default authService;
