import React from 'react'

export const Table = (props) => {
    const { stakingBalance, tkTokenBalance } = props

    return (
        <table className='table table-borderless text-muted text-center'>
            <thead>
                <tr>
                    <th scope='col'>Staking Balance</th>
                    <th scope='col'>Reward Blance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{window.web3.utils.fromWei(stakingBalance.toString(), 'Ether')} mDAI</td>
                    <td>{window.web3.utils.fromWei(tkTokenBalance.toString(), 'Ether')} TK</td>
                </tr>
            </tbody>
      </table>
    )
}