import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../src/components/Home'
import Products from '../src/components/Products'
import AddProduct from '../src/components/AddProduct'
import AddVariant from '../src/components/AddVariant'
import UpdateProduct from '../src/components/UpdateProduct'
import OrderProduct from '../src/components/OrderProduct'
import Orders from '../src/components/Orders'
import CheckoutPage from '../src/components/CheckoutPage'
import LoginPage from '../src/components/LoginPage'
import RegisterPage from '../src/components/RegisterPage'
import Protector from '../src/components/Protector'
import Billing from '../src/components/Billing'
import Loader from '../src/components/loader'
import Discounts from '../src/components/Discounts'
import ReturnPage from '../src/components/ReturnPage'
import ServerError from '../src/components/ServerError'
import Inventory from '../src/components/Inventory'
import ReturnOrder from '../src/components/ReturnOrder'
import ReturnedItems from '../src/components/ReturnedItems'
import Payments from '../src/components/Payments'


function Routing() {
  return (
    <Routes>
     <Route path="/" element={
        <Protector>
            <Home />
        </Protector>
    } />
     <Route path="/products" element={
        <Protector>
            <Products />
        </Protector>
    } />
   
    <Route path='/products' element={<Products />} />
    <Route path='/add-product' element={<AddProduct />} />
    <Route path='/add-variant' element={<AddVariant />} />
    <Route path="/update-product/:id" element={<UpdateProduct />} />
    <Route path='/add-order' element={<OrderProduct />} />
    <Route path='/my-orders' element={<Orders />} />
    <Route path='/checkout/:id' element={<CheckoutPage />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/register' element={<RegisterPage />} />
    <Route path='/billing/:id' element={<Billing />} />
    <Route path='/loading' element={<Loader />} />
    <Route path='/discounts' element={<Discounts />} />
    <Route path='/return' element={<ReturnPage />} />
    <Route path='/server-error' element={<ServerError />} />
    <Route path='/inventory' element={<Inventory />} />
    <Route path='/return/:id' element={<ReturnOrder />} />
    <Route path='/returned-products' element={<ReturnedItems />} />
    <Route path='/payments' element={<Payments />} />
   </Routes>
  )
}

export default Routing