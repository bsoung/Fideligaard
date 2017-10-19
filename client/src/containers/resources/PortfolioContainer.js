import React, { Component } from "react";
import Portfolio from "../../components/resources/Portfolio";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class PortfolioContainer extends Component {
	render() {
		return <Portfolio {...this.props} />;
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		stocks: state.portfolio.fullStocks,
		symbols: state.portfolio.stocks
	};
};

export default withRouter(connect(mapStateToProps, null)(PortfolioContainer));
