import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

axios.defaults.baseURL = API_URL;

async function login(payload) {
    const response = await axios.post("/login", payload);

    console.dir(response);

    return response;
}

async function register(payload) {
    return axios.post("/register", payload);
}

async function logout() {
    localStorage.removeItem("token");
}

const authService = {
    login,
    register,
    logout,
};

export default authService;