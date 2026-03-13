interface BarMeterProps {
  label: string;
  value: number;
  tone?: 'default' | 'recommended' | 'stretch';
}

export function BarMeter({ label, value, tone = 'default' }: BarMeterProps) {
  return (
    <div className="meter">
      <div className="meter__label-row">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="meter__track" aria-hidden="true">
        <div className={`meter__fill meter__fill--${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
