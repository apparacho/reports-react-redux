import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import ExclamationHelper from '../../datadisplay/exclamationhelper/ExclamationHelper';
import { Field, getIn } from 'formik';

import './select.less';

const Option = Select.Option;

class FormikAntdSelect extends Component {

    static propTypes = {
        selectionData: PropTypes.array,
        nameField: PropTypes.string,
        valueField: PropTypes.string
    };

    render() {
        const {
            selectionData,
            nameField,
            valueField,
            name,
            style,
            inputStyle,
            onChange,
            onBlur,
            ...antdComponentProps
        } = this.props;

        return (
            <Field name={name}>
                {({ field, form }) => {
                    const error = getIn(form.errors, name);
                        // touch = getIn(form.touched, name);
                    return (
                        <div style={{ display: 'inline-block', ...style }}>
                            <div style={{ display: 'inline-block' }}>
                                <Select
                                    {...antdComponentProps}
                                    name={name}
                                    value={field.value}
                                    optionFilterProp={'children'}
                                    onChange={(val) => {
                                        form.setFieldValue(name, val);
                                        onChange && onChange(val);
                                    }}
                                    onBlur={(e) => {
                                        form.setFieldTouched(name, true);
                                        onBlur && onBlur(e);
                                    }}
                                    style={{width: style.width - (error ? 20 : 0), ...inputStyle}}
                                    className={'comagic-select' + (error ? ' error' : '')}
                                >
                                    {selectionData.map((item, i) =>
                                        <Option key={i} value={item[valueField]}>{item[nameField]}</Option>
                                    )}
                                </Select>
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

export default FormikAntdSelect
