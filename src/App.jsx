  import React, { useState } from 'react'
  import Products from './components/Products'
  import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
  import AddProduct from './components/AddProduct'
  import Home from './components/Home'
  import Routing from '../utils/Routing'
  import { useEffect } from 'react'
  import isLoggedIn from '../utils/isLoggedIn'
  import { useDispatch, useSelector } from 'react-redux'
  import { Login, Logout } from './store/authSlice'
  import Loader from './components/Loader'
  import offlineError from './assets/offline.png'
import ServerError from './components/ServerError'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

  function App() {
    useSelector(state => console.log(state))
    const [server, setServer] = useState(null)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
      const authCheck = async () => {
      try {
        const user = await isLoggedIn()
      if (user) {
        console.log(user)
        dispatch(Login(user))
      } 
      else {
        console.log("else block")
        dispatch(Logout())    
      }
      } catch (error) {
        console.log(error)
        console.log("here")
        dispatch(Logout()) 
        return <Navigate to={"/server-error"} replace />
      }
      finally{
        setLoading(false)
      }
      }
      authCheck()
    }, [dispatch])
      const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); 

    if (loading) return <Loader />
    // if(!isOnline) return <div className="h-screen w-screen p-10 bg-indigo-200  overflow-hidden">
    //    <img className='h-full w-full object-cover rounded' src={offlineError} alt="" />
    // </div>
    return <>
     <ToastContainer position="top-right" autoClose={3000} />
    <Routing />
    </> 
  }

  export default App