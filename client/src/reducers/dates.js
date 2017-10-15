import { dateActions } from "../actions";

const defaultState = {
  current: 1451624400000,
  start: 1451624400000,
  end: 1483246800000
};

const dates = (state = defaultState, action) => {
  switch (action.type) {
    case dateActions.SET_CURRENT:
      return { ...state, current: action.data };
    case dateActions.SET_RANGE:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export default dates;
