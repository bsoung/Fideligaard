import { portfolioActions } from "../actions";

const defaultState = {
  balance: 100000,
  dates: [],
  stocks: {},
  fullStocks: [],
  sort: {
    column: "Ticker",
    direction: true
  },
  filter: ""
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case portfolioActions.TRADE:
      const { cost, ticker, quantity } = action.data;
      const balance = +(state.balance - cost).toFixed(2);
      const stocks = { ...state.stocks };
      const number = state.stocks[ticker]
        ? state.stocks[ticker] + quantity
        : quantity;

      if (number) {
        stocks[ticker] = number;
      } else {
        delete stocks[ticker];
      }

      return { ...state, balance, stocks };

    case portfolioActions.SET_PORTFOLIO_STOCKS:
      return { ...state, fullStocks: action.data };
    case portfolioActions.SET_PORTFOLIO_SORT:
      return { ...state, sort: action.data };
    case portfolioActions.SET_PORTFOLIO_FILTER:
      return { ...state, filter: action.data };
    default:
      return state;
  }
};
