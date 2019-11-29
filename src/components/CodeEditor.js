import PropTypes from 'prop-types';
import React from 'react';

export default class CodeEditor extends React.Component {
    constructor() {
        super();

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const cm = CodeMirror.fromTextArea(this.refs.textarea, {
            mode:  "javascript",
            lineNumbers: true,
            indentUnit: 4
        });
        cm.setSize('100%', '600px');
        cm.on('focus', this.handleFocus);
        cm.on('blur', this.handleBlur);
        cm.on('change', this.handleChange);
    }

    handleFocus(cm) {
        if (cm.getValue() == this.props.defaultValue) {
            cm.setValue('');
        }
    }

    handleBlur(cm) {
        if (cm.getValue() === '') {
            cm.setValue(this.props.defaultValue);
        }
    }

    handleChange(cm, change) {
        if (this.props.onChange && change.origin != 'setValue') {
            this.props.onChange(cm.getValue());
        }
    }

    render() {
        return (
            <textarea className="editor" defaultValue={this.props.defaultValue} ref="textarea"></textarea>
        );
    }
}

CodeEditor.propTypes = {
    defaultValue: PropTypes.string,
    onChange: PropTypes.func.isRequired
}
