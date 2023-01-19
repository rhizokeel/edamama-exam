# Shop App built using MEAN (MongoDB, Express, AngularJS, NodeJS)
---
This is for exam purposes for edamama company.

## Installation and Setup

## Prerequisites

- Node.js version 16.15.0 (Recommended: Use [nvm](https://github.com/nvm-sh/nvm))
- MongoDB
- Angular

#### Project Setup
##### For Front-End setup:
- Navigate to `./myShop/`
```
# install project dependencies 
$ npm install
# Run the application
$ npm start
```
##### For Back-End setup:
- Navigate to `./myShopBE/`
```
# install project dependencies 
$ npm install
# Run the application
$ npm start
```

##### Post Setup

- Generate initial data for `products` collection in `myshopdb` database in MongoDB

``` 
# Call API using curl
curl --location --request POST "http://localhost:5000/products/saveall"
```

