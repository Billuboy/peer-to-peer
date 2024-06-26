module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: './contracts',
  contracts_build_directory: './build/contracts/',
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    }
  }, 
  compilers:{
    solc:{
      version:'0.4.24'
  }
}
};
