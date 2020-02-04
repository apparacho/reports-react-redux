import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import ExclamationHelper from '../../datadisplay/exclamationhelper/ExclamationHelper';
import { Field, getIn } from 'formik';

import './rangepicker.less';

class FormikAntdRangePicker extends Component {

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        const {
            name,
            style,
            onChange,
            onBlur,
            ...antdComponentProps
        } = this.props;

        return (
            <Field name={name}>
                {({ field, form }) => {
                    const error = getIn(form.errors, name),
                        touch = getIn(form.touched, name);
                    return (
                        <div style={{ display: 'inline-block' }}>
                            <div style={{ display: 'inline-block' }}>
                                <DatePicker.RangePicker
                                    allowClear={false}
                                    name={name}
                                    {...antdComponentProps}
                                    onChange={(dateVal, dateString) => {
                                        form.setFieldValue(name, dateVal);
                                        onChange && onChange(dateVal);
                                    }}
                                    onBlur={(e) => {
                                        form.setFieldTouched(name, true);
                                        onBlur && onBlur(e);
                                    }}
                                    style={style}
                                    value={field.value}
                                    className={'comagic-range-picker' + (error && touch ? ' error' : '')}
                                />
                            </div>
                            {error && touch && (
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

export default FormikAntdRangePicker
