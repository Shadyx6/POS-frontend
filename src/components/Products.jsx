import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'

function Products() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    useEffect(() => {
        async function getProducts() {
            try {
                const res = await api.get('/products')
                console.log(res)
            if(res.data){
                setProducts(res.data)
            } 
            
            } catch (error) {
                console.log(error)
                return navigate("/server-error")
            }
        }
        getProducts()
    }, [])


  return (
    <>
    <div className="min-h-screen h-auto bg-pink-100">
   <div className="flex flex-wrap p-10 gap-5">
    {
     products.length > 0 ?
      products.map((prod => (
        <div key={prod._id} className="bg-pink-300 rounded w-30 p-12 h-auto py-10">
            <h1>{prod.name}</h1>
            <p>{prod.description}</p>
            {
                
            }
            <button className='mt-3 ml-full p-2 rounded-lg  bg-blue-200' >Add to inventory</button>
        </div>
     )))
     : <p>No products yet</p>
    }
   </div>
     </div>
 
    </>
  )
}

export default Products