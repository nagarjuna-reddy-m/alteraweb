import { useNavigate } from "react-router-dom";
export default function MeasuresTable({ measures }) {
  const navigate = useNavigate();
  return (
    <div className="measures-card mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 text-white">eCQM Measures</h5>
        <span className="measures-badge">{measures.length} MEASURES</span>
      </div>

      <div className="table-responsive">
        <table className="table align-middle mb-0 custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>MEASURE NAME</th>
              <th>DOMAIN</th>
              <th>NUM/DEN</th>
              <th style={{ width: "220px" }}>RATE</th>
              <th>GAPS</th>
              <th>DRILL</th>
            </tr>
          </thead>

          <tbody>
            {measures.map((m, i) => (
              <tr key={i}>
                <td className="measure-id">{m.measureId}</td>

                <td className="measure-name">{m.measureName}</td>

                <td>
                  <span className="domain-pill">{m.category}</span>
                </td>

                <td className="numden">
                  {m.numerator}/{m.denominator}
                </td>

                <td>
                  <div className="rate-wrapper">
                    <div className="custom-progress">
                      <div
                        className={`progress-fill ${
                          m.rate >= 75
                            ? "good"
                            : m.rate >= 60
                              ? "warning"
                              : "danger"
                        }`}
                        style={{ width: `${m.rate}%` }}
                      />
                    </div>
                    <span
                      className={`rate-text ${
                        m.rate >= 75
                          ? "good"
                          : m.rate >= 60
                            ? "warning"
                            : "danger"
                      }`}
                    >
                      {m.rate}%
                    </span>
                  </div>
                </td>

                <td>
                  <span className="gap-badge">{m.gaps}</span>
                </td>

                <td>
                  <button
                    className="drill-btn"
                    onClick={() => navigate(`/measure/${m.measureId}`)}
                  >
                    Patients →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
