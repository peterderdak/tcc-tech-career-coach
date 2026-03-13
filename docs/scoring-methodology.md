# Scoring methodology

## Normalization

Each answer contributes raw points to one or more dimensions. Raw totals are not compared directly because some dimensions appear in more questions than others.

For each dimension, TCC calculates the maximum available contribution from every question, sums those maxima, and then normalizes with:

`normalized = round((raw / maxPossible) * 100)`

Scores are clamped between 0 and 100.

## Weighted role scoring

Each supported role has a weight matrix across the 14 dimensions.

The role base score is:

`baseScore = round(sum(normalizedDimension * weight) / sum(weight))`

This keeps the scoring transparent and deterministic while still allowing roles to emphasize different strengths.

## Gating and stretch logic

Base score alone does not decide recommendations.

- `recommended` means the role cleared its base score bar, all target thresholds, and all required evidence checks.
- `stretch` means the role still has meaningful upside, but one or more thresholds or credibility signals are missing.
- `lower_signal` means the score and guardrails do not currently support the role strongly enough.

Gap analysis is derived from the same thresholds:

- Strengths: role-relevant dimensions at or above target
- Missing signals: role-relevant dimensions 10 to 24 points below target
- Credibility gaps: critical threshold misses of 10+ points or missing required evidence

## Why PM, SE, and TPM are guarded

Product Management, Sales Engineering, and TPM-leaning recommendations are deliberately more conservative because those roles are frequently over-targeted by early-career candidates without enough supporting evidence.

- Product Management requires stronger customer, analytical, ambiguity, collaboration, ownership, and communication signals plus role-specific evidence.
- Sales Engineering requires technical comfort, systems thinking, communication, presentation comfort, and technical credibility evidence.
- Technical Program Management is represented as a variant inside Project / Program Management and only appears when execution/process strength is paired with stronger technical and systems signals.

The goal is not to block ambition. It is to distinguish between current best-fit roles and credible stretch paths.
