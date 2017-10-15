import React from "react";
import moment from "moment";
import Slider from "react-rangeslider";
import {
  Segment,
  Header,
  Accordion,
  Icon,
  Button,
  Loader
} from "semantic-ui-react";

const DAY = 86400000; // 1 day in ms
const MAX_TICKERS = 100; // setting this value too high will return massive amounts of data
const LATEST = moment() // get the latest stocks starting from last week
  .startOf("day")
  .subtract(1, "week");
const EARLIEST = LATEST.clone().subtract(10, "years"); // last decade

const form = date => moment(date).format("L");

const DateSlider = ({
  dates,
  fetch,
  isFetching,
  onChangeStart,
  onChangeEnd,
  onChangeCurrent,
  onChangeCurrentComplete,
  onChangeStocks,
  onChangeRange
}) => (
  <Segment>
    <Header as="h3">
      {`Selected Date: ${form(dates.array[fetch.current])}`}
    </Header>

    <Slider
      max={dates.array.length - 1}
      value={fetch.current}
      tooltip={false}
      onChange={onChangeCurrent}
      onChangeComplete={onChangeCurrentComplete}
    />

    <Accordion>
      <Loader
        active={isFetching}
        size="large"
        content="Loading, this may take a while..."
      />
      <Accordion.Title>
        <Icon name="dropdown" />
        {`Range: ${form(dates.start)} - ${form(dates.end)}`}
      </Accordion.Title>
      <Accordion.Content>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h4">Fetch a new set of stocks:</Header>
          <Button color="green" onClick={onChangeRange}>
            Fetch
          </Button>
        </div>
        Start Date: {form(fetch.start)}
        <Slider
          min={+EARLIEST}
          max={+LATEST}
          step={DAY}
          value={fetch.start}
          tooltip={false}
          onChange={onChangeStart}
        />
        End Date: {form(fetch.end)}
        <Slider
          min={+EARLIEST}
          max={+LATEST}
          step={DAY}
          value={fetch.end}
          tooltip={false}
          onChange={onChangeEnd}
        />
        Number of Stocks: {fetch.stocks}
        <Slider
          min={1}
          max={MAX_TICKERS}
          value={fetch.stocks}
          tooltip={false}
          onChange={onChangeStocks}
        />
      </Accordion.Content>
    </Accordion>
  </Segment>
);

export default DateSlider;
