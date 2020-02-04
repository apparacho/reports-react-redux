import { appName } from '../config';
import axios from 'axios';
import queryString from 'query-string';
import history from '../history';
import { isEqual } from 'lodash';

/**
 * Constants
 * */


export const defaultFilterParams = {
    app_id: undefined,
    search: undefined
};

export const defaultTableParams = {
    limit: 10,
    offset: 0,
    sort: [{field: 'app_id', order: 'desc'}]
};

export const defaultTablePagination = {
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '20', '30', '50'],
    current: (defaultTableParams.offset / defaultTableParams.limit) + 1,
    pageSize: defaultTableParams.limit,
    total: 0
};

const initState = {
    reportParams: {
        filterParams: {...defaultFilterParams},
        tableParams: {...defaultTableParams}
    },
    tablePagination: {...defaultTablePagination},
    clientsList: [],
    metadata: {},
    client: {
        domain: null,
        is_short_phone_shared_in_holding: null,
        state_name: "Активен",
        is_agent: false,
        app_id: 69864,
        numbers: null,
        app_name: "Людмила Кузнецова",
        agent_app_ids: null,
        hide_return_commission: null,
        is_share_tp: false,
        state: "active",
        customer_id: 626088,
        watched_app_ids: [],
        account_number: "VA20071263",
        account_id: 59327,
        tp_id: 135,
        tariff_plan: "Универсал Trial",
        node_id: 1,
        agent_id: null,
        total_records: 62969,
        agent_tp_is_share: null,
        is_use_numb_as_numa: null,
        watching_app_ids: [],
        transit_dst_app_id: null,
        watching_app_ids_on_share_tp: [],
        login: null,
        balance: 0.0000
    },
    loading: false,
    autoload: true,
    isLoaded: false,
    isSubmitting: false
};



export const moduleName = 'clients';
const prefix = `${appName}/${moduleName}`;
export const FETCH_CLIENTS_LIST_START = `${prefix}/FETCH_CLIENTS_LIST_START`;
export const FETCH_CLIENTS_LIST_SUCCESS = `${prefix}/FETCH_CLIENTS_LIST_SUCCESS`;

export const FETCH_CLIENT_START = `${prefix}/FETCH_CLIENT_START`;
export const FETCH_CLIENT_SUCCESS = `${prefix}/FETCH_CLIENT_SUCCESS`;

export const SET_TABLE_PAGINATION = `${prefix}/SET_TABLE_PAGINATION`;
export const SET_IS_SUBMITTING = `${prefix}/SET_IS_SUBMITTING`;

/**
 * Reducer
 * */

// const ACTION_HANDLERS = {
//   [ACTION_1]: (state, action) => ...,
//   [ACTION_2]: (state, action) => ...,
//   [ACTION_3]: (state, action) => ...,
//   [ACTION_4]: (state, action) => ...,
//   ...
// };
//
// const reducer = (state = INITIAL_STATE, action) => {
//   const handler = ACTION_HANDLERS[action.type];
//   return handler ? handler(state, action) : state;
// };

export default function reducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
      case FETCH_CLIENTS_LIST_START:
      case FETCH_CLIENT_START:
          return {...state, loading: true};
      case FETCH_CLIENTS_LIST_SUCCESS:
          return {
              ...state,
              clientsList: payload.data,
              metadata: payload.metadata,
              isLoaded: true,
              loading: false
          };
      case FETCH_CLIENT_SUCCESS:
          return {...state, client: payload, loading: false};
      case SET_TABLE_PAGINATION:
          return {...state, tablePagination: payload};
      case SET_IS_SUBMITTING:
          return {...state, isSubmitting: payload};
      default:
          return state
  }
}

/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName];
export const clientsListSelector = (state) => stateSelector(state)['clientsList'];
export const clientSelector = (state) => stateSelector(state)['client'];

export const loadingSelector = (state) => stateSelector(state)['loading'];
export const autoloadSelector = (state) => stateSelector(state)['autoload'];
export const isSubmittingSelector = (state) => stateSelector(state)['isSubmitting'];
export const isLoadedSelector = (state) => stateSelector(state)['isLoaded'];

export const reportParamsSelector = (state) => stateSelector(state)['reportParams'];
export const filterParamsSelector = (state) => reportParamsSelector(state)['filterParams'];
export const tableParamsSelector = (state) => reportParamsSelector(state)['tableParams'];


/**
 * Action Creators
 * */


export const fetchAllClients = () => {
    return (dispatch, getState) => {
        // if (!getState().clients.clientsList.length) {
             debugger;
            dispatch({type: FETCH_CLIENTS_LIST_START});
            dispatch({type: SET_IS_SUBMITTING, payload: false});
            loadClientsListService()
                .then(data => dispatch({
                    type: FETCH_CLIENTS_LIST_SUCCESS,
                    payload: data
                }))
        }
    // }
};

export const fetchClient = (clientId) => {
    return (dispatch) => {
        dispatch({ type: FETCH_CLIENT_START });
        loadClientService(clientId)
            .then(all => dispatch({
                type: FETCH_CLIENT_SUCCESS,
                payload: all
             }))
    }
};


/**
 *   Side Effects
 * */

export function loadClientsListService () {
    return axios.get('/clients')
        .then(function (response) {
            console.log(response, response.data);
            debugger;
            return response.data;
        })
}

