export const SET_TRADE_MODEL_VISIBILITY = 'SET_TRADE_MODEL_VISIBILITY'

export const setTradeModelVisibilitySuccess = (isVisible) => ({
    type: SET_TRADE_MODEL_VISIBILITY,
    payload: {isVisible}
})

export function setTradeModelVisibility(isVisible) {
    return dispatch => {
        dispatch(setTradeModelVisibilitySuccess(isVisible))
    }
}