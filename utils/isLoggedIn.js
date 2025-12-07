import { Navigate, useNavigate } from "react-router-dom"
import api from "./api"

const isLoggedIn = async () => {
    try {
        const res = await api.get("/user/profile")
        console.log(res)
        if (res.data.success){
            return res.data.data
        }
    } catch (error) {
        console.log("isLoggedIn error:", error)
        return null
    }
}

export default isLoggedIn