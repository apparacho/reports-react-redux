import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button as AntdButton } from 'antd';

import './button.less';

export const ButtonText = ({children}) => <span style={{ verticalAlign: 'middle' }}> {children} </span>;

class Button extends Component {

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
            baseCls = 'comagic-btn';
        let btnType = type;
        switch (type) {
            case 'main':
                btnType = 'primary';
                break;
            case 'usual':
                btnType = 'default';
                break;
            default:
              btnType = 'default';
        }
        return (
            <AntdButton className={`${baseCls} ${className}`} type={btnType} {...rest} >
                {children}
            </AntdButton>
        );
    }
}

export default Button;
