import React from 'react'

import { Table, Card } from '../components'

const MainSection = (props) => {
    const { 
        stakingBalance, 
        tkTokenBalance, 
        daiTokenBalance, 
        stakeTokens, 
        unstakeTokens
    } = props

    return (
        <div id='content' className='mt-3'>
            <Table stakingBalance={stakingBalance} tkTokenBalance={tkTokenBalance} />
            <Card daiTokenBalance={daiTokenBalance} stakeTokens={stakeTokens} unstakeTokens={unstakeTokens} />
        </div>
    )
}

export default MainSection