const databricksClient = require("../config/databricks");

async function executeQuery(query) {
  try {
    const response = await databricksClient.post(
      "/api/2.0/sql/statements/",
      {
        statement: query,
        warehouse_id: process.env.DATABRICKS_WAREHOUSE_ID,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
}

async function getStatementResult(statementId) {
  try {
    const response = await databricksClient.get(
      `/api/2.0/sql/statements/${statementId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  executeQuery,
  getStatementResult,
};