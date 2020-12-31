const { createStore, combineReducers, applyMiddleware } = require('redux');
const { createLogger } = require('redux-logger');

const logger = createLogger();

const BUY_CAKE = 'BUY_CAKE';
const BUY_ICECREAM = 'BUY_ICECREAM';

const buyCake = () => ({
  type: BUY_CAKE,
  info: 'First redux action',
});

const buyIcream = () => ({
  type: BUY_ICECREAM,
});

const initialIcecreamState = {
  numOfIceCreams: 20,
};

const initialCakeState = {
  numOfCakes: 10,
};

const cakeReducer = (state = initialCakeState, action) => {
  switch (action.type) {
    case BUY_CAKE:
      return {
        ...state,
        numOfCakes: state.numOfCakes - 1,
      };
    default:
      return state;
  }
};

const iceCreamReducer = (state = initialIcecreamState, action) => {
  switch (action.type) {
    case BUY_ICECREAM:
      return {
        ...state,
        numOfIceCreams: state.numOfIceCreams - 1,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cake: cakeReducer,
  iceCream: iceCreamReducer,
});

const store = createStore(rootReducer, applyMiddleware(logger));

console.log('Initial state', store.getState());
// const unsubscribe = store.subscribe(() => );
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyIcream());
store.dispatch(buyIcream());
//unsubscribe();
