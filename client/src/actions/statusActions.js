export const SET_FETCHING = "SET_FETCHING";
export const SET_ERROR = "SET_ERROR";
export const SET_SUCCESS = "SET_SUCCESS";

export const setFetching = () => {
  return {
    type: SET_FETCHING
  };
};

export const setSuccess = () => {
  return {
    type: SET_SUCCESS
  };
};

export const setError = msg => {
  return {
    type: SET_ERROR,
    error: msg
  };
};
