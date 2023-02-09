import './dashboard.css';
import HeaderBase from "../../component/header/headerBase";
import {useContext, useEffect, useState} from "react";
import {UseNetworkGet} from "../../hooks/UseNetwork";
import { api } from "../../config/api";
import ActionForm from "../action_form/actionForm";
import RouteContext from "../../context/RouteContext";
import AuditTable from "../auditTable/AuditTable";
import IconButton from "@mui/material/IconButton";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';


function Dashboard() {
    const [actionMap, setActionMap] = useState(null);
    const [actionItem, setActionItem] = useState(null);
    const [historyResponse, setHistoryResponse] = useState(null);
    const [page, setPage] = useState(0);
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
    const getHistory = async () => {
        const {data, error} =  await UseNetworkGet(
            `${api.GetHistory}${page}`
        )
        if(data) {
            await setHistoryResponse(data)
        } else {
            console.log("Error in data for history")
            console.log("Error: ", error)
        }
    }

    useEffect(()=>{
        getHistory();
        getActionList();
    }, [])

    useEffect(()=>{
        setActionItem(currentRoute)
    }, [currentRoute])

    useEffect(()=>{
        getHistory()
    }, [page])

    const handlePageChange = async (event, direction, page) => {
        if(direction === "LEFT") {
            if(page > 0) {
                await setPage(page-1)
            }
        } else {
            await setPage(page+1)
        }
    }

    return (
        <>
            <HeaderBase actionMap={actionMap}/>
            <div className="Dashboard-Body">
                {
                    (currentRoute === null && historyResponse) ? (
                        <div className="Audit-Container">
                            <div className="Table-Control-Container">
                                <IconButton
                                    color="primary"
                                    aria-label="add to shopping cart"
                                    onClick={(event)=>handlePageChange(event, "LEFT", page)}
                                    disabled={(page === 0) ? true : false}
                                >
                                    <ArrowCircleLeftIcon />
                                </IconButton>
                                <IconButton
                                    color="primary"
                                    aria-label="add to shopping cart"
                                    onClick={(event)=>handlePageChange(event, "RIGHT", page)}
                                    disabled={(historyResponse && historyResponse.length === 0) ? true : false}
                                >
                                    <ArrowCircleRightIcon />
                                </IconButton>
                            </div>
                            <div className="Table-Container">
                                <AuditTable data={historyResponse} handlePageChange={setPage}/>
                            </div>
                            <div className="Table-Control-Container">
                                <IconButton
                                    color="primary"
                                    aria-label="add to shopping cart"
                                    onClick={(event)=>handlePageChange(event, "LEFT", page)}
                                    disabled={(page === 0) ? true : false}
                                >
                                    <ArrowCircleLeftIcon />
                                </IconButton>
                                <IconButton
                                    color="primary"
                                    aria-label="add to shopping cart"
                                    onClick={(event)=>handlePageChange(event, "RIGHT", page)}
                                    disabled={(historyResponse && historyResponse.length === 0) ? true : false}
                                >
                                    <ArrowCircleRightIcon />
                                </IconButton>
                            </div>
                        </div>
                    ) : (<></>)
                }
                {
                    ( currentRoute!=null && actionMap && actionItem ) ? (
                        <ActionForm actionItem={currentRoute} actionMap={actionMap} />
                    ) : (<></>)
                }
            </div>
        </>
    );
}

export default Dashboard;