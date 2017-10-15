import { stockActions } from "../actions";

const defaultState = {
  symbols: [],
  dates: [],
  records: {},
  sort: {
    column: "Ticker",
    direction: true
  },
  filter: ""
};

const dates = (state = defaultState, action) => {
  switch (action.type) {
    case stockActions.SET_STOCKS:
      console.log(action.data, "do we set new stocks?????????");
      return { ...state, ...action.data };
    case stockActions.SET_SORT:
      return { ...state, sort: action.data };
    case stockActions.SET_FILTER:
      return { ...state, filter: action.data };
    default:
      return state;
  }
};

export default dates;
