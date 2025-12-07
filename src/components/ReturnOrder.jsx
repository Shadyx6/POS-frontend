import React from 'react'
import NavBar from './NavBar'
import { useEffect } from 'react'
import api from '../../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Loader from './Loader'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
function ReturnOrder() {
    const [details, setDetails] = useState(null)
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState(null)
    const {id} = useParams()
    useEffect(() => {
        const fetchOrderDetails = async() => {
            try {
                const res = await api.get(`/bill/${id}`)
                console.log(res.data)
                if(res.data.success){
                    setDetails(res.data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchOrderDetails()
    }, [])
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        console.log(data)
        try {
            const {product_variant_id, reason} = data
            const res = await api.post(`/order/return/${id}`, {
                product_variant_id, reason
            })
            if(res.data.success){
              toast.success("Order returned successfully")
                navigate('/return')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            setError(error.message)
        }
    }
  return (
    <div>
        <NavBar />
        {details ? (
            <div className="h- full w-full bg-yellow-50 p-5 ">
                <h1>OrderId: {details.order._id}</h1>
                <div className="flex">
                   <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
  <h1 className="mb-5">Products</h1>

  {details.order_items.map(item => (
    <div key={item._id} className="flex border-b-2 pb-2 flex-col">
      <div className="flex mt-2">
        <input
          type="checkbox"
          value={item.product_variant_id._id}
          {...register("product_variant_id")}
        />
        <p>{item.product_id.name}</p>
        <p className="ml-6">Variant - {item.product_variant_id.variant_value}</p>
        <p className="ml-6">QTY - {item.quantity}</p>
        <p className="ml-6">{item.product_variant_id.refundable === "true" ? "Refundable" : "Non-Refundable"}</p>
      </div>
    </div>
  ))}

  <label className="mt-6 mb-3">Reason for Return</label>
  <input
    {...register("reason", {
        required: true
    })}
    type="text"
    className="p-2 w-full"
    placeholder="Enter here"
  />

  <input
    type="submit"
    className="py-1 px-2 rounded-lg bg-red-400 w-fit text-center mx-auto text-white mt-5"
  />
</form>

                </div>
            </div>
        ) : (<Loader context={"Loading details"} />)}
    </div>
  )
}

export default ReturnOrder