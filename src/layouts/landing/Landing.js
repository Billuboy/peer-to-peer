import React, { Component } from 'react'

class Landing extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="grid place-items-center h-screen">
        <div >
          <h1 className='text-4xl text-center font-bold'>Welcome to CryptoRyder!</h1>
          <p className='text-2xl text-center font-semibold'>Find out how you can contribute to the decentralized transportation future!</p>
        </div>
      </div>
    )
  }
}

export default Landing
