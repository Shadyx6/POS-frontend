import React from 'react'
import ServerErrImg from '../assets/server-error.png'

function ServerError({error}) {
    console.log(error)
  return (
    <div className='h-screen w-screen bg-white flex items-center justify-center flex-col'>
        <div className="h-[60%] w-1/2 rounded">
            <img className='h-full w-full object-cover bg-cover' src={ServerErrImg} alt="" />
        </div>
        <p className='text-red-500 text-xl mt-2' >{error} </p>
    </div>
  )
}

export default ServerError