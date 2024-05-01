import React, { Component } from 'react';
import RideshareContract from '../../../build/contracts/Rideshare.json';
import UserContract from '../../../build/contracts/Authentication.json';
import store from '../../store';
import JoinRideContainer from '../../rideshare/ui/joinride/JoinRideContainer';
import ConfirmDriverMetContainer from '../../rideshare/ui/confirmDriverMet/ConfirmDriverMetContainer';
import ConfirmPassengersMetContainer from '../../rideshare/ui/confirmPassengersMet/ConfirmPassengersMetContainer';
import ArrivedContainer from '../../rideshare/ui/arrived/ArrivedContainer';
import { Link } from 'react-router';

import { connect } from 'react-redux'
import { arrived } from './ArrivedActions'
import { confirmDriverMet } from '../../rideshare/ui/confirmDriverMet/ConfirmDriverMetActions';


const contract = require('truffle-contract');

const statusMap = {
  initial: {
    text: 'Waiting for driver to arrive',
    color: 'text-yellow-500',
  },
  driverConfirmed: {
    text: 'Ride confirmed',
    color: 'text-green-700',
  },
  completion: {
    text: 'Ride completed',
    color: 'text-blue-600',
  },
};

class RideDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { ride: null, isLoading: true };
    this.getRides = this.getRides.bind(this);
  }

  componentDidMount() {
    this.getRides();
  }

  async getRides() {
    let web3 = store.getState().web3.web3Instance;

    const rideshare = contract(RideshareContract);
    const user = contract(UserContract);
    rideshare.setProvider(web3.currentProvider);
    user.setProvider(web3.currentProvider);
    var _this = this;

    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      // Log errors, if any.
      if (error) {
        console.error(error);
      }

      try {
        const rideInstance = await rideshare.deployed();
        const userInstance = await user.deployed();

        const [ride, passengers] = await Promise.all([
          rideInstance.getRide(_this.props.rideId),
          rideInstance.getPassengers(_this.props.rideId),
        ]);

        const passengersArr = [];
        for (var i = 0; i < passengers.length; i++) {
          const [passengerInfo, status] = await Promise.all([
            userInstance.login({ from: passengers[i] }),
            rideInstance.getPassengerRideState(
              _this.props.rideId,
              passengers[i],
            ),
          ]);

          passengersArr.push({
            id: passengers[i],
            status,
            data: {
              id: passengerInfo[0],
              name: web3.toUtf8(passengerInfo[1]),
              email: web3.toUtf8(passengerInfo[2]),
              mobile: passengerInfo[3],
            },
          });
        }

        this.setState({
          ride: {
            driver: ride[0],
            from: ride[3],
            to: ride[4],
            departure: `${ride[6]['c'][0] % 12}:00 ${
              ride[6]['c'][0] > 12 ? 'pm' : 'am'
            }`,
            arrival: `${ride[7]['c'][0] % 12}:00 ${
              ride[7]['c'][0] > 12 ? 'pm' : 'am'
            }`,
            price: ride[1]['c'][0],
            seats: ride[2]['c'][0],
            passengers: passengersArr,
          },
          isLoading: false,
        });
      } catch (err) {
        console.log(err);
      }
    });
  }

  getAvatar(name) {
    return `https://ui-avatars.com/api/?background=random&name=${name}`;
  }

  render() {
    let web3 = store.getState().web3.web3Instance;

    if (this.state.isLoading) {
      return <p>Loading...</p>;
    } else {
      const currAccount = web3.eth.accounts[0];
      let rideId = this.props.rideId;
      let data = this.state.ride;
      let isPassenger = !!data.passengers.find((pass) => pass.id === web3.eth.accounts[0]);
      let isDriver = data.driver === currAccount;
      console.log(isPassenger, isDriver, this.props);

      console.log(data.passengers)

      return (
        <div className='mt-10 w-[900px] mx-auto'>
          <div>
            <div>
              <h1 className='text-3xl font-medium mb-4'>Ride Information:</h1>
              <div className='flex flex-col gap-2'>
                <p>
                  Driver: <span className='text-lg'>{data.driver}</span>
                </p>
                <p>
                  From: <span className='text-lg'>{data.from}</span>
                </p>
                <p>
                  To: <span className='text-lg'>{data.to}</span>
                </p>
                <p>
                  Departure time:{' '}
                  <span className='text-lg'>{data.departure}</span>
                </p>
                <p>
                  Arrival time: <span className='text-lg'>{data.arrival}</span>
                </p>
                <p>
                  Available seats: <span className='text-lg'>{data.seats}</span>
                </p>
                <p>
                  Price per head: <span className='text-lg'>{data.price}</span>
                </p>
              </div>
            </div>
            <div className='my-10'>
              <h1 className='text-3xl font-medium mb-4'>Passengers:</h1>
              <div className='grid grid-cols-2 gap-4'>
                {data.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className='border rounded-md p-4 flex flex-col w-full gap-2'>
                    <p className='text-xs'>{passenger.id}</p>
                    <div className='flex items-center gap-3 my-3'>
                      <img
                        src={this.getAvatar(passenger.data.name)}
                        alt='Alt'
                        className='size-12 rounded-full'
                      />
                      <div>
                        <p className='text-lg font-medium'>
                          {passenger.data.name}{' '}
                          <span className='text-sm'>
                            ({passenger.data.mobile})
                          </span>
                        </p>
                        <p className='text-sm'>{passenger.data.email}</p>
                      </div>
                    </div>
                    <p className='text-lg'>
                      Status:{' '}
                      <span className={`${statusMap[passenger.status].color}`}>
                        {statusMap[passenger.status].text}
                      </span>
                    </p>
                    {passenger.status === 'initial' && isPassenger ? (
                      <button className='bg-green-500 w-full py-1 rounded-md' onClick={()=> this.props.onConfirmDriverMetFormSubmit(rideId)}>
                        Confirm driver met
                      </button> 
                    ) : null}
                    {passenger.status === 'driverConfirmed' && isPassenger ? (
                      <button className='bg-green-500 w-full py-1 rounded-md' onClick={()=> this.props.arrivedFormSubmit(rideId)}>
                        Arrived at destination
                      </button> 
                    ) : null}
                    {/* {passenger.status === 'initial' && isDriver ? (
                      <button className='bg-green-500 w-full py-1 rounded-md' onClick={()=> this.props.onConfirmDriverMetFormSubmit(rideId)}>
                        Confirm
                      </button> 
                    ) : null} */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

      // if (isPassenger) {
      //     let confirmDriverMet;
      //     if (passengerState === 'initial') {
      //       confirmDriverMet = <ConfirmDriverMetContainer ride_number={rideId} />;
      //     } else if (passengerState === 'enRoute') {
            // confirmDriverMet = <ArrivedContainer ride_number={rideId} />;
      //     }

      //     return (
      //       <main className='container'>
      //         <div className='pure-g'>
      //           <div className='pure-u-1-1'>
      //             <p>You are a passenger</p>

      //             <p>Current state: {passengerState}</p>

      //             {confirmDriverMet}
      //           </div>
      //         </div>
      //       </main>
      //     );

      // }

      // let passengerState = this.state.passengerState;
      // let passengerStates = this.state.passengerStates;
      // let passenger = this.state.passenger;

      // if (isPassenger) {
      //   let confirmDriverMet;
      //   if (passengerState === 'initial') {
      //     confirmDriverMet = <ConfirmDriverMetContainer ride_number={rideId} />;
      //   } else if (passengerState === 'enRoute') {
      //     confirmDriverMet = <ArrivedContainer ride_number={rideId} />;
      //   }

      //   return (
      //     <main className='container'>
      //       <div className='pure-g'>
      //         <div className='pure-u-1-1'>
      //           <p>You are a passenger</p>

      //           <p>Current state: {passengerState}</p>

      //           {confirmDriverMet}
      //         </div>
      //       </div>
      //     </main>
      //   );
      // } else if (isDriver) {
      //   if (passengerStates.length === 0) {
      //     return <p>No passenger yet</p>;
      //   } else {
      //     return (
      //       <main className='container'>
      //         <div className='pure-g'>
      //           <div className='pure-u-1-1'>
      //             <p>You are a driver</p>
      //             <p>Passenger States: </p>

      //             {passengerStates.length == 0
      //               ? ''
      //               : passengerStates.map((passengerState, i) => {
      //                   return (
      //                     <p>
      //                       {passenger[i]} {passengerState}
      //                     </p>
      //                   );
      //                 })}

      //             <ConfirmPassengersMetContainer ride_number={rideId} />
      //           </div>
      //         </div>
      //       </main>
      //     );
      //   }
      // } else {
      //   return (
      //     <main className='container'>
      //       <div className='pure-g'>
      //         <div className='pure-u-1-1'>
      //           <p>Would you like to join this ride?</p>

      //           <JoinRideContainer
      //             ride_number={rideId}
      //             payment={web3.fromWei(ride[1], 'ether').toNumber()}
      //           />
      //         </div>
      //       </div>
      //     </main>
      //   );
      // }
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onArrivedFormSubmit: (ride_number) => {
      dispatch(arrived(ride_number))
    },
    onConfirmDriverMetFormSubmit: (ride_number) => {
      dispatch(confirmDriverMet(ride_number))
    },
    arrivedFormSubmit: (ride_number) => {
      dispatch(arrived(ride_number))
    },
  }
}

const RideDetailsConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(RideDetails)


export default RideDetailsConnect;
