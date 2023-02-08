import './dashboard.css';
import HeaderBase from "../../component/header/headerBase";
import {Route, Routes} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UseNetworkGet} from "../../hooks/UseNetwork";
import { api } from "../../config/api";
import ActionForm from "../action_form/actionForm";
import RouteContext from "../../context/RouteContext";

function Dashboard() {
    const [actionMap, setActionMap] = useState(null);
    const [actionItem, setActionItem] = useState(null);
    const {currentRoute, dispatch} = useContext(RouteContext)

    const getActionList = async () => {
        const {data, error} =  await UseNetworkGet(
           `${api.ActionList}`
        )
        if(data) {
            await setActionMap(data);
        } else {
            console.log("Error in data fetching for action list")
            console.log("Error: ", error)
        }
    }

    useEffect(()=>{
        getActionList()
    }, [])

    useEffect(()=>{
        setActionItem(currentRoute)
    }, [currentRoute])

    return (
        <>
            <HeaderBase actionMap={actionMap}/>
            <div className="Dashboard-Body">
                {
                    ( actionMap && actionItem ) ? (
                        <ActionForm actionItem={currentRoute} actionMap={actionMap} />
                    ) : (<></>)
                }
            </div>
        </>
    );
}

export default Dashboard;