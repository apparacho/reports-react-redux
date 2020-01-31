import { appName } from '../../config';
import axios from 'axios';

/**
 * Constants
 * */

export const moduleName = 'clients';
const prefix = `${appName}/${moduleName}`;
export const FETCH_CLIENTS_LIST_START = `${prefix}/FETCH_CLIENTS_LIST_START`;
export const FETCH_CLIENTS_LIST_SUCCESS = `${prefix}/FETCH_CLIENTS_LIST_SUCCESS`;

export const FETCH_CLIENT_START = `${prefix}/FETCH_CLIENT_START`;
export const FETCH_CLIENT_SUCCESS = `${prefix}/FETCH_CLIENT_SUCCESS`;

/**
 * Reducer
 * */

const initState = {
    clientsList: [],
    client: {
        id: "",
        name: "",
        accountType: "",
        accountStatus: "",
        accountNumber: "",
        activationDate: "",
        ogrn: "",
        ogrnIp: "",
        taxNumber: "",
        contactInfo: [
            {
                email: '',
                phone: '',
                fio: '',
                post: ''
            }
        ],
        address: [
            {
                country: '',
                region: '',
                town: '',
                postCode: '',
                street: '',
                house: '',
                addressType: '',
                extra: ''
            }
        ],
        groups: null
    },
    loading: false
};

export default function reducer(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
      case FETCH_CLIENTS_LIST_START:
      case FETCH_CLIENT_START:
          return {...state, loading: true};
      case FETCH_CLIENTS_LIST_SUCCESS:
          return {...state, clientsList: payload, loading: false};
      case FETCH_CLIENT_SUCCESS:
          return {...state, client: payload, loading: false};
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


/**
 * Action Creators
 * */


export const fetchAllClients = () => {
    return (dispatch, getState) => {
        if (!getState().clients.clientsList.length) {
            dispatch({type: FETCH_CLIENTS_LIST_START});
            loadAllClientsService()
                .then(all => dispatch({
                    type: FETCH_CLIENTS_LIST_SUCCESS,
                    payload: all
                }))
        }
    }
};

export const fetchClient = (ClientId) => {
    return (dispatch) => {
        dispatch({ type: FETCH_CLIENT_START });
        loadClientService(ClientId)
            .then(all => dispatch({
                type: FETCH_CLIENT_SUCCESS,
                payload: all
             }))
    }
};


/**
 *   Side Effects
 * */

export function loadAllClientsService () {
   return axios.get('/Clients')
      .then(function (response) {
        return response.data;
      })
}

export function loadClientService (clientId) {
   return axios.get('/Clients/' + clientId)
      .then(function (response) {
        return response.data;
      })
}
