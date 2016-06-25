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
            </div>
        )
    }
}
