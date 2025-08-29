import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.18.0.211:8080/api/",
});

export default axiosInstance;