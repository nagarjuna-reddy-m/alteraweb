
import { useEffect, useState } from "react";
import API from "../services/api";

import StatCard from "./StatCard";
import MeasuresTable from "./MeasuresTable";
import ProgramTabs from "./ProgramTabs";
import ViewToggle from "./ViewToggle";

// import "../styles/dashboard.css"

export default function Dashboard() {
  const [stats, setStats] = useState({
    compositeRate: 0,
    totalGaps: 0,
    patientsTracked: 0,
    totalMeasures: 0,
  });

  const [measures, setMeasures] = useState([]);

  const [program, setProgram] = useState("eCQM");
  const [view, setView] = useState("population");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        numeratorRes,
        denominatorRes,
        patientRes,
        measuresRes,
      ] = await Promise.all([
        API.get("/dashboard/numerator-sum"),
        API.get("/dashboard/denominator-sum"),
        API.get("/dashboard/patient-track"),
        API.get("/dashboard/measures"),
      ]);

      // ---------- Stats ----------
      const numerator = Number(numeratorRes.data.numeratorSum) || 0;
      const denominator = Number(denominatorRes.data.denominatorSum) || 0;
      const patientsTracked =
        Number(patientRes.data.numeratorSum) || 0;

      const compositeRate =
        denominator === 0
          ? 0
          : Math.round((numerator / denominator) * 100);

      const totalGaps = denominator - numerator;

      // ---------- Measures ----------
      const formattedMeasures = (measuresRes.data || []).map(
        (row) => ({
          measureId: row[0],
          measureName: row[1],
          category: row[2],
          numerator: Number(row[3]),
          denominator: Number(row[4]),
          rate: Math.round(Number(row[5])),
          gaps: Number(row[6]),
        })
      );

      setStats({
        compositeRate,
        totalGaps,
        patientsTracked,
        totalMeasures: formattedMeasures.length,
      });

      setMeasures(formattedMeasures);

    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <div className="dashboard-title">
          CMS Quality Metrics Dashboard
        </div>

        <ViewToggle view={view} setView={setView} />
      </div>

      <ProgramTabs selected={program} onChange={setProgram} />

      <div className="stats-row">
        <StatCard
          title="Composite Rate"
          value={`${stats.compositeRate}%`}
          color="warning"
        />

        <StatCard
          title="Total Measures"
          value={stats.totalMeasures}
          color="primary"
        />

        <StatCard
          title="Total Gaps"
          value={stats.totalGaps}
          color="danger"
        />

        <StatCard
          title="Patients Tracked"
          value={stats.patientsTracked}
          color="info"
        />
      </div>

      <MeasuresTable measures={measures} />
    </div>
  );
}