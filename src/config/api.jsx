import {BUILD_TYPE, BUILD_TYPE_OPTIONS} from "./config";
const BaseUrl = (BUILD_TYPE === BUILD_TYPE_OPTIONS.STAGING) ? 'https://api.staging.voltmoney.in' : 'https://api.voltmoney.in'
export const api = {
    RequestOtp: `${BaseUrl}/admin/auth/requestOtp/`,
    VerifyOtp: `${BaseUrl}/admin/auth/verifyOtp`,
    ActionInfo: `${BaseUrl}/admin/action/info`,
    ActionList: `${BaseUrl}/admin/action/list`,
    ActionSubmit: `${BaseUrl}/admin/action/submit`,
    GetHistory: `${BaseUrl}/admin/action/history/`
}



