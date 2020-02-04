import React, { Component } from 'react';
import { Form, } from 'antd';
const FormItem = Form.Item;

const defaults = {
    fieldName: 'basefieldname'
};

export const createFormItem = (C, params = defaults) => {
    return class extends Component {

        render() {
            const { form, options, fieldName, formItemProps, ...rest } = this.props;
            const { getFieldDecorator } = form;
            const props = {
                form,
                ...rest
            };
            const name = fieldName || params.fieldName;
            return <FormItem {...formItemProps}>
                {getFieldDecorator(name, options)(
                    <C {...props} />
                )}
            </FormItem>;
        }
    };
};

export default createFormItem;
