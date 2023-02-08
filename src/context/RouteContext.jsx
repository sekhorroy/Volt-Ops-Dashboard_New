import React, {useReducer, createContext} from 'react';

const RouteContextState = {
    currentRoute: null
}

export const RouteContext = createContext(RouteContextState);

const RouteReducer = (state, action) => {
    // based on the action type we provide
    // it returns us the state (action.payload)
    switch(action.type) {
        case "CHANGE_ROUTE":
            return {
                currentRoute: action.payload,
            }
        default:
            return state;
    }
}

export const RouteContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(RouteReducer, RouteContextState)
    return (
        <RouteContext.Provider value={{
            currentRoute: state.currentRoute,
            dispatch
        }}>
            {children}
        </RouteContext.Provider>
    );
}

export default RouteContext;