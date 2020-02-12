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

export const initialState = {
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

export const getPrefix = (moduleName) => `${appName}/${moduleName}`;

export const getNextSearch = (filterParams, tableParams) => {
    const filterParamsSearch = queryString.stringify(filterParams, {arrayFormat: 'index'}),
        tableParamsSearch = queryString.stringify({...tableParams, sort: tableParams.sort ? tableParams.sort.map(i => JSON.stringify(i)) : null}, {arrayFormat: 'index'}),
        separator = filterParamsSearch && tableParamsSearch ? '&' : '';
    return  filterParamsSearch + separator + tableParamsSearch;
};

export const getBaseReportDuck = (moduleName, fetchListUrl) => {

    const prefix = getPrefix(moduleName);

    /**
     *   Constants
     * */
    const FETCH_LIST_START = `${prefix}/FETCH_LIST_START`,
        FETCH_LIST_SUCCESS = `${prefix}/FETCH_LIST_SUCCESS`,
        SET_TABLE_PAGINATION = `${prefix}/SET_TABLE_PAGINATION`,
        SET_IS_SUBMITTING = `${prefix}/SET_IS_SUBMITTING`;

    /**
     *  Reducer
     */

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

    const fetchListStart = () => ({type: FETCH_LIST_START});
    const fetchListSuccess = (data) => ({type: FETCH_LIST_SUCCESS, payload: data });
    const setIsSubmitting = (val) => ({type: SET_IS_SUBMITTING, payload: val});
    const setTablePagination = (offset, limit) => ({
        type: SET_TABLE_PAGINATION,
        payload: {...defaultTablePagination, pageSize: +limit, current: +offset / +limit + 1}
    });

    const getReducer = (actionHandlers = ACTION_HANDLERS, iState = initialState) => (state = iState, action) => {
        const handler = actionHandlers[action.type];
        return handler ? handler(state, action) : state;
    };

    /**
     * Selectors
     * */

    const stateSelector = (state) => state[moduleName];

    const listDataSelector = (state) => stateSelector(state)['listData'];

    const loadingSelector = (state) => stateSelector(state)['loading'];
    const autoloadSelector = (state) => stateSelector(state)['autoload'];
    const isSubmittingSelector = (state) => stateSelector(state)['isSubmitting'];
    const isLoadedSelector = (state) => stateSelector(state)['isLoaded'];

    const reportParamsSelector = (state) => stateSelector(state)['reportParams'];
    const filterParamsSelector = (state) => reportParamsSelector(state)['filterParams'];
    const tableParamsSelector = (state) => reportParamsSelector(state)['tableParams'];

    const defaultReportParamsSelector = (state) => stateSelector(state)['defaultReportParams'];
    const defaultFilterParamsSelector = (state) => defaultReportParamsSelector(state)['filterParams'];
    const defaultTableParamsSelector = (state) => defaultReportParamsSelector(state)['tableParams'];


    /**
     * Action Creators
     * */

    /**************************** MODULENAME ************************/
    const fetchListData = () => {
        return (dispatch, getState) => {
            console.log(`fetch list data`);
            dispatch(fetchListStart());
            dispatch(setIsSubmitting(false));
            loadListDataService()
                .then(data => dispatch(fetchListSuccess(data)))
        }
    };


    /**
     *   Side Effects
     * */


        /**************************** URL ************************/
    const loadListDataService = () => {
        return axios.get(fetchListUrl)
            .then(function (response) {
                console.log(`loadListDataService `, response, response.data);
                // debugger;
                return response.data;
            })
    };


    /**
     *
     *
     * **/

    const getNextReportParams = (search = history.location.search) => {
        console.log(search);
        return (dispatch, getState) => {
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
            // const defaultFilterParams = defaultFilterParamsSelector(getState);
            // const defaultTableParams = defaultTableParamsSelector(getState);
            return {
                filterParams: search ? getNextParams(filterParamsSelector(getState()) || {}, defaultFilterParams) : defaultFilterParams,
                tableParams: search ? getNextParams(tableParamsSelector(getState()), defaultTableParams) : defaultTableParams
            };
        }
    };

    const onFiltersFormSubmit = (values, action) => {
        console.log(values, action);
        return (dispatch, getState) => {
            const tableParams = tableParamsSelector(getState());
            console.log('onFiltersFormSubmit', tableParams);
            const {hash, pathname, state} = history.location,
                search = getNextSearch(values, {...tableParams, offset: 0});
            dispatch(setIsSubmitting(true));
            // debugger;
            history.push({hash, pathname, state, search});
        }
    };

    const checkReportParams = () => {
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

    const setTablePaginationFromUrlParams = ({offset, limit}) => (dispatch) => dispatch(setTablePagination(offset, limit));

    const onTableParamsChange = (pagination, filter, sort, ...rest) => {
        console.log('onTableParamsChange');
        return (dispatch, getState) => {
            if (!isLoadedSelector(getState())) {
                return;
            }
            const tableParams = tableParamsSelector(getState());
            const filterParams = filterParamsSelector(getState());
            const nextTableParams = {
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

            dispatch(setIsSubmitting(true));

            history.push({hash, pathname, state, search});
        }
    };


    return {
        CONSTS: {
            FETCH_LIST_START,
            FETCH_LIST_SUCCESS,
            SET_TABLE_PAGINATION,
            SET_IS_SUBMITTING
        },
        ACTION_HANDLERS,
        ACTIONS: {
            fetchListStart,
            fetchListSuccess,
            setIsSubmitting,
            setTablePagination
        },
        SELECTORS: {
            stateSelector,
            listDataSelector,

            loadingSelector,
            autoloadSelector,
            isSubmittingSelector,
            isLoadedSelector,

            reportParamsSelector,
            filterParamsSelector,
            tableParamsSelector
        },
        getReducer,
        getNextReportParams,
        onFiltersFormSubmit,
        checkReportParams,
        setTablePaginationFromUrlParams,
        onTableParamsChange
    }
};
