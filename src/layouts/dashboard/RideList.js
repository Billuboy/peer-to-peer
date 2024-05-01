import React, { Component } from 'react';
import RideshareContract from '../../../build/contracts/Rideshare.json';
import store from '../../store';
import JoinRideContainer from '../../rideshare/ui/joinride/JoinRideContainer';
import Ride from './Ride';

const contract = require('truffle-contract');

class RideList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
      rideshareLoading: true,
    };
    this.getRides = this.getRides.bind(this);
    this.rideshareButton = this.rideshareButton.bind(this);
  }

  componentDidMount() {
    this.getRides();
  }

  getRides() {
    let web3 = store.getState().web3.web3Instance;

    const rideshare = contract(RideshareContract);
    rideshare.setProvider(web3.currentProvider);

    // Get current ethereum wallet.
    web3.eth.getCoinbase(async (error, coinbase) => {
      // Log errors, if any.
      if (error) {
        console.error(error);
      }

      try {
        const rideshareInstance = await rideshare.deployed();
        const rides = await rideshareInstance.getRideCount();

        const modRides = [];
        for (let i = 0; i < rides; i++) {
          const [ride, passengers] = await Promise.all([
            rideshareInstance.getRide(i),
            rideshareInstance.getPassengers(i),
          ]);
          modRides.push({ ride, passengers });
        }
        this.setState({ rides: modRides, rideshareLoading: false });
      } catch (e) {
        console.log(e);
      }
    });
  }

  rideshareButton(condition, bigNum, i) {
    let web3 = store.getState().web3.web3Instance;
    console.log('passengers');
    console.log(this.state.passengers);
    if (condition) {
      return <span>Leave</span>;
    } else {
      return (
        <JoinRideContainer
          ride_number={i}
          payment={web3.fromWei(bigNum, 'ether').toNumber()}
        />
      );
    }
  }

  render() {
    let web3 = store.getState().web3.web3Instance;

    if (this.state.rideshareLoading) {
      return <p>Loading</p>;
    } else {
      console.log('rides', this.state.rideshares);
      return (
        <div className='grid grid-cols-2 gap-y-4 gap-x-10 mt-10'>
          {this.state.rides.map((ride, i) => {
            return (
              <Ride
                key={i}
                i={i}
                ride={ride.ride}
                passengers={ride.passengers}
                web3={web3}
              />
            );
          })}
        </div>
      );
    }
  }
}

export default RideList;
