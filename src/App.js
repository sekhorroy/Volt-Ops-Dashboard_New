import "./App.css";
import {Route, Routes} from "react-router-dom";
import Login from './pages/login/login';
import Dashboard from "./pages/dashboard/dashboard";
import {AppContextProvider} from "./context/AppContext";
import {useEffect, useState} from "react";
import {BaseRoute, getFromLocalStorage, LOCAL_STORAGE_KEYS} from "./config/utils";
import {RouteContextProvider} from "./context/RouteContext";

function App() {
  const[authKey, setAuthKey] = useState(null)
  useEffect(()=>{
      const key = getFromLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
      console.log("key: ", key)
      setAuthKey(key)
  }, [])
  return (
    <div className="App">
            <RouteContextProvider>
                {
                    !authKey ?
                        <Login /> :
                        <Routes>
                            <Route path={BaseRoute+'/*'} element={<Dashboard />} />
                        </Routes>
                }
           </RouteContextProvider>
    </div>
  );
}

export default App;
