import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import createRootReducer from './reducer';
import history from '../history';

const enhancer = applyMiddleware(thunk, routerMiddleware(history), logger);

const store = createStore(createRootReducer(history), enhancer);

if (process.env.NODE_ENV === 'development') {
    window.store = store;
}

export default store;
