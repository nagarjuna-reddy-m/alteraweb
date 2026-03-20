export default function ViewToggle({ view, setView }) {
  return (
    <div className="view-toggle">
      <button
        className={view === "population" ? "active" : ""}
        onClick={() => setView("population")}
      >
        Population
      </button>

      <button
        className={view === "clinicians" ? "active" : ""}
        onClick={() => setView("clinicians")}
      >
        Clinicians
      </button>
    </div>
  );
}