import React, { use } from 'react'
import logImg from '../assets/illustration.png'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { Login } from '../store/authSlice'


function RegisterPage() {
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSubmit = async (data) => {
        const {username, password, full_name, email} = data
        try {
            const res = await api.post("/user/register", {
                username,
                password,
                full_name,
                email
            })
            if(!username || !password || !full_name || !email){
                setError("Please fill all details")
                return
            }
            console.log(res)
            if (res.data.success){
                dispatch(Login(res.data.data))
                console.log("logged in")
                toast.success("You are registered!")
                navigate("/")
            } else{
                toast.error("Error registering")
                setError("Error occurred")
                return navigate("/server-error")
            }
        } catch (error) {
            setError(error.message)
            toast.error(error.message)
            return navigate("/server-error")
        }
    }
  return (
    <>
        <div className="h-screen p-20 w-screen flex items-center justify-center overflow-x-hidden">
<div className="flex h-full w-[80%] bg-gray-200 rounded">
    <div className="w-1/2 h-full p-10">
    <h1>Create a new Account!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex mt-20 flex-col gap-5' action="">
            <input type="text" placeholder='Username' className='p-2 rounded' {...register("username", {
                required: true
            })} />
            <input type="text" placeholder='Full Name' className='p-2 rounded' {...register("full_name", {
                required: true
            })} />
            <input type="text" placeholder='Email' className='p-2 rounded' {...register("email", {required: true})} />
            <input type="password" placeholder='Password' className='p-2 rounded' {...register("password", {
                required: true
            })} />
            {error && <p className='text-red-500'>{error}</p>}
              <p className='text-xs text-center'>Already have an account? <Link className=' underline text-green-500' to="/login" >Register now</Link> </p>
            <input className='py-1 px-4 bg-blue-500 w-fit text-center mx-auto rounded text-white' type="submit" value="Register" />
        </form>
    </div>
    <div className="w-1/2 overflow-hidden">
    <img className='h-full w-full object-cover' src={logImg} alt="" /></div>
</div>
        </div>
    </>
  )
}

export default RegisterPage