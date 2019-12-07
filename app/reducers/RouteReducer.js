const INITIAL_STATE = {
  markers: [],
  steps: [],
  selected: null,
  userId: null,
  refresh: false,
};

const routeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        markers: [...state.markers, action.payload.marker],
        steps: action.payload.distance ? [...state.steps, action.payload.distance] : state.steps
      };
    case 'REMOVE':
      let indexToRemove;
      return {
        ...state,
        markers: state.markers.filter((marker, index) => {
          if (marker.properties.placeId == action.payload.id) {
            if (index == state.markers.length - 1) {
              indexToRemove = state.steps.length - 1;
            } else {
              indexToRemove = index;
            }
            return false;
          }

          return true;
        }),
        steps: state.steps.filter((_, index) => index != indexToRemove),
      };
    case 'SWAP':
      let newMarkers = [...state.markers];
      const temp = newMarkers[action.payload.a];
      newMarkers[action.payload.a] = newMarkers[action.payload.b];
      newMarkers[action.payload.b] = temp;
      
      return {
        ...state,
        markers: newMarkers
      };
    case 'VIEW_DETAIL':
      return {
        ...state,
        selected: action.payload.selectedIndex
      };
    case 'UPDATE':
      let updatedMarkers = [...state.markers];
      let updatedMarker = {...state.markers[state.selected]};
      updatedMarker.properties = {
        ...updatedMarker.properties,
        note: action.payload.note
      };
      updatedMarkers[state.selected] = updatedMarker;

      return {
        ...state,
        markers: updatedMarkers  
      };
    case 'CLEAR':
      return {
        markers: [],
        steps: [],
        selected: null,
        showRoute: null
      };
    case 'LOG_IN':
      return {
        ...state,
        userId: action.payload.userId
      };
    case 'LOAD_ROUTE':
      return {
        ...state,
        markers: action.payload.markers,
        steps: action.payload.steps
      };
    case 'SELECT_ROUTE':
      return {
        ...state,
        showRoute: action.payload.selectedIndex
      };
    case 'CLEAR_ROUTE':
      return {
        ...state,
        showRoute: null
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
