const INITIAL_STATE = {
  user: null,
  friends: null,
  friendReqs: null,
  people: {},
  // route flattened for easy updating
  name: null,
  creator: null,
  city: null,
  pins: null,
  tags: null,
  _id: null,
  collaborators: null,
  collaboratorsSet: null,
  lastModified: null,
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
  let collaborators;
  let collaboratorsSet;

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

      action.payload.reqs.received
        .map(elem => ({...elem, status: 'RECEIVED'}))
        .reduce(peopleReducer, newPeople);

      action.payload.reqs.sent
        .map(elem => ({...elem, status: 'SENT'}))
        .reduce(peopleReducer, newPeople);

      return {
        ...state,
        friendReqs: action.payload.reqs,
        people: newPeople
      };
    case 'LOAD_ROUTE':
      return {
        ...state,
        ...action.payload.route,
        collaboratorsSet: new Set(action.payload.route.collaborators.map(elem => elem._id))
      };
    case 'SET_PINS':
      return {
        ...state,
        pins: action.payload.pins,
        refresh: true
      };
    case 'ADD_PIN':
      return {
        ...state,
        pins: state.pins ? [...state.pins, action.payload.pin] : [action.payload.pin],
        refresh: true
      };
    case 'REMOVE_PIN':
      return {
        ...state,
        pins: state.pins.filter((pin, index) => index != action.payload.indexToRemove),
        refresh: true
      };
    case 'SET_ROUTE_NAME':
      return {
        ...state,
        name: action.payload.name
      };
    case 'ADD_COLLABORATOR':
      collaborators = [...state.collaborators];
      collaboratorsSet = new Set(state.collaborators);

      collaborators.push(action.payload.collaborator);
      collaboratorsSet.add(action.payload.collaborator._id);

      return {
        ...state,
        collaborators: collaborators,
        collaboratorsSet: collaboratorsSet
      };
    case 'REMOVE_COLLABORATOR':
      collaborators = state.collaborators.filter(elem => elem._id != action.payload.id);
      collaboratorsSet = new Set(collaborators);

      return {
        ...state,
        collaborators: collaborators,
        collaboratorsSet: collaboratorsSet
      };
    case 'VIEW_PLACE_DETAILS':
      let selectedBuf = {...state.pins[action.payload.selectedIndex]};

      return {
        ...state,
        selected: action.payload.selectedIndex,
        selectedBuf: selectedBuf
      };
    case 'UPDATE_SELECTED':
      updatedPin = {...state.selectedBuf};

      // update with given data
      updatedPin.properties = {
        ...updatedPin.properties,
        ...action.payload.data
      };

      return {
        ...state,
        selectedBuf: updatedPin,
        refresh: true 
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
        city: null,
        pins: null,
        tags: null,
        _id: null,
        collaborators: null,
        collaboratorsSet: null,
        lastModified: null
      };
    case 'SET_REFRESH':
      return {
        ...state,
        refresh: action.payload.refresh
      };
    case 'SET_LAST_MODIFIED':
      return {
        ...state,
        lastModified: action.payload.lastModified 
      };
    default:
      return state;
  }
}

export default routeReducer;
