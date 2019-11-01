const INITIAL_STATE = {
  markers: [],
  steps: [],
  selected: null,
  userId: null
};

const routeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        markers: [...state.markers, action.payload.marker],
        steps: action.payload.routeInfo ? [...state.steps, action.payload.routeInfo] : state.steps,
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
        selected: null
      };
    case 'LOG_IN':
      return {
        ...state,
        userId: action.payload.userId
      };
    default:
      return state;
  }
}

export default routeReducer;