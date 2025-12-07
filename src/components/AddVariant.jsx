import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import NavBar from './NavBar'
import { toast } from 'react-toastify'

function AddVariant() {
const {
    register,
    handleSubmit,
  } = useForm()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const onSubmit = async (data) => {
    try {
        const {variant_name, sku, variant_value, price, product_sku, location, quantity, refundable} = data
        if (!variant_name || sku || !variant_value || !price || !product_sku || !location || !quantity || !refundable) {
          toast.error("Please fill all details")
          setError("Please fill all details")
          return
        }
        const res = await api.post("/variants/add", { variant_name,
            sku, variant_value, price, product_sku, refundable
        })
        console.log(res)
        if(res.data.success){
            const res2 = await api.post("/inventory/add", {
              location, quantity, product_id: res.data.variant.product_id, product_variant_id: res.data.variant._id
            }) 
            if(res2.data.success){
              toast.success("Variant Added Successfully")
              navigate('/')
            }
        } 
    } catch (error) {
      toast.error("Error adding variant")
       setError(error.message)
       return navigate("/server-error")
    }
  }
  return (
    <>
    <NavBar />
        <div className="h-screen w-full p-5 ">
<h1>Add a new Variant</h1>
            <div className="h-[70%] w-1/2 ">
            <form className='flex flex-col gap-5 mt-4 w-56' onSubmit={handleSubmit(onSubmit)} action="">
                <input className='rounded p-2 border-2  ' placeholder='variant name'  {...register("variant_name")} type="text" />
                <input className='rounded p-2 border-2  ' placeholder='sku' {...register("sku")} type="text" />
                <input className='rounded p-2 border-2  ' placeholder='product sku' {...register("product_sku")} type="text" />
                <input className='rounded p-2 border-2  h-16 ' placeholder='variant value' {...register("variant_value")} type="text" />
                <input className='rounded p-2 border-2  ' placeholder='price' {...register("price")} type="number" />
                <input className='rounded p-2 border-2  ' placeholder='refundable' {...register("refundable")} type='text' />
                <input className='rounded p-2 border-2  ' placeholder='location' {...register("location")} type="text" />
                <input className='rounded p-2 border-2  ' placeholder='quantity' {...register("quantity")} type="number" />
                {error && <p className=' text-red-500'> {error} </p>}
                <input className='p-2 bg-blue-200 rounded' type="submit" value="Add Variant" />
            </form>
            </div>

        </div>
    </>
  )
}

export default AddVariant