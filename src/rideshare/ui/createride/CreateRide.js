import React, { Component } from 'react';

class CreateRide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expected_payment: '',
      capacity: 0,
      origin_address: '',
      destination_address: '',
      confirmed_at: 0,
      depart_at: 0,
    };
  }

  onExpectedPaymentChange(event) {
    this.setState({ expected_payment: event.target.value });
  }

  onCapacityChange(event) {
    this.setState({ capacity: event.target.value });
  }

  onOriginAddressChange(event) {
    this.setState({ origin_address: event.target.value });
  }

  onDestinationAddressChange(event) {
    this.setState({ destination_address: event.target.value });
  }

  onConfirmedAtChange(event) {
    this.setState({ confirmed_at: event.target.value });
  }

  onDepartAtChange(event) {
    this.setState({ depart_at: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.onCreateRideFormSubmit(
      this.state.expected_payment,
      this.state.capacity,
      this.state.origin_address,
      this.state.destination_address,
      this.state.confirmed_at,
      this.state.depart_at,
    );
  }

  render() {
    return (
      <div
        className='grid place-items-center mt-10'
        onSubmit={this.handleSubmit.bind(this)}>
        <form className='border w-[600px] px-6 py-8 flex flex-col gap-6 rounded-lg shadow-md'>
          <h2 className='text-center text-3xl font-semibold'>Create a ride</h2>
          <div>
            <p className='font-medium mb-1'>Expected Payment</p>
            <input
              type='text'
              id='expected_payment'
              placeholder='Expected Payment'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              value={this.state.expected_payment}
              onChange={this.onExpectedPaymentChange.bind(this)}
            />
          </div>
          <div>
            <p className='font-medium mb-1'>Passenger Capacity</p>
            <input
              type='text'
              placeholder='Passenger Capacity'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              id='capacity'
              value={this.state.capacity}
              onChange={this.onCapacityChange.bind(this)}
            />
          </div>
          <div>
            <p className='font-medium mb-1'>Start Address</p>
            <input
              type='text'
              placeholder='Start Address'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              id='origin_address'
              value={this.state.origin_address}
              onChange={this.onOriginAddressChange.bind(this)}
            />
          </div>
          <div>
            <p className='font-medium mb-1'>Destination Address</p>
            <input
              type='text'
              placeholder='Destination Address'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              id='destination_address'
              value={this.state.destination_address}
              onChange={this.onDestinationAddressChange.bind(this)}
            />
          </div>
          <div>
            <p className='font-medium mb-1'>Start Time</p>
            <input
              type='text'
              placeholder='Start Time'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              id='confirmed_at'
              value={this.state.confirmed_at}
              onChange={this.onConfirmedAtChange.bind(this)}
            />
          </div>
          <div>
            <p className='font-medium mb-1'>Departure Time</p>
            <input
              type='text'
              placeholder='Departure Time'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              id='depart_at'
              value={this.state.depart_at}
              onChange={this.onDepartAtChange.bind(this)}
            />
          </div>
          <button type='submit' className='bg-green-500 py-2 rounded-md'>
            Create
          </button>
        </form>
      </div>
    );
  }
}

export default CreateRide;
