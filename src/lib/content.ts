import { careerPaths, roles, weights } from '../data';
import type { CareerPathGuide, Role, RoleId, RoleWeightConfig } from '../types';

export function getRoleById(roleId: RoleId): Role {
  const role = roles.find((candidate) => candidate.id === roleId);

  if (!role) {
    throw new Error(`Missing role for id ${roleId}`);
  }

  return role;
}

export function getCareerPathGuide(roleId: RoleId): CareerPathGuide {
  const guide = careerPaths.find((candidate) => candidate.roleId === roleId);

  if (!guide) {
    throw new Error(`Missing career path guide for id ${roleId}`);
  }

  return guide;
}

export function getRoleWeightConfig(roleId: RoleId): RoleWeightConfig {
  const config = weights.find((candidate) => candidate.roleId === roleId);

  if (!config) {
    throw new Error(`Missing weight config for id ${roleId}`);
  }

  return config;
}
