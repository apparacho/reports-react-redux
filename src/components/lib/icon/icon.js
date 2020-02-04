import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './icon.less';

class Icon extends Component {

    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string
    }

    static defaultProps = {
        type: '',
        className: '',
    }

    render() {
        const { type, className, children, ...rest } = this.props,
            baseCls = 'comagic-icon',
            iconClassName = `${baseCls}-${type}`;
        return (
            <span {...rest} className={`${baseCls} ${iconClassName} ${className}`}>
            </span>
        );
    }
}

export default Icon;
