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
  let updatedPins;

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
      updatedPins = [...state.pins];
      
      let updated;
      let swapTo;
      for (let i of [0, 1]) {
        updated = {...action.payload.pins[i]};
        swapTo = (i + 1) % 2;
        updatedPins[action.payload.indices[swapTo]] = updated;
      }

      return {
        ...state,
        pins: updatedPins
      };
    case 'EDIT_ROUTE_NAME':
      return {
        ...state,
        name: action.payload.name
      };
    case 'VIEW_PLACE_DETAIL':
      return {
        ...state,
        selected: action.payload.selectedIndex
      };
    case 'UPDATE_PIN':
      updatedPins = [...state.pins];
      let updatedPin = {...state.pins[action.payload.index]};
      updatedPin.properties = {
        ...updatedPin.properties,
        ...action.payload.data
      };
      updatedPins[action.payload.index] = updatedPin;

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
