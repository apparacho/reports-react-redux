import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Icon from '../../icon/icon';

import './ExclamationHelper.less'

const helperTypes = ['error', 'info', 'warning', 'success'];

class ExclamationHelper extends Component {

    static propTypes = {
        className: PropTypes.string,
        type: PropTypes.string,
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Component)
          ])
    };

    static defaultProps = {
        className: '',
        type: ''
    };

    render() {
        const { className, title, type, ...rest } = this.props,
            tooltipClass = helperTypes.indexOf(type) !== -1 ? type : '';

        return (
            <Tooltip placement="right" title={title} overlayClassName={`comagic-exclamation-helper-tooltip ${tooltipClass} ${className}`}>
                <Icon type="exclamation" className={`${tooltipClass} ${className}`} {...rest} />
            </Tooltip>
        )
    }
}

export default ExclamationHelper
