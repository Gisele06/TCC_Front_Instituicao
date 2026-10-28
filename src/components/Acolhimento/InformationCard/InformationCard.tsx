import "./InformationCard.css";

interface InformationCardProps {
  icon: string;
  value: number;
  label: string;
}

export default function InformationCard({
  icon,
  value,
  label,
}: InformationCardProps) {
  return (
    <div className="information-card">
      <img
        className="information-card-icon"
        src={icon}
        alt=""
      />

      <div className="information-card-content">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}