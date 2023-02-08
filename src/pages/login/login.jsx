import "./login.css"
import {Avatar, TextField} from "@mui/material";
import {useState} from "react";
import {api,} from '../../config/api';
import {UseNetworkGet, UseNetworkPost} from "../../hooks/UseNetwork";
import LoadingButton from "@mui/lab/LoadingButton";
import {BaseRoute, LOCAL_STORAGE_KEYS, setInLocalStorage} from "../../config/utils";
import AlertBase, {AlertTypeToken} from "../../component/alert/alertBase";
import Typography from "@mui/material/Typography";
import PinIcon from '@mui/icons-material/Pin';
import Card from "@mui/material/Card";
import {useNavigate} from "react-router-dom";

function Login() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [submitPhoneNumber, setSubmitPhoneNumber] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigation = useNavigate()


    const  handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value)
    }
    const  handleOtpChange = async(event) => {
        await setOtp(event.target.value)
    }
    const handlePhoneNumberSubmit = async () => {
        await setLoading(true)
        if(phoneNumber && phoneNumber.length === 10) {
             await setSubmitPhoneNumber(true)
             const {data, error} = await UseNetworkGet(`${api.RequestOtp}+91${phoneNumber}`, {
                 "content-type": "application/json"
             });
            if(data && data.status === "SUCCESS") {
                //alert(data.message)
                await setSuccess(data.message);
                await setError(null);
                //
                // navigation(BaseRoute)
            }
            if(error) {
                //alert(error?.response?.data.message)
                await setError(error?.response?.data.message);
                await setSuccess(null)
            }
        } else {
            //alert("Enter a valid phone number");
            await setError("Enter a valid phone number");
            await setSuccess(null);
        }
        await setLoading(false)
    }
    const handleOtpSubmit = async () => {
        await setLoading(true)
        if(otp && phoneNumber && phoneNumber.length === 10) {
            const {data, error} = await UseNetworkPost(`${api.VerifyOtp}`, {
                "otp": otp,
                "phoneNo": `+91${phoneNumber}`
            });
            if(data) {
               await setInLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN, data.jwt);
               await setInLocalStorage(LOCAL_STORAGE_KEYS.USER, data.user);
               //force reload to update conditional rendering
               window.location.reload(false);
            }
            if(error) {
                await setError(error.response.data.message);
                await setSuccess(null);
            }
        } else {
            await setError("Enter otp");
            await setSuccess(null);
        }
        await setLoading(false)
    }

    return (
        <div className="LoginContainer">
            <div className="LoginContainer-App">
                <Card>
                    <div className="LoginContainer-App-Top">
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <PinIcon />
                        </Avatar>
                        <Typography component="h6" variant="h6">
                            Volt admin login
                        </Typography>
                    </div>
                </Card>

                    <div>
                        {
                            !submitPhoneNumber ? (
                                <div className="LoginContainer-App-PhoneNumber" style={submitPhoneNumber?{height: "auto"}:{height: 0}}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Enter registered phone number"
                                        variant="outlined"
                                        value={phoneNumber}
                                        onChange={(event)=>handlePhoneNumberChange(event)}
                                    />
                                    <LoadingButton
                                        variant="contained"
                                        loading={loading}
                                        onClick={()=>handlePhoneNumberSubmit()}
                                    >Get otp</LoadingButton>
                                    {
                                        error ? (<AlertBase type={AlertTypeToken.ERROR} message={error}/>) : (<></>)
                                    }
                                    {
                                        success ? (<AlertBase type={AlertTypeToken.SUCCESS} message={success}/>) : (<></>)
                                    }
                                </div>
                            ):(
                                <div className="LoginContainer-App-OTP" style={!submitPhoneNumber?{height: 0}:{height: "auto"}}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Enter Otp"
                                        variant="outlined"
                                        value={otp}
                                        onChange={(event)=>handleOtpChange(event)}
                                    />
                                    <LoadingButton
                                        variant="contained"
                                        loading={loading}
                                        onClick={()=>handleOtpSubmit()}
                                    >Submit Otp</LoadingButton>
                                    {
                                        error ? (<AlertBase type={AlertTypeToken.ERROR} message={error}/>) : (<></>)
                                    }
                                    {
                                        success ? (<AlertBase type={AlertTypeToken.SUCCESS} message={success}/>) : (<></>)
                                    }
                                </div>
                            )
                        }
                    </div>
            </div>
        </div>
    );
}

export default Login;