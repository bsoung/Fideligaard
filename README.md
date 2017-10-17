# Fideligaard - A historical stock portfolio simulator!

Ever wanted to see what it would be like to purchase stocks with the power to predict the future? Now you can! The stock portfolio simulator lets you customize a particular date ranging from last week to the past decade. You can look for stocks and purchase them and see how your portfolio grows.


[Checkout Fideligaard here!](https://fideligaard.herokuapp.com/)

If there are any problem, make sure to check if Heroku is having any issues.

## Technologies

Frontend:
* React
* Redux

Backend:
* Node
* Express

Tools:
* Webpack
* Babel


## API Reference

* GET /api/stocks :: returns a pre-cached list of stocks from a set date.

* GET /api/stocks/fetch :: consumes a query string and returns the appropriate amount of stocks depending on the given date ranges.


## To Develop / Running the App Locally

For Github:

* Clone the repository.
* Make sure you have Webpack installed globally, if not:
```
npm i -g webpack
```
* Run npm install.
* Go into client folder
* Run npm install again
* Go back to the root directory
* Run the following npm script:
```
npm run dev
```
* Visit localhost:3000 
