import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import clientsReducer, { moduleName as clientsModule } from '../ducks/clients';
import callsReducer, { moduleName as callsModule } from '../ducks/calls';
import callsNew1Reducer, { moduleName as callsNew1Module } from '../ducks/callsNew1';

export default (history) => combineReducers({
    router: connectRouter(history),
    [clientsModule]: clientsReducer,
    [callsModule]: callsReducer,
    [callsNew1Module]: callsNew1Reducer
})
