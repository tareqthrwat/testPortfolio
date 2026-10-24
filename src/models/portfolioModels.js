/**
 * Portfolio Data Models & Validation Schema
 * Version 1.0.0
 */

export const SCHEMA_VERSION = 1;

export const PROJECT_CATEGORIES = ['Frontend', 'Backend', 'Full Stack'];

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Other',
];

/**
 * Generate a URL-friendly slug from title
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug ensuring no collision with existing project slugs
 * @param {string} title
 * @param {Array} existingProjects
 * @param {string|null} excludeId
 * @returns {string}
 */
export function generateUniqueSlug(title, existingProjects = [], excludeId = null) {
  const base = slugify(title) || 'project';
  const existingSlugs = new Set(
    existingProjects
      .filter((p) => p && (!excludeId || p.id !== excludeId))
      .map((p) => p.slug)
  );

  if (!existingSlugs.has(base)) {
    return base;
  }

  let counter = 2;
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}

/**
 * Generate a unique ID (UUID or timestamp-based fallback)
 * @returns {string}
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validate Project Entity
 * @param {Object} project
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateProject(project) {
  const errors = [];
  if (!project || typeof project !== 'object') {
    return { valid: false, errors: ['Project must be an object'] };
  }

  if (!project.title || typeof project.title !== 'string' || !project.title.trim()) {
    errors.push('Project title is required');
  }

  if (project.category && !PROJECT_CATEGORIES.includes(project.category)) {
    errors.push(`Invalid category: ${project.category}. Allowed: ${PROJECT_CATEGORIES.join(', ')}`);
  }

  if (project.technologies && !Array.isArray(project.technologies)) {
    errors.push('Technologies must be an array of strings');
  }

  if (project.additionalImages && !Array.isArray(project.additionalImages)) {
    errors.push('Additional images must be an array of image URLs');
  }

  if (project.visibility && !['public', 'hidden'].includes(project.visibility)) {
    errors.push('Visibility must be either "public" or "hidden"');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Skill Entity
 * @param {Object} skill
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSkill(skill) {
  const errors = [];
  if (!skill || typeof skill !== 'object') {
    return { valid: false, errors: ['Skill must be an object'] };
  }

  if (!skill.name || typeof skill.name !== 'string' || !skill.name.trim()) {
    errors.push('Skill name is required');
  }

  if (skill.category && !SKILL_CATEGORIES.includes(skill.category)) {
    errors.push(`Invalid category: ${skill.category}. Allowed: ${SKILL_CATEGORIES.join(', ')}`);
  }

  if (skill.proficiency !== undefined && skill.proficiency !== null) {
    const prof = Number(skill.proficiency);
    if (isNaN(prof) || prof < 0 || prof > 100) {
      errors.push('Proficiency must be a number between 0 and 100');
    }
  }

  if (skill.visibility && !['public', 'hidden'].includes(skill.visibility)) {
    errors.push('Visibility must be either "public" or "hidden"');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Portfolio Settings
 * @param {Object} settings
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSettings(settings) {
  const errors = [];
  if (!settings || typeof settings !== 'object') {
    return { valid: false, errors: ['Settings must be an object'] };
  }

  if (!settings.developerName || typeof settings.developerName !== 'string') {
    errors.push('Developer name is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate entire backup data structure before import
 * Ensures schema version, format, and rejects duplicate IDs or conflicting project slugs
 * @param {Object} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateBackupData(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Backup payload must be a JSON object'] };
  }

  if (data.schemaVersion === undefined || isNaN(Number(data.schemaVersion))) {
    errors.push('Backup is missing a valid schemaVersion');
  }

  if (!Array.isArray(data.projects)) {
    errors.push('Backup projects must be an array');
  } else {
    const projectIds = new Set();
    const projectSlugs = new Set();

    data.projects.forEach((proj, idx) => {
      const v = validateProject(proj);
      if (!v.valid) {
        errors.push(`Project at index ${idx} is invalid: ${v.errors.join(', ')}`);
      }
      if (proj && proj.id) {
        if (projectIds.has(proj.id)) {
          errors.push(`Duplicate project ID detected: "${proj.id}"`);
        }
        projectIds.add(proj.id);
      }
      if (proj && proj.slug) {
        if (projectSlugs.has(proj.slug)) {
          errors.push(`Conflicting duplicate project slug detected: "${proj.slug}"`);
        }
        projectSlugs.add(proj.slug);
      }
    });
  }

  if (!Array.isArray(data.skills)) {
    errors.push('Backup skills must be an array');
  } else {
    const skillIds = new Set();
    data.skills.forEach((skill, idx) => {
      const v = validateSkill(skill);
      if (!v.valid) {
        errors.push(`Skill at index ${idx} is invalid: ${v.errors.join(', ')}`);
      }
      if (skill && skill.id) {
        if (skillIds.has(skill.id)) {
          errors.push(`Duplicate skill ID detected: "${skill.id}"`);
        }
        skillIds.add(skill.id);
      }
    });
  }

  if (!data.settings || typeof data.settings !== 'object') {
    errors.push('Backup settings must be an object');
  } else {
    const v = validateSettings(data.settings);
    if (!v.valid) {
      errors.push(`Settings are invalid: ${v.errors.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
