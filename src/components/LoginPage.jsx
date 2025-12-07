import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../utils/api'
import { Link, useNavigate } from 'react-router-dom'
import logImg from '../assets/illustration.png'
import { useDispatch } from 'react-redux'
import { Login } from '../store/authSlice'
import ServerError from './ServerError'
import { toast } from 'react-toastify'
function LoginPage() {
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSubmit = async (data) => {
        const {username, password} = data
        if (!username || !password){
            setError("Please enter details")
            return
        }
        try {
            const res = await api.post("/user/login", {
                username,
                password
            })
            console.log(res)
            if (res.data.success){
                console.log(res.data)
                dispatch(Login(res.data.data))
                
                navigate("/")
            } else{
                toast.error("Error in logging in")
                setError("Error occured")
            }
        } catch (error) {
            toast.error("server error")
            console.log("here")
            console.log(error)
            setError(error.message)
            return navigate("/server-error")
        }
    }
  return (
    <>
        <div className="h-screen p-20 w-screen flex items-center justify-center overflow-x-hidden">
<div className="flex h-full w-[80%] bg-gray-200 rounded">
    <div className="w-1/2 h-full p-10">
    <h1>Log in to your Account Now!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex mt-20 flex-col gap-5' action="">
            <input type="text" placeholder='Username' className='p-2 rounded' {...register("username")} />
            <input type="password" placeholder='Password' className='p-2 rounded' {...register("password")} />
            {error && <p className='text-red-500'>{error}</p>}
            <p className='text-xs text-center'>Don't have an account? <Link className=' underline text-blue-500' to="/register" >Register now</Link> </p>
            <input className='py-1 px-4 bg-blue-500 w-fit text-center mx-auto rounded text-white' type="submit" value="Login" />
        </form>
    </div>
    <div className="w-1/2 overflow-hidden">
    <img className='h-full w-full object-cover' src={logImg} alt="" /></div>
</div>
        </div>
    </>
  )
}

export default LoginPage