import React from 'react'

import dai from '../../dai.png'

export const Form = (props) => {
    const { daiTokenBalance, onSubmit, setAmount, onUnStake } = props

    return (
        <form className='mb-3' onSubmit={onSubmit}>
            <div>
                <label className='float-left'><b>Stake Tokens</b></label>
                <span className='float-right text-muted'>
                    Balance: {window.web3.utils.fromWei(daiTokenBalance.toString(), 'Ether')}
                </span>

                <div className='input-group mb-4'>
                    <input 
                        type='text'
                        className='form-control form-control-lg'
                        placeholder='0'
                        onChange={(event) => setAmount(event.target.value)}
                        required
                    />
                    
                    <div className='input-group-append'>
                        <div className='input-group-text'>
                            <img src={dai} height='32' alt='' />
                            &nbsp;&nbsp;&nbsp; mDAI
                        </div>
                    </div>
                </div>

                <button 
                    type='submit' 
                    className='btn btn-primary btn-block btn-lg'
                >
                        STAKE!
                </button>
                <button 
                    type='submit'
                    className='btn btn-link btn-block btn-sm'
                    onClick={onUnStake}
                >
                        UN-STAKE...
                </button>
            </div>
        </form>
    )
}