import { statusActions } from "../actions";

const status = (state = { isFetching: false, error: null }, action) => {
  switch (action.type) {
    case statusActions.SET_FETCHING:
      return { error: null, isFetching: true };
    case statusActions.SET_ERROR:
      return { isFetching: false, error: action.error };
    case statusActions.SET_SUCCESS:
      return { isFetching: false, error: null };
    default:
      return state;
  }
};

export default status;
