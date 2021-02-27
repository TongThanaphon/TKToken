import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import './App.css'

import Main from './sections/Main'

import { Navbar } from './components'

import DaiToken from '../abis/DaiToken.json'
import TkToken from '../abis/TkToken.json'
import TokenFarm from '../abis/TokenFarm.json'

const App = () => {
  const [account, setAccount] = useState('')
  const [daiToken, setDaiToken] = useState({})
  const [tkToken, setTkToken] = useState({})
  const [tokenFarm, setTokenFarm] = useState({})
  const [daiTokenBalance, setDaiTokenBalance] = useState('0')
  const [tkTokenBalance, setTkTokenBalance] = useState('0')
  const [stakingBalance, setStakingBalance] = useState('0')
  const [loading, setLoading] = useState(true)

  const loadBlockchainData = async () => {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    const _account = accounts[0]
    setAccount(_account)

    const networkId = await web3.eth.net.getId()

    // Load Dai Token
    const daiTokenData = DaiToken.networks[networkId]
    if (daiTokenData) {
      const _daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      setDaiToken(_daiToken)
      
      let _daiTokenBalance = await _daiToken.methods.balanceOf(_account).call()
      setDaiTokenBalance(_daiTokenBalance.toString())
    } else {
      window.alert('Dai Token contract not deployed to detected network.')
    }


    // Load TK Token
    const tkTokenData = TkToken.networks[networkId]
    if (tkTokenData) {
      const _tkToken = new web3.eth.Contract(TkToken.abi, tkTokenData.address)
      setTkToken(_tkToken)

      let _tkTokenBalance = await _tkToken.methods.balanceOf(_account).call()
      setTkTokenBalance(_tkTokenBalance.toString())
    } else {
      window.alert('TK Token contract not deployed to detected network.')
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      const _tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      setTokenFarm(_tokenFarm)
      let _stakingBalance = await _tokenFarm.methods.stakingBalance(_account).call()
      setStakingBalance(_stakingBalance)
    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    setLoading(false)
  }

  const stakeTokens = (amount) => {
    setLoading(true)
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account }).on('transactionHash', (hash) => {
      tokenFarm.methods.stakeTokens(amount).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false)
      })
    })
  }

  const unstakeTokens = () => {
    setLoading(true)
    tokenFarm.methods.unstakeTokens().send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false)
    })
  }

  let content

  if (loading) {
      content = <p id='loader' className='text-center'>Loading...</p>
  } else {
      content = <Main 
        daiTokenBalance={daiTokenBalance}
        tkTokenBalance={tkTokenBalance}
        stakingBalance={stakingBalance}
        stakeTokens={stakeTokens}
        unstakeTokens={unstakeTokens}
      />
  }

  useEffect(() => {
    const loadData = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }

    loadData()
  }, [])

  return (
        <div>
            <Navbar account={account} />
            <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
                <div className="content mr-auto ml-auto">
                 <a
                    href="https://github.com/TongThanaphon/TKToken"
                    target="_blank"
                    rel="noopener noreferrer"
                 >
                </a>
                    {content}
                </div>
                </main>
            </div>
            </div>
        </div>
  )
}

export default App