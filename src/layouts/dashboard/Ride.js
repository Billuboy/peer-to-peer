import React from 'react';
import { Link } from 'react-router';

export default function Ride({ ride, web3, i }) {
  console.log(web3.fromWei(ride[1], 'ether'))
  return (
    <div key={i} className='border p-4 rounded-md flex flex-col gap-3 shadow-sm'>
      <p className='text-xs'>Driver: {ride[0]}</p>
      <div className='flex gap-4'>
        <p className='w-1/2 text-sm'>
          From: <span className='text-lg'>{ride[3]}</span>
        </p>
        <p className='text-sm'>
          To: <span className='text-lg'>{ride[4]}</span>
        </p>
      </div>
      <div className='flex gap-4'>
        <p className='w-1/2 text-sm'>
          Departure:{' '}
          <span className='text-lg uppercase'>
            {ride[6]['c'][0] % 12}:00 {ride[6]['c'][0] > 12 ? 'pm' : 'am'}
          </span>
        </p>
        <p className='text-sm'>
          Arrival:{' '}
          <span className='text-lg uppercase'>
            {ride[7]['c'][0] % 12}:00 {ride[7]['c'][0] > 12 ? 'pm' : 'am'}
          </span>
        </p>
      </div>
      <div className='flex gap-4'>
        <p className='w-1/2 text-sm'>
          Price: <span className='text-lg uppercase'>{ride[1]['c'][0]}</span>
        </p>
        <p className='text-sm'>
          Available seats: <span className='text-lg uppercase'>{ride[2]['c'][0]}</span>
        </p>
      </div>
      <Link to={`/details/${i}`}>
        <button className='bg-blue-200 w-full py-1 rounded-md'>Details</button>
      </Link>
    </div>
  );
}
