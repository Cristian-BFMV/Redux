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
