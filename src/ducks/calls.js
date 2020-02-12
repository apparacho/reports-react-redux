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

const initialState = {
    reportParams: {
        filterParams: {...defaultFilterParams},
        tableParams: {...defaultTableParams}
    },
    tablePagination: {...defaultTablePagination},
    listData: [],
    metadata: {},
    loading: false,
    autoload: true,
    isLoaded: false,
    isSubmitting: false
};



export const moduleName = 'calls';
const prefix = `${appName}/${moduleName}`;

export const FETCH_LIST_START = `${prefix}/FETCH_LIST_START`;
export const FETCH_LIST_SUCCESS = `${prefix}/FETCH_LIST_SUCCESS`;

export const SET_TABLE_PAGINATION = `${prefix}/SET_TABLE_PAGINATION`;
export const SET_IS_SUBMITTING = `${prefix}/SET_IS_SUBMITTING`;

/**
 * Reducer
 * */


const ACTION_HANDLERS = {
  [FETCH_LIST_START]: (state, action) => ({...state, loading: true}),
  [FETCH_LIST_SUCCESS]: (state, action) => ({
      ...state,
      listData: action.payload.data,
      metadata: action.payload.metadata,
      isLoaded: true,
      loading: false
  }),
  [SET_TABLE_PAGINATION]: (state, action) => ({...state, tablePagination: action.payload}),
  [SET_IS_SUBMITTING]: (state, action) => ({...state, isSubmitting: action.payload}),
};

export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName];
export const listDataSelector = (state) => stateSelector(state)['listData'];

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


export const fetchListData = () => {
    return (dispatch, getState) => {
        console.log(`fetch ${moduleName} list data`);
        dispatch({type: FETCH_LIST_START});
        dispatch({type: SET_IS_SUBMITTING, payload: false});
        loadListDataService()
            .then(data => dispatch({
                type: FETCH_LIST_SUCCESS,
                payload: data
            }))
    }
};


/**
 *   Side Effects
 * */

export function loadListDataService () {
    return axios.get('/calls')
        .then(function (response) {
            console.log(`loadListDataService -- ${moduleName}`, response, response.data);
            // debugger;
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
        console.log('getNextReportParams', dispatch, getState(), x, y);
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
        const tableParams = tableParamsSelector(getState());
        console.log('onFiltersFormSubmit', tableParams);
        const {hash, pathname, state} = history.location,
            search = getNextSearch(values, {...tableParams, offset: 0});
        dispatch({ type: SET_IS_SUBMITTING, payload: true });
        // debugger;
        history.push({hash, pathname, state, search});
    }
};



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

        if (!history.location.search && autoload && !isSubmitting) {
            if (!isEqual(filterParams, nextReportParams.filterParams) || !isEqual(tableParams, nextReportParams.tableParams)) {
                // this.initParams();
                debugger;
            }
        } else if (isSubmitting){
            // debugger;
            const {limit, offset} = nextReportParams.tableParams;
            limit && offset && setTablePaginationFromUrlParams({limit, offset})(dispatch);
            const searchFromParams = getNextSearch(nextReportParams.filterParams, nextReportParams.tableParams),
                {hash, pathname, state} = history.location;
            history.replace({hash, pathname, state, search: searchFromParams});

            fetchListData()(dispatch, getState);
        }
    }
};

export const setTablePaginationFromUrlParams = ({offset, limit}) => {
    console.log('setTablePaginationFromUrlParams');
    return (dispatch) => {
        dispatch({
            type: SET_TABLE_PAGINATION,
            payload: {...defaultTablePagination, pageSize: +limit, current: +offset / +limit + 1}
        });
    }
};

export const onTableParamsChange = (pagination, filter, sort, ...rest) => {
    console.log('onTableParamsChange');
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

        dispatch({type: SET_IS_SUBMITTING, payload: true});

        history.push({hash, pathname, state, search});
    }
};


