const {
  executeQuery,
  getStatementResult,
} = require("../services/databricksService");

exports.getMeasures = async (req, res) => {
  try {
    const query = `
 SELECT
 cmb.Id AS Measure_ID,
 cmb.measure_name AS Measure_Name,
 cmb.Domain AS Domain,
 
 SUM(qpm.Numerator)   AS SumNum,
 SUM(qpm.Denominator) AS SumDenom,
 
 CASE
     WHEN SUM(qpm.Denominator) = 0 THEN 0
     ELSE (SUM(qpm.Numerator) * 100.0) / SUM(qpm.Denominator)
 END AS Rate,
 
 SUM(qpm.Denominator) - SUM(qpm.Numerator) AS Gaps
 
FROM cin_lumina_mart_dev.ecqm_mart.quality_measure_provider qpm
JOIN cin_lumina_mart_dev.ecqm_mart.measure_lookup cmb
ON qpm.CMS = cmb.measure_id
 
GROUP BY
 cmb.ID,
 cmb.measure_name,
 cmb.Domain;
`;

    const statement = await executeQuery(query);
    console.log(statement);

    const result = await getStatementResult(statement.statement_id);
    console.log(result);

    res.json(result.result.data_array);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNumeratorSum = async (req, res) => {
  try {
    const query = `
      SELECT SUM(Numerator) AS NUM
      FROM cin_lumina_mart_dev.ecqm_mart.quality_measure_provider
    `;

    const dbResponse = await executeQuery(query);

    // Correct extraction for executeQuery
    let numeratorSum = 0;

    if (
      dbResponse &&
      dbResponse.result &&
      dbResponse.result.data_array &&
      dbResponse.result.data_array.length > 0
    ) {
      numeratorSum = Number(dbResponse.result.data_array[0][0]);
    }

    res.status(200).json({
      success: true,
      numeratorSum,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getDenominatorSum = async (req, res) => {
  try {
    const query = `
      SELECT SUM(Denominator) AS DENOM
      FROM cin_lumina_mart_dev.ecqm_mart.quality_measure_provider
    `;

    const dbResponse = await executeQuery(query);
    console.log(dbResponse);

    let denominatorSum = 0;

    if (
      dbResponse &&
      dbResponse.result &&
      dbResponse.result.data_array &&
      dbResponse.result.data_array.length > 0
    ) {
      denominatorSum = Number(dbResponse.result.data_array[0][0]);
    }
    console.log(denominatorSum);
    res.status(200).json({
      success: true,
      denominatorSum,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPatientTrack = async (req, res) => {
  try {
    const query = `
      select count(PersonId) As patienttrack from cin_lumina_mart_dev.ecqm_mart.quality_measure_patient
    `;

    const dbResponse = await executeQuery(query);

    // Correct extraction for executeQuery
    let numeratorSum = 0;

    if (
      dbResponse &&
      dbResponse.result &&
      dbResponse.result.data_array &&
      dbResponse.result.data_array.length > 0
    ) {
      numeratorSum = Number(dbResponse.result.data_array[0][0]);
    }

    res.status(200).json({
      success: true,
      numeratorSum,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTotalMeasures = async (req, res) => {
  try {
    const query = `
      SELECT count(distinct CMS) AS totalmeasures FROM cin_lumina_mart_dev.ecqm_mart.quality_measure_patient
    `;

    const dbResponse = await executeQuery(query);

    // Correct extraction for executeQuery
    let totalMeasures = 0;

    if (
      dbResponse &&
      dbResponse.result &&
      dbResponse.result.data_array &&
      dbResponse.result.data_array.length > 0
    ) {
      totalMeasures = Number(dbResponse.result.data_array[0][0]);
    }

    res.status(200).json({
      success: true,
      totalMeasures,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMeasureSummary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Measure ID required" });
    }

    const query = `
      SELECT
        SUM(qpm.Denominator) AS Total_Eligible,
        SUM(qpm.Numerator)   AS Total_Met,
        SUM(qpm.Denominator) - SUM(qpm.Numerator) AS Total_Gaps
      FROM cin_lumina_mart_dev.ecqm_mart.QUALITY_MEASURE_PROVIDER qpm
      WHERE qpm.CMS LIKE '%${id}%'
    `;

    const statement = await executeQuery(query);
    console.log(statement);
    const result = await getStatementResult(statement.statement_id);
    console.log(result);

    const row = result.result?.data_array?.[0] || [];
    

    res.json({
      eligible: row[0] || 0,
      met: row[1] || 0,
      gaps: row[2] || 0,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getMeasurePatientsTable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Measure ID required" });
    }

    const query = `
      SELECT
        pat.name AS Patient,
        pat.PersonId AS Patient_Id,
        pat.Age AS Age,
        pat.provider AS Provider,
        pat2.payer AS Insurance,
        CASE
          WHEN COALESCE(pat.DenominatorExclusions, 0) = 1 THEN 'Excluded'
          WHEN COALESCE(pat.Denominator, 0) = 1 
               AND COALESCE(pat.Numerator, 0) = 1 THEN 'Met'
          WHEN COALESCE(pat.Denominator, 0) = 1 
               AND COALESCE(pat.Numerator, 0) <> 1 THEN 'Gap'
          ELSE 'Not in Measure'
        END AS Status
      FROM cin_lumina_mart_dev.ecqm_mart.QUALITY_MEASURE_PATIENT pat
      JOIN cin_lumina_mart_dev.gold_lumina_mart.CIN_LUMINA_MART_PATIENT pat2
        ON pat.PersonId = pat2.person_id
      WHERE pat.CMS LIKE '%${id}%'
    `;

    const statement = await executeQuery(query);
    const result = await getStatementResult(statement.statement_id);

    const patients =
      result.result?.data_array?.map((row) => ({
        name: row[0],
        mrn: row[1],
        age: row[2],
        provider: row[3],
        insurance: row[4],
        status: row[5],
      })) || [];

    res.json(patients);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};