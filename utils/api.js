import axios from 'axios'
// console.log(import.meta.env.VITE_API_URL)
const api = axios.create({
    baseURL: "https://pos-backend-lkuv.onrender.com",
    withCredentials: true
})
export default api
