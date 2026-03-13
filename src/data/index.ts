import rolesJson from './roles.json';
import questionsJson from './questions.json';
import weightsJson from './weights.json';
import careerPathsJson from './career_paths.json';
import promptTemplatesJson from './prompt_templates.json';
import type {
  CareerPathGuide,
  PromptTemplate,
  Question,
  Role,
  RoleWeightConfig
} from '../types';

export const roles = rolesJson as Role[];
export const questions = questionsJson as Question[];
export const weights = weightsJson as RoleWeightConfig[];
export const careerPaths = careerPathsJson as CareerPathGuide[];
export const promptTemplates = promptTemplatesJson as PromptTemplate[];
