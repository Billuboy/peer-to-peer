import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import store from '../../store';
import { joinRide } from './JoinRideActions';

function Ride({ ride, i, web3, passengers, onJoinRideFormSubmit }) {
  const { user } = store.getState();

  return (
    <div
      key={i}
      className='border p-4 rounded-md flex flex-col gap-3 shadow-sm'>
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
          Price: <span className='text-lg uppercase'>${ride[1]['c'][0]}</span>
        </p>
        <p className='text-sm'>
          Available seats:{' '}
          <span className='text-lg uppercase'>{ride[2]['c'][0]}</span>
        </p>
      </div>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Link to={`/details/${i}`}>
            <button className='bg-blue-400 w-full py-1 rounded-md'>
              Details
            </button>
          </Link>
        </div>
        {!passengers.find((pass) => pass === user.data.id) && ride[0] !== user.data.id ? (
          <button
            className='bg-green-400 flex-1 py-1 rounded-md'
            onClick={() =>
              onJoinRideFormSubmit(i, web3.fromWei(ride[1], 'ether').toNumber())
            }>
            Join
          </button>
        ): null}
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onJoinRideFormSubmit: (ride_number, payment) => {
      dispatch(joinRide(ride_number, payment));
    },
  };
};

const JoinRideContainer = connect(mapStateToProps, mapDispatchToProps)(Ride);

export default JoinRideContainer;
