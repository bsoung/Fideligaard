import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import StocksContainer from "./StocksContainer";

class StocksWrapper extends Component {
	onTrade = ticker => () => this.props.history.push(`/trade?ticker=${ticker}`);

	render() {
		return <StocksContainer onTrade={this.onTrade} />;
	}
}

export default withRouter(StocksWrapper);
