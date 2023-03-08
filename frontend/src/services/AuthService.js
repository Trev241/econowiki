import { cAxios } from "../constants";

class AuthService {
  login(nameOrEmail, password) {
    return cAxios.post(
      `/auth/signin`,
      {
        nameOrEmail,
        password,
      },
      {
        withCredentials: true,
      }
    );
  }

  signup(username, email, password) {
    return cAxios.post(`/auth/signup`, {
      username,
      email,
      password,
    });
  }
}

const authService = new AuthService();
export default authService;
