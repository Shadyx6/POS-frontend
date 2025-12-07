import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import productImg from '../assets/products.png'
import api from '../../utils/api'
import NavBar from './NavBar'

function ReturnPage() {
      const [orders, setOrders] = useState(null)
    
         const fetchOrders = async () => {
        try {
            const res = await api.get("/order")
            console.log(res.data.details)
            if(res.data.success) {
                setOrders(res.data.details)
            }
        } catch (error) {
            console.log(error)
            return navigate("/server-error")
        }
    }
        useEffect(() => {
        fetchOrders()
    }, [])
    const handleReturn = async (id) => {
        try {
            const res = await api.put(`/order/return/${id}`)
            console.log(res)
            if(res.data.success) {
                console.log("Successfully cancelled")
                fetchOrders()
            }
        } catch (error) {
            console.log(error)
            return navigate("/server-error")
        }
    }
    const navigate = useNavigate()
  return (
        <>
        <div className="h-screen w-screen ">
            <NavBar />
        <div className="flex justify-between w-full px-4 mt-2">
                <h1>These are your orders</h1>
                <Link className='bg-indigo-500 mr-5 text-white py-1 px-2 rounded-full ' to={'/returned-products'}>Returned Products</Link>
        </div>
            <div className="p-10 flex gap-5  flex-wrap ">
                {
orders ? orders.filter((o) => (o.order.status === 'Delivered' || o.order.status === "Returned")).map(o => (
         <div key={o.order. _id}>
       <div key={o.order._id} className="  h-auto min-h-[20rem] w-[26rem] shadow-lg shadow-black/50  px-10  py-2 rounded-lg overflow-hidden">
                          <div className="overflow-hidden h-40">
                        <img className="h-full w-full object-contain" src={productImg} alt="" />
                          </div>
                         <div className="flex items-center flex-col text-md  ">
                            {o.products.map((prod, i) => (
                                <h1 key={i} >{prod.name}</h1>
                            ))}
                            <h1>{o.order.user_name}</h1>
                            <h1>{o.order.user_phone}</h1>
                           <hr />
                           
                          <div className="flex flex-col mt-3 gap-3 text-start items-start">
                            <p className='font-bold'>Total Price: <span className='font-normal'> ${o.order.total_amount}</span> </p>
                            <p className='font-bold'>Date: <span className='font-normal'>
                              {new Date(o.order.createdAt).toDateString()}  </span> </p>
                            <p className='font-bold'>Payment Mode: <span className='font-normal'>{o.order.payment_mode}</span> </p>
                            <p className='font-bold' >Status <span className={`font-normal bg-opacity-40 rounded-lg p-1  ${o.order.status === 'Delivered' ? 'bg-indigo-500' : 'bg-cyan-500'} `}>
                              {o.order.status}  </span> </p>
                                    <p className='font-bold'>Posted by: <span className='font-normal'> {o.order.posted_by}</span> </p>
                          </div>
                     
                           
                          <div className="flex gap-5 mt-6">
                             {o.order.status !== "Returned" && <Link to={`/return/${o.order._id}`} className="border py-1 px-3 text-md  border-black rounded-lg hover:text-white hover:bg-red-500 " >Return</Link>}
                             <button onClick={() => navigate(`/billing/${o.order._id}`)} className="border py-1 px-3 text-md  border-black rounded-lg hover:text-white hover:bg-green-500 " >Check Bill</button>
                          </div>
                         </div>

                      </div>
     </div>
)) : <h1>loading....</h1>
                }
            </div>
        </div>
    </>
  )
}

export default ReturnPage