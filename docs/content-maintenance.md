# Content maintenance

TCC is designed so most edits happen in JSON instead of React components.

## Edit `src/data/questions.json`

- Each question must keep exactly 5 options.
- Each option must have:
  - `id`
  - `label`
  - `description`
  - `dimensionPoints`
- `dimensionPoints` keys must match the supported dimensions in `src/config/dimensions.ts`.
- If you add or remove evidence tags, make sure they still exist in `src/config/evidence.ts`.
- After editing quiz content, run tests to confirm persona regressions still behave as expected.

## Edit `src/data/weights.json`

- Each role must keep a full weight object for all 14 dimensions.
- `targetThresholds` define the role-relevant dimensions used for fit explanations and gap analysis.
- `criticalThresholds` are the dimensions that can create stronger credibility gaps when missed by 10+ points.
- `requiredEvidence` controls role gating.
- `recommendedMinScore` and `stretchMinScore` adjust how conservative a role is.

## Edit `src/data/career_paths.json`

- Keep one guide per role id.
- These fields feed the results page and prompt generator:
  - `whatTheRoleDoes`
  - `commonEntryTitles`
  - `strengthsToEmphasize`
  - `storiesToTell`
  - `biggestGapsToClose`
  - `keyActions`

## Edit `src/data/prompt_templates.json`

- Prompt templates are plain text with placeholders like `{{displayRoleName}}`.
- Keep prompts role-agnostic; the app injects the selected role, strengths, and gaps.
- If you add a new placeholder, update `src/lib/prompts.ts`.

## Rebalancing scoring safely

1. Change one role or one question cluster at a time.
2. Run `pnpm test` after each change.
3. Check persona regression tests first.
4. Review whether guarded roles started surfacing too often as recommended.
5. If you add a new evidence requirement, confirm that the quiz still gives users a realistic way to earn that evidence tag.
