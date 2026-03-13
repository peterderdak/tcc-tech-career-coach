import type { RoleClassification } from '../types';

interface BadgeProps {
  classification: RoleClassification;
}

export function Badge({ classification }: BadgeProps) {
  const label =
    classification === 'recommended'
      ? 'Best fit'
      : classification === 'stretch'
        ? 'Stretch'
        : 'Lower signal';

  return <span className={`badge badge--${classification}`}>{label}</span>;
}
