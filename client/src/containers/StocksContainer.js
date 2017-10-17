import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createSelector } from "reselect";
import Stocks from "../components/Stocks";
import { stockActions } from "../actions";

class StocksContainer extends PureComponent {
  componentDidMount() {
    this.props.hydrateStocks();
  }

  onSort = column => () => {
    const direction =
      this.props.sort.column === column ? !this.props.sort.direction : true;
    this.props.updateSort(column, direction);
  };

  onFilter = event => {
    this.props.updateFilter(event.target.value);
  };

  render() {
    return (
      <Stocks
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
const getFilter = state => state.stocks.filter;
const getSortColumn = state => state.stocks.sort.column;
const getSortDirection = state => state.stocks.sort.direction;

const getCurrentStocks = createSelector(
  [getRecords, getDate],
  (records, date) => {
    const selection = records[date];
    return selection ? Object.values(selection) : [];
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
    onTrade: ownProps.onTrade
  };
};

const mapDispatchToProps = dispatch => ({
  hydrateStocks: () => dispatch(stockActions.hydrateStocks()),
  updateSort: (column, direction) =>
    dispatch(stockActions.setSort(column, direction)),
  updateFilter: filter => dispatch(stockActions.setFilter(filter))
});

export default connect(mapStateToProps, mapDispatchToProps)(StocksContainer);
