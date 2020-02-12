import {
    initialState,
    getBaseReportDuck,
    getPrefix,
    // defaultFilterParams,
    // defaultTableParams,
    // defaultTablePagination
} from './BaseReport';


export const moduleName = 'callsNew1';

export const {
    getReducer,
    ACTION_HANDLERS,
    SELECTORS: {
        listDataSelector,
        loadingSelector,
        reportParamsSelector,
        filterParamsSelector,
        tableParamsSelector
    },
    getNextReportParams,
    onFiltersFormSubmit,
    checkReportParams,
    onTableParamsChange
} = getBaseReportDuck(moduleName, 'calls');

// здесь можно расширить ACTION_HANDLERS, initialState
const prefix = getPrefix(moduleName);

const TOGGLE_CALLS_FLAG = `${prefix}/TOGGLE_CALLS_FLAG`;

const callsNew1InitialState = {
    ...initialState,
    callsFlag: true
};
// тут же можно поменять любое дефолтное св-во в initialState - reportParams, например

const CALLS_NEW_1_ACTION_HANDLERS = {
    ...ACTION_HANDLERS,
    [TOGGLE_CALLS_FLAG]: (state, action) => ({...state, callsFlag: !state.callsFlag}),
};


// и создать редьюсер так getReducer(NEW_ACTION_HANDLERS)
export default getReducer(CALLS_NEW_1_ACTION_HANDLERS, callsNew1InitialState);

// либо если функциональность стандартная, то
// export default getReducer();
