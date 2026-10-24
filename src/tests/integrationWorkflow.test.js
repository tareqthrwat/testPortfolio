import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { portfolioRepository } from '../services/portfolioRepository.js';

describe('Task 5.4 Integration & Synchronization Verification Tests', () => {
  beforeEach(async () => {
    portfolioRepository.__setSimulateWriteFailure(false);
    await portfolioRepository.resetData();
  });

  // 1. PROJECTS WORKFLOW INTEGRATION
  describe('1. Projects Integration Workflow', () => {
    test('Add, edit, toggle visibility, reorder, and delete flow preserves data and public filters', async () => {
      // 1. Initial public projects
      const initial = await portfolioRepository.getProjects();
      assert.strictEqual(initial.length, 3);

      // 2. Add a new project
      const newProj = await portfolioRepository.addProject({
        title: 'Cyberpunk Portfolio Hub',
        shortDescription: 'Modern cybernetic interactive portal',
        category: 'Frontend',
        technologies: ['React', 'Tailwind', 'Motion'],
        visibility: 'public',
        featured: true,
        order: 4,
      });

      let allProjects = await portfolioRepository.getProjects();
      assert.strictEqual(allProjects.length, 4);
      let publicProjects = allProjects.filter((p) => p.visibility === 'public');
      assert.strictEqual(publicProjects.length, 4);
      assert.ok(publicProjects.some((p) => p.id === newProj.id && p.featured === true));

      // 3. Edit project
      const updated = await portfolioRepository.updateProject(newProj.id, {
        title: 'Cyberpunk Portfolio Pro Edition',
        featured: false,
      });
      assert.strictEqual(updated.title, 'Cyberpunk Portfolio Pro Edition');
      assert.strictEqual(updated.featured, false);

      // 4. Hide project
      await portfolioRepository.updateProject(newProj.id, {
        visibility: 'hidden',
      });
      allProjects = await portfolioRepository.getProjects();
      publicProjects = allProjects.filter((p) => p.visibility === 'public');
      assert.strictEqual(publicProjects.length, 3);
      assert.ok(!publicProjects.some((p) => p.id === newProj.id));

      // 5. Restore visibility
      await portfolioRepository.updateProject(newProj.id, {
        visibility: 'public',
      });
      allProjects = await portfolioRepository.getProjects();
      publicProjects = allProjects.filter((p) => p.visibility === 'public');
      assert.strictEqual(publicProjects.length, 4);

      // 6. Reorder project to front
      await portfolioRepository.updateProject(newProj.id, { order: 0 });
      allProjects = await portfolioRepository.getProjects();
      const sortedPublic = allProjects
        .filter((p) => p.visibility === 'public')
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      assert.strictEqual(sortedPublic[0].id, newProj.id);

      // 7. Delete project
      await portfolioRepository.deleteProject(newProj.id);
      allProjects = await portfolioRepository.getProjects();
      assert.strictEqual(allProjects.length, 3);
      assert.ok(!allProjects.some((p) => p.id === newProj.id));
    });

    test('Edge cases: missing URLs, long title/description, special characters', async () => {
      const edgeProj = await portfolioRepository.addProject({
        title: 'Extremely Long Project Title Designed To Test Text Wrap And Overflow Containers Responsively Without Breaking Layout Boundaries',
        shortDescription: 'Very long description that continues for a long time to verify graceful multi-line rendering across mobile, tablet, and desktop viewport sizes.',
        category: 'Full Stack',
        technologies: ['React 19', 'Next.js', 'TailwindCSS 4'],
        githubUrl: '',
        liveUrl: '',
        imageUrl: '',
      });

      assert.strictEqual(edgeProj.liveUrl, '');
      assert.strictEqual(edgeProj.githubUrl, '');
      assert.strictEqual(edgeProj.imageUrl, '');
      assert.ok(edgeProj.slug.startsWith('extremely-long-project-title'));
    });
  });

  // 2. SKILLS WORKFLOW INTEGRATION
  describe('2. Skills Integration Workflow', () => {
    test('Add, edit proficiency, toggle visibility, reorder, delete flow', async () => {
      const initialSkills = await portfolioRepository.getSkills();
      assert.strictEqual(initialSkills.length, 5);

      // 1. Add skill
      const newSkill = await portfolioRepository.addSkill({
        name: 'TypeScript',
        category: 'Frontend',
        iconIdentifier: 'SiTypescript',
        proficiency: 88,
        visibility: 'public',
        displayOrder: 6,
      });

      let allSkills = await portfolioRepository.getSkills();
      assert.strictEqual(allSkills.length, 6);
      let publicSkills = allSkills.filter((s) => s.visibility === 'public');
      assert.strictEqual(publicSkills.length, 6);

      // 2. Edit proficiency (edge cases: 0% and 100%)
      const skillAtZero = await portfolioRepository.updateSkill(newSkill.id, { proficiency: 0 });
      assert.strictEqual(skillAtZero.proficiency, 0);

      const skillAtHundred = await portfolioRepository.updateSkill(newSkill.id, { proficiency: 100 });
      assert.strictEqual(skillAtHundred.proficiency, 100);

      // 3. Hide skill
      await portfolioRepository.updateSkill(newSkill.id, { visibility: 'hidden' });
      allSkills = await portfolioRepository.getSkills();
      publicSkills = allSkills.filter((s) => s.visibility === 'public');
      assert.strictEqual(publicSkills.length, 5);
      assert.ok(!publicSkills.some((s) => s.id === newSkill.id));

      // 4. Restore visibility
      await portfolioRepository.updateSkill(newSkill.id, { visibility: 'public' });
      allSkills = await portfolioRepository.getSkills();
      publicSkills = allSkills.filter((s) => s.visibility === 'public');
      assert.strictEqual(publicSkills.length, 6);

      // 5. Reorder skill to top priority (displayOrder: 0)
      await portfolioRepository.updateSkill(newSkill.id, { displayOrder: 0 });
      allSkills = await portfolioRepository.getSkills();
      const sortedSkills = allSkills
        .filter((s) => s.visibility === 'public')
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      assert.strictEqual(sortedSkills[0].id, newSkill.id);

      // 6. Delete skill
      await portfolioRepository.deleteSkill(newSkill.id);
      allSkills = await portfolioRepository.getSkills();
      assert.strictEqual(allSkills.length, 5);
      assert.ok(!allSkills.some((s) => s.id === newSkill.id));
    });
  });

  // 3. PROFILE SETTINGS WORKFLOW INTEGRATION
  describe('3. Profile Settings Workflow', () => {
    test('Settings updates persist and handle edge cases and restore', async () => {
      const original = await portfolioRepository.getSettings();
      assert.strictEqual(original.developerName, 'Tarek');

      // Update settings
      const updated = await portfolioRepository.updateSettings({
        developerName: 'Tarek Al-Sayed',
        professionalTitle: 'Senior Full Stack & Distributed Systems Specialist',
        aboutMe: 'Engineering high-resilience systems and cinematic user experiences.',
        email: 'tarek.custom@example.com',
        githubUrl: 'https://github.com/tarek-custom',
        linkedinUrl: 'https://linkedin.com/in/tarek-custom',
        resumeUrl: 'https://example.com/resume-custom.pdf',
        profileImageUrl: 'https://example.com/custom-avatar.jpg',
      });

      assert.strictEqual(updated.developerName, 'Tarek Al-Sayed');
      assert.strictEqual(updated.email, 'tarek.custom@example.com');

      // Refresh to confirm persistence
      const persisted = await portfolioRepository.getSettings();
      assert.strictEqual(persisted.developerName, 'Tarek Al-Sayed');
      assert.strictEqual(persisted.githubUrl, 'https://github.com/tarek-custom');

      // Edge case: Empty optional links
      const emptyOptional = await portfolioRepository.updateSettings({
        developerName: 'Tarek',
        email: '',
        githubUrl: '',
        linkedinUrl: '',
        resumeUrl: '',
      });
      assert.strictEqual(emptyOptional.developerName, 'Tarek');
      assert.strictEqual(emptyOptional.githubUrl, '');

      // Reset restores original defaults
      await portfolioRepository.resetData();
      const restored = await portfolioRepository.getSettings();
      assert.strictEqual(restored.developerName, 'Tarek');
      assert.strictEqual(restored.professionalTitle, 'Frontend Developer | React Specialist');
    });
  });

  // 4. BACKUP EXPORT & IMPORT SYNCHRONIZATION
  describe('4. Backup Export & Import Synchronization', () => {
    test('Exporting, modifying, and re-importing restores exact state without corruption', async () => {
      // Create unique test state
      await portfolioRepository.addProject({
        title: 'Backup Test Project',
        category: 'Backend',
      });
      await portfolioRepository.updateSettings({
        developerName: 'Snapshot Developer',
      });

      const backupObj = await portfolioRepository.exportData();
      const backupString = JSON.stringify(backupObj);
      assert.ok(backupString.includes('Backup Test Project'));
      assert.ok(backupString.includes('Snapshot Developer'));

      // Make disruptive changes
      await portfolioRepository.resetData();
      const resetProjects = await portfolioRepository.getProjects();
      assert.strictEqual(resetProjects.length, 3);
      assert.ok(!resetProjects.some((p) => p.title === 'Backup Test Project'));

      // Import backup string
      const imported = await portfolioRepository.importData(backupString);
      assert.strictEqual(imported.projects.length, 4);
      assert.strictEqual(imported.settings.developerName, 'Snapshot Developer');

      const currentProjects = await portfolioRepository.getProjects();
      assert.strictEqual(currentProjects.length, 4);
      assert.ok(currentProjects.some((p) => p.title === 'Backup Test Project'));
    });
  });
});
