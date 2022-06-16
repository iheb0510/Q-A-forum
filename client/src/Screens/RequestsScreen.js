import React from 'react'
import FindRequestsContainer from '../Container/FindRequestsContainer'

const RequestsScreen = () => {
    return (
        <div className='grid grid-cols-4 h-full'>
        <div className='col-span-4 md:col-span-3'>
          <div className='mb-2 text-xl text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 w-full font-bold p-3'>
            Find Request
          </div>
          <div>
            <FindRequestsContainer/>
          </div>
        </div>
      </div>
      )
}

export default RequestsScreen