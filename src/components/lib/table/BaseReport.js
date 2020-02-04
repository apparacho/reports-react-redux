import React, { Component } from 'react';
import ReportTable from './ReportTable';
import './BaseReport.less';
import Button, { ButtonText } from '../button/button';
import Icon from '../icon/icon';
import SettingsModal from './settingsmodal/SettingsModal';
import { getReportColumns } from './settingsmodal/SettingsModal';
import columnRenders from './ColumnRenders';
import { isEqual } from 'lodash';

import sortAscImg from '../icon/table-column-sort-asc.png'
import sortDescImg from '../icon/table-column-sort-desc.png'

const isStaticColumn = col => col.type === 'extra' || col.type === 'static';

class BaseReportTable extends Component {

    static defaultProps = {
        onClickRow: () => { },
        onDoubleClick: () => { },
    };

    state = {
        visibleColumnSettingsModal: false
    };

    openColumnSettingsModal = () => this.setState({ visibleColumnSettingsModal: true });

    closeColumnSettingsModal = () => this.setState({ visibleColumnSettingsModal: false });

    componentDidMount() {
        this.setState({ gridHeight: this.el.clientHeight });
    }

    componentDidUpdate() {
        console.log('BaseReport -- componentDidUpdate');
        this.props.store.checkReportParams();
    }

    onRow = (record, rowIndex) => {
        const { onClickRow, onDoubleClick } = this.props;
        return {
            onClick: () => onClickRow(record),
            onDoubleClick: () => onDoubleClick(record)
        };
    };

    setColumnTitles(column) {
        const titleText = column.title || ((column.type === 'extra') ? '' : column.dataIndex);
        return {
            ...column,
            titleText,
            title: <div className="table-header-column-content">
                {titleText}
                {column.sortOrder && <div className="table-header-column-sort">
                    {(column.sortOrder === 'ascend' ? <img src={sortAscImg}/> : <img src={sortDescImg}/>)}
                </div>}
            </div>
        };
    }

    applyColumnSort(column) {
        const { store: { reportParams } } = this.props,
            sortValue = reportParams && reportParams.tableParams.sort && reportParams.tableParams.sort[0];
        if (!sortValue) {
            column.sortOrder = false;
        } else {
            let sortOrder;
            if (sortValue.field === column.dataIndex) {
                sortOrder = sortValue.order === 'asc' ? 'ascend' : 'descend';
            }
            column.sortOrder = sortOrder;
        }
        return column;
    }

    applyColumnRender(column) {
        return {...column, render: column.render || columnRenders[column.dataType] || columnRenders.base};
    }

    applyColumnClass(column) {
        return {
            ...column,
            onHeaderCell: (col) => {
                let cls = ['comagic-table-header-column'].concat(
                    'comagic-table-header-column-' + (column.dataType || 'text'),
                    column.headerCellClass ? column.headerCellClass.split(' ') : [],
                    column.onHeaderCell ? column.onHeaderCell(column).className.split(' ') : [],
                );
                return {
                    className: cls.join(' ')
                };
            },
            onCell: (col) => {
                let cls = ['comagic-table-cell-column'].concat(
                    column.cellClass ? column.cellClass.split(' ') : [],
                    column.onCell ? column.onCell(column).className.split(' ') : [],
                );
                return {
                    className: cls.join(' ')
                };
            }
        };
    }

    applyColumnConfig(columns) {
        return columns.map(c => (this.applyColumnRender(this.setColumnTitles(this.applyColumnSort(this.applyColumnClass(c))))));
    }

    render() {
        const { rowKey, FilterPanel, store: { tablePagination, items, loading, isLoaded, onTableParamsChange, exportCsv },
                filterFooter, actionPanelContent, columns: reportColumns, reportName, showColumnSettingsButton, showExportBtn } = this.props,
            columns = this.applyColumnConfig(reportColumns),
            tableProps = {
                className: 'basetable',
                onChange: onTableParamsChange,
                dataSource: items.slice(),
                rowKey, loading,
                pagination: {...tablePagination},
                onRow: this.onRow,
                columns: getReportColumns(reportName) ? columns.filter(col => isStaticColumn(col)).concat(
                    getReportColumns(reportName).map(lsCol => columns.filter(col => col.dataIndex === lsCol)[0])
                ) : columns,
                scroll: { x: true }
            };

        if (this.props.withTotalRow) {
            tableProps.className += ' basetable--with-total-row';
        }

        return (
            <>
                <div>
                    {
                        showExportBtn && <div style={{ textAlign: 'right' }}>
                            <Button
                                type="main"
                                onClick={() => exportCsv()}
                                disabled={!isLoaded}
                            >
                                Экспорт в csv
                            </Button>
                        </div>
                    }
                    <div className="filterpanel">
                        {FilterPanel}
                        {filterFooter}
                    </div>
                    <div className='report-action-panel' style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: '50px' }}>
                        {actionPanelContent}
                    </div>
                    {
                        showColumnSettingsButton && <div className="report-settings-panel">
                            <Button className="btn-with-icon" type="usual" onClick={this.openColumnSettingsModal}>
                                <Icon type="columns" />
                                <ButtonText>Настроить столбцы</ButtonText>
                            </Button>
                        </div>
                    }
                </div>
                <div className="grid-container" ref={el => this.el = el}>
                    <ReportTable {...tableProps} />
                </div>
                <SettingsModal
                    reportName={reportName}
                    columns={columns.filter(col => !isStaticColumn(col))}
                    visible={this.state.visibleColumnSettingsModal}
                    onOk={this.closeColumnSettingsModal}
                    onCancel={this.closeColumnSettingsModal}
                />
            </>
        );
    }
}

export default BaseReportTable;
