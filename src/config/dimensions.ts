import type { DimensionKey } from '../types';

export interface DimensionAdvice {
  label: string;
  description: string;
  resumeAdvice: string;
  interviewAdvice: string;
  developmentAdvice: string;
}

export const DIMENSION_KEYS: DimensionKey[] = [
  'communication',
  'persuasion',
  'analytical_reasoning',
  'quantitative_comfort',
  'detail_orientation',
  'customer_empathy',
  'process_thinking',
  'execution_discipline',
  'cross_functional_collaboration',
  'ambiguity_tolerance',
  'technical_comfort',
  'systems_thinking',
  'initiative_ownership',
  'presentation_comfort'
];

export const DIMENSIONS: Record<DimensionKey, DimensionAdvice> = {
  communication: {
    label: 'Communication',
    description: 'Explaining ideas clearly, listening closely, and adapting your message for the audience in front of you.',
    resumeAdvice: 'Lead with examples where you translated complexity into an action people could actually take.',
    interviewAdvice: 'Tell stories that show how you clarified goals, expectations, or tradeoffs for different stakeholders.',
    developmentAdvice: 'Practice structured updates, concise writing, and audience-specific messaging.'
  },
  persuasion: {
    label: 'Persuasion',
    description: 'Influencing people, creating momentum, and helping others commit to a direction or decision.',
    resumeAdvice: 'Highlight moments when your recommendation changed a decision, won support, or moved work forward.',
    interviewAdvice: 'Use stories where you overcame skepticism with logic, empathy, or commercial framing.',
    developmentAdvice: 'Build skill in objection handling, negotiation, and framing a recommendation around stakeholder incentives.'
  },
  analytical_reasoning: {
    label: 'Analytical Reasoning',
    description: 'Breaking messy problems into clear drivers, patterns, and tradeoffs.',
    resumeAdvice: 'Show how you diagnosed a problem, identified the signal, and made a grounded recommendation.',
    interviewAdvice: 'Use stories that move from messy inputs to a crisp decision or action plan.',
    developmentAdvice: 'Practice structured problem solving, hypothesis testing, and root-cause analysis.'
  },
  quantitative_comfort: {
    label: 'Quantitative Comfort',
    description: 'Working confidently with numbers, models, metrics, and performance data.',
    resumeAdvice: 'Name the metrics, size of the analysis, or financial impact whenever numbers strengthened your work.',
    interviewAdvice: 'Choose stories where you used data to prioritize, forecast, or validate a recommendation.',
    developmentAdvice: 'Sharpen spreadsheet fluency, financial reasoning, and comfort with KPI interpretation.'
  },
  detail_orientation: {
    label: 'Detail Orientation',
    description: 'Catching inconsistencies, maintaining accuracy, and protecting quality in the small things.',
    resumeAdvice: 'Point to the controls, reviews, or accuracy wins that prevented errors or improved reliability.',
    interviewAdvice: 'Tell stories where precision mattered and your thoroughness changed the outcome.',
    developmentAdvice: 'Build habits around QA checklists, documentation hygiene, and proofing under time pressure.'
  },
  customer_empathy: {
    label: 'Customer Empathy',
    description: 'Understanding user needs, reading emotional context, and responding with credibility and care.',
    resumeAdvice: 'Emphasize situations where you learned what people actually needed, not just what they asked for.',
    interviewAdvice: 'Use stories that show listening, trust building, and a thoughtful response to customer pain points.',
    developmentAdvice: 'Spend time on discovery interviews, support shadowing, and active listening drills.'
  },
  process_thinking: {
    label: 'Process Thinking',
    description: 'Seeing how work flows from one step to the next and improving how that flow operates.',
    resumeAdvice: 'Describe how you mapped, simplified, or standardized a workflow to reduce friction.',
    interviewAdvice: 'Tell stories about improving coordination, handoffs, or operating cadence.',
    developmentAdvice: 'Practice process mapping, documenting SOPs, and identifying bottlenecks.'
  },
  execution_discipline: {
    label: 'Execution Discipline',
    description: 'Following through reliably, managing details across timelines, and keeping commitments visible.',
    resumeAdvice: 'Quantify deadlines met, launches delivered, or recurring work you kept on track.',
    interviewAdvice: 'Use examples where you drove a plan through ambiguity and closed loops consistently.',
    developmentAdvice: 'Strengthen project tracking, prioritization, and risk management routines.'
  },
  cross_functional_collaboration: {
    label: 'Cross-Functional Collaboration',
    description: 'Coordinating across different teams, priorities, and working styles without losing momentum.',
    resumeAdvice: 'Show where you aligned people with different incentives and turned that alignment into action.',
    interviewAdvice: 'Choose stories with multiple stakeholders, competing needs, and visible coordination work.',
    developmentAdvice: 'Improve facilitation, stakeholder mapping, and follow-up discipline.'
  },
  ambiguity_tolerance: {
    label: 'Ambiguity Tolerance',
    description: 'Making progress when goals are fuzzy, information is incomplete, or the right answer is not obvious.',
    resumeAdvice: 'Feature moments where you created structure before the path was clearly defined.',
    interviewAdvice: 'Tell stories where you made principled progress despite imperfect information.',
    developmentAdvice: 'Practice framing assumptions, testing small bets, and iterating without waiting for perfect clarity.'
  },
  technical_comfort: {
    label: 'Technical Comfort',
    description: 'Learning tools quickly, understanding technical concepts, and staying calm around system-level details.',
    resumeAdvice: 'Include systems, platforms, or tooling you learned well enough to improve work around them.',
    interviewAdvice: 'Use examples that show curiosity and confidence around technical concepts without overstating depth.',
    developmentAdvice: 'Grow through tool exploration, SQL basics, API concepts, and light troubleshooting practice.'
  },
  systems_thinking: {
    label: 'Systems Thinking',
    description: 'Understanding how tools, teams, and dependencies connect across a broader operating environment.',
    resumeAdvice: 'Explain how your work improved a broader workflow, not just a single task in isolation.',
    interviewAdvice: 'Tell stories where you spotted upstream or downstream impacts before others did.',
    developmentAdvice: 'Practice diagramming systems, dependencies, and operational tradeoffs.'
  },
  initiative_ownership: {
    label: 'Initiative & Ownership',
    description: 'Taking responsibility, creating momentum, and staying accountable for outcomes rather than tasks alone.',
    resumeAdvice: 'Lead with action verbs and examples where you initiated work or owned a result end to end.',
    interviewAdvice: 'Use stories where you noticed a gap, stepped in, and stayed accountable to the result.',
    developmentAdvice: 'Build the habit of proposing next steps, setting checkpoints, and owning follow-through.'
  },
  presentation_comfort: {
    label: 'Presentation Comfort',
    description: 'Presenting ideas live, leading conversations, and staying composed when attention is on you.',
    resumeAdvice: 'Name the audiences you presented to and what those presentations influenced.',
    interviewAdvice: 'Tell stories about handling questions, leading demos, or framing information live.',
    developmentAdvice: 'Practice demos, slide storytelling, and concise verbal delivery under light pressure.'
  }
};
