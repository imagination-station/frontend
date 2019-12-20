const INITIAL_STATE = {
  selected: null,
  user: null,
  refresh: false,
  // route flattened for easy updating
  name: null,
  creator: null,
  location: null,
  pins: null,
  tags: null,
};

const routeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user
      };
    case 'LOAD_ROUTE':
      return {
        ...state,
        ...action.payload.route
      };
    case 'ADD_PIN':
      return {
        ...state,
        pins: state.pins ? [...state.pins, action.payload.pin] : [action.payload.pin]
      };
    case 'REMOVE_PIN':
      return {
        ...state,
        pins: state.pins.filter((pin, index) => index != action.payload.indexToRemove)
      };
    case 'SWAP_PINS':
      let newPins = [...state.pins];
      const temp = newPins[action.payload.a];
      newPins[action.payload.a] = newPins[action.payload.b];
      newPins[action.payload.b] = temp;
      
      return {
        ...state,
        pins: newPins
      };
    case 'VIEW_PLACE_DETAIL':
      return {
        ...state,
        selected: action.payload.selectedIndex
      };
    case 'UPDATE_PIN':
      let updatedPins = [...state.pins];
      let updatedPin = {...state.pins[state.selected]};
      updatedPin.properties = {
        ...updatedPin.properties,
        ...action.payload.data,
      };
      updatedPins[state.selected] = updatedPin;

      return {
        ...state,
        pins: updatedPins  
      };
    case 'CLEAR':
      return {
        ...state,
        selected: null,
        name: null,
        creator: null,
        location: null,
        pins: null,
        tags: null,
      };
    case 'TOGGLE_REFRESH':
      return {
        ...state,
        refresh: !state.refresh
      };
    default:
      return state;
  }
}

export default routeReducer;
