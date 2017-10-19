import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import PortfolioStocksContainer from "./PortfolioStocksContainer";

class PortfolioStocksWrapper extends Component {
	onTrade = ticker => () => this.props.history.push(`/trade?ticker=${ticker}`);

	render() {
		return <PortfolioStocksContainer onTrade={this.onTrade} />;
	}
}

export default withRouter(PortfolioStocksWrapper);
