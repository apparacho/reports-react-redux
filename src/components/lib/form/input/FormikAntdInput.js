import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import ExclamationHelper from '../../datadisplay/exclamationhelper/ExclamationHelper';
import { Field, getIn } from 'formik';

import './input.less'

const { Search } = Input;

class FormikAntdInput extends Component {

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        const {
            name,
            style,
            inputStyle,
            onChange,
            onBlur,
            isSearchField,
            ...antdComponentProps
        } = this.props,
            FormInput = isSearchField ? Search : Input;

        return (
            <Field name={name}>
                {({ field, form }) => {
                    const error = getIn(form.errors, name);
                    return (
                        <div style={{ display: 'inline-block', ...style }}>
                            <div style={{ display: 'inline-block' }}>
                                <FormInput
                                    name={name}
                                    {...antdComponentProps}
                                    onChange={(e) => {
                                        form.handleChange(e);
                                        onChange && onChange(e);
                                    }}
                                    onBlur={(e) => {
                                        form.handleBlur(e);
                                        onBlur && onBlur(e);
                                    }}
                                    style={{width: style.width - (error ? 20 : 0), ...inputStyle}}
                                    value={field.value}
                                    className={'comagic-input' + (error ? ' error' : '')}
                                />
                            </div>
                            {error && (
                                <div style={{ display: 'inline-block', width: 20 }} >
                                    <ExclamationHelper type='error' title={error} style={{ marginLeft: '5px' }} />
                                </div>
                            )}
                        </div>
                    )
                }}
            </Field>
        )
    }
}

export default FormikAntdInput
