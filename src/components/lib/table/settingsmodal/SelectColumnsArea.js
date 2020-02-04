import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';

const { TreeNode } = Tree;

const getContentWithHighlight = (content, targetText) => {
    const targetStartIndex = content.toLowerCase().indexOf(targetText.toLowerCase());
    if (targetText && targetStartIndex !== -1) {
        const res = content.split('');
        return (
            <span>
                {res.slice(0, targetStartIndex).join('')}
                <span className="settings-modal-found-text">{res.slice(targetStartIndex, targetStartIndex + targetText.length)}</span>
                {res.slice(targetStartIndex + targetText.length).join('')}
            </span>
        );
    }
    return content;
};

class SelectColumnsArea extends Component {
    static propTypes = {
        checkedKeys: PropTypes.array,
        searchFieldValue: PropTypes.string
    };

    static defaultProps = {
        checkedKeys: [],
        searchFieldValue: ''
    };

    state = {
        expandedKeys: [],
        autoExpandParent: true
    };

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = (checkedKeys) => {
        this.props.onCheck && this.props.onCheck(checkedKeys);
    };

    renderTreeNodes = data => data.map((item) => {
        const nodeStyle = { display: item.title.toLowerCase().indexOf(this.props.searchFieldValue.toLowerCase()) !== -1 ? 'block' : 'none' };
        if (item.children) {
            return (
                <TreeNode title={getContentWithHighlight(item.title, this.props.searchFieldValue)} key={item.key} dataRef={item} style={nodeStyle}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={getContentWithHighlight(item.title, this.props.searchFieldValue)} key={item.key} selectable={false} style={nodeStyle}/>;
    });

    render() {
        return (
            <div className="select-columns-area">
                <Tree
                    checkable
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.props.checkedKeys}
                >
                    {this.renderTreeNodes(this.props.items)}
                </Tree>
            </div>
        );
    }
}

export default SelectColumnsArea;
