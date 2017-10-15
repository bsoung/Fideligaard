export const SET_CURRENT = "SET_CURRENT";
export const SET_RANGE = "SET_RANGE";

export const setCurrent = date => {
  return {
    type: SET_CURRENT,
    data: date
  };
};

export const setRange = (start, end) => {
  return {
    type: SET_RANGE,
    data: { start, end }
  };
};
