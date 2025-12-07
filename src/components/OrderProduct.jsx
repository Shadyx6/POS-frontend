  import React from 'react'
  import NavBar from './NavBar'
  import { useState } from 'react'
  import { useEffect } from 'react';
  import api from '../../utils/api';
  import prodImg from '../assets/products.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

  function OrderProduct() {
    const [orderId, setOrderId] = useState(null)
    const [products, setProducts] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [error, setError] = useState(null)
    const [selectedVariant, setSelectedVariant] = useState('default')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [items, setItems] = useState([])
      const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        console.log(res.data);
        if (res.data.success) {
          const flatted = res.data.data.flat()
          console.log(flatted)
          setProducts(flatted);
        }
      } catch (error) {
        setError(error.message)
        return navigate("/server-error")
      }
    };

    useEffect(() => {
      console.log(selectedVariant)
    }, [selectedVariant])

    const userData = useSelector(state => state.authSlice.userData)
    const configureOrder = async () => {
      if (!orderId) {
        try {

          const res = await api.post("/order/post", {
            userData
          })
          console.log(res)
          if (res.data.success) {
            setOrderId(res.data.order_id)
            console.log(res.data.order_id)
            localStorage.setItem("order_id", res.data.order_id)
            setItems(() => {
              localStorage.setItem("items", JSON.stringify([]))
              return []
            })
            return
          }
        } catch (error) {
          console.log(error)
          setError(error.message)
          return navigate("/server-error")
        }
      } 
    }
    console.log(orderId)
    useEffect(() => {
       const setupOrder = async () => {
    let key = localStorage.getItem("order_id")
    console.log(key)
    if (!key) {
      await configureOrder()
    } else {
      setOrderId(key)
      console.log(orderId)
    }
  }
  setupOrder()
    }, [])

    useEffect(() => {
      fetchProducts()
    }, [])  
    const fetchItems = () => {
      let list = localStorage.getItem("items")
      if(!list || list.length <= 0){
        return setItems([])
      }
      list = JSON.parse(list)
      setItems(list)
    }
    useEffect(() => {
      fetchItems()
    },[])
    const navigate = useNavigate()
    return (
      <>
      <div className="h-screen w-screen overflow-x-hidden">
        <NavBar />
        <div className="flex flex-col">
          <h1>Make an order now</h1>
          <div className="w-1/2 flex flex-col h-60 gap-7">
          <select onChange={(e) => {
            console.log(e)
            const prod = products.find(p => p.prod._id === e.target.value)
            console.log("here")
            console.log(prod)
            setSelectedProduct(prod)
            setSelectedVariant(prod.variants[0])
            
          }} className='h-10 w-24' id="">
            <option value="default">
              Select a Product
            </option>
            {products && products.map((product, i) => (
              <option key={i} className='h-6 w-full p-2' value={product.prod._id}>
                {product.prod.name}
                {product.prod.quantity}
              </option>
              
            ))}
          </select>
          {selectedProduct && selectedProduct.variants && (
            <div className="flex">
              <select value={selectedVariant._id} onChange={(e) => {
                const selVar = selectedProduct.variants.find(v => v._id === e.target.value)
                setSelectedVariant(selVar)
              }} id="">
                <option disabled value="default">
                  select a variant
                </option>
                {selectedProduct.variants.map((variant,i) => (                  <option key={i} value={variant._id}>
                  {variant.variant_value}
                </option>
                ))}
              </select>
             <label className='ml-3 mr-4' htmlFor="">Enter quantity</label> <input placeholder='quantity'className='border border-bg-black border-2 rounded w-fit ' value={quantity} onChange={(e) => setQuantity(e.target.value)}  type="Number" />
            </div>
          )}
          

<button
  onClick={async () => {
    if (selectedProduct && quantity > 0) {
      console.log(selectedProduct)
      console.log(selectedVariant)
      if (selectedVariant.quantity < quantity) {
        return alert("Insufficient Quantity")
      }
      if (!selectedVariant || selectedVariant === 'default') {
        return alert("Please select a variant")
      }

      const data = {
        order_id: orderId,
        product_id: selectedProduct.prod._id,
        product_variant_id: selectedVariant,
        quantity: quantity,
        unit_price: selectedProduct.prod.price
      }

      try {
        const res = await api.post('/order-item/add', { data })
        if (res.data.success) {
          const orderItem = res.data.orderItem
          const currentVar = selectedProduct.variants.find(v => v._id === selectedVariant._id)

          setItems(prev => {
            const existingIndex = prev.findIndex(item => item._id === orderItem._id)

            let newItems
            if (existingIndex !== -1) {
              newItems = [...prev]
              newItems[existingIndex] = {
                ...newItems[existingIndex],
                quantity: orderItem.quantity,
                total_price: orderItem.total_price
              }
            } else {
              newItems = [
                ...prev,
                {
                  _id: orderItem._id,
                  order_id: orderId,
                  product_id: selectedProduct.prod._id,
                  name: selectedProduct.prod.name,
                  variantName: currentVar.variant_name,
                  variantValue: currentVar.variant_value,
                  quantity: orderItem.quantity,
                  variantId: currentVar._id,
                  total_price: orderItem.total_price
                }
              ]
            }

            localStorage.setItem("items", JSON.stringify(newItems))
            return newItems
          })
        }
      } catch (error) {
        setError(error.message)
      }
    }
  }}
  className='bg-blue-400 w-fit rounded-lg p-2 ml-10'
>
  Add to Order item
</button>

          </div>
        </div>
        <div className="w-full mt-6">
          <h1>Current Items</h1>
        <div className="flex flex-wrap gap-5 mt-7 px-10 p-6">
  {items && items.length > 0 ? items.map(item => (
          <div key={item._id} className='flex flex-col gap-4 items-start'>
            <div className="h-fit w-fit p-5 rounded flex flex-col gap-2 items-center justify-center overflow-hidden bg-gray-400">
              <h3>OrderItem ID: <br /> {item.order_id}</h3>
              <h3 className=''> Product Name: {item.name} </h3>
              <div className="flex gap-10">
                <div className="bg-green-400 rounded p-1">
                  {item.variantName}
                </div>
                 <div className="bg-blue-400 rounded p-1">
                  {item.variantValue}
                </div>
              </div>
              <h3>
              quantity: {item.quantity}
              </h3>
  <button 
  onClick={async () => {
    try {
      const res = await api.delete(`/order-item/cancel/${item._id}`)
      if (res.data.success) {
        // update state
        setItems(prev => {
          const newItems = prev.filter(i => i._id !== item._id)
          localStorage.setItem("items", JSON.stringify(newItems))
          return newItems
        })
        toast.success("Item removed from cart!")
      }
    } catch (error) {
      setError(error.message || "Something went wrong")
    }
  }} 
  className='bg-red-400 p-2 rounded-lg mr-auto'
>
  Remove Item
</button>
            </div>
   
          </div>

            
          )) : <h1>No items yet</h1>}
        </div>
        {items && items.length > 0 && (
                   <button onClick={() => navigate(`/checkout/${orderId}`)} className='bg-blue-400 h-fit w-fit ml-10  rounded p-2'>Checkout now </button>
        )}
        </div>
      </div>

      </>
    )
  }

  export default OrderProduct