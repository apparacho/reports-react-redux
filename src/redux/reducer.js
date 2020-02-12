import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import clientsReducer, { moduleName as clientsModule } from '../ducks/clients';
import callsReducer, { moduleName as callsModule } from '../ducks/calls';

export default (history) => combineReducers({
    router: connectRouter(history),
    [clientsModule]: clientsReducer,
    [callsModule]: callsReducer,
})
