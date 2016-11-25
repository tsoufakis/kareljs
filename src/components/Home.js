import React from 'react'

import AnimatedBoard from './AnimatedBoard'
import { CONFIG, CODE_STR } from '../logo-animation'


export default class Home extends React.Component {
    constructor() {
        super()
        this.handleAnimationComplete = this.handleAnimationComplete.bind(this)
    }

    handleAnimationComplete(_, error) {
        console.log('done', error)
    }

    render() {
        return (
            <div>
                <div className="exampleHolder">
                    <div className="exBoard">
                        <AnimatedBoard
                            config={CONFIG}
                            code={CODE_STR}
                            onComplete={this.handleAnimationComplete}
                            width="600"
                            msPerFrame={50}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
