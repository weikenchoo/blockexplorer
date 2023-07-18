import React from 'react'
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

function NotFound() {
  const {query} = useParams();
  return (
    <div className='flex flex-col justify-center items-center'>
      <p className='text-5xl p-2'>Search not found</p>
      {
        query &&
        <div className='text-xl p-2'>
          Oops! The search string you entered was: {query}
        </div>
      }
      <Link to={`/`}>
        <button class="rounded-lg border-2 p-2 bg-gray-500 text-white">Back Home</button>
      </Link>
 
      
    </div>
  )
}

export default NotFound