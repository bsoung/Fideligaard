// Require es6-promise polyfill and isomorphic-fetch
require("isomorphic-fetch");

// Express
const express = require("express");
const app = express();

// Check if stock data exists
// fs.stat("stockData.json", (err, stat) => {
//   if (err == null) {
//   } else if (err.code == "ENOENT") {
//     // file does not exist
//     buildCache();
//   } else {
//     console.log("fs error: ", err.code);
//   }
// });

// Set development port to 3001
app.set("port", process.env.PORT || 3001);

// When in production, only serve static assets
// from the client/build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Hydration Endpoint
app.get("/api/stocks", (req, res, next) => {
  try {
    res.json(require("./stockData.json"));
  } catch (error) {
    next(error);
  }
});

// Fetch Endpoint
const { fetchParsedRecords } = require("./quandl");
app.get("/api/stocks/fetch", async (req, res, next) => {
  try {
    let { start, end, columns, tickers } = req.query;

    console.log(req.query, "what is this");

    columns = columns ? columns.split(",") : columns;
    tickers = isNaN(tickers) && tickers ? tickers.split(",") : tickers;
    [start, end] = [+start, +end];

    console.log(columns, "columns");
    console.log(tickers, "tickers");
    console.log(start, end);

    const parsedRecords = await fetchParsedRecords({
      start,
      end,
      columns,
      tickers
    });

    res.json(parsedRecords);
  } catch (error) {
    next(error);
  }
});

// Handle errors
app.use((err, req, res, next) => {
  console.error("Error: ", err.stack);
  res.status(err.response ? err.response.status : 500);
  res.json({ error: err.message });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
