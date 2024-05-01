import React, { Component } from 'react'
import RideshareContract from '../../../build/contracts/Rideshare.json'
import store from '../../store'
import JoinRideContainer from '../../rideshare/ui/joinride/JoinRideContainer'
import Ride from './Ride'


const contract = require('truffle-contract')

class RideList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rideshares: [],
      passengers: [],
      rideshareLoading: true
    };
    this.getRides = this.getRides.bind(this);
    this.rideshareButton = this.rideshareButton.bind(this);
  }

  componentDidMount() {
    this.getRides();
  }

  getRides() {
    console.log('store',store.getState())
    let web3 = store.getState().web3.web3Instance

    const rideshare = contract(RideshareContract)
    rideshare.setProvider(web3.currentProvider)

    // Declaring this for later so we can chain functions on Authentication.
    var rideshareInstance

    var _this = this;

    // Get current ethereum wallet.
    web3.eth.getCoinbase((error, coinbase) => {
      // Log errors, if any.
      if (error) {
        console.error(error);
      }

      rideshare.deployed().then(function(instance) {
        rideshareInstance = instance

        rideshareInstance.getRideCount.call()
        .then(function(result) {
          // console.log('get rideshare count', result)
          // console.log(result)
          let rideshareCount = result["c"][0];

          for (let i = 0; i < rideshareCount; i++) {
            rideshareInstance.getRide.call(i)
            .then(function(result) {
              // If no error, login user.
              // console.log('getridesharecount')
              // console.log(result)
              var tempArr = _this.state.rideshares;
              let tempRideshares = tempArr.concat([result]);
              _this.setState({rideshares: tempRideshares})
              // console.log('test2');
              // console.log(_this.state.rideshares);
              // debugger
              // return result;
              // return dispatch(loginUser())
            })
            rideshareInstance.getPassengers.call(i)
            .then(function(result) {
              var tempArr = _this.state.passengers;
              let tempPassengers = tempArr.concat([result]);
              _this.setState({passengers: tempPassengers})
            })
            // Attempt to sign up user.
            .catch(function(result) {
              // If error...
            })
          }
          _this.setState({rideshareLoading: false})
        })
      })
    })
  }

  rideshareButton(condition, bigNum,i) {
    let web3 = store.getState().web3.web3Instance
    console.log('passengers');
    console.log(this.state.passengers);
    if (condition) {
      return (
        <span>Leave</span>
      )
    } else {
      return (
        <JoinRideContainer ride_number={i} payment={web3.fromWei(bigNum, "ether" ).toNumber()}/>
      )
    }
  }

  render() {
    let web3 = store.getState().web3.web3Instance

    
    if (this.state.rideshareLoading) {
      return (
        <p>Loading</p>
      )
    } else {
      // console.log('rides', this.state.rideshares)
      return(
            <div className="grid grid-cols-2 gap-y-4 gap-x-10 mt-10">
              {this.state.rideshares.map((ride, i) => {
                console.log('ride', ride);
                return (
                  <Ride key={i} i={i} ride={ride} web3={web3} />
                )
              })}
            </div>
      )
    }
  }
}

export default RideList
