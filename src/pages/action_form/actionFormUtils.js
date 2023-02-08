export const ACTION_FIELD_TYPE = Object.freeze({
    TEXT_INPUT: 'TEXT_INPUT',
    LABEL: 'LABEL',
    DROPDOWN: 'DROPDOWN',
    LINK: 'LINK',
    ACTION_BUTTON: 'ACTION_BUTTON'
})

/** Function to check if a particular action field type is readonly**/
/** @param(actionFieldType: boolean) **/
export const isReadOnly = (actionFieldType) => {
    if(actionFieldType === ACTION_FIELD_TYPE.LABEL) {
        return false;
    } else if (actionFieldType === ACTION_FIELD_TYPE.TEXT_INPUT) {
        return true;
    } else {
        return false;
    }
}