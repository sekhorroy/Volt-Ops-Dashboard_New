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