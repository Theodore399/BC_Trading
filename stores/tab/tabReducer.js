import * as tabActionTypes from './tabActions';

const initialState = {
    isTradeModelVisible: false
}

 const tabReducer = (state = initialState, action) => {
    switch (action.type) {
        case tabActionTypes.SET_TRADE_MODEL_VISIBILITY:
            return {
                ...state,
                isTradeModelVisible: action.payload.isVisible
            }
        default:
            return state
    }
 }

 export default tabReducer;