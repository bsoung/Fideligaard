import { portfolioActions } from "../actions";

const defaultState = {
  balance: 100000,
  stocks: {}
};

const dates = (state = defaultState, action) => {
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

      return { balance, stocks };
    default:
      return state;
  }
};

export default dates;
