import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'
import { toast } from 'react-toastify'
  

function UpdateProduct() {    
      const [product, setProduct] = useState(null)
      const {id} = useParams()
      const [error, setError] = useState(null)
      const [variants, setVariants] = useState(null)
      const [categories, setCategories] = useState(null)
      const [selectedVariant, setSelectedVariant] = useState('default')
      console.log(id)
      const fetchProductDetail = async () => {
        try {
            const res = await api.get(`products/details/${id}`)
            console.log(res.data.product)
            if(res.data.success) {
                setProduct(res.data.product)
            } else{
                setError("something went wrong, could not fetch product")
            }
        } catch (error) {
            setError(error.message)
            return navigate("/server-error")
        }
      }
           const {
        register,
        handleSubmit,
      } = useForm({
        defaultValues: {
            category: 'default',
            variant: 'default'
        }
      })
      useEffect(() => {
        console.log("variant changed!", selectedVariant)
      }, [selectedVariant])
      const navigate = useNavigate()
      const onSubmit = async (data) => {
        console.log(data)
        if(selectedVariant === 'default'){
            return setError("Please select a variant")
        } 
        if (data.category === 'default'){
            return setError("Please select a category")
        }
        if (!data.refundable || !data.variant_value || !data.variant_price){
            setError("Set variant details")
            return toast.error("Set variant details")
        }
        console.log(data)
        try {
            const res = await api.put(`products/update-product/${id}`, {
                 category: data.category,
        variant: data.variant,
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: data.price
            })
            console.log(res)
            if(res.data.success){
                const res2 = await api.put(`variants/update/${selectedVariant}`, {
                    variant_value: data.variant_value,
                    price: data.variant_price,
                    refundable: data.refundable

                })
                console.log(res2)
                if (res2.data.success){
                    toast.success("Product Updated Successfully")
        console.log("Updated!")
                navigate("/")
                }
                
            }

        } catch (error) {
            setError(error)
            toast.error(error.message)
            return navigate("/server-error")
        }
      }
      useEffect(() => {
        fetchProductDetail()
      }, [])
      useEffect(() => {
        const getVariants = async () => {
try {
    const res = await api.get(`/variants/product/${id}`)
    if (res.data.success) {
        setVariants(res.data.variants)
    } 
} catch (error) {
    setError(error.message)
    return navigate("/server-error")
}

        }
        getVariants()
      }, [product, id])


      useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("category")
                if (res.data.success) {
                    setCategories(res.data.categories)
                }
            } catch (error) {
                setError(error.message)
                return navigate("/server-error")
            }
        }
        fetchCategories()
      }, [product])
  return (
   <>
    {
        product && <div className="h-screen w-screen">
        <NavBar />
          <div className="w-1/3 mb-7 rounded h-auto mt-10 mx-auto items-center flex flex-col bg-[#E7E5E4] ">
          <h1 className=' font-bold text-2xl mt-5'>Update product</h1>
         <div className="flex flex-col justify-between px-6 w-full items-center ">
             <div className="h-[70%] items-center justify-center w-full px-0">
            <form className='flex w-full flex-col gap-5 px-6 mt-4 py-5' onSubmit={handleSubmit(onSubmit)} action="">
                <input className='rounded p-2 w-full ' placeholder='name' defaultValue={product.name}  {...register("name")} type="text" />
                <input className='rounded p-2 w-full ' placeholder='sku' defaultValue={product.sku} {...register("sku")} type="text" />
                <input className='rounded p-2 w-full h-16 ' placeholder='description' defaultValue={product.description} {...register("description")} type="text" />
                <input className='rounded p-2 w-full ' placeholder='price' defaultValue={product.price} {...register("price")} type="number" />

                <select  className='p-2 rounded' {...register("category")} id="">
                    <option value="default">Select the category</option>
                    {
                        categories && categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name} </option>
                        ))
                    }
                </select>

                <h1 className='text-start '>Variant info</h1>
                <select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)}  className='p-2 rounded' id="">
                    <option value="default" disabled >Select Variant to assign</option>
                    {
                        variants && variants.map((variant) => {
                           return <option key={variant._id} value={variant._id}>
                                {variant.variant_value}
                            </option>
                        })
                    }
                </select>

                <h1  className='text-start '>Current Variants</h1>
                <div className="flex gap-5 text-indigo-500 ml-2 items-center">
                    <p>Name</p>
                    <p>Value</p>
                    <p>Price</p>
                    <p>Refundable</p>
                </div>
                {
                        variants && variants.map((variant) => (
                            <div key={variant._id} className=" items-center flex gap-2">
                                <div className="">🔴</div>
                                <p> {variant.variant_name} - </p>
                                {variant._id === selectedVariant ? (<input className='rounded p-2 w-full ' placeholder='Variant Value' defaultValue={variant.variant_value} {...register("variant_value")} type="text" />) : (<p>{variant.variant_value}</p>)}
                                {variant._id === selectedVariant ? (<input className='rounded p-2 w-full ' placeholder='Variant price' defaultValue={variant.price} {...register("variant_price")} type="number" />) : ( <p> {variant.price} </p>) }
                                {variant._id === selectedVariant ? (<input className='rounded p-2 w-full ' placeholder='Refundable' defaultValue={variant.refundable || "false"} {...register("refundable")} type="text" />) : ( <p> {variant.refundable || "false"} </p>) }
                               
                            </div>
                        ))  
                    }


                {error && <p className='text-red-400'>{error}</p>}
      
                <input className='p-2 bg-blue-500 text-white  rounded-lg' type="submit" value="Submit" />
            </form>
            </div>

         </div>
         </div>
    </div>
    }

   </>
  )
}

export default UpdateProduct