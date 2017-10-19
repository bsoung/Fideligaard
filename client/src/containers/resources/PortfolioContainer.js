import React, { Component } from "react";
import Portfolio from "../../components/resources/Portfolio";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class PortfolioContainer extends Component {
	render() {
		console.log(this.props, "profile container");
		return <Portfolio {...this.props} />;
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		stocks: state.portfolio.fullStocks,
		symbols: state.portfolio.stocks
	};
};

const mapDispatchToProps = dispatch => ({
	// hydrateStocks: () => dispatch(stockActions.hydrateStocks()),
	// updateSort: (column, direction) =>
	//   dispatch(stockActions.setSort(column, direction)),
	// updateFilter: filter => dispatch(stockActions.setFilter(filter))
});

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(PortfolioContainer)
);
