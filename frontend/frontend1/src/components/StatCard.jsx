export default function StatCard({ title, value, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}