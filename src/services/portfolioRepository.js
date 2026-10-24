import {
  SCHEMA_VERSION,
  PROJECT_CATEGORIES,
  SKILL_CATEGORIES,
  generateId,
  generateUniqueSlug,
  validateProject,
  validateSkill,
  validateSettings,
  validateBackupData,
} from '../models/portfolioModels.js';
import { SEED_PROJECTS, SEED_SKILLS, SEED_SETTINGS } from '../data/seedData.js';

const STORAGE_KEY = 'portfolio_data_v1';

// In-memory fallback for environments without localStorage (e.g. Node tests, SSR)
let memoryStore = null;
let simulateWriteFailure = false;

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, val) => {
        if (simulateWriteFailure) {
          throw new Error('QuotaExceededError: LocalStorage quota exceeded');
        }
        window.localStorage.setItem(key, val);
      },
      removeItem: (key) => window.localStorage.removeItem(key),
    };
  }
  return {
    getItem: () => (memoryStore ? JSON.stringify(memoryStore) : null),
    setItem: (_key, val) => {
      if (simulateWriteFailure) {
        throw new Error('QuotaExceededError: LocalStorage quota exceeded');
      }
      memoryStore = JSON.parse(val);
    },
    removeItem: () => {
      memoryStore = null;
    },
  };
}

/**
 * Creates default state object
 */
function createDefaultData() {
  return {
    schemaVersion: SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
    projects: [...SEED_PROJECTS],
    skills: [...SEED_SKILLS],
    settings: { ...SEED_SETTINGS },
  };
}

/**
 * Safely loads portfolio data from storage, recovering from corruption if necessary
 * without destroying recoverable user data.
 */
function loadFromStorage() {
  const storage = getStorage();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultData = createDefaultData();
      try {
        saveToStorage(defaultData);
      } catch {
        // In read-only or quota-exceeded modes, return in-memory default without crashing reads
      }
      return defaultData;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.warn('Storage data unparseable, preserving raw backup before reset:', parseErr);
      try {
        storage.setItem(`${STORAGE_KEY}_corrupt_raw_bak_${Date.now()}`, raw);
      } catch {
        // ignore backup storage errors
      }
      const defaultData = createDefaultData();
      saveToStorage(defaultData);
      return defaultData;
    }

    // Attempt safe schema normalization for partially valid / recoverable user data
    if (parsed && typeof parsed === 'object') {
      const hasProjects = Array.isArray(parsed.projects);
      const hasSkills = Array.isArray(parsed.skills);

      if (hasProjects || hasSkills) {
        const recoveredProjects = hasProjects
          ? parsed.projects
              .filter((p) => p && typeof p === 'object' && p.title)
              .map((p, idx) => ({
                ...p,
                id: p.id || generateId(),
                slug: p.slug || generateUniqueSlug(p.title),
                category: PROJECT_CATEGORIES.includes(p.category) ? p.category : 'Frontend',
                visibility: p.visibility === 'hidden' ? 'hidden' : 'public',
                order: p.order ?? idx + 1,
              }))
          : [...SEED_PROJECTS];

        const recoveredSkills = hasSkills
          ? parsed.skills
              .filter((s) => s && typeof s === 'object' && s.name)
              .map((s, idx) => ({
                ...s,
                id: s.id || generateId(),
                category: SKILL_CATEGORIES.includes(s.category) ? s.category : 'Frontend',
                proficiency: Number(s.proficiency ?? 80),
                displayOrder: s.displayOrder ?? idx + 1,
                visibility: s.visibility === 'hidden' ? 'hidden' : 'public',
              }))
          : [...SEED_SKILLS];

        const recoveredSettings = {
          ...SEED_SETTINGS,
          ...(parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {}),
        };

        const candidateData = {
          schemaVersion: SCHEMA_VERSION,
          lastUpdated: new Date().toISOString(),
          projects: recoveredProjects,
          skills: recoveredSkills,
          settings: recoveredSettings,
        };

        const validation = validateBackupData(candidateData);
        if (validation.valid) {
          try {
            saveToStorage(candidateData);
          } catch {
            // ignore save failure during read phase
          }
          return candidateData;
        }
      }
    }

    // If completely unrecoverable, backup raw data and reset
    try {
      storage.setItem(`${STORAGE_KEY}_corrupt_raw_bak_${Date.now()}`, raw);
    } catch {
      // ignore backup storage errors
    }
    const defaultData = createDefaultData();
    try {
      saveToStorage(defaultData);
    } catch {
      // ignore save failure during read phase
    }
    return defaultData;
  } catch (err) {
    if (!simulateWriteFailure) {
      console.error('Failed to load storage data, resetting to seeds:', err);
    }
    return createDefaultData();
  }
}

