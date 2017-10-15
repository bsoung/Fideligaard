import { combineReducers } from "redux";

import dates from "./dates";
import stocks from "./stocks";
import status from "./status";
import portfolio from "./portfolio";

const stocksApp = combineReducers({ dates, stocks, status, portfolio });
export default stocksApp;
