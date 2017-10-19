import React from "react";
import { Header, Segment, Grid, Input } from "semantic-ui-react";
import SortablePortfolioTable from "./elements/SortablePortfolioTable";

const headers = [
  "Ticker",
  "Quantity",
  "Cost Basis",
  "Current Value",
  "Profit/Loss",
  "Price",
  "1d",
  "7d",
  "30d"
];

const calculateReturns = (price, amount) => {
  if (price === 0 || typeof price !== "number") {
    price = "W";
    return price.toFixed(2);
  }

  return (price * amount).toFixed(2);
};

export default ({
  stocks,
  date,
  sort,
  filter,
  onSort,
  onFilter,
  onTrade,
  portfolio
}) => {
  const updatedStocks = stocks.map(stock => ({
    Quantity: portfolio.stocks[stock.Ticker],
    Ticker: stock.Ticker,
    "Cost Basis": `WIP`,
    "Current Value": `$${portfolio.stocks[stock.Ticker] * stock.Price}`,
    "Profit/Loss": `WIP`,
    Price: `$${stock.Price}`,
    "1d": `$${calculateReturns(stock["1d"], portfolio.stocks[stock.Ticker])}`,
    "7d": `$${calculateReturns(stock["7d"], portfolio.stocks[stock.Ticker])}`,
    "30d": `$${calculateReturns(stock["30d"], portfolio.stocks[stock.Ticker])}`
  }));

  const rows = updatedStocks.map(values => {
    return {
      cells: headers.map(name => values[name]),
      onClick: onTrade(values.Ticker)
    };
  });
  return (
    <Segment className="portfolio-stocks-component__segment">
      <Grid>
        <Grid.Column width={6}>
          <Header content="Portfolio Stocks" subheader="Here are your stocks" />
        </Grid.Column>
        <Grid.Column width={10} textAlign="right">
          <Input
            placeholder="Search stock name..."
            value={portfolio.filter}
            onChange={onFilter}
          />
        </Grid.Column>
      </Grid>
      <SortablePortfolioTable
        rows={rows}
        headers={headers}
        sort={sort}
        onClick={onSort}
      />
    </Segment>
  );
};
