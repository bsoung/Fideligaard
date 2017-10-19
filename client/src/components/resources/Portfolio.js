import React from "react";
import { Table } from "semantic-ui-react";
import PortfolioStocksContainerWrapper from "../../containers/PortfolioStocksContainerWrapper";

const Portfolio = ({ stocks, symbols }) => {
	let profileOverview = {
		currentValue: 0,
		oneDay: 0,
		sevenDay: 0,
		thirtyDay: 0
	};

	stocks &&
		stocks.forEach(stock => {
			let stockAmount = symbols[stock.Ticker];
			let totalStockValue = stock.Price * stockAmount;
			let totalOneDay = stock["1d"] * stockAmount;
			let totalSevenDay = stock["7d"] * stockAmount;
			let totalThirtyDay = stock["7d"] * stockAmount;

			profileOverview.currentValue += totalStockValue;
			profileOverview.oneDay += totalOneDay;
			profileOverview.sevenDay += totalSevenDay;
			profileOverview.thirtyDay += totalThirtyDay;
		});

	return (
		<div>
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Cost Basis</Table.HeaderCell>
						<Table.HeaderCell>Current Value</Table.HeaderCell>
						<Table.HeaderCell>Profit/Loss</Table.HeaderCell>
						<Table.HeaderCell>1d</Table.HeaderCell>
						<Table.HeaderCell>7d</Table.HeaderCell>
						<Table.HeaderCell>30d</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					<Table.Row>
						<Table.Cell>WIP</Table.Cell>
						<Table.Cell>{profileOverview.currentValue.toFixed(2)}</Table.Cell>
						<Table.Cell>WIP</Table.Cell>
						<Table.Cell>{profileOverview.oneDay.toFixed(2)}</Table.Cell>
						<Table.Cell>{profileOverview.sevenDay.toFixed(2)}</Table.Cell>
						<Table.Cell>{profileOverview.thirtyDay.toFixed(2)}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>

			<PortfolioStocksContainerWrapper />
		</div>
	);
};

export default Portfolio;
