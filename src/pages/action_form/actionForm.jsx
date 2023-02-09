import './actionForm.css';
import Card from '@mui/material/Card';
import {MenuItem, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useContext, useEffect, useState} from "react";
import {UseNetworkPost} from "../../hooks/UseNetwork";
import {api} from "../../config/api";
import {ACTION_FIELD_TYPE} from "./actionFormUtils";
import LoadingButton from '@mui/lab/LoadingButton';
import AlertBase, {AlertTypeToken} from "../../component/alert/alertBase";
import RouteContext from "../../context/RouteContext";


function ActionForm({
     actionItem = {},
     actionMap={}
}) {
    const [pan, setPan] = useState(null);
    // ** We are storing the response as we need to send it back to the as a req body for the
    const [adminActionInfoFieldListResponse, setAdminActionInfoFieldListResponse] = useState(null);
    const [confirmChanges, setConfirmChanges] = useState(false);
    const [reason, setReason] = useState(null);
    const [panLoading, setPanLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const {currentRoute, dispatch} = useContext(RouteContext)

    const getActionInfo = async (pan, actionItem) => {
        await setPanLoading(true)
        const {data, error} = await UseNetworkPost(
            `${api.ActionInfo}`,
            {
                    "adminAction": `${actionItem}`,
                    "panNumber": `${pan}`
                }
        );
        if(data) {
            await setAdminActionInfoFieldListResponse(data);
        }
        if(error) {
            setError(error?.response?.data.message);
            setSuccess(null);
            if(adminActionInfoFieldListResponse) {
                await setAdminActionInfoFieldListResponse(null);
            }
        }
        await setPanLoading(false)
    }
    const submitAction = async() => {
        await setLoading(true)
        if(!pan) {
            //alert("Pan missing");
            setError("Pan missing");
            setSuccess(null);
        } else if(!reason) {
            //alert("Reason missing");
            setError("Reason missing");
            setSuccess(null);
        } else {
            const {data, error} = await UseNetworkPost(
                `${api.ActionSubmit}`,
                adminActionInfoFieldListResponse
            )
            if(error) {
                //alert(error?.response?.data.message)
                setError(error?.response?.data.message);
                setSuccess(null);
                setAdminActionInfoFieldListResponse(null);
            }
            if(data) {
                setSuccess(data?.message);
                setError(null);
                setAdminActionInfoFieldListResponse(null);
            }
        }
        await setLoading(false)
    }
    const handlePanChange = async (event) => {
        await setPan(event.target.value);
    }
    const handleReasonChange = async (event) => {
        await setReason(event.target.value);
    }
    const handleConfirmChange = async () => {
        await setConfirmChanges(true)
    }
    const handleFormChange = async(event, fieldName) => {
        event.preventDefault();
        adminActionInfoFieldListResponse.adminActionInfoFieldList.forEach((actionItem, index) => {
            if( adminActionInfoFieldListResponse.adminActionInfoFieldList[index] &&
                actionItem.fieldName === fieldName) {
                    adminActionInfoFieldListResponse.adminActionInfoFieldList[index].submittedValues = [event.target.value]
            }
        });
        await setAdminActionInfoFieldListResponse(adminActionInfoFieldListResponse)
        console.log("adminActionInfoFieldListResponse Updated: ", adminActionInfoFieldListResponse)
    }

    useEffect(()=>{
        setError(null);
        setSuccess(null);
        setAdminActionInfoFieldListResponse(null);
        setReason(null);
        setConfirmChanges(false);
    }, [currentRoute])

    return (
        <>
            <div className="Action-Body">
                <div className="Action-Body-Info-Container">
                    <Card
                    >
                        <div className="Card-Container">
                            {
                                error ? (
                                    <AlertBase type={AlertTypeToken.ERROR} message={error}/>
                                ) : (<></>)
                            }
                            {
                                success ? (
                                    <AlertBase type={AlertTypeToken.SUCCESS} message={success}/>
                                ) : (<></>)
                            }
                            <div>{actionMap[actionItem]}</div>
                            <div className="Pan-Card-Container">
                                <TextField
                                    id="outlined-basic"
                                    label="Enter pan number"
                                    variant="outlined"
                                    onChange={(event)=>handlePanChange(event)}
                                />
                                <LoadingButton
                                    loading={panLoading}
                                    variant="outlined"
                                    onClick={() => getActionInfo(pan, actionItem)}
                                >
                                    Submit
                                </LoadingButton>
                            </div>
                            <div className="Form_Item_Container">
                                {
                                    adminActionInfoFieldListResponse &&
                                    adminActionInfoFieldListResponse.adminActionInfoFieldList &&
                                    adminActionInfoFieldListResponse.adminActionInfoFieldList.map((actionInfoItem)=>{
                                        if(actionInfoItem && actionInfoItem.fieldType === ACTION_FIELD_TYPE.LABEL) {
                                            return(
                                                <TextField
                                                    id={actionInfoItem.fieldName}
                                                    key={actionInfoItem.fieldName.toString()}
                                                    label={actionInfoItem.fieldName}
                                                    variant="outlined"
                                                    disabled={true}
                                                    value={actionInfoItem.fieldValues[0]}
                                                />
                                            )
                                        }
                                        if(actionInfoItem && actionInfoItem.fieldType === ACTION_FIELD_TYPE.TEXT_INPUT) {
                                            return(
                                                <TextField
                                                    id={actionInfoItem.fieldName}
                                                    key={actionInfoItem.fieldName.toString()}
                                                    label={actionInfoItem.fieldName}
                                                    variant="outlined"
                                                    onChange={(event)=>{handleFormChange(event, actionInfoItem.fieldName)}}
                                                />
                                            )
                                        }
                                        if(actionInfoItem && actionInfoItem.fieldType === ACTION_FIELD_TYPE.LINK) {
                                            return (
                                                <a
                                                    href={actionInfoItem.fieldValues[0]}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {actionInfoItem.fieldName}
                                                </a>
                                            )
                                        }
                                        if(actionInfoItem && actionInfoItem.fieldType === ACTION_FIELD_TYPE.DROPDOWN) {
                                            return (
                                                <TextField
                                                    id={actionInfoItem.fieldName}
                                                    select
                                                    key={actionInfoItem.fieldName.toString()}
                                                    label={actionInfoItem.fieldName}
                                                    defaultValue={actionInfoItem.fieldValues[0]}
                                                    onChange={(event)=>{handleFormChange(event, actionInfoItem.fieldName)}}
                                                >
                                                    {actionInfoItem && actionInfoItem.fieldValues.map((option, index) => (
                                                        <MenuItem key={index+option} value={option} >
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )
                                        }
                                        if( actionInfoItem &&
                                            actionInfoItem.fieldType === ACTION_FIELD_TYPE.ACTION_BUTTON )
                                        {
                                            return (
                                                <></>
                                            )
                                        }
                                    })
                                }
                                {
                                    (
                                        !confirmChanges &&
                                        adminActionInfoFieldListResponse &&
                                        adminActionInfoFieldListResponse.adminActionInfoFieldList
                                    ) ?
                                        <Button
                                            variant="contained"
                                            onClick={()=>handleConfirmChange()}
                                        >Confirm change</Button> : <></>
                                }
                                {
                                    (
                                        confirmChanges  &&
                                        adminActionInfoFieldListResponse &&
                                        adminActionInfoFieldListResponse.adminActionInfoFieldList
                                    ) ? (
                                        <>
                                            <TextField
                                                id="outlined-basic"
                                                label="Enter reason for this change"
                                                value={reason}
                                                variant="outlined"
                                                onChange={(event)=>handleReasonChange(event)}
                                            />
                                            <LoadingButton
                                                variant="contained"
                                                loading={loading}
                                                onClick={()=>submitAction()}
                                            >Submit</LoadingButton>
                                        </>
                                    ): (<></>)
                                }
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default ActionForm;