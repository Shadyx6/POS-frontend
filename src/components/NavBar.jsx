import React, { useState } from 'react'
import cart from "../assets/grocery-store.png";
import discount from "../assets/discount.png";
import shoppingBag from "../assets/shopping-bag.png";
import userImg from "../assets/user.png";
import bag from "../assets/nav-bag.png";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../store/authSlice';
import api from '../../utils/api';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaCartArrowDown } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { BiCart } from "react-icons/bi";
import { IoBagHandle } from "react-icons/io5";
import { TbRosetteDiscountCheckOff } from "react-icons/tb";
import { TfiFlickrAlt } from "react-icons/tfi";
import { TbTruckReturn } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { MdOutlinePayments } from "react-icons/md";

function NavBar() {
  const [dropDown, setDropDown] = useState(false)
  const user = useSelector(state => state.authSlice.userData)
  const [isSideBar, setIsSideBar] = useState(false)
  const [isProfile, setIsProfile] = useState(false)
  const handleClick = () => {
    setDropDown(p => !p)
  }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const res = await api.post("/user/logout")
      if(res.data.success){
        dispatch(Logout())
        navigate("/")
      }
    } catch (error) {
      console.log(error)
      return navigate("/server-error")
    }
  }

  return (
    <>  
    {isProfile && (<div className="absolute h-screen w-screen bg-black bg-opacity-50 ">
      <div className="h-64 w-96 rounded-lg absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
    <div className="flex flex-col h-full w-full p-2">
      <div className="h-4 text-end">
        <button onClick={() => {
          setIsProfile(false)
          setDropDown(false)
        }}>❌</button>
      </div>
       <div className="flex flex-col h-full w-full p-3 items-start justify-center ">
        <h1 className='bg-green-400 rounded-full py-1 px-3 '>Your Profile</h1>
        <p>Name: <span className='text-2xl' > {user.full_name} </span></p>
      <p>Username: <span className='text-2xl' > {user.username} </span> </p>
      <p>Email: <span className='text-2xl'>{user.email}</span> </p>
      
      </div>
    </div>
     
    </div>
    </div>)}
    <button onClick={() => setIsSideBar(prev => !prev)} className='absolute duration-300 ease-linear left-12 size z-50 top-5'> {isSideBar ? (<RxCross2 className='fixed duration-300 ease-linear' size={'24px'} />) : (<RxHamburgerMenu className='absolute duration-300 ease-linear' size={'24px'} />)} </button>
    <div className={` ${isSideBar ? "-translate-x[100%]" : "-translate-x-[100%]"} duration-300 ease-in fixed top-0 p-12  h-full w-1/2 bg-white z-20`}  >
      <h1 className='text-2xl'>Menu</h1>
  <hr className="h-2 mt-2 mb-4 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.7)]" />

     <div className="flex flex-col gap-8 mt-6 justify-center">
      <Link to={'/add-product'} className="flex gap-2 hover:text-indigo-500 duration-150   w-fit cursor-pointer ease-linear">
      <FaCartArrowDown size={'30px'} /> <h2 className='text-xl'>Add Products</h2>
      </Link>
       <Link to={'/add-order'} className="flex gap-2 hover:text-indigo-500 duration-150  w-fit cursor-pointer ease-linear">
      <BiCart size={'30px'} /> <h2 className='text-xl'>View Cart</h2>
      </Link>
       <Link to={'/my-orders'} className="flex gap-2 hover:text-indigo-500 duration-150  w-fit cursor-pointer ease-linear">
      <IoBagHandle size={'30px'} /> <h2 className='text-xl'>My Orders</h2>
      </Link>
       <Link to={'/discounts'} className="flex gap-2 hover:text-indigo-500 duration-150  w-fit cursor-pointer ease-linear">
      <TbRosetteDiscountCheckOff size={'30px'} /> <h2 className='text-xl'>Discounts</h2>
      </Link>
      <Link to={'/payments'} className="flex gap-2 hover:text-indigo-500 duration-150  w-fit cursor-pointer ease-linear">
      <MdOutlinePayments size={'30px'} /> <h2 className='text-xl'>Payments</h2>
      </Link>
       <Link to={'/add-variant'} className="flex gap-2 hover:text-indigo-500 duration-150  w-fit cursor-pointer ease-linear">
      <TfiFlickrAlt size={'30px'} /> <h2 className='text-xl'>Add Variants</h2>
      </Link>

       <Link to={'/return'} className="flex gap-2 hover:text-indigo-500 duration-150   w-fit cursor-pointer ease-linear">
      <TbTruckReturn size={'30px'} /> <h2 className='text-xl'>Return Section</h2>
      </Link>
       <Link onClick={() => handleLogout()} className="flex gap-2 hover:text-indigo-500 duration-150   w-fit cursor-pointer ease-linear">
      <CiLogout size={'30px'} /> <h2 className='text-xl'>Logout</h2>
      </Link>
     </div>
    </div>
 {isSideBar &&     <div className={`h-full w-screen fixed bg-black bg-opacity-50 z-10`}>
    </div>}
      
       <div className="w-screen overflow-x-hidden h-[4rem]  bg-[#E7E5E4] flex justify-between px-32 py-2">

              <div className="left flex gap-3 items-center">
                <div className="img h-12 overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={bag}
                    alt="shopping-bag"
                  />
                </div>
                <div className="tags flex gap-3">
                  <Link
                    className="py-1 px-2 bg-white shadow-md rounded-md text-xl font-semibold"
                    to={"/"}
                  >
                    Home
                  </Link>
                  <Link
                    className="py-1 px-2 bg-white shadow-md rounded-md text-xl font-semibold"
                    to={"/add-product"}
                  >
                    Add Product
                  </Link>
                  <Link
                    className="py-1 px-2 bg-white shadow-md rounded-md text-xl font-semibold"
                    to={"/return"}
                  >
                    Return Section
                  </Link>
                   <Link
                    className="py-1 px-2 bg-white shadow-md rounded-md text-xl font-semibold"
                    to={"/inventory"}
                  >
                    Inventory
                  </Link>
                </div>
              </div>
              <div className="right">
                <div className="flex gap-8 items-center">
                  <Link to={"/add-order"} className="h-10 overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={cart}
                      alt=""
                    />
                  </Link>
                  <Link to={"/discounts"} className="h-10 overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={discount}
                      alt=""
                    />
                  </Link>
                  <Link to={"/my-orders"} className="h-10 overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={shoppingBag}
                      alt=""
                    />
                  </Link>
                  <div  onClick={() => handleClick()}  className="h-10 flex items-center cursor-pointer justify-center overflow-hidden rounded-full w-10 bg-stone-700">
                    <h1 className='text-white text-center text-xl '> {user ? (user.username.slice(0,1).toUpperCase()): ""} </h1>
                  </div>

                </div>
            {dropDown && (
                  <div className="absolute rounded-lg right-8 mt-1 w-40  bg-white border shadow-lg z-10">
          <ul className="py-2">
            <li onClick={() => setIsProfile(true)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
            <li onClick={() => handleLogout()} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        </div>
            )}
              </div>
            </div>
    </>

  )
}

export default NavBar