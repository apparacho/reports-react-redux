import React, { Component } from 'react';
import { connect } from 'react-redux'
import BaseReport from '../../components/lib/table/BaseReport';
import FilterPanel from './FilterPanel';

import {
    getNextReportParams, onFiltersFormSubmit, checkReportParams, onTableParamsChange,

    filterParamsSelector, tableParamsSelector, reportParamsSelector, listDataSelector, loadingSelector


} from '../../ducks/callsNew1';

class CallsNew1List extends Component {

    render() {
        const { filterParams, reportParams, items, checkReportParams, onTableParamsChange, onFiltersFormSubmit } = this.props,
            paramsFromUrl = getNextReportParams().filterParams,
            { app_id, search } = { ...filterParams, ...paramsFromUrl },
            filterPanelParams = {
                app_id,
                search,

                onSubmit: (values) => onFiltersFormSubmit(values)
            };

        const tableProps = {
            columns,
            FilterPanel: <FilterPanel {...filterPanelParams} />,
            rowKey: (r) => r.app_id + ' ' + r.customer_id,

            showColumnSettingsButton: true,

            store: {
                checkReportParams: () => checkReportParams(),
                tablePagination: {},
                reportParams,
                items,
                loading: false,
                isLoaded: true,
                onTableParamsChange: () => onTableParamsChange(),
                exportCsv: () => console.log('store.exportCsv')
            }
        };

        return (
            <>
                <div className="clients-list" >
                    <BaseReport {...tableProps} />
                </div>
            </>
        );
    }
}

export default connect(
    (state) => ({
        filterParams: filterParamsSelector(state),
        tableParams: tableParamsSelector(state),
        reportParams: reportParamsSelector(state),
        items: listDataSelector(state),
        loading: loadingSelector(state),

    }),
    { onFiltersFormSubmit, getNextReportParams, checkReportParams, onTableParamsChange}
)(CallsNew1List);


const columns = [

    {
        dataIndex: 'app_name',
        sorter: true,
        width: 150
    },
    {
        dataIndex: 'id',
        sorter: true,

        width: 150
    },
    {
        dataIndex: 'start_time',
        sorter: true,
        dataType: 'datetime',
        width: 150
    },
    {
        dataIndex: 'connect_time',
        dataType: 'datetime',
        sorter: true,
        width: 150,
    },
    {
        dataIndex: 'numc',
        sorter: true,
        width: 120,
    },
    {
        dataIndex: 'numa',
        sorter: true,
        width: 120,
    },
    {
        dataIndex: 'total_duration',
        sorter: true,
        width: 110,
    },
    {
        dataIndex: 'release_desc_name',
        sorter: true,
        type: 'text',
        width: 110,
    },
    {
        dataIndex: 'platform_name',
        sorter: true,
        width: 110,
    }
];
