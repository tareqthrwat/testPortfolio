import { createContext, useEffect, useState, useCallback } from 'react';
import { portfolioRepository } from '../services/portfolioRepository';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [fetchedProjects, fetchedSkills, fetchedSettings] = await Promise.all([
        portfolioRepository.getProjects(),
        portfolioRepository.getSkills(),
        portfolioRepository.getSettings(),
      ]);
      setProjects(fetchedProjects);
      setSkills(fetchedSkills);
      setSettings(fetchedSettings);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
      setError(err.message || 'Error loading portfolio data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Project Actions
  const addProject = async (projectData) => {
    try {
      const created = await portfolioRepository.addProject(projectData);
      setProjects((prev) => [...prev, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      return { success: true, project: created };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const updated = await portfolioRepository.updateProject(id, updates);
      setProjects((prev) =>
        prev
          .map((p) => (p.id === id ? updated : p))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      );
      return { success: true, project: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteProject = async (id) => {
    try {
      await portfolioRepository.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Skill Actions
  const addSkill = async (skillData) => {
    try {
      const created = await portfolioRepository.addSkill(skillData);
      setSkills((prev) => [...prev, created].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
      return { success: true, skill: created };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateSkill = async (id, updates) => {
    try {
      const updated = await portfolioRepository.updateSkill(id, updates);
      setSkills((prev) =>
        prev
          .map((s) => (s.id === id ? updated : s))
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      );
      return { success: true, skill: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteSkill = async (id) => {
    try {
      await portfolioRepository.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Settings Actions
  const updateSettings = async (newSettings) => {
    try {
      const updated = await portfolioRepository.updateSettings(newSettings);
      setSettings(updated);
      return { success: true, settings: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Backup & Restore
  const exportData = async () => {
    return await portfolioRepository.exportData();
  };

  const importData = async (jsonDataOrString) => {
    try {
      const restored = await portfolioRepository.importData(jsonDataOrString);
      setProjects(restored.projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      setSkills(restored.skills.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
      setSettings(restored.settings);
      return { success: true, data: restored };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetData = async () => {
    try {
      const reset = await portfolioRepository.resetData();
      setProjects(reset.projects);
      setSkills(reset.skills);
      setSettings(reset.settings);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    projects,
    skills,
    settings,
    isLoading,
    error,
    refreshData: loadAllData,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    updateSettings,
    exportData,
    importData,
    resetData,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export { PortfolioContext };

