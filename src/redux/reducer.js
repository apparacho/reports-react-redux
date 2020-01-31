import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import clientsReducer, { moduleName as clientsModule } from '../ducks/reports/clients';

export default (history) => combineReducers({
    router: connectRouter(history),
    [clientsModule]: clientsReducer,
})
