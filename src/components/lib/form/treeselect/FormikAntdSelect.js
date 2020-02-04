import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TreeSelect} from 'antd';
import ExclamationHelper from '../../datadisplay/exclamationhelper/ExclamationHelper';
import {Field, getIn} from 'formik';
import './treeselect.less';

const {TreeNode} = TreeSelect;

const Option = TreeSelect.Option;

class FormikAntdTreeSelect extends Component {

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
            onChange,
            onBlur,
            ...antdComponentProps
        } = this.props;

        return (
            <Field name={name}>
                {({field, form}) => {
                    const error = getIn(form.errors, name),
                        touch = getIn(form.touched, name);
                    return (
                        <div style={{display: 'inline-block'}}>
                            <div style={{display: 'inline-block'}}>
                                <TreeSelect
                                    {...antdComponentProps}
                                    name={name}
                                    value={field.value}
                                    onChange={(val) => {
                                        form.setFieldValue(name, val);
                                        onChange && onChange(val);
                                    }}
                                    onBlur={(e) => {
                                        form.setFieldTouched(name, true);
                                        onBlur && onBlur(e);
                                    }}
                                    style={style}
                                    className={'comagic-treeselect' + (error && touch ? ' error' : '')}
                                >
                                    {selectionData.map((item, i) =>
                                        <TreeNode
                                            isLeaf={false}
                                            disableCheckbox={true}
                                            selectable={false}
                                            title={item[nameField]}
                                            key={item[valueField]}
                                            value={'_' + item[valueField]}
                                        >
                                            {(item['data'] || []).map((item2, i) =>
                                                <TreeNode
                                                    isLeaf={true}
                                                    key={item[valueField] + '_' + item2[valueField]}
                                                    value={item2[valueField]}
                                                    title={item[nameField] + ' ' + item2[nameField]}
                                                >
                                                </TreeNode>
                                            )}
                                        </TreeNode>
                                    )}
                                </TreeSelect>
                            </div>
                            {error && touch && (
                                <div style={{display: 'inline-block', width: 20}}>
                                    <ExclamationHelper type='error' title={error} style={{marginLeft: '5px'}}/>
                                </div>
                            )}
                        </div>
                    )
                }}
            </Field>
        )
    }
}

export default FormikAntdTreeSelect
