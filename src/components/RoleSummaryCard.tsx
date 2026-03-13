import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import type { RoleResult } from '../types';

interface RoleSummaryCardProps {
  roleResult: RoleResult;
  onSelect?: () => void;
  active?: boolean;
}

export function RoleSummaryCard({ roleResult, onSelect, active = false }: RoleSummaryCardProps) {
  return (
    <article className={`role-card ${active ? 'role-card--active' : ''}`}>
      <div className="role-card__top">
        <Badge classification={roleResult.classification} />
        <span className="role-card__score">{roleResult.baseScore}</span>
      </div>
      <h3>{roleResult.displayName}</h3>
      <p>{roleResult.whyThisFits}</p>
      <p className="role-card__note">{roleResult.stretchExplanation}</p>
      <div className="role-card__actions">
        {onSelect ? (
          <button type="button" className="button button--ghost" onClick={onSelect}>
            View role detail
          </button>
        ) : null}
        <Link className="text-link" to="/roles">
          Compare role realities
        </Link>
      </div>
    </article>
  );
}
