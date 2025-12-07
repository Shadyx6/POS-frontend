import React from 'react'
import NavBar from './NavBar'
import { LuCircleDollarSign } from "react-icons/lu";
import { TbBasketDollar } from "react-icons/tb";
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../utils/api';
import Loader from "./Loader"
import { useForm } from 'react-hook-form';
import { CiLocationOn } from "react-icons/ci";
import { toast } from 'react-toastify';


function Inventory() {
  const [inventory, setInventory] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditForm, setIsEditForm] = useState(false)
  const [selectedProd, setSelectedProd] = useState(null)
  const {register, handleSubmit, reset} = useForm()
  const [totalQuantity, setTotalQuantity] = useState(0)

  const onSubmit = async (data) => {
    const {quantity, location, id} = data
    console.log(data)
    try {
      const res = await api.put(`/inventory/update/${id}`, {
        quantity,
        location
      })
      console.log(res.data)
      if(res.data.success){
        toast.success("Inventory updated successfully")
        setLoading(true)
        setIsEditForm(false)
        setSelectedProd(null)
        fetchInventory()
      }
    } catch (error) {
      setError(error.message)
    }
    console.log(data)
  }
 const fetchInventory = async () => {
      try {
        const res = await api.get("/inventory/all")
        console.log(res.data)
        if(res.data.success) {
          setInventory(res.data.inventory)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
        setError(error.message)
        setLoading(false)
      } finally{
        setLoading(false)
      }
    }
    useEffect(() => {
  if(selectedProd) {
    reset({
      quantity: selectedProd.quantity,
      location: selectedProd.location,
      id: selectedProd.inventoryId
    })
  }
}, [selectedProd, reset])

    useEffect(() => {

const totQuantity = inventory && inventory.reduce((sum, product) => {
  if (Array.isArray(product.variantsWithInventory)) {
    const variantSum = product.variantsWithInventory.reduce((vSum, variant) => {
      const qty = variant.inventory?.quantity || 0;
      return vSum + qty;
    }, 0);
    return sum + variantSum;
  }
  return sum;
}, 0);

    setTotalQuantity(totQuantity)
    }, [inventory])
  useEffect(() => {
   
    fetchInventory()
    
  }, [])

  return (
    <>
    {isEditForm && (<div className="h-screen flex items-center justify-center fixed w-screen bg-black bg-opacity-50">
      <button onClick={() => {
        setIsEditForm(false)
        setSelectedProd(null)
      }} className='absolute top-10 left-10 bg-red-500 py-1 px-2 text-white rounded-lg'>Close</button>
      {selectedProd ? (<div className="bg-yellow-50 flex gap-5 p-5 rounded flex-col">
        <div className="flex gap-3 mb-6 flex-col">
          <h1>Product: {selectedProd.product} </h1>
          <h1>Variant: {selectedProd.variant} </h1>
          <h1>Current Quantity: {selectedProd.quantity} </h1>
        </div>
              <h1>       Edit Inventory</h1>
              {error && <p className='text-red-500' >{error}</p>}
<form onSubmit={handleSubmit(onSubmit)} className='flex gap-2' action="">
         <div className="flex gap-2">
        <h2>Quantity:</h2>
         <input {...register("quantity", {
          required: true
         })} type="number" defaultValue={selectedProd.quantity} className='bg-transparent border-2 rounded' placeholder='Change Quantity' />
       </div>
       <div className="flex gap-2">
        <h2>Location:</h2>
         <input defaultValue={selectedProd.location} {...register("location")} type="text" className='bg-transparent border-2  rounded' placeholder='Change Location' />
         <input className='hidden' defaultValue={selectedProd.inventoryId} {...register("id")}  type="text" />
         <input className='hidden'  type="text" />
       </div>
       <input type="submit" className='bg-red-400 rounded-lg py-1 px-2 w-fit  text-center mx-auto hover:text-white hover:bg-red-600 duration-300 ease-in' />
</form>
      </div>) : (<Loader context={"Opening Editor..."} color='black' />)}
    </div>)}
    <div className="h-screen w-screen">
        <NavBar />
       <div className="p-2 h-10  border-b-2 flex gap-5 w-full border-b-amber-900 py-10 ">
        <div className="flex items-center justify-center">
          <div className="h-fit overflow-hidden p-1 rounded-full bg-gray-300 ">
          <TbBasketDollar color='blue' size={'30px'} />

          </div>
          <div className="flex flex-col">
            <h2 className='text-gray-400 text-xs'>Total Stocks</h2>
            <h1 className='text-3xl ml-2'>{totalQuantity}</h1>
          </div>
        </div>
        <div className="flex flex-wrap bg-green-400 ">
            <div className="h-1/2 w-[40%] bg-red-300 "></div>
        </div>
       </div>
       <div className="h-full w-full p-2">
        <div className="">
          <h1>Inventory</h1>
          <div className="flex">
            <button className=''></button>
          </div>
        </div>
       <div className="space-y-6 px-6">
  {inventory && inventory.length > 0 ? inventory.map(item => (
     <div className="bg-blue-50 rounded-lg p-4">
    <h2 className="text-lg font-semibold">{item.name}</h2>
    <p className="text-gray-500">SKU: {item.sku}</p>

    <div className="mt-4">
      <h3 className="font-medium text-gray-700">Variants</h3>
      {item.variantsWithInventory.map(v => (
       <div className="divide-y border-t border-gray-200">
        <div className="flex justify-between items-center py-2 px-2 rounded">
          <div>
            <span className="text-gray-800">{v.variant_name}-{v.variant_value}-{v.price}</span> | 
            <span className="text-gray-600 ml-2">SKU: {v.sku}</span>
            <span className="text-gray-600 ml-2">Stock: {v.inventory?.quantity || 0}</span>
            <span className="text-gray-600 ml-2"><CiLocationOn className='inline' />: {v.inventory?.location || "Unknown"}</span>
          </div>
          <button onClick={() => {
            console.log("clicked")  
            console.log(v.inventory)
            const data = {
              product: item.name,
              variant: v.variant_value,
              quantity: v.inventory?.quantity || 0,
              inventoryId: v.inventory?._id || null,
              location: v.inventory?.location || ""
            }
            setIsEditForm(true)
            setSelectedProd(data)
          }} className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Edit
          </button>
        </div>
      </div>
     ))}
     
    </div>
  </div>
  )) : (<Loader context={"Loading Inventory..."} />)}
</div>


       </div>
    </div>
    </>
  )
}

export default Inventory