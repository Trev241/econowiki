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

  register(email, username, password) {
    return cAxios.post(
      `/auth/signup`,
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
