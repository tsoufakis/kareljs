import React from 'react';
import Popup from './Popup';
import BoardView from './BoardView';


export default class BoardPanel extends React.Component {
    getDefaultProps() {
        return {
            rows: null,
            finalRows: null,
            objective: 'Select a level from the dropdown.'
        };
    }
    getInitialState() {
        return {showExamplePopup: false};
    }
    openExample() {
        this.setState({showExamplePopup: true});
    }
    closeExample() {
        this.setState({showExamplePopup: false});
    }
    handleTabClick(index) {
        console.log('tab click', index);
    }
    _renderTabBar() {
        const makeLabel = (label, i) => {
            let className = 'tab';

            if (i === this.props.activeTabIndex) {
                className += ' activeTab';
            }

            return (
                <li key={i}>
                    <a href="#" className={className} onClick={this.handleTabClick.bind(this, i)}>
                        {label}
                    </a>
                </li>
            );
        };

        return (
            <ul className="tabBar">
                {this.props.tabLabels.map(makeLabel)}
            </ul>
        );
    }
    render() {
        let popup;
        let exampleLink;
        let board;

        if (this.state.showExamplePopup) {
            popup = (
                <Popup onClose={this.closeExample}>
                    <p className="examplePopupText">This is what the board should look like after running your program</p>
                    <BoardView rows={this.props.finalRows}/>
                </Popup>
            );
        }

        if (this.props.rows) {
            board = <BoardView rows={this.props.rows}/>;
            exampleLink = <a href="#" onClick={this.openExample}>Show example.</a>;
        }

        return (
            <section>
                <p><strong>Objective:</strong> {this.props.objective} {exampleLink}</p>
                {board}
                {popup}
            </section>
        );
    }
}
