require("isomorphic-fetch");
require("dotenv").config();
const moment = require("moment");

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

  date = moment(+date);
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
  console.log(`Retrieved ${tickers.length} tickers.`);
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

  start = moment(start);
  end = end ? moment(end) : start.clone().add(1, "year");
  const date = `date.gte=${formatDate(start)}&date.lt=${formatDate(end)}`;

  tickers = tickers === undefined ? 39 : tickers;
  if (tickers.join) {
    tickers = `ticker=${tickers.join(",")}`;
  } else if (tickers > 0) {
    let tickerArray = await fetchTickers(midDate(start, end));
    const mod = Math.ceil(tickerArray.length / tickers);
    tickerArray = tickerArray.filter((t, i) => i % mod === 0);
    tickers = `ticker=${tickerArray.join(",")}`;
  }

  columns = columns ? columns : ["ticker", "date", "close"];
  columns = `qopts.columns=${columns.join(",")}`;

  let records = [];
  let next;
  do {
    const queries = [date, columns, tickers, next].filter(q => !!q);
    let data = await fetch(buildUrl(queries));
    data = await data.json();
    records = records.concat(data.datatable.data);

    next = data.meta.next_cursor_id;
    next = next ? `qopts.cursor_id=${next}` : next;
  } while (next);

  if (!records) throw new Error("Unable to fetch records");

  console.log(`Retrieved ${records.length} records.`);
  return records;
};

/////////////////////////////
// Parsing private methods //
/////////////////////////////

const buildRecordHash = records => {
  return records.reduce((records, [ticker, date, price]) => {
    records[ticker] = records[ticker] ? records[ticker] : {};
    records[ticker][+moment(date)] = price;
    return records;
  }, {});
};

const buildDateList = (start, end) => {
  const day = moment(start);
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
  const day = moment(start);
  while (!prices[+day] && day < end) {
    day.add(1, "day");
  }
  return prices[+day];
};

const priceMap = [["1d", 1], ["7d", 7], ["30d", 30]];

const populate = (start, end) => (data, [company, prices]) => {
  let mostRecentPrice = getFirstPrice(prices, start, end);

  data.dates.map((day, index) => {
    const price = prices[day];
    mostRecentPrice = price ? price : mostRecentPrice;

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
  return data;
};

////////////////////
// Parsing method //
////////////////////

const fetchParsedRecords = async ({ start, end, columns, tickers }) => {
  if (!start) throw new Error("A start date is required");

  start = moment(start);
  end = end ? moment(end) : start.clone().add(1, "year");

  const recordArray = await fetchRecords({ start, end, columns, tickers });
  const recordHash = buildRecordHash(recordArray);
  const symbols = Object.keys(recordHash);
  const dates = buildDateList(start, end);
  const records = buildRecords(dates);

  const schema = { records, symbols, dates };

  return Object.entries(recordHash).reduce(populate(start, end), schema);
};

module.exports = { fetchTickers, fetchRecords, fetchParsedRecords };
