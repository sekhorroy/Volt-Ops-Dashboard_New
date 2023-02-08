import React, {useReducer, createContext} from 'react';

const GlobalContext = {
    openMenu: false,
    loading: false,
    error: null,
    user: null,
}
export const AppContext = createContext(GlobalContext);

const AppReducer = (state, action) => {
    // based on the action type we provide ..
    // it returns us the state (action.payload)

    console.log("action.type: ", action.type)

    switch(action.type) {
        case "LOGIN_START":
            return {
                loading: true,
                user: null,
                error: null,
                openMenu: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                loading: false,
                error: null,
                openMenu: false,
            };
        case "LOGIN_FAILURE":
            return {
                loading: false,
                error: action.payload,
                user: null,
                openMenu: false,
            };
        case "LOGOUT_SUCCESS":
            return {
                loading: false,
                error: null,
                user: null,
                openMenu: false,
            };
        case "OPEN_MENU":
            return ()=>{
                GlobalContext.openMenu = false
                console.log("GlobalContext: ", GlobalContext)
            }
        case "CLOSE_MENU":
            return GlobalContext.openMenu = true
        default:
            return state;
    }
}


export const AppContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, GlobalContext)
    // useEffect(()=>{
    //     localStorage.setItem("user", JSON.stringify(state.user))
    //     console.log(localStorage.getItem("user"))
    // }, [state.user])

    return (
        <AppContext.Provider value={{
            user: state.user,
            error :state.error,
            loading:state.loading,
            openMenu: state.openMenu,
            dispatch}
        }>
            {children}
        </AppContext.Provider>
    );
}