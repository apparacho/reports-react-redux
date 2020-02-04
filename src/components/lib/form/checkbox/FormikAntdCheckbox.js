import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { Field } from 'formik';

import './checkbox.less';

class FormikAntdCheckbox extends Component {

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        const {
            style,
            ...antdComponentProps
        } = this.props;

        return (
            <Field name={this.props.name}>
                {({ field, form }) => (
                    <div style={{ display: 'inline-block' }}>
                        <Checkbox
                            {...antdComponentProps}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            style={style}
                            value={form.values[field.name]}
                            checked={field.value}
                            className="comagic-checkbox"
                        >{this.props.label}</Checkbox>
                    </div>
                )}
            </Field>
        )
    }
}

export default FormikAntdCheckbox
