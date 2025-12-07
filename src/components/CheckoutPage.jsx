import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Loader from './Loader'
import { toast } from 'react-toastify'
function CheckoutPage() {
  const user = useSelector(state => state.authSlice.userData)
  console.log(user)
  const {register, handleSubmit} = useForm()
  const [taxAmount, setTaxAmount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [items, setItems] = useState(null)
  const [discount,  setDiscount] = useState(null)
  const [totalPrice, setTotalPrice] = useState(null)
  const [totalDiscount,setTotalDiscount] = useState()

  const {id} = useParams()
     const fetchItems = () => {
      let list = localStorage.getItem("items")
      if(!list || list.length <= 0){
        return setItems([])
      }
      list = JSON.parse(list)
      setItems(list)
    }
  // const fetchProducts = async () => {
  //   try {
  //     const res = await api.get(`/order-item/all-items/${id}`)
  //     if(res.data.success){
  //       setItems(res.data.allOrderItems)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     setError(error.message)
  //   }
  // }
  useEffect(() => {
    fetchItems()
  }, [id])
  function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
       setLoading(true)
       if(data.payment_mode === "default"){
        return setError("Set Payment method!")
       }
      if(!data.user_phone || !data.user_email || !data.user_name || !data.payment_mode || !data.posted_by || !data.address ) {
        return setError("Please enter details")
    }
    if (data.payment_mode === 'COD')

    console.log(data)
      const res = await api.post(`/order/checkout/${id}`, {
        user_email: data.user_email,
        user_phone: data.user_phone,
        user_name: data.user_name,
        payment_mode: data.payment_mode,
        posted_by: data.posted_by,
        address: data.address,
        amount: totalPrice
       })
       console.log(res)
      if (data.payment_mode === 'COD'){
        if (res.data.success){
           localStorage.setItem("items", JSON.stringify([]))
        localStorage.removeItem("order_id")
        console.log("order made")
        let user = localStorage.getItem("user")
        if (user) {
        user = JSON.parse(user)
        user = [...user, id]
        localStorage.setItem("user", JSON.stringify([user]))
        }
        localStorage.setItem("user", JSON.stringify([id]))
        toast.success("Order made successfully")
        navigate(`/billing/${id}`)
                
        }
      }

       if(res.data.payment){
        console.log("here")
        const Razorpay = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js")
        console.log(Razorpay)
      
       var options = {
  key: import.meta.env.VITE_RAZORPAY_KEY,// Enter the Key ID generated from the Dashboard
    "amount": totalPrice * 100, // Amount is in currency subunits. 
    "currency": "INR",
    "name": "POS", //your business name
    "description": "Order Payment",
    "image": "https://example.com/your_logo",
    "order_id": res.data.order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1,
      "handler": function(res) {
        console.log(res, "handler here")
                api.post('/order/api/payment/verify', {
                  razorpayOrderId: res.razorpay_order_id,
                  razorpayPaymentId: res.razorpay_payment_id,
                  signature: res.razorpay_signature
                })
                .then(function (response) {
                  console.log(response)
                     localStorage.setItem("items", JSON.stringify([]))
        localStorage.removeItem("order_id")
        console.log("order made")
        let user = localStorage.getItem("user")
        if (user) {
        user = JSON.parse(user)
        user = [...user, id]
        localStorage.setItem("user", JSON.stringify([user]))
        }
        localStorage.setItem("user", JSON.stringify([id]))
        toast.success("Order made successfully")
        navigate(`/billing/${id}`)
                })
                .catch(function (error) {
                  console.log("here")
                  console.error(error);
                });
              },
    "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        "name": data.user_name, //your customer's name
        "email": data.user_email,
        "contact": data.user_phone //Provide the customer's phone number for better conversion rates 
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new window.Razorpay(options);
rzp1.open()
       }
      
    } catch (error) {
      console.log(error)
      toast.error("Error in placing order")
      setError(error.message)
      return navigate("/server-error")
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('discount here',discount)
  }, [discount])
  useEffect(() => {
    const fetchDiscounts = async () => {
if (id) {
        try {
          console.log(items)
        const res = await api.get(`/discount/all/${id}`)
        console.log(res)
        if (!res.data.success){
          return setError("Could not find discount")
        }
        console.log(res.data)
        setDiscount(res.data.validDiscounts)
  
      } catch (error) {
        console.log(error)
        setError("error occurred")
        return navigate("/server-error")
      }
}
    }
    fetchDiscounts()
  }, [id])
  


  useEffect(() => {
    const price = discount && discount.reduce((start, dis) => start + dis.discount_price,0 )
    setTotalDiscount(price)
    
  }, [totalDiscount, discount])
 
  useEffect(() =>  {
    console.log("total discount", totalDiscount, totalPrice)
  }, [totalDiscount, totalPrice])

  useEffect(() => {
     const calcTotalPrice = () => {
    const price = items && items.reduce((start, item) => start + item.total_price, 0)
    setTotalPrice(price)
  }
    calcTotalPrice()
  }, [items])
  useEffect(() => {
    const calcTax = () => {
  if (totalPrice > 0){
      const tax = totalPrice * (18/100)
      setTaxAmount(tax)
      console.log(taxAmount, 'tax')
    }
    }
    calcTax()
  }, [totalPrice])

  return loading ? <Loader context="Placing your order..." /> : (
    <>
    <div className="h-screen w-screen flex">
        <div className="w-[70%] p-10 bg-cyan-100">
          These are your items in your order!
       <div className="flex flex-wrap gap-5">
         {
          items && items.length > 0 && items.map(item => (
            <div key={item._id} className='flex flex-col gap-4 items-start'>
            <div className="h-fit w-fit p-5 rounded flex flex-col gap-2 items-center justify-center overflow-hidden bg-gray-400">
              <h3>Order ID: <br /> {item.order_id}</h3>
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
                {}
              quantity: {item.quantity}
              </h3>

            </div>
          </div>
          ))
      
}
       </div>
        {error && <p>{error}</p>}
        </div>
        <div className="w-[30%] flex flex-col py-10 px-10">
          {discount && discount.length > 0 && (
            <div className="flex flex-col border-2 border-red-300 p-5">
              <h1 className='text-red-400'>Hurray You have got Discount!</h1>
              {discount.map(d => {
           return <div key={d.variant._id} className="flex flex-col">
                <p>Variant: {d.variant.variant_name}</p>
                <p>Value: {d.variant.variant_value}</p>
                <p>Discounted Price: ${d.discount_price} </p>
              </div>
              })}
               <h2 >New effective price: <s> ${totalPrice}
                  </s> ${ totalPrice - totalDiscount }</h2>
            </div>
          )}  
           <div className="flex flex-col border-2 border-red-300 p-5">
              <h1 className='text-red-400'>Checkout Details</h1>
               <h2 >SubTotal:${totalPrice}</h2>
               <h2 >Tax Amount:18% - ${taxAmount}</h2>
               <h2>Total Amount: ${totalPrice && totalPrice + taxAmount - totalDiscount}</h2>
               
            </div>


          <form className='flex mt-3 flex-col gap-5' onSubmit={handleSubmit(onSubmit)} action="">
            <input className='p-2 rounded border-2 ' {...register("user_name")} placeholder='Full name' type="text" />
            <input className='p-2 rounded border-2 ' {...register("user_phone")} placeholder='Phone number' type="number" />
            <select className='p-2 rounded border-2 ' {...register("payment_mode")}  id="">
              <option value="default">
                Select Payment mode
              </option>
              <option value="online">
                Online
              </option>
              <option value="COD">
                COD
              </option>
            </select>
            <input className='p-2 rounded border-2 ' {...register("user_email")}placeholder='User email' type="email" />
            <input className='p-2 rounded border-2 ' {...register("address")}placeholder='Shipping Address' type="text" />
            <input disabled defaultValue={user && user.email}  className='p-2 rounded border-2 ' {...register("posted_by")}placeholder='Posted By' type="email" />
            <input  disabled={loading} className='p-2 rounded text-white bg-green-500' type="submit" value={loading ? "Proceeding..." : "Place order"} />
          </form>
        </div>
    </div>
    </>
  )
}

export default CheckoutPage