const axios = require("axios");

const databricksClient = axios.create({
  baseURL: process.env.DATABRICKS_HOST,
  headers: {
    Authorization: `Bearer ${process.env.DATABRICKS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

module.exports = databricksClient;