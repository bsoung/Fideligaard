import { setFetching, setSuccess, setError } from "./statusActions.js";
import { setRange, setCurrent } from "./dateActions";
import { FetchError } from "../lib/errors";

export const SET_STOCKS = "SET_STOCKS";
export const SET_SORT = "SET_SORT";
export const SET_FILTER = "SET_FILTER";

export const setSort = (column, direction) => {
  return {
    type: SET_SORT,
    data: { column, direction }
  };
};

export const setFilter = filter => {
  return {
    type: SET_FILTER,
    data: filter
  };
};

const setStocks = stocks => {
  return {
    type: SET_STOCKS,
    data: stocks
  };
};

const ensureFetch = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new FetchError(response);
  }
  return response.json();
};

export const hydrateStocks = () => async dispatch => {
  try {
    dispatch(setFetching());
    const json = await ensureFetch("/api/stocks");
    dispatch(setStocks(json));
    dispatch(setSuccess());
  } catch (error) {
    dispatch(setError(error));
  }
};

export const fetchStocks = (start, end, tickers) => async dispatch => {
  try {
    dispatch(setFetching());
    const url = `/api/stocks/fetch?start=${start}&end=${end}&tickers=${tickers}`;
    const json = await ensureFetch(url);
    dispatch(setStocks(json));
    dispatch(setRange(start, end));
    dispatch(setCurrent(start));
    dispatch(setSuccess());
  } catch (error) {
    dispatch(setError(error));
  }
};
