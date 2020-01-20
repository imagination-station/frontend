const INITIAL_STATE = {
  user: null,
  accessToken: null,
  friends: null,
  friendReqs: null,
  people: {},
  // route flattened for easy updating
  name: null,
  creator: null,
  location: null,
  pins: null,
  tags: null,
  collaborators: null,
  // for selecting & editing place
  selected: null,
  selectedBuf: null, // buffer to save intermediate changes
  refresh: false
};

const peopleReducer = (accumulator, cur) => {
  accumulator[cur._id] = cur.status;
  return accumulator;
}

const routeReducer = (state = INITIAL_STATE, action) => {
  let updatedPins;
  let newPeople;

  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        people: {[action.payload.user._id]: 'SELF'}
      };
    case 'SET_FRIENDS':
      newPeople = {...state.people};

      return {
        ...state,
        friends: action.payload.friends,
        people: action.payload.friends
          .map(elem => ({...elem, status: 'ADDED'}))
          .reduce(peopleReducer, newPeople)
      };
    case 'SET_FRIEND_REQS':
      newPeople = {...state.people};

      newPeople = action.payload.reqs.received
        .map(elem => ({...elem, status: 'RECEIVED'}))
        .reduce(peopleReducer, newPeople);

      newPeople = action.payload.reqs.sent
        .map(elem => ({...elem, status: 'SENT'}))
        .reduce(peopleReducer, newPeople);

      return {
        ...state,
        friendReqs: action.payload.reqs,
        people: newPeople
      };
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.payload.token
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
      let selectedBuf = {...state.pins[action.payload.selectedIndex]};
      selectedBuf.properties = {...selectedBuf.properties};
      selectedBuf.properties.photoRefs = [...selectedBuf.properties.photoRefs];

      return {
        ...state,
        selected: action.payload.selectedIndex,
        selectedBuf: selectedBuf
      };
    case 'UPDATE_PIN':
      updatedPin = {...state.selectedBuf};
      updatedPin.properties = {
        ...updatedPin.properties,
        ...action.payload.data
      };

      return {
        ...state,
        selectedBuf: updatedPin  
      };
    case 'COMMIT_PIN':
      updatedPins = [...state.pins];
      updatedPins[state.selected] = state.selectedBuf;

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
        collaborators: null
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
