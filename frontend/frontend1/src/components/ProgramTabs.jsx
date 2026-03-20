export default function ProgramTabs({ selected, onChange }) {
  const tabs = ["eCQM", "MIPS", "MSSP"];

  return (
    <div className="program-tabs">
      {tabs.map(tab => (
        <div
          key={tab}
          className={`program-tab ${selected === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}