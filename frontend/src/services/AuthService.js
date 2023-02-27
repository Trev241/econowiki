import axios from "axios"

const API_URL = "http://localhost:5001/auth"

class AuthService {
  async login(username, password) {
    return axios
      .post(`${API_URL}/signin`, {
        username,
        password
      })
      .then(response => {
        return response.data
      })
      .catch(error => {
        return error
      })
  }

  register(email, username, password) {
    return axios
      .post(`${API_URL}/signup`, {
        email,
        username,
        password
      })
      .catch(error => {
        return error
      })
  }
}

const authService = new AuthService()
export default authService