import React, { Component } from 'react';

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      mobile: '',
    };
  }

  onNameChange(event) {
    this.setState({ name: event.target.value });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onMobileChange(event) {
    this.setState({ mobile: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.name.length < 2) {
      return alert('Please fill in your name.');
    }

    this.props.onSignUpFormSubmit(
      this.state.name,
      this.state.email,
      this.state.mobile,
    );
  }

  render() {
    return (
      <div
        className='grid place-items-center mt-10 h-full'
        onSubmit={this.handleSubmit.bind(this)}>
        <form className='border w-[600px] px-6 py-8 flex flex-col gap-6 rounded-lg shadow-md'>
          <h2 className='text-center text-3xl font-semibold'>
            Create an account
          </h2>
          <p className='text-center'>
            We've got your wallet information, simply input your name and your
            account is made!
          </p>
          <div>
            <p className='font-medium mb-1'>Username</p>
            <input
              type='text'
              placeholder='Username'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              value={this.state.name}
              onChange={this.onNameChange.bind(this)}
            />
          </div>
          <div>
            <p className='font-medium mb-1'>Email</p>
            <input
              type='text'
              placeholder='Email'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              value={this.state.email}
              onChange={this.onEmailChange.bind(this)}
            />
          </div>
          <div>
            <p className='font-medium mb-1'>Mobile Number</p>
            <input
              type='text'
              placeholder='Mobile Number'
              className='border w-full rounded-md py-2 px-2 focus:outline-none'
              value={this.state.mobile}
              onChange={this.onMobileChange.bind(this)}
            />
          </div>
          <button type='submit' className='bg-green-500 py-2 rounded-md'>
            Create account
          </button>
        </form>
      </div>
    );
  }
}

export default SignUpForm;
