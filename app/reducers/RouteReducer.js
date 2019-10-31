const INITIAL_STATE = {
    markers: [],
    selected: null
};

const routeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD':
            return {
                ...state,
                markers: [...state.markers, action.payload.marker]
            };
        case 'REMOVE':
            return {
                ...state,
                markers: state.markers.filter(marker => marker.properties.placeId != action.payload.id)
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
                selected: null
            };
        default:
            return state;

    }
}

export default routeReducer;