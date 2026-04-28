import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7025/api"
})

export default api;