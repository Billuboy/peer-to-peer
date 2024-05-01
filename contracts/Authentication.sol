pragma solidity 0.4.24;

import './zeppelin/lifecycle/Killable.sol';

contract Authentication is Killable {
  struct User {
    bytes32 name;
    bytes32 email;
    string mobile;
  }

  mapping (address => User) public users;

  uint private id; // Stores user id temporarily

  modifier onlyExistingUser {
    // Check if user exists or terminate

    require(!(users[msg.sender].name == 0x0));
    _;
  }

  modifier onlyValidName(bytes32 name) {
    // Only valid names allowed

    require(!(name == 0x0));
    _;
  }

  function login() constant
  public
  onlyExistingUser
  returns (address _user, bytes32 _name, bytes32 _email, string _mobile) {
    User user = users[msg.sender];
    return ( 
      msg.sender,
      user.name,
      user.email,
      user.mobile
    );
  }

  function signup(bytes32 name, bytes32 email, string mobile)
  public
  payable
  onlyValidName(name)
  returns (address _user, bytes32 _name, bytes32 _email, string _mobile) {
    // Check if user exists.
    // If yes, return user name.
    // If no, check if name was sent.
    // If yes, create and return user.

    if (users[msg.sender].name == 0x0)
    {
        users[msg.sender].name = name;
        users[msg.sender].email = email;
        users[msg.sender].mobile = mobile;

        return (
          msg.sender,
          users[msg.sender].name,
          users[msg.sender].email,
          users[msg.sender].mobile
        );
    }

    return (
      msg.sender,
      users[msg.sender].name,
      users[msg.sender].email,
      users[msg.sender].mobile
    );
  }

  function update(bytes32 name, bytes32 email, string mobile)
  public
  payable
  onlyValidName(name)
  onlyExistingUser
  returns (address _user, bytes32 _name, bytes32 _email, string _mobile) {
    // Update user name.

    if (users[msg.sender].name != 0x0)
    {
        users[msg.sender].name = name;
        users[msg.sender].email = email;
        users[msg.sender].mobile = mobile;

        return (
          msg.sender,
          users[msg.sender].name,
          users[msg.sender].email,
          users[msg.sender].mobile
        );
    }
  }
}
