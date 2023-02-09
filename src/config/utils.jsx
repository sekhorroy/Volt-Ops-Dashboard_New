export const LOCAL_STORAGE_KEYS = Object.freeze({
    USER: "USER",
    AUTH_TOKEN: "AUTH_TOKEN"
})
export const BaseRoute = ''
export const setInLocalStorage = async (key, value) => {
    await localStorage.setItem(key, JSON.stringify(value))
}
export const getFromLocalStorage = (key) => {
    const result = localStorage.getItem(key);
    return result
}

export const convertEpochToDateAndTime = (epochTime) => {
    let date = new Date(epochTime);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    return `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}`;
}