import React from 'react'
import NavBar from './NavBar'
import { useEffect } from 'react'
import api from '../../utils/api'
import { useState } from 'react'
import Loader from './Loader'

function ReturnedItems() {
    const [items, setItems] = useState(null)
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await api.get("/return")
                console.log(res)
                if(res.data.success){
                    setItems(res.data.items)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchItems()
    }, [])
  return (
    <>
    <div className=" h-screen w-screen ">
        <NavBar />
       <div className="h-full w-full">
         <div className="flex flex-wrap gap-5 p-5">
           {items && items.length > 0 ? items.map(item => (
            ( <div key={item._id} className="h-fit bg-yellow-50 rounded-lg p-5 w-fit">
                <div className="flex justify-between flex-col gap-2">
                    <h1 className=' font-semibold'>orderId: {item.order_id} <span className='font-normal'></span> </h1>
                    <h1 className='font-semibold'>Refunded: <span>{item.refunded}</span></h1>
                </div>
                <div className="mt-2 flex flex-col">
                    <h1>{item.item.product_id?.name}-{item.item.product_variant_id.variant_value}</h1>
                    <h1>Quantity: {item.item.quantity} </h1>
                </div>
                <div className="mt-2">
                    <p>Reason: {item.reason} </p>
                </div>
                {item.item.product_variant_id.refundable === "true" && (
                    <p>Refund Amount: {item.item.product_variant_id.price * item.item.quantity}</p>
                )}

            </div>)
           )) : (
                <Loader context='Loading your return items' />
            )}
        </div>
       </div>
    </div>
    </>
  )
}

export default ReturnedItems