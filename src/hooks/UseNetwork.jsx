import axios from "axios";
import {getFromLocalStorage, LOCAL_STORAGE_KEYS, setInLocalStorage} from "../config/utils";

export const UseNetworkGet = async (url, headerOptions) => {
    let data  = null;
    let error = null;

    try {
        const response = await axios.get(`${url}`,
            {
                headers: headerOptions ? headerOptions : {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${JSON.parse(getFromLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN))}`
                }
            })
        data = response.data
        error = null;
    } catch (err) {
        //Logout user on forbidden request
        // if(err.response.status === 403) {
        //     await setInLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
        //     await setInLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
        // }
        data = null;
        error = err
    }
    return {data, error}
}

export const UseNetworkPost = async(url, body, headerOptions) => {
    let data  = null
    let error = null;

    try {
        const response = await axios.post(
            `${url}`,
            body,
            {
                headers: headerOptions ? headerOptions : {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${JSON.parse(getFromLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN))}`
                }
            })
        data = response.data
        error = null;
    } catch (err) {
        // if(err.response.status === 403) {
        //     //Logout user on forbidden request
        //     await setInLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
        //     await setInLocalStorage(LOCAL_STORAGE_KEYS.AUTH_TOKEN, null);
        // }
        data = null;
        error = err
    }
    return {data, error}
}