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

export const getBaseReportDuck = (moduleName) => {
    const prefix = getPrefix(moduleName);

    /**
     *   Constants
     * */
    const CONSTS = {
        FETCH_LIST_START: `${prefix}/FETCH_LIST_START`,
        FETCH_LIST_SUCCESS: `${prefix}/FETCH_LIST_SUCCESS`,
        SET_TABLE_PAGINATION: `${prefix}/SET_TABLE_PAGINATION`,
        SET_IS_SUBMITTING: `${prefix}/SET_IS_SUBMITTING`
    },
    {
        FETCH_LIST_START,
        FETCH_LIST_SUCCESS,
        SET_TABLE_PAGINATION,
        SET_IS_SUBMITTING
    } = CONSTS;

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

    const ACTIONS = {
        fetchListStart: () => ({type: CONSTS.FETCH_LIST_START}),
        fetchListSuccess: (data) => ({type: CONSTS.FETCH_LIST_SUCCESS, payload: data }),
        setIsSubmitting: (val) => ({type: CONSTS.SET_IS_SUBMITTING, payload: val}),
        setTablePagination: (offset, limit) => ({
            type: CONSTS.SET_TABLE_PAGINATION,
            payload: {...defaultTablePagination, pageSize: +limit, current: +offset / +limit + 1}
        })
    },
    {
        fetchListStart,
        fetchListSuccess,
        setIsSubmitting,
        setTablePagination
    } = ACTIONS;

    const getReducer = (actionHandlers = ACTION_HANDLERS, iState = initialState) => function reducer(state = iState, action) {
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


    /**
     * Action Creators
     * */

    const fetchListData = () => {
        return (dispatch, getState) => {
            console.log(`fetch list data`);
            dispatch(fetchListStart);
            dispatch(setIsSubmitting(false));
            loadListDataService()
                .then(data => dispatch(fetchListSuccess(data)))
        }
    };


    /**
     *   Side Effects
     * */

     const loadListDataService = () => {
        return axios.get('/calls')
            .then(function (response) {
                console.log(`loadListDataService `, response, response.data);
                debugger;
                return response.data;
            })
    };


    /**
     *
     *
     * **/


    const getNextReportParams = (search = history.location.search) => {
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

    const onFiltersFormSubmit = (values, action) => {
        console.log(values, action);
        return (dispatch, getState) => {
            const tableParams = tableParamsSelector(getState());
            console.log('onFiltersFormSubmit', tableParams);
            const {hash, pathname, state} = history.location,
                search = getNextSearch(values, {...tableParams, offset: 0});
            dispatch(setIsSubmitting(true));
            debugger;
            history.push({hash, pathname, state, search});
        }
    };

    const getNextSearch = (filterParams, tableParams) => {
        const filterParamsSearch = queryString.stringify(filterParams, {arrayFormat: 'index'}),
            tableParamsSearch = queryString.stringify({...tableParams, sort: tableParams.sort ? tableParams.sort.map(i => JSON.stringify(i)) : null}, {arrayFormat: 'index'}),
            separator = filterParamsSearch && tableParamsSearch ? '&' : '';
        return  filterParamsSearch + separator + tableParamsSearch;
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
                debugger;
                const {limit, offset} = nextReportParams.tableParams;
                limit && offset && setTablePaginationFromUrlParams({limit, offset})(dispatch);
                const searchFromParams = getNextSearch(nextReportParams.filterParams, nextReportParams.tableParams),
                    {hash, pathname, state} = history.location;
                history.replace({hash, pathname, state, search: searchFromParams});

                fetchListData()(dispatch, getState);
            }
        }
    };

    const setTablePaginationFromUrlParams = ({offset, limit}) => {
        console.log('setTablePaginationFromUrlParams');
        return (dispatch) => {
            dispatch(setTablePagination(offset, limit));
        }
    };

    const onTableParamsChange = (pagination, filter, sort, ...rest) => {
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

            dispatch(setIsSubmitting(true));

            history.push({hash, pathname, state, search});
        }
    };


    return {
        CONSTS,
        ACTION_HANDLERS,
        ACTIONS,
        getReducer,
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
        getNextReportParams,
        onFiltersFormSubmit,
        getNextSearch,
        checkReportParams,
        setTablePaginationFromUrlParams,
        onTableParamsChange
    }
};
