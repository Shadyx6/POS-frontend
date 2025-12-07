import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import NavBar from './NavBar'
import { toast } from 'react-toastify'

function AddProduct() {
    const {
    register,
    handleSubmit,
  } = useForm()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const onSubmit = async (data) => {  
    try {
        const {name, sku, description, price, category, variant_name, variant_value, refundable, v_sku, v_price, quantity, location } = data
        console.log(data)
        if(!name || !sku ||  !description ||  !price ||  !category ||  !variant_name ||  !variant_value ||  !refundable ||  !v_sku ||  !v_price ||  !quantity ||  !location ){
          setError("Please fill all details")
          return
        }
        const res1 = await api.post("products/add", { name,
            sku, description, price, category,
        })
        if (res1) {
          console.log(res1.data)
          const p_id = res1.data.product._id
          const res2 = await api.post("variants/add", {
          variant_name, variant_value, sku: v_sku, price: v_price, product_id: p_id, product_sku: sku})
          if(res2){
            console.log(res2.data)
            const res3 = await api.post("inventory/add", {
              product_id: p_id,
              product_variant_id: res2.data.variant._id,
              quantity,
              location,
              refundable
            })
            if (res3) {
              toast.success("successfully added")
              navigate("/")
            }
            else{
              setError('error in inventory')
            }
          } else 
            {setError("Could not make variant")}
        } else{
          toast.error("Could not make product")
          setError("Could not make product")
        }
         
    } catch (error) {
      toast.error*"Server Error"
       setError(error.message)
       return navigate("/server-error")
    }
  }
  const [categories, setCategories] = useState(null)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("category")
                if (res.data.success) {
                    setCategories(res.data.categories)
                }
            } catch (error) {
                setError(error)
                return navigate("server error")
            }
        }
        fetchCategories()
      }, [])
  return (
    <>
        <div className="h-screen w-screen overflow-x-hidden">
          <NavBar />
          <div className="w-1/3 mb-7 rounded h-auto mt-10 mx-auto items-center flex flex-col bg-[#E7E5E4] ">
          <h1 className=' font-bold text-2xl mt-5'>Add a new product</h1>
         <div className="flex flex-col justify-between px-6 w-full items-center ">
             <div className="h-[70%] items-center justify-center w-full px-0">
            <form className='flex w-full flex-col gap-5 px-6 mt-4 py-5' onSubmit={handleSubmit(onSubmit)} action="">
                <input className='rounded p-2 w-full ' placeholder='name'  {...register("name", {required: true})} type="text" />
                <input className='rounded p-2 w-full ' placeholder='sku' {...register("sku")} type="text" />
                <input className='rounded p-2 w-full h-16 ' placeholder='description' {...register("description")} type="text" />
                <input className='rounded p-2 w-full ' placeholder='price' {...register("price")} type="number" />
            
                <select  className='p-2 rounded' {...register("category")} id="">
                    <option value="default">Select the category</option>
                    {
                        categories && categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name} </option>
                        ))
                    }
                </select>
                <h1 className='text-start '>Variant info</h1>

                      <input className='rounded p-2 w-full ' placeholder='variant sku' {...register("v_sku")} type="text" />
                      <input className='rounded p-2 w-full ' placeholder='variant_name' {...register("variant_name")} type="text" />
                <input className='rounded p-2 w-full h-16 ' placeholder='variant value' {...register("variant_value")} type="text" />
                 <input className='rounded p-2 w-full' placeholder='refundable' {...register("refundable")} type="text" />
                <input className='rounded p-2 w-full ' placeholder='price' {...register("v_price")} type="number" />

                <h1  className='text-start '>Inventory Info</h1>
                <input className='rounded p-2 w-full ' placeholder='quantity' {...register("quantity")} type="text" />
                <input className='rounded p-2 w-full ' placeholder='location' {...register("location")} type="text" />


                {error && <p className='text-red-500 text-center'>{error}</p>}
      
                <input className='p-2 bg-blue-500 text-white  rounded-lg' type="submit" value="Submit" />
            </form>
            </div>

         </div>
         </div>



        </div>
    </>
  )
}

export default AddProduct