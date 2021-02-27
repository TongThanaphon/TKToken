const TokenFarm = artifacts.require('TokenFarm')
const TkToken = artifacts.require('TkToken')
const DaiToken = artifacts.require('DaiToken')

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // Deploy Tk Token
  await deployer.deploy(TkToken)
  const tkToken = await TkToken.deployed()

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, tkToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  await tkToken.transfer(tokenFarm.address, '1000000000000000000000000')

  await daiToken.transfer(accounts[1], '100000000000000000000')
}
