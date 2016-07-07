import React from 'react'
import reference from '../../public/reference'

export default class Reference extends React.Component {
    render() {
        function makeItem(data, i) {
            return <li key={i}><code>{data.code}</code> {data.desc}</li>
        }

        const commands = reference.commands.map(makeItem)
        const conditionals = reference.conditionals.map(makeItem)

        return (
            <div>
                <h2>Commands</h2>
                <section>
                    <ul className="referenceList">
                        {commands}
                    </ul>
                </section>
                <h2>Conditionals</h2>
                <section>
                    <ul className="referenceList">
                        {conditionals}
                    </ul>
                </section>
                <h2>Functions</h2>
                <section>
                    <p>Make a function that moves Karel twice</p>
                    <pre><code>{
`function moveTwice() {
    move();
    move();
}`
                    }</code></pre>
                </section>
                <h2>If Statements</h2>
                <section>
                    <p>If Karel's front is clear, move forward, otherwise turn left</p>
                    <pre><code>{
`if (frontIsClear()) {
    move();
} else {
    turnLeft();
}`
                    }</code></pre>
                    <p>Move if both Karel's front and left are clear</p>
                    <pre><code>{
`if (frontIsClear() && leftIsClear()) {
    move();
}`
                    }</code></pre>
                </section>
                <h2>While loops</h2>
                <section>
                    <p>Keep moving forward until Karel encounters a wall</p>
                    <pre><code>{
`while (frontIsClear()) {
    move();
}`
                    }</code></pre>
                </section>
                <h2>For loops</h2>
                <section>
                    <p>Move forward 5 times</p>
                    <pre><code>{
`for (var i = 0; i < 5; i++) {
    move();
}`
                    }</code></pre>
                </section>
            </div>
        )
    }
}
