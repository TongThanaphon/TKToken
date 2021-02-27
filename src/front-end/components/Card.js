import React, { useState } from 'react'

import { Form } from '.'

export const Card = (props) => {
    const { stakeTokens, daiTokenBalance, unstakeTokens } = props

    const [amount, setAmount] = useState('')

    const onSubmit = (event) => {
        event.preventDefault()
     
        const toWei = window.web3.utils.toWei(amount, 'Ether')
        stakeTokens(toWei)
    }

    const onUnStake = (event) => {
        event.preventDefault()

        unstakeTokens()
    }

    return (
        <div className='card mb-4'>
            <div className='card-body'>
                <Form 
                    daiTokenBalance={daiTokenBalance} 
                    onSubmit={onSubmit} 
                    setAmount={setAmount}
                    onUnStake={onUnStake}
                />
            </div>
        </div>
    )
}