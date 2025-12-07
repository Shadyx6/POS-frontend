import React from 'react'
import { useEffect } from 'react'
import isLoggedIn from '../../utils/isLoggedIn'
import {useSelector} from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

function Protector({children}) {
    console.log(useSelector(state => console.log(state)))
    const {status, isLoading} = useSelector(state => state.authSlice) 
    if (isLoading) 
        return <p>Loading....</p>
    if (!status && !isLoading){
        console.log("not logged in")
        return <Navigate to={'/login'} replace />
        
    }
    return children
        
}

export default Protector