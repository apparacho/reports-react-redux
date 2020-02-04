import React, { Component } from 'react';
import { Table, Select } from 'antd';

import './ReportTable.less';

const { Option } = Select;

class ReportTable extends Component {

    onTableParamsChange = (tablePagination, filter, sort, ...res) => {
        const { pagination, onChange } = this.props;
        onChange && onChange(pagination, filter, sort, ...res);
    };

    onPaginationChange = (pagination) => {
        const { columns, onChange } = this.props;
        let sort = {};
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sortOrder) {
                sort = {
                    column: {...columns[i]},
                    columnKey: columns[i].dataIndex,
                    field: columns[i].dataIndex,
                    order: columns[i].sortOrder
                }
            }
        }
        onChange && onChange(pagination, null, sort);
    };

    render() {
        const { pagination, className = '', ...rest } = this.props,
            tableClassName = `comagic-report-table ${className}`;
        return (
            <div>
                <Table className={tableClassName} {...rest} pagination={false} onChange={this.onTableParamsChange} />
                <TablePagination
                    paginationConfig={{...pagination, currentCount: rest.dataSource.length}}
                    onChange={this.onPaginationChange}
                />
            </div>
        );
    }
}

export default ReportTable;


class TablePagination extends Component {

    onPageSizeChange = (nextPageSize) => {
        const { paginationConfig, onChange } = this.props,
            {total, current, pageSize} = paginationConfig;

        pageSize !== nextPageSize && onChange && onChange({ ...paginationConfig, pageSize: +nextPageSize, current: nextPageSize*current > total ? 1 : current });
    };

    onPageChange = (pageNumb) => () => {
        const { paginationConfig, onChange } = this.props;
        onChange && onChange({ ...paginationConfig, current: pageNumb })
    };

    render() {
        const { current, pageSize, pageSizeOptions, showSizeChanger, total, withoutTotal, currentCount } = this.props.paginationConfig,
            pageCount = withoutTotal ? current : Math.ceil(total/pageSize),
            iLimit = (current <= 3 && pageCount >= 5) ? (5 - current) : 2,
            prevBtnVisible = current > 3,
            nextBtnVisible = withoutTotal ? (currentCount >= pageSize) : (current + 2 < pageCount);

        let visiblePages = [current];

        for (let i = 1; i <= iLimit; i++) {
            current + i <= pageCount && visiblePages.push(current + i);
            current - i > 0 && visiblePages.unshift(current - i);
        }

        return (
            <div className="comagic-report-pagination-panel">
                <ul className="comagic-report-pagination" unselectable="unselectable">
                    {
                        prevBtnVisible && (
                            <li title="В начало" tabIndex="0" className="pagination-prev" aria-disabled="false">
                                <a className="pagination-item-link" onClick={this.onPageChange(1)}>
                                    В начало
                                </a>
                            </li>
                        )
                    }
                    {
                        visiblePages.map(page => (
                            <li key={page} title={''+page} className={`pagination-item ${page === current && 'pagination-item-active'} `} tabIndex="0">
                                { page !== current ? <a onClick={this.onPageChange(page)}>{page}</a> : <a>{page}</a> }
                            </li>
                        ))
                    }
                    {
                        nextBtnVisible && (
                            <li title="дальше" tabIndex="0" className="pagination-next" aria-disabled="false">
                                <a className="pagination-item-link" onClick={this.onPageChange(current + 1)}>
                                    дальше
                                </a>
                            </li>
                        )
                    }
                </ul>

                {
                    showSizeChanger && <div className="page-size-changer">
                        <span> Строк на странице </span>
                        <Select
                            className="page-size-changer-select"
                            onChange={this.onPageSizeChange}
                            defaultValue={pageSize}
                        >
                            {pageSizeOptions.map(s => <Option key={s} value={s}>{s}</Option>)}
                        </Select>
                    </div>
                }

                { !withoutTotal && <span className="pagination-total"> Всего записей {total} </span> }

            </div>
        )
    }
}
