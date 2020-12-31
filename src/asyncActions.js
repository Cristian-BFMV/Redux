const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const axios = require('axios');

const initialState = {
  loading: false,
  users: [],
  error: '',
};

const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

const fetchUserSuccess = users => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: users,
  };
};

const fetchUserFailure = error => {
  return {
    type: FETCH_USER_FAILURE,
    payload: error,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: '',
      };
    case FETCH_USER_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUserRequest());
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        const users = response.data.map(user => user.id);
        dispatch(fetchUserSuccess(users));
      })
      .catch(error => {
        dispatch(fetchUserFailure(error.message));
      });
  };
};

const store = createStore(reducer, applyMiddleware(thunk));

store.subscribe(() => console.log(store.getState()));
store.dispatch(fetchUsers());
