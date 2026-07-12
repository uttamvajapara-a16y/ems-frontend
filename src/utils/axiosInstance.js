import axios from 'axios' ;

const axiosInstance = axios.create({
    // baseURL: import.meta.env.BASE_URL,
    baseURL: "http://localhost:6050/api",
    withCredentials: true,
})

export default axiosInstance ;