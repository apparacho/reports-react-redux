import React, { Component } from 'react';
import { connect } from 'react-redux'
import BaseReport from '../../components/lib/table/BaseReport';
import queryString from 'query-string';
import { Menu, Dropdown } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { textRenderer } from '../../components/lib/table/ColumnRenders';
import AddAgentModal from './addagent/AddAgentModal';
import FilterPanel from './FilterPanel';

import detailsImg from '../../components/lib/icon/table-details.png';

import {
    defaultFilterParams, defaultTableParams,
    getNextReportParams, onFiltersFormSubmit, checkReportParams, onTableParamsChange,

    filterParamsSelector, tableParamsSelector, reportParamsSelector, clientsListSelector, loadingSelector


} from '../../ducks/clients';

class ClientsList extends Component {

    render() {
        const { user, filterParams, reportParams, items, checkReportParams, onTableParamsChange, onFiltersFormSubmit } = this.props,
            paramsFromUrl = getNextReportParams().filterParams,
            { app_id, search } = { ...filterParams, ...paramsFromUrl },
            filterPanelParams = {
                app_id,
                search,

                onSubmit: (values) => onFiltersFormSubmit(values)
            };

        const tableProps = {
            columns: getColumns(this.props),
            FilterPanel: <FilterPanel {...filterPanelParams} />,
            rowKey: (r) => r.app_id + ' ' + r.customer_id,

            actionPanelContent: ['billing', 'developer', 'helpdesk'].indexOf(user.user_role) !== -1 ? null
                : <AddAgentModal />,
            showColumnSettingsButton: true,

            store: {
                checkReportParams: () => console.log('store.checkReportParams') || checkReportParams(),
                tablePagination: {},
                // reportParams: {
                //     filterParams: {...defaultFilterParams},
                //     tableParams: {...defaultTableParams}
                // },
                reportParams,
                items,
                loading: false,
                isLoaded: true, // если true - значит, загрузили данные хотя бы 1 раз
                onTableParamsChange: () => console.log('store.onTableParamsChange') || onTableParamsChange(),
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
        items: clientsListSelector(state),
        loading: loadingSelector(state),

    }),
    { onFiltersFormSubmit, getNextReportParams, checkReportParams, onTableParamsChange}
)(ClientsList);


const getColumns = (props) => {

    const columns = [
        {
            dataIndex: 'app_id',
            sorter: true,
            width: 100,
            type: 'static'
        },
        {
            dataIndex: 'customer_id',
            sorter: true,
            width: 120,
            type: 'static'
        },
        {
            dataIndex: 'app_name',
            width: 300,
            dataType: 'text',
            sorter: true,
            type: 'static'
        },
        {
            dataIndex: 'state_name',
            sorter: true,
            width: 120
        },
        {
            dataIndex: 'tariff_plan',
            sorter: true,
            dataType: 'text',
            width: 200
        },
        {
            dataIndex: 'numbers',
            sorter: true,
            width: 130,
            render: numsRenderer
        },
        {
            dataIndex: 'account_number',
            width: 150,
            sorter: true,
        },
        {
            dataIndex: 'balance',
            dataType: 'number',
            sorter: true,
            width: 100,
        },
        {
            dataIndex: 'domain',
            sorter: true,
            dataType: 'text',
            width: 200,
        },
        {
            dataIndex: 'login',
            width: 150,
            dataType: 'text',
            sorter: true,
        },
        {
            dataIndex: 'is_agent',
            sorter: true,
            width: 120,
            render: isAgentRenderer(props)
        },
        {
            dataIndex: 'node_id',
            sorter: true,
            width: 80
        },
        {
            dataIndex: 'agent_id',
            sorter: true,
            width: 120,
            render: (val, record) => <Link to={{ pathname: props.match.path, search: `?app_id=${val}` }}>{val}</Link>
        },
        {
            dataIndex: 'watching_app_ids',
            sorter: true,
            width: 120,
            render: (val, record) => val && val.map((id) => <Link key={id} to={{ pathname: props.match.path, search: `?app_id=${id}` }}>{id}</Link>)
        }
    ];

    return props.user.user_role !== 'billing' ? [{
            dataIndex: 'action column',
            type: 'extra',
            width: 48,
            render: actionRenderer(props)
        }, ...columns] : columns;
};

const actionRenderer = (props) => (v, record) => {
    const { app_id: appId} = record,
        actionList = (
            <Menu style={{ width: 340 }} className="comagic-client-details-dropdown-overlay">
                <Menu.Item key="0">
                    <Link to={'/changeshistory/?' + queryString.stringify({ app_id: appId })}>История изменений</Link>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link tag="span" to={`${props.match.path}/${appId}`}>Редактирование клиента</Link>
                </Menu.Item>
                <Menu.Divider />
                <div className="away-block">
                    <span>Перейти в ЛК</span>
                </div>
            </Menu>
        );

    return (
        <Dropdown overlay={actionList} trigger={['click']}>
            <div style={{ cursor: 'pointer', width: 16 }}><img src={detailsImg}/></div>
        </Dropdown>
    );
};

const isAgentRenderer = (props) => (isAgent) => <div className="cell-value">{isAgent ? 'agent' : 'notagent'}</div>;

const numsRenderer = (nums) => nums === null ? '' : textRenderer(nums.split(', ').sort().join(', '));
