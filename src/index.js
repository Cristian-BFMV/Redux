const redux = require('redux');
const createStore = redux.createStore;
const combineReducers = redux.combineReducers;

/*
    Redux tiene 3 conceptos principales:
    
    action: Describe una acción a realziar sobre el estado 
    de la aplicación.

    reducer: Se encarga de modificar el estado de la aplicación
    teniendo en cuenta el action que se desea realizar

    store: El store es la parte central donde se almacena todo 
    el estado de la aplicación 
*/

const BUY_CAKE = 'BUY_CAKE';
const BUY_ICECREAM = 'BUY_ICECREAM';
/**
 * Un action se puede generar a través de una función que retorne
 * un objeto que describa la acción a realizar sobre el estado.
 *
 * Este objeto debe contener un type, el cual describe el cambio
 * a realizar, un payload el cual contiene los datos que se le quiere
 * llevar/modificar al estado y opcionalmente puede tener cualquier
 * atributo
 */
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

/**
 * El reducer es una función que recibe como parametros el estado
 * y el action para controlar el cambio que se debe realizar sobre
 * el estado
 */
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

const store = createStore(rootReducer);

console.log('Initial state', store.getState());
const unsubscribe = store.subscribe(() => console.log('Updated state', store.getState()));
/**
 * Con el método dispatch que provee redux, se ejecuta el reducer
 * creado, este a su vez recibe el action a ejecutar sobre el estado
 */
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyIcream());
store.dispatch(buyIcream());
unsubscribe();
