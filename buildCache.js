const fs = require("fs");
const { fetchParsedRecords } = require("./quandl");
const CACHE_FILE = "./stockData.json";
const START_DATE = "20160101";
const END_DATE = "20170101";

fetchParsedRecords({ start: START_DATE, end: END_DATE })
	.then(records => {
		fs.writeFileSync(CACHE_FILE, JSON.stringify(records));
	})
	.catch(e => console.log(e.stack ? e.stack : e));

// const buildCache = () => {
// 	fetchParsedRecords({ start: START_DATE, end: END_DATE })
// 		.then(records => {
// 			fs.writeFileSync(CACHE_FILE, JSON.stringify(records));
// 		})
// 		.catch(e => console.log(e.stack ? e.stack : e));
// };

// module.exports = buildCache;
