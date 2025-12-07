import React from 'react'
import NavBar from './NavBar'
import { useEffect } from 'react'
import api from '../../utils/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
function Discounts() {
    const [discounts, setDiscounts] = useState(null)
    const {register, handleSubmit} = useForm()
    const [addForm, setaAddForm] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchDiscounts = async()=>{
            try {
                const res = await api.get('/discount')
                console.log(res.data)
                if(res.data.success){
                    setDiscounts(res.data.discounts)
                }
            } catch (error) {
                console.log(error)
                return navigate("/server-error")
            }
        }
        fetchDiscounts()
    }, [])

    const onSubmit = async (data) => {
        const {name, value, start_date, end_date, sku, discount_type} = data
        if (!name || !value|| !start_date|| !end_date || !sku, !discount_type){
            toast.error("Please fill all details")
            return setError("please fill all details")
        }
        try {
            const res = await api.post('/discount/add', {
                name, value, start_date, end_date, sku, discount_type
            })
            if(res.data.success) {
                toast.success("Discount added successfully")
                setDiscounts(prev => [...prev, res.data.discount])
                setaAddForm(false)
            }
            else{
                setError("error adding discount")
            }

        } catch (error) {
            setError(error.message)
            return navigate("/server-error")
        }
    }
  return (
    <div className="h-screen w-screen">
       {addForm &&  <div className="h-screen w-screen flex bg-opacity-50 absolute bg-black items-center justify-center">
          <button onClick={() => setaAddForm(false)}  className='p-2 absolute    top-20 left-5 rounded-full inline-block bg-gray-300'> <FaLongArrowAltLeft /> </button >
    <form onSubmit={handleSubmit(onSubmit)} className='flex text-black flex-col gap-3 items-center w-1/3 rounded p-5 bg-white/30 backdrop-blur-md shadow-lg border border-white/40 ' action="">
    <h1 className='text-white text-xl'>Add Discount</h1>
        <input {...register("name")} placeholder='name' className='p-2 w-fit rounded' type="text" />
        <input {...register("value")} placeholder='value' className='p-2 w-fit rounded' type="text" />
        <label className='text-white' htmlFor="">Discount Type </label>
       <select  {...register("discount_type")} className='p-2 w-fit rounded' id="">
        <option value="Percentage">
            Percentage
        </option>
        <option value="Absolute">
            Absolute
        </option>
       </select>
     <div className="flex gap-5 items-center">
        <div className="flex flex-col gap-2 items-center">
              <label className='text-white' htmlFor="">
        Start Date
       </label>
        <input {...register("start_date")} placeholder='start_date' className='p-2 w-fit rounded' type="date"  />
        </div>
            <div className="flex flex-col gap-2 items-center">
                <label  className='text-white' htmlFor="">
            End Date
        </label>
        <input {...register("end_date")} placeholder='end_date' className='p-2 w-fit rounded' type="date" />
            </div>

     </div>

        <input {...register("sku")} placeholder='variant sku' className='p-2 w-fit rounded' type="text" />
        <input type="submit" value="submit" className='py-1 px-2 rounded bg-indigo-500 text-white ' />
        {error && <p className='text-red-500'>{error}</p>}
    </form>
        </div>}
        <NavBar />
        <div className="w-screen h-full p-10">
            <div className="flex justify-between px-2">
                <h1>These are all discounts</h1>
                <button onClick={() => setaAddForm(prev => !prev)} className='bg-indigo-500 p-2 rounded-full text-gray-100'>Add Discount</button>
            </div>
            <div className="flex gap-5 flex-wrap p-5">
             {discounts && discounts.map(d => (
                   <div key={d._id} className="h-fit w-fit gap-4 items-center p-3  bg-slate-300 rounded flex-col flex">
            <p>{d.name}</p>
            <p>{new Date(d.start_date).toDateString()}</p>
            <p>{new Date(d.end_date).toDateString()}</p>
                </div>
             ))}
            </div>
        </div>
    </div>
  )
}

export default Discounts