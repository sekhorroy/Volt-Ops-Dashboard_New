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
     actionMap= {}
}) {
    const [valueMap, setValueMap] = useState(null);
    const [adminActionInfoFieldListResponse, setAdminActionInfoFieldListResponse] = useState(null);
    const [confirmChanges, setConfirmChanges] = useState(false);
    const [reason, setReason] = useState(null);
    const [valueMapLoading, setValueMapPanLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const {currentRoute, dispatch} = useContext(RouteContext)

    const getActionInfo = async (valueMap, actionItem) => {
        let payload = {...valueMap};
        payload["adminAction"] = `${actionItem}`;
        await setValueMapPanLoading(true)
        const {data, error} = await UseNetworkPost(
            `${api.ActionInfo}`,
            payload
        );
        if(data) {
            if(
                data &&
                data.adminActionInfoFieldList &&
                data.adminActionInfoFieldList.length>0
            ) {
                data.adminActionInfoFieldList.forEach((adminActionInfoField, index)=>{
                    if(adminActionInfoField.fieldValues && adminActionInfoField.fieldValues[0]) {
                        data.adminActionInfoFieldList[index].submittedValues = [adminActionInfoField.fieldValues[0]]
                    }
                })
            }
            await setAdminActionInfoFieldListResponse(data);
        }
        if(error) {
            setError(error?.response?.data.message);
            setSuccess(null);
            if(adminActionInfoFieldListResponse) {
                await setAdminActionInfoFieldListResponse(null);
            }
        }
        await setValueMapPanLoading(false)
    }
    const submitAction = async() => {
        await setLoading(true)
        if(!valueMap) {
            setError("required field missing");
            setSuccess(null);
        } else if(!reason) {
            setError("Reason missing");
            setSuccess(null);
        } else {
            const {data, error} = await UseNetworkPost(
                `${api.ActionSubmit}`,
                {
                    "reason": reason,
                    ...adminActionInfoFieldListResponse,
                    ...valueMap,
                }
            )
            if(error) {
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
    const handleValueMapChange = async(event, item) => {
        // console.log("event VM : ", event);
        // console.log("event Item : ", item);
        let value_Map = valueMap;
        value_Map[item] = event.target.value;
        await setValueMap(value_Map);
        console.log(valueMap)
    }
    const handleReasonChange = async (event) => {
        await setReason(event.target.value);
    }
    const handleConfirmChange = async () => {
        await setConfirmChanges(true)
    }
    const handleFormChange = (event, fieldName) => {
        event.preventDefault();
        adminActionInfoFieldListResponse.adminActionInfoFieldList.forEach((actionItem, index) => {
            if( adminActionInfoFieldListResponse.adminActionInfoFieldList[index] &&
                actionItem.fieldName === fieldName) {
                    adminActionInfoFieldListResponse.adminActionInfoFieldList[index].submittedValues = [event.target.value]
                }
        });
        setAdminActionInfoFieldListResponse({...adminActionInfoFieldListResponse})
        console.log("setAdminActionInfoFieldListResponse: ", setAdminActionInfoFieldListResponse)
    }

    useEffect(()=> {
        // create a key value map from the requiredParam action
        let value_Map = new Map();
        actionMap[actionItem].requiredParams.forEach((item, index) => {
            value_Map[item] =  '';
        })
        setValueMap(value_Map);
    }, [])

    useEffect(()=>{
        setError(null);
        setSuccess(null);
        setAdminActionInfoFieldListResponse(null);
        setReason(null);
        setConfirmChanges(false);
    }, [currentRoute])

    useEffect(()=>{
        console.log("action item response changed");
    }, [adminActionInfoFieldListResponse])

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
                            <div>{actionMap[actionItem].displayName}</div>
                            <div className="Pan-Card-Container">
                                {
                                    actionMap[actionItem] &&
                                    actionMap[actionItem].requiredParams &&
                                    actionMap[actionItem].requiredParams.map((item, index)=>(
                                        <>
                                            <TextField
                                                id="outlined-basic"
                                                label={item}
                                                variant="outlined"
                                                required={true}
                                                onChange={(event)=>handleValueMapChange(event, item)}
                                            />
                                        </>
                                    ))
                                }
                                <LoadingButton
                                    loading={valueMapLoading}
                                    variant="outlined"
                                    onClick={() => getActionInfo(valueMap, actionItem)}
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
                                                    value={actionInfoItem && actionInfoItem.submittedValues && actionInfoItem.submittedValues[0] ? actionInfoItem.submittedValues[0] : ''}
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