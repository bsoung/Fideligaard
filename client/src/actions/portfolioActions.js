export const TRADE = "TRADE";
export const SET_PORTFOLIO_STOCKS = "SET_PORTFOLIO_STOCKS";
export const SET_PORTFOLIO_SORT = "SET_PORTFOLIO_SORT";
export const SET_PORTFOLIO_FILTER = "SET_PORTFOLIO_FILTER";

export const setPortfolioSort = (column, direction) => {
	return {
		type: SET_PORTFOLIO_SORT,
		data: { column, direction }
	};
};

export const setPortfolioFilter = filter => {
	console.log(filter, "filter? in actions");
	return {
		type: SET_PORTFOLIO_FILTER,
		data: filter
	};
};

export const setPortfolioStocks = stocks => {
	return {
		type: SET_PORTFOLIO_STOCKS,
		data: stocks
	};
};

export const makeTrade = (ticker, quantity, cost) => {
	[quantity, cost] = [+quantity, +cost];
	return {
		type: TRADE,
		data: { ticker, quantity, cost }
	};
};
