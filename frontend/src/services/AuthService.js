import { cAxios } from "../constants";

class AuthService {
  login(nameOrEmail, password) {
    return cAxios.post(
      `/signin`,
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
      `/signup`,
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