export function loadClientService (clientId) {
    return axios.get('/clients/' + clientId)
        .then(function (response) {
            return response.data;
        })
}


/**
 *
 *
 * **/



export const getNextReportParams = (search = history.location.search) => {
    console.log(search);
    return (dispatch, getState, x, y) => {
        console.log(dispatch, getState(), x, y);
        debugger;
        const paramsFromUrl = queryString.parse(search, {arrayFormat: 'index'});
        if (search && paramsFromUrl.sort && paramsFromUrl.sort.length) {
            paramsFromUrl.sort = paramsFromUrl.sort.map(i => i ? JSON.parse(i) : i);
        } else if (search && !paramsFromUrl.sort) {
            paramsFromUrl.sort = [];
        }
        const getNextParams = (params, defaultParams) => Object.keys(params).reduce((res, key) => ({
            ...res,
            [key]: key in paramsFromUrl ? paramsFromUrl[key] : defaultParams[key]
        }), {});
        return {
            filterParams: search ? getNextParams(getState().clients.reportParams.filterParams || {}, defaultFilterParams) : defaultFilterParams,
            tableParams: search ? getNextParams(getState().clients.reportParams.tableParams, defaultTableParams) : defaultTableParams
        };
    }
};

export const onFiltersFormSubmit = (values, action) => {
    console.log(values, action);
    return (dispatch, getState) => {
        // this.setTableDefaults();
        const tableParams = tableParamsSelector(getState());
        console.log(tableParams);
        const {hash, pathname, state} = history.location,
            search = getNextSearch(values, {...tableParams, offset: 0});
        // reducer !!!
        // this.isSubmitting = true;
        dispatch({ type: SET_IS_SUBMITTING, payload: true });
        debugger;
        history.push({hash, pathname, state, search});
    }
};


// это в редьюсер
// export const setTableDefaults = () => {
//     this.reportParams.tableParams = {...this.defaultReportParams.tableParams};
//     this.tablePagination = {...this.defaultTablePagination};
// };

export const getNextSearch = (filterParams, tableParams) => {
    const filterParamsSearch = queryString.stringify(filterParams, {arrayFormat: 'index'}),
        tableParamsSearch = queryString.stringify({...tableParams, sort: tableParams.sort ? tableParams.sort.map(i => JSON.stringify(i)) : null}, {arrayFormat: 'index'}),
        separator = filterParamsSearch && tableParamsSearch ? '&' : '';
    return  filterParamsSearch + separator + tableParamsSearch;
};

export const checkReportParams = () => {
    return (dispatch, getState) => {
        console.log(getState());
        const {filterParams, tableParams} = reportParamsSelector(getState()),
            nextReportParams = getNextReportParams()(dispatch, getState),
            autoload = autoloadSelector(getState()),
            isSubmitting = isSubmittingSelector(getState());

        debugger;

        if (!history.location.search && autoload && !isSubmitting) {
            if (!isEqual(filterParams, nextReportParams.filterParams) || !isEqual(tableParams, nextReportParams.tableParams)) {
                // this.initParams();
                debugger;
            }
        } else if (isSubmitting){
            // || (!history.location.search && autoload)
            // || (!isEqual(filterParams, nextReportParams.filterParams) || !isEqual(tableParams, nextReportParams.tableParams))) {
            debugger;
            const {limit, offset} = nextReportParams.tableParams;
            limit && offset && setTablePaginationFromUrlParams({limit, offset})(dispatch);
            // reducer !!!
            // this.reportParams = {...nextReportParams};
            const searchFromParams = getNextSearch(nextReportParams.filterParams, nextReportParams.tableParams),
                {hash, pathname, state} = history.location;
            history.replace({hash, pathname, state, search: searchFromParams});
            //this.load();
            // dispatch();
            debugger;
            fetchAllClients()(dispatch, getState);
        }
    }
};

export const setTablePaginationFromUrlParams = ({offset, limit}) => {
    debugger;
    return (dispatch) => {
        dispatch({
            type: SET_TABLE_PAGINATION,
            payload: {...defaultTablePagination, pageSize: +limit, current: +offset / +limit + 1}
        });
    }
};

export const onTableParamsChange = (pagination, filter, sort, ...rest) => {
    debugger;
    return (dispatch, getState) => {
        const isLoaded = isLoadedSelector(getState());
        const tableParams = tableParamsSelector(getState());
        const filterParams = filterParamsSelector(getState());

        if (!isLoaded) {
            return;
        }
        let nextTableParams = {
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize,
            sort: sort.field
                ? [{field: sort.field, order: sort.order === 'ascend' ? 'asc' : 'desc'}]
                : [],
            // filter
        };

        if (!isEqual(nextTableParams.sort, tableParams.sort || []) && nextTableParams.offset !== 0) {
            nextTableParams.offset = 0;
        }

        const {hash, pathname, state} = history.location,
            search = getNextSearch(filterParams, nextTableParams);

        // this.isSubmitting = true;
        dispatch({type: SET_IS_SUBMITTING, payload: true});

        history.push({hash, pathname, state, search});
    }
};

// Это в редьюсер
// initParams() {
//     this.items = [];
//     this.reportParams = {...this.defaultReportParams};
//     this.metadata = {};
//     this.tablePagination = {...this.defaultTablePagination};
//     this.isLoaded = false;
//
//     this.autoload = false;
// };


