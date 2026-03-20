const express = require("express");
const router = express.Router();

const {
  getNumeratorSum,
  getPatientTrack,
  getDenominatorSum,
  getTotalMeasures,
  getMeasures,
  getMeasureSummary,
  getMeasurePatientsTable
} = require("../controllers/dashboardController");

// router.get("/stats", getDashboardStats);
router.get("/measures", getMeasures);
router.get("/numerator-sum", getNumeratorSum);
router.get("/patient-track", getPatientTrack);
router.get("/denominator-sum", getDenominatorSum);
router.get("/Measures-total", getTotalMeasures);
router.get("/measure-summary/:id", getMeasureSummary);
router.get("/measure-patients/:id", getMeasurePatientsTable);


module.exports = router;