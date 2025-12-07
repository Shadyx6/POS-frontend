import React from 'react';
import { ClimbingBoxLoader
 } from 'react-spinners';

function Loader({context="Loading your experience...", color="gray"}) {
 return (
      <div className='h-screen w-screen items-center flex-col flex justify-center'>
        <ClimbingBoxLoader

          color={color}
          size={'100%'}
        />
        <h1>{context}</h1>
      </div>
    )
}
   
export default Loader
