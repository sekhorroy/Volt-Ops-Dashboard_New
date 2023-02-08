import Alert from '@mui/material/Alert'

export const AlertTypeToken = Object.freeze({
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
    SUCCESS: "success"
})

/**  **/
const AlertBase = ({
    type,
    message,
}) => {
    if(type === AlertTypeToken.ERROR) {
        return (<Alert severity="error">{message}</Alert>)
    } else if(type === AlertTypeToken.WARNING) {
        return (<Alert severity="warning">{message}</Alert>)
    } else if(type === AlertTypeToken.INFO) {
        return (<Alert severity="info">{message}</Alert>)
    } else {
        return (<Alert severity="success">{message}</Alert>)
    }
}

export default AlertBase