const { assert } = require('chai')

const TkToken = artifacts.require('TkToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, tkToken, tokenFarm

    before(async () => {
        daiToken = await DaiToken.new()
        tkToken = await TkToken.new()
        tokenFarm = await TokenFarm.new(tkToken.address, daiToken.address)

        await tkToken.transfer(tokenFarm.address, tokens('1000000'))

        await daiToken.transfer(investor, tokens('100'), { from: owner })
    })

    describe('Mock DAI deployment', async () => {
        it ('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Tk Token deployment', async () => {
        it ('has a name', async () => {
            const name = await tkToken.name()
            assert.equal(name, 'TK Token')
        })
    })

    describe('Token Farm deployment', async () => {
        it ('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'TK Token Farm')
        })

        it ('contract has tokens', async () => {
            let balance = await tkToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming tokens', async () => {
        it ('rewards investors for staking mDai tokens', async () => {
            let result

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

            // Stake Mock DAI Tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            await tokenFarm.stakeTokens(tokens('100'), { from: investor })

            // Check staking result
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balnace correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            // Issue Tokens
            await tokenFarm.issueTokens({ from: owner })
            
            // Check balaces after issuance
            result = await tkToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor TK Token wallet balance correct after issuance')

            // Ensure that only owner can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected

            // Unstake tokens
            await tokenFarm.unstakeTokens({ from: investor })

            // Chech result after unstaking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
        })
    })
})