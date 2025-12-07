import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import api from '../../utils/api'

function Payments() {
    const [payments, setPayments] = useState(null)
    const [filteredPayments, setFilteredPayments] = useState(null)
    useEffect(() => {
        const fetchPayments = async () => {
            const res = await api.get("/order/payments")
            console.log(res)
            if(res.data.success){
                const data = res.data.payments.map(p => {
                    return {
                        ...p,
                        status: p?.payment_mode === "COD" ? p.status === "Delivered" ? "Paid" : "Not Paid" : p.status === "pending" ? "Not Paid" : "Paid"
                    }
                })
                setPayments(data)
                setFilteredPayments(data)
            
            }
        }
        fetchPayments()
    }, [])
    useEffect(() => {
        console.log("filtered")
        console.log(filteredPayments)
    }, [filteredPayments])
    const handleDateSort = (e) => {
        const filter = e.target.value
        if (filter === 'old'){
            const sorted = [...filteredPayments].sort((a,b) => {
                return new Date(a.createdAt) - new Date(b.createdAt)
            })
            setFilteredPayments(sorted)
            return
        }
         if (filter === 'new'){
            const sorted = [...filteredPayments].sort((a,b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
            })
            setFilteredPayments(sorted)
            return
        }
    }
    const handleStatusSort = (e) => {
        const filter = e.target.value
        if (filter === "paid"){
            const data = [...payments].filter(p => p.status !== "Not Paid")
            setFilteredPayments(data)
        }
        if (filter === "not"){
            const data = [...payments].filter(p => p.status !== "Paid")
            setFilteredPayments(data)
        }
    }
  return (
    <>
        <div className="h-full w-full">
            <NavBar />
            <div className="flex gap-6 items-center justify-between px-10 p-2">
                <h1>These are Payments</h1>
               <div className="flex">
                Filter By Date 
                <select value="default" onChange={(e) => handleDateSort(e)} className=' bg-gray-200 rounded ml-3' name="" id="">
                    <option disabled value="default">
                        Select Order
                    </option>
                     <option value="old">
                        Oldest
                    </option>
                     <option value="new">
                        Newest
                    </option>
                </select>
               </div>
                   <div className="flex">
                Filter By Status 
                <select value={"default"} onChange={(e) => handleStatusSort(e)} className=' bg-gray-200 rounded ml-3' name="" id="">
                    <option disabled value="default">
                        Select Status
                    </option>
                     <option value="paid">
                        Paid
                    </option>
                     <option value="not">
                        Not Paid
                    </option>
                </select>
               </div>
               <button onClick={() => setFilteredPayments(payments)} className=' bg-gray-200 hover:bg-gray-500  rounded py-1 px-2'>Clear</button>
            </div>

        </div>
        <div className="relative overflow-x-auto">
    {filteredPayments && filteredPayments.length > 0 ? (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Customer Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Payment Date 
                </th>
                <th scope="col" className="px-6 py-3">
                    Payment Mode
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                   <th scope="col" className="px-6 py-3">
                    Amount
                </th>
            </tr>
        </thead>
        <tbody>
        
              {
                filteredPayments.map(p => (
                     <tr className="bg-white border-b  border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {p.user_id.full_name}
                </th>
                <td className="px-6 py-4">
                     { new Date(p.createdAt).toDateString()}
                </td>
                <td className="px-6 py-4">
                    {p?.payment_mode}
                </td>
                <td className="px-6 py-4">
                    {p.status}
                </td>
                 <td className="px-6 py-4">
                    
₹{p.total_amount}
                </td>
            </tr>
                ))
              }
         
         
          
        </tbody>
    </table>
    ) : (<p>No Payments Found</p>)}
</div>
    </>
  )
}

export default Payments