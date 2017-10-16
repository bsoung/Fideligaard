import React, { Component } from "react";
import { connect } from "react-redux";
import DateSlider from "../components/DateSlider";
import { dateActions, stockActions } from "../actions";

class DateSliderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: this.props.dates.start,
      end: this.props.dates.end,
      current: 0,
      stocks: 39
    };
  }

  onChangeCurrent = current => {
    this.setState({ current });
  };
  onChangeCurrentComplete = () => {
    const { actions, dates } = this.props;

    console.log(dates, "what are the dates on end");

    actions.updateCurrent(dates.array[this.state.current]);
  };

  onChangeStart = start => {
    this.setState(start > this.state.end ? { start, end: start } : { start });
  };
  onChangeEnd = end => {
    this.setState(end < this.state.start ? { end, start: end } : { end });
  };

  onChangeStocks = stocks => this.setState({ stocks });

  onChangeRange = () => this.props.actions.updateRange(this.state);

  render() {
    return (
      <DateSlider
        {...this.props}
        fetch={{ ...this.state }}
        onChangeStart={this.onChangeStart}
        onChangeEnd={this.onChangeEnd}
        onChangeCurrent={this.onChangeCurrent}
        onChangeCurrentComplete={this.onChangeCurrentComplete}
        onChangeStocks={this.onChangeStocks}
        onChangeRange={this.onChangeRange}
      />
    );
  }
}

const mapStateToProps = state => ({
  dates: { ...state.dates, array: state.stocks.dates },
  isFetching: state.status.isFetching
});

const mapDispatchToProps = dispatch => ({
  actions: {
    updateCurrent: date => dispatch(dateActions.setCurrent(+date)),
    updateRange: ({ start, end, stocks }) => {
      dispatch(stockActions.fetchStocks(+start, +end, stocks));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DateSliderContainer
);
