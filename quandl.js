require("isomorphic-fetch");
require("dotenv").config();
const moment = require("moment-timezone");
const TIME_ZONE = "America/New_York";
// moment.utc(value, "DD/MM/YYYY").unix();

///////////////////////////
// Fetching private methods
////////////////////////////

const buildUrl = queries => {
  const base = "https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json";
  const key = `api_key=${process.env.QUANDL_API_KEY}`;

  return `${base}?${queries.join("&")}&${key}`;
};

const formatDate = date => date.format("YYYYMMDD");
const midDate = (start, end) => moment((start + end) / 2).startOf("day");

//////////////////////
// Fetching methods //
//////////////////////

// Not all days have stock data, so we retry the request incrementing the day
// if necessary
const fetchTickers = async (date, days = 10) => {
  if (!date) throw new Error("A date is required");

  date = moment(+date).tz(TIME_ZONE);

  const columns = "qopts.columns=ticker";

  let tickers;
  for (let i = 1; i < days + 1; i++) {
    tickers = await fetch(buildUrl([`date=${formatDate(date)}`, columns]));
    tickers = await tickers.json();
    if (tickers.datatable.data.length) break;
    else date = date.add(1, "days");
  }

  if (!tickers) throw new Error("Unable to fetch tickers");

  tickers = tickers.datatable.data.map(ticker => ticker[0]);
  return tickers;
};

/*
The Quandl API will return at most 10,000 records for any request. If there
are additional pages it supplies a query param to fetch the next page.
By default we fetch one year of info for 39 stocks, since this usually returns
just under 10,000 records. Those values are configurable and, if necessary, we
fetch additional pages. To fetch data for all available stocks, set tickers to
0. To fetch data for a specific set of tickers, pass them in as an array of
strings. To fetch a custom set of columns, pass them in as an array of strings.
*/
const fetchRecords = async ({ start, end, columns, tickers }) => {
  if (!start) throw new Error("A start date is required");

  start = moment(start).tz(TIME_ZONE);

  // clone moment to avoid mutating original
  end = end ? moment(end).tz(TIME_ZONE) : start.clone().add(1, "year");
  const date = `date.gte=${formatDate(start)}&date.lt=${formatDate(end)}`;

  tickers = tickers === undefined ? 39 : tickers;

  if (tickers.join) {
    tickers = `ticker=${tickers.join(",")}`;
  } else if (tickers > 0) {
    let tickerArray = await fetchTickers(midDate(start, end));
    const mod = Math.ceil(tickerArray.length / tickers);

    // making sure selected tickers are within state and end date;
    tickerArray = tickerArray.filter((t, i) => i % mod === 0);

    tickers = `ticker=${tickerArray.join(",")}`;
  }

  // if column undefined, build out our base columns for quandl api
  columns = columns ? columns : ["ticker", "date", "close"];
  columns = `qopts.columns=${columns.join(",")}`;

  let records = [];
  let next;

  // build our record in the format ['ticker', 'date', 'price']
  do {
    const queries = [date, columns, tickers, next].filter(q => !!q);
    let data = await fetch(buildUrl(queries));

    data = await data.json();

    records = records.concat(data.datatable.data);

    next = data.meta.next_cursor_id;
    next = next ? `qopts.cursor_id=${next}` : next;
  } while (next);

  if (!records) throw new Error("Unable to fetch records");

  // console.log(records, "records"); // HERE - stock name/date/price show up
  return records;
};

/////////////////////////////
// Parsing private methods //
/////////////////////////////

const buildRecordHash = records => {
  return records.reduce((records, [ticker, date, price]) => {
    records[ticker] = records[ticker] ? records[ticker] : {};
    records[ticker][+moment(date).tz(TIME_ZONE)] = price;
    return records;
  }, {});
};

const buildDateList = (start, end) => {
  const day = moment(start).tz(TIME_ZONE);
  const dateList = [];
  do {
    dateList.push(+day);
    day.add(1, "day");
  } while (day < end);
  return dateList;
};

const buildRecords = dates => {
  return dates.reduce((records, day) => {
    records[day] = {};
    return records;
  }, {});
};

const getFirstPrice = (prices, start, end) => {
  const day = moment(start).tz(TIME_ZONE);
  // console.log(prices, "the prices passed in");

  while (!prices[+day] && day < end) {
    day.add(1, "day");
  }
  // console.log(Number(day), "what does heroku think day is");
  // console.log(typeof +day, typeof Number(day), "+ first then normal");
  // console.log(prices[Number(day)], "what does this return???");
  return prices[+day];
};

const priceMap = [["1d", 1], ["7d", 7], ["30d", 30]];

const populate = (start, end) => (data, [company, prices]) => {
  let mostRecentPrice = getFirstPrice(prices, start, end);
  // console.log(mostRecentPrice, "what is this most recent price???");
  data.dates.map((day, index) => {
    const price = prices[day];
    // console.log(price, "are these the price"); // TODO: PROBLEM: prices here ALL undefined in heroku
    mostRecentPrice = price ? price : mostRecentPrice;
    // console.log(mostRecentPrice, 'most recent price')

    data.records[day][company] = priceMap.reduce(
      (prices, [name, diff]) => {
        if (index - diff < 0) {
          prices[name] = "?";
        } else {
          const prevPrice =
            data.records[data.dates[index - diff]][company].Price;
          prices[name] = +(prevPrice - mostRecentPrice).toFixed(2);
        }
        return prices;
      },
      { Price: mostRecentPrice, Ticker: company }
    );
  });

  // return an object populated with the keys 'records', 'symbols', 'dates' and their values
  // console.log(data.records, "populate data records");
  return data;
};

////////////////////
// Parsing method //
////////////////////

const fetchParsedRecords = async ({ start, end, columns, tickers }) => {
  if (!start) throw new Error("A start date is required");

  start = moment(start).tz(TIME_ZONE);
  end = end ? moment(end).tz(TIME_ZONE) : start.clone().add(1, "year");

  // build [ticker, date, price]
  const recordArray = await fetchRecords({ start, end, columns, tickers });

  // console.log(recordArray, "recordArray"); // HERE - all good //  [ 'A', '2016-05-11', 42.46 ],

  const recordHash = buildRecordHash(recordArray);

  // console.log(recordHash, "recordHash");

  const symbols = Object.keys(recordHash);

  // console.log(symbols, "symbols"); // all good

  const dates = buildDateList(start, end);

  // console.log(dates, "dates"); // all good

  const records = buildRecords(dates);

  // console.log(records, "records");

  const schema = { records, symbols, dates };

  // console.log(schema, "schema");

  // console.log(recordHash, "what does record hash look like");

  // populate data == {dates: [1451624400000], symbols: ['A'], records: { '1451624400000': {'A': [obj]} }}

  // console.log(schema, "schema****************");
  const result = Object.entries(recordHash).reduce(
    populate(start, end),
    schema
  );

  // 1454389200000': { A: { Price: 37.07, Ticker: 'A', '1d': 0.62, '7d': 0.44, '30d': 3.62 } },

  // console.log(result.records, "records"); // TODO: in heroku, Price is undefined, 1d/7d/30d is NaN

  return result;
};

module.exports = { fetchTickers, fetchRecords, fetchParsedRecords };
