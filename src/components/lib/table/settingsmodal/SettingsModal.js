import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import SelectColumnsArea from './SelectColumnsArea';
import ChangeColumnsPriorityArea from './ChangeColumnsPriorityArea';

import './SettingsModal.less';


const getColumnsConfig = () => JSON.parse(localStorage.getItem('columnsConfig')) || {};
const setColumnsConfig = (config) => localStorage.setItem('columnsConfig', JSON.stringify(config));

export const getReportColumns = (reportName) => getColumnsConfig()[reportName];
const setReportColumns = (reportName, selectedColumns) => {
    setColumnsConfig({ ...getColumnsConfig(), [reportName]: selectedColumns });
};


class SettingsModal extends Component {
    static propTypes = {};

    state = {
        searchFieldValue: '',
        selectedColumns: getReportColumns(this.props.reportName) || this.props.columns.map((col) => col.dataIndex)
    };

    onChangeColumnsPriority = (columns) => {
        this.setState({selectedColumns: columns.map(col => col.dataIndex)});
    };

    onChangeColumnsSelection = (selectedColumns) => {
        this.setState({selectedColumns});
    };

    saveColumnsSelection = () => {
        setReportColumns(this.props.reportName, this.state.selectedColumns);
        this.props.onCancel && this.props.onCancel();
    };

    render() {
        const columnsTreeStructure = this.props.columns.map(col => ({ key: col.dataIndex, title: col.titleText})),
            priorityAreaItems = this.state.selectedColumns.map(sCol => this.props.columns.filter(col => col.dataIndex === sCol)[0]);
        return (
            <Modal
                {...this.props}
                title="Столбцы для отображения в отчете"
                className="settings-modal"
                width={800}
                bodyStyle={{height: '500px'}}
                onOk={this.saveColumnsSelection}
            >
                <div style={{ margin: '5px' }}>
                    <Input.Search
                        placeholder="Введите название колонки"
                        onChange={e => this.setState({ searchFieldValue: e.target.value})}
                    />
                </div>
                <div>
                    <div style={{ width: '50%', height: '455px', float: 'left', borderRight: '1px solid #dcdcdc' }}>
                        <div className="settings-modal-action-area-header">
                            <span className="settings-modal-action-area-header-number">1</span> - Выберите показатель для отображения в отчете
                        </div>
                        <div className="settings-modal-action-area-content">
                            <SelectColumnsArea
                                searchFieldValue={this.state.searchFieldValue}
                                items={columnsTreeStructure}
                                checkedKeys={this.state.selectedColumns}
                                onCheck={this.onChangeColumnsSelection}
                            />
                        </div>
                    </div>
                    <div style={{ width: '50%', marginLeft: '50%' }}>
                        <div className="settings-modal-action-area-header">
                            <span className="settings-modal-action-area-header-number">2</span> - Переместите столбцы, чтобы изменить их порядок в отчете
                        </div>
                        <div className="settings-modal-action-area-content">
                            <ChangeColumnsPriorityArea
                                items={priorityAreaItems}
                                onChange={this.onChangeColumnsPriority}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default SettingsModal;
