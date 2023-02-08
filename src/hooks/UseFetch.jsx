import {useEffect, useState} from "react";
import axios from "axios";

const UseFetch = (url) => {
    const [data, setData]  = useState(null)
    const [loading, setLoading]  = useState(false)
    const [error, setError]  = useState(null)

    useEffect(()=>{
        // an async function is declared as the get request may take some time
        const fetchData = async() => {
            setLoading(true)
            try {
                const response = await axios.get(url)
                setData(response.data)
            } catch (error) {
                setError(error)
            }
            setLoading(false)
        }
        fetchData();
    }, [])

    const reFetch = async() => {
        setLoading(true)
        try {
            const response = await axios.get(url)
            setData(response.data)
        } catch (error) {
            setError(error)
        }
        setLoading(false)
    }

    // we are returning this as we have created a hook
    // just like useState or useEffect
    return {data, loading, error, reFetch}
}

export default UseFetch