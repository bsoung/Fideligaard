import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "react-rangeslider/lib/index.css";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import stocksApp from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  stocksApp,
  composeWithDevTools(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
