# Redux

Redux es una libreria de JavaScript la cual nos sirve para el manejo del estado de una aplicación.

## Conceptos principales de Redux

Redux tiene 3 conceptos principales, los cuales son:

1.  Action: Un action describe cómo el estado de la aplicación debe cambiar, sin embargo, este no lleva a cabo este cambio. Por lo general un action se genera a través de una función que retorna un objeto, este objeto contiene un type que describe el cambio a realizar, un payload que contiene los datos a modificar en el estado y opcionalmente puede tener cualquier otro atributo.

    ```js
    const buyCake = () => ({
      type: BUY_CAKE,
      info: 'First redux action',
    });
    ```

2.  Redcuer: Un reducer es una función la cual es la encargada de realizar los cambios sobre el estado de la aplicación basados en el action que se desea realizar. Esta función recibe el estado de la aplicación y el action que describe los cambios a realizar por el reducer; como resultado esta función retorna el nuevo estado.

    ```js
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
    ```

    Nota: En esta función se debe definir un valor por defecto para el estado de la aplicación.

    ```js
    const initialCakeState = {
      numOfCakes: 10,
    };
    ```

3.  Store: El store almacena todo el estado de la aplicación y este nos provee con los métodos para obtener el estado y modificarlo.

    ```js
    const store = createStore(cakeReducer);
    const unsubscribe = store.subscribe(() => console.log('Updated state', store.getState()));
    store.dispatch(buyCake());
    ```

    Nota: para ejecutar los reducers que modifiquen el estado de la aplicación es necesario usar el método dispatch provisto por el store creado y pasar como parametro el objeto devuelto por el action creator que deseemos ejecutar.

## Combine reducers

Normalmente en una aplicación surge la necesidad de manejar distintas piezas de estado de la aplicación y el manejar todo la complejidad asociado a esto con un solo reducer se vuelve algo engorroso de realizar, para solucionar esto Redux ofrece la posibilidad de tener varios reducers que manejen el estado de la aplicación en pequeñas partes, sin embargo, para crear el store de Redux este solo acepta un solo reducer, para solucionar esto Redux tiene el método combineRecuers el cual combina los diferentes reducers en uno para poder crear el store.

```js
const rootReducer = combineReducers({
  cake: cakeReducer,
  iceCream: iceCreamReducer,
});
```

Con este reducer resultante, se puede crear el store para almacenar el estado de toda la aplicación.

```js
const store = createStore(rootReducer);
```

## Middleware

Redux ofrece la posibilidad de extender su funcionalidad a través de middlewares los cuales se ejecutan entre el dispatch de un action y la respectiva ejecución del reducer. Para lograr esto Redux ofrece el método applyMiddleware el cual recibe los diferentes Middlewares que queramos usar en nuestra aplicación.

```js
const { applyMiddleware } = require('redux');
const { createLogger } = require('redux-logger');

const logger = createLogger();
const store = createStore(rootReducer, applyMiddleware(logger));
```

## Actions asincronos y Redux thunk middleware

---

### Actions asincronos

Los actions asincronos son utiles para obtener datos de una API externa y poder integrar estos datos a nuestra aplicación a través del store de Redux.

### Redux thunk

Para la ejecución de actions asincronos es necesario usar la funcionalidad que ofrece Redux thunk, lo que nos permite declarar actions creators que en lugar de retornar un objeto describiendo una acción a realizar sobre el estado de la aplicación, retornen una función que realice los llamados asincronos a APIs externas y sea esta función la encargada de realizar el dispatch para modificar el estado de la aplicación a partir de los datos retornados por la API.

Como Redux thunk es un middleware su configuración es similar a la mostrada en una sección anterior.

```js
const thunk = require('redux-thunk').default;
const store = createStore(reducer, applyMiddleware(thunk));
```

Lo siguiente que se debe realizar para la funcionalidad de Redux thunk es crear los actions y el reducer que sea el encargado de realizar las modificaciones al estado de la aplicación.

```js
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
```

Teniendo esto se crea el action creator que retorna la función asincrona para aplicar la funcionalidad de Redux thunk. Esta función que retorna el action creator recibe como parametro la función dispatch para realizar los respectivos cambios en el estado de la aplicación y opcionalmente también recibe el estado actual de la aplicación.

```js
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
```

Para ejecutar esta función asincrona, se debe realizar a través de un dispatch del store al cual se le debe pasar la función retornada por el action creator anterior.

```js
store.subscribe(() => console.log(store.getState()));
store.dispatch(fetchUsers());
```