/**
 * Safely persists portfolio data to storage
 * Throws explicit error on write failures (e.g. quota exceeded)
 */
function saveToStorage(data) {
  const storage = getStorage();
  data.lastUpdated = new Date().toISOString();
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    throw new Error(`LocalStorage write failed: ${err.message || 'Storage quota exceeded'}`);
  }
}

/**
 * Repository interface for portfolio data
 */
export const portfolioRepository = {
  // ---------------- PROJECTS ----------------
  async getProjects() {
    const data = loadFromStorage();
    return [...data.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  async addProject(projectInput) {
    const data = loadFromStorage();

    const title = typeof projectInput.title === 'string' ? projectInput.title.trim() : '';
    const slug = projectInput.slug
      ? generateUniqueSlug(projectInput.slug, data.projects)
      : generateUniqueSlug(title, data.projects);

    const newProject = {
      id: projectInput.id || generateId(),
      title,
      slug,
      shortDescription: projectInput.shortDescription || '',
      fullDescription: projectInput.fullDescription || '',
      category: projectInput.category || 'Frontend',
      technologies: Array.isArray(projectInput.technologies) ? projectInput.technologies : [],
      imageUrl: projectInput.imageUrl || '',
      additionalImages: Array.isArray(projectInput.additionalImages) ? projectInput.additionalImages : [],
      githubUrl: projectInput.githubUrl || '',
      liveUrl: projectInput.liveUrl || '',
      featured: Boolean(projectInput.featured),
      visibility: projectInput.visibility === 'hidden' ? 'hidden' : 'public',
      order: projectInput.order ?? (data.projects.length + 1),
      createdAt: projectInput.createdAt || new Date().toISOString(),
    };

    const validation = validateProject(newProject);
    if (!validation.valid) {
      throw new Error(`Invalid project: ${validation.errors.join(', ')}`);
    }

    // Check slug uniqueness
    if (data.projects.some((p) => p.slug === newProject.slug)) {
      throw new Error(`Project slug "${newProject.slug}" is already in use.`);
    }

    const nextProjects = [...data.projects, newProject];
    saveToStorage({ ...data, projects: nextProjects });
    return newProject;
  },

  async updateProject(id, updates) {
    const data = loadFromStorage();
    const index = data.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Project with ID "${id}" not found.`);
    }

    const current = data.projects[index];
    let nextSlug = current.slug;
    if (updates.slug && updates.slug !== current.slug) {
      if (data.projects.some((p) => p.id !== id && p.slug === updates.slug)) {
        throw new Error(`Project slug "${updates.slug}" is already in use.`);
      }
      nextSlug = updates.slug;
    } else if (updates.title && updates.title !== current.title && !updates.slug) {
      nextSlug = generateUniqueSlug(updates.title, data.projects, id);
    }

    const updated = {
      ...current,
      ...updates,
      id: current.id, // ID cannot be mutated
      slug: nextSlug,
    };

    const validation = validateProject(updated);
    if (!validation.valid) {
      throw new Error(`Invalid project update: ${validation.errors.join(', ')}`);
    }

    const nextProjects = [...data.projects];
    nextProjects[index] = updated;
    saveToStorage({ ...data, projects: nextProjects });
    return updated;
  },

  async deleteProject(id) {
    const data = loadFromStorage();
    const filtered = data.projects.filter((p) => p.id !== id);
    if (filtered.length === data.projects.length) {
      throw new Error(`Project with ID "${id}" not found.`);
    }
    saveToStorage({ ...data, projects: filtered });
    return true;
  },

  // ---------------- SKILLS ----------------
  async getSkills() {
    const data = loadFromStorage();
    return [...data.skills].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  },

  async addSkill(skillInput) {
    const data = loadFromStorage();

    const name = typeof skillInput.name === 'string' ? skillInput.name.trim() : '';

    const newSkill = {
      id: skillInput.id || generateId(),
      name,
      category: skillInput.category || 'Frontend',
      iconIdentifier: skillInput.iconIdentifier || 'FaCode',
      proficiency: Number(skillInput.proficiency ?? 80),
      displayOrder: skillInput.displayOrder ?? (data.skills.length + 1),
      visibility: skillInput.visibility === 'hidden' ? 'hidden' : 'public',
    };

    const validation = validateSkill(newSkill);
    if (!validation.valid) {
      throw new Error(`Invalid skill: ${validation.errors.join(', ')}`);
    }

    const nextSkills = [...data.skills, newSkill];
    saveToStorage({ ...data, skills: nextSkills });
    return newSkill;
  },

  async updateSkill(id, updates) {
    const data = loadFromStorage();
    const index = data.skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Skill with ID "${id}" not found.`);
    }

    const current = data.skills[index];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      proficiency: updates.proficiency !== undefined ? Number(updates.proficiency) : current.proficiency,
    };

    const validation = validateSkill(updated);
    if (!validation.valid) {
      throw new Error(`Invalid skill update: ${validation.errors.join(', ')}`);
    }

    const nextSkills = [...data.skills];
    nextSkills[index] = updated;
    saveToStorage({ ...data, skills: nextSkills });
    return updated;
  },

  async deleteSkill(id) {
    const data = loadFromStorage();
    const filtered = data.skills.filter((s) => s.id !== id);
    if (filtered.length === data.skills.length) {
      throw new Error(`Skill with ID "${id}" not found.`);
    }
    saveToStorage({ ...data, skills: filtered });
    return true;
  },

  // ---------------- SETTINGS ----------------
  async getSettings() {
    const data = loadFromStorage();
    return { ...data.settings };
  },

  async updateSettings(settingsInput) {
    const data = loadFromStorage();
    const updated = {
      ...data.settings,
      ...settingsInput,
    };

    const validation = validateSettings(updated);
    if (!validation.valid) {
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }

    saveToStorage({ ...data, settings: updated });
    return updated;
  },

  // ---------------- BACKUP & EXPORT/IMPORT ----------------
  async exportData() {
    const data = loadFromStorage();
    return {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      projects: data.projects,
      skills: data.skills,
      settings: data.settings,
    };
  },

  async importData(importedInput) {
    let parsed;
    if (typeof importedInput === 'string') {
      try {
        parsed = JSON.parse(importedInput);
      } catch (e) {
        throw new Error(`Invalid JSON syntax: ${e.message}`);
      }
    } else {
      parsed = importedInput;
    }

    // Atomic complete validation BEFORE touching existing data
    const validation = validateBackupData(parsed);
    if (!validation.valid) {
      throw new Error(`Backup validation failed: ${validation.errors.join('; ')}`);
    }

    // Safety check: ensure arrays exist
    const sanitizedData = {
      schemaVersion: SCHEMA_VERSION,
      lastUpdated: new Date().toISOString(),
      projects: parsed.projects.map((p, idx) => ({
        ...p,
        id: p.id || generateId(),
        slug: p.slug || generateUniqueSlug(p.title),
        order: p.order ?? idx + 1,
      })),
      skills: parsed.skills.map((s, idx) => ({
        ...s,
        id: s.id || generateId(),
        displayOrder: s.displayOrder ?? idx + 1,
      })),
      settings: { ...parsed.settings },
    };

    saveToStorage(sanitizedData);
    return sanitizedData;
  },

  async resetData() {
    const defaultData = createDefaultData();
    saveToStorage(defaultData);
    return defaultData;
  },

  // ---------------- TESTING UTILITIES ----------------
  __setSimulateWriteFailure(shouldFail) {
    simulateWriteFailure = shouldFail;
  },
};
