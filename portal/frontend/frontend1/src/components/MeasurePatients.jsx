import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function MeasurePatients() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    eligible: 0,
    met: 0,
    gaps: 0,
  });

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [showGaps, setShowGaps] = useState(false);

  useEffect(() => {
    loadSummary();
    loadPatients();
  }, [id]);

  const loadSummary = async () => {
    try {
      const res = await API.get(`/dashboard/measure-summary/${id}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await API.get(`/dashboard/measure-patients/${id}`);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPatients = patients
    .filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      showGaps ? p.status === "Gap" : true
    );

  return (
    <div className="dashboard-wrapper">

      {/* Breadcrumb */}
      <div className="mb-4 d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <span className="text-muted">Population</span>
        <span>›</span>
        <span className="fw-bold">{id}</span>
      </div>

      <h3 className="mb-4">
        {id}: Patient-level detail
      </h3>

      {/* Summary Cards */}
      <div className="stats-row mb-5">

        <div className="stat-card stat-primary">
          <div className="stat-title">Eligible</div>
          <div className="stat-value">{summary.eligible}</div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-title">Met</div>
          <div className="stat-value">{summary.met}</div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-title">Gaps</div>
          <div className="stat-value">{summary.gaps}</div>
        </div>

      </div>

      {/* Search + Filter */}
      <div className="d-flex gap-3 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-secondary"
          onClick={() => setShowGaps(!showGaps)}
        >
          {showGaps ? "Show All" : "Show Gaps Only"}
        </button>
      </div>

      {/* Patient Table */}
      <div className="measures-card">
        <div className="table-responsive">
          <table className="table align-middle custom-table mb-0">
            <thead>
              <tr>
                <th>Patient</th>
                <th>MRN</th>
                <th>Age</th>
                <th>Provider</th>
                <th>Insurance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.mrn}</td>
                  <td>{p.age}</td>
                  <td>{p.provider}</td>
                  <td>
                    <span className="domain-pill">
                      {p.insurance}
                    </span>
                  </td>
                  <td>
                    <span className={
                      p.status === "Gap"
                        ? "gap-badge"
                        : p.status === "Met"
                        ? "gap-badge bg-success"
                        : "gap-badge bg-secondary"
                    }>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button className="drill-btn">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}