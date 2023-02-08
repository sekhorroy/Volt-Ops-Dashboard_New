import axios from "axios";

export const UseNetworkGet = async (url) => {
    let data  = null;
    let error = null;

    try {
        const response = await axios.get(`${url}`,
            {
                headers:  {
                    "content-type": "application/json"
                }
            })
        data = response.data
        error = null;
    } catch (err) {
        data = null;
        error = err
    }
    return {data, error}
}

export const UseNetworkPost = async(url, body) => {
    let data  = null
    let error = null;

    try {
        const response = await axios.post(
            `${url}`,
            body,
            {
                headers: {
                    "content-type": "application/json"
                }
            })
        data = response.data
        error = null;
    } catch (err) {
        data = null;
        error = err
    }
    return {data, error}
}