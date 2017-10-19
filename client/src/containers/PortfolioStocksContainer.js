import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createSelector } from "reselect";
import PortfolioStocks from "../components/PortfolioStocks";
import { stockActions } from "../actions";
import { portfolioActions } from "../actions";
import _ from "lodash";

class PortfolioStocksContainer extends PureComponent {
  componentDidMount() {
    this.props.updateProfileStocks(this.props.stocks);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.stocks, nextProps.stocks))
      this.props.updateProfileStocks(nextProps.stocks);
  }

  onSort = column => () => {
    const direction =
      this.props.sort.column === column ? !this.props.sort.direction : true;
    this.props.updateSort(column, direction);
  };

  onFilter = event => {
    this.props.updatePortfolioFilter(event.target.value);
  };

  render() {
    return (
      <PortfolioStocks
        {...this.props}
        onSort={this.onSort}
        onFilter={this.onFilter}
        onTrade={this.props.onTrade}
      />
    );
  }
}

// memoized selectors - grabbing bits of redux state
const getDate = state => state.dates.current;
const getRecords = state => state.stocks.records;
const getFilter = state => state.portfolio.filter;
const getSortColumn = state => state.stocks.sort.column;
const getSortDirection = state => state.stocks.sort.direction;

// portfolio memoizers
const getPortfolioStocks = state => state.portfolio.stocks;

const getCurrentStocks = createSelector(
  [getRecords, getPortfolioStocks, getDate],
  (records, portfolioStocks, date) => {
    const selection = records[date];
    const tickers = Object.keys(portfolioStocks);

    let currentStocks = selection ? Object.values(selection) : [];

    let filtered = currentStocks.filter(function(stock) {
      return this.indexOf(stock.Ticker) !== -1;
    }, tickers);

    return filtered;
  }
);

// searching stock by ticker name
const getCurrentFilteredStocks = createSelector(
  [getCurrentStocks, getFilter],
  (stocks, filter) => {
    // ignore uppercase searches
    const query = filter.toUpperCase();
    return filter
      ? stocks.filter(stock => stock.Ticker.includes(query))
      : stocks;
  }
);

// TODO: understand this code
const getCurrentFilteredSortedStocks = createSelector(
  [getCurrentFilteredStocks, getSortColumn, getSortDirection],
  (stocks, column, direction) => {
    return stocks.sort((a, b) => {
      [a, b] = [a[column], b[column]];
      if (!direction) [a, b] = [b, a];

      if (a > b) return 1;
      if (a < b) return -1;
      else return 0;
    });
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    stocks: getCurrentFilteredSortedStocks(state),
    date: state.dates.current,
    sort: state.stocks.sort,
    filter: state.stocks.filter,
    onTrade: ownProps.onTrade,
    portfolio: state.portfolio
  };
};

const mapDispatchToProps = dispatch => ({
  hydrateStocks: () => dispatch(stockActions.hydrateStocks()),
  updateSort: (column, direction) =>
    dispatch(stockActions.setSort(column, direction)),
  updatePortfolioFilter: filter =>
    dispatch(portfolioActions.setPortfolioFilter(filter)),
  updateProfileStocks: stock =>
    dispatch(portfolioActions.setPortfolioStocks(stock))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortfolioStocksContainer)
);
