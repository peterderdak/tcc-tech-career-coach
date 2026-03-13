import type { DimensionKey, EvidenceTag } from '../types';

export interface EvidenceAdvice {
  label: string;
  description: string;
  relatedDimensions: DimensionKey[];
}

export const EVIDENCE_METADATA: Record<EvidenceTag, EvidenceAdvice> = {
  client_facing: {
    label: 'Customer-facing experience',
    description: 'You have credible examples of talking directly with customers, prospects, or external stakeholders.',
    relatedDimensions: ['customer_empathy', 'communication']
  },
  closes_with_confidence: {
    label: 'Commercial confidence',
    description: 'You show comfort asking for commitment, handling objections, or moving a conversation toward action.',
    relatedDimensions: ['persuasion', 'presentation_comfort']
  },
  owns_outcomes: {
    label: 'Outcome ownership',
    description: 'You have examples of owning a goal or result instead of only contributing tasks.',
    relatedDimensions: ['initiative_ownership', 'execution_discipline']
  },
  customer_discovery: {
    label: 'Customer discovery',
    description: 'You show evidence of learning from users before deciding what to do.',
    relatedDimensions: ['customer_empathy', 'analytical_reasoning']
  },
  roadmap_tradeoffs: {
    label: 'Tradeoff judgment',
    description: 'You have examples of weighing competing priorities and making a call.',
    relatedDimensions: ['ambiguity_tolerance', 'analytical_reasoning']
  },
  cross_functional_facilitation: {
    label: 'Cross-functional facilitation',
    description: 'You have examples of helping different teams align around a direction.',
    relatedDimensions: ['cross_functional_collaboration', 'communication']
  },
  technical_translation: {
    label: 'Technical translation',
    description: 'You can bridge technical detail and business understanding in a usable way.',
    relatedDimensions: ['technical_comfort', 'communication']
  },
  technical_debugging: {
    label: 'Technical troubleshooting',
    description: 'You have examples of exploring a tool, diagnosing friction, or solving a technical issue.',
    relatedDimensions: ['technical_comfort', 'systems_thinking']
  },
  builds_process: {
    label: 'Process building',
    description: 'You have evidence of creating a workflow, operating rhythm, or repeatable structure.',
    relatedDimensions: ['process_thinking', 'execution_discipline']
  },
  structured_delivery: {
    label: 'Structured delivery',
    description: 'You have examples of keeping work on track through milestones, deadlines, and follow-through.',
    relatedDimensions: ['execution_discipline', 'process_thinking']
  },
  financial_modeling: {
    label: 'Quantitative modeling',
    description: 'You show hands-on comfort with metrics, forecasts, or number-driven analysis.',
    relatedDimensions: ['quantitative_comfort', 'analytical_reasoning']
  },
  controls_accuracy: {
    label: 'Control-minded accuracy',
    description: 'You show precision and reliability when accuracy matters.',
    relatedDimensions: ['detail_orientation', 'execution_discipline']
  },
  system_configuration: {
    label: 'System configuration',
    description: 'You have examples of understanding fields, rules, or setup inside a business tool.',
    relatedDimensions: ['systems_thinking', 'technical_comfort']
  },
  workflow_optimization: {
    label: 'Workflow optimization',
    description: 'You have evidence of improving how information or tasks move through a process.',
    relatedDimensions: ['systems_thinking', 'process_thinking']
  },
  executive_presentations: {
    label: 'Presentation reps',
    description: 'You have examples of presenting, pitching, or explaining ideas live.',
    relatedDimensions: ['presentation_comfort', 'communication']
  },
  stakeholder_coordination: {
    label: 'Stakeholder coordination',
    description: 'You have proof of coordinating work, owners, and updates across people.',
    relatedDimensions: ['cross_functional_collaboration', 'execution_discipline']
  },
  renewal_expansion: {
    label: 'Relationship retention',
    description: 'You have evidence of strengthening an external relationship after initial delivery.',
    relatedDimensions: ['customer_empathy', 'communication']
  }
};
