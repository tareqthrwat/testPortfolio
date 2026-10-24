import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { portfolioRepository } from '../services/portfolioRepository.js';
import { SEED_PROJECTS, SEED_SKILLS, SEED_SETTINGS } from '../data/seedData.js';

describe('Phase 6.7 Full Functional & Synchronization Testing', () => {
  beforeEach(async () => {
    portfolioRepository.__setSimulateWriteFailure(false);
    await portfolioRepository.resetData();
  });

  // 1. PROJECT WORKFLOW
  describe('Project CRUD, Visibility, Featured State, and Reordering', () => {
    test('complete project lifecycle from creation to deletion', async () => {
      // 1. Create
      const created = await portfolioRepository.addProject({
        title: 'Quantum Neural Interface',
        shortDescription: 'Brain-computer telemetry dashboard',
        fullDescription: 'Comprehensive telemetry and interactive neural control systems.',
        category: 'Full Stack',
        technologies: ['React', 'TypeScript', 'Tailwind', 'WebSockets'],
        imageUrl: 'https://example.com/quantum.png',
        liveUrl: 'https://quantum.example.com',
        githubUrl: 'https://github.com/example/quantum',
        featured: true,
        visibility: 'public',
        order: 4,
      });

      assert.ok(created.id);
      assert.strictEqual(created.title, 'Quantum Neural Interface');
      assert.strictEqual(created.slug, 'quantum-neural-interface');
      assert.strictEqual(created.featured, true);
      assert.strictEqual(created.visibility, 'public');

      // 2. Read
      let allProjects = await portfolioRepository.getProjects();
      assert.strictEqual(allProjects.length, 4);
      let found = allProjects.find((p) => p.id === created.id);
      assert.ok(found);
      assert.deepStrictEqual(found.technologies, ['React', 'TypeScript', 'Tailwind', 'WebSockets']);

      // 3. Update title and slug
      const updated = await portfolioRepository.updateProject(created.id, {
        title: 'Quantum Neural Interface Pro',
        shortDescription: 'Upgraded brain-computer interface',
      });
      assert.strictEqual(updated.title, 'Quantum Neural Interface Pro');
      assert.strictEqual(updated.shortDescription, 'Upgraded brain-computer interface');

      // 4. Toggle visibility (hidden)
      await portfolioRepository.updateProject(created.id, { visibility: 'hidden' });
      allProjects = await portfolioRepository.getProjects();
      let publicOnly = allProjects.filter((p) => p.visibility === 'public');
      assert.strictEqual(publicOnly.length, 3);
      assert.ok(!publicOnly.some((p) => p.id === created.id));

      // 5. Toggle visibility back (public)
      await portfolioRepository.updateProject(created.id, { visibility: 'public' });
      allProjects = await portfolioRepository.getProjects();
      publicOnly = allProjects.filter((p) => p.visibility === 'public');
      assert.strictEqual(publicOnly.length, 4);

      // 6. Toggle featured state
      await portfolioRepository.updateProject(created.id, { featured: false });
      allProjects = await portfolioRepository.getProjects();
      found = allProjects.find((p) => p.id === created.id);
      assert.strictEqual(found.featured, false);

      // 7. Reorder project to front
      await portfolioRepository.updateProject(created.id, { order: 0 });
      allProjects = await portfolioRepository.getProjects();
      const sorted = [...allProjects].sort((a, b) => a.order - b.order);
      assert.strictEqual(sorted[0].id, created.id);

      // 8. Delete project
      const deleteResult = await portfolioRepository.deleteProject(created.id);
      assert.strictEqual(deleteResult, true);
      allProjects = await portfolioRepository.getProjects();
      assert.strictEqual(allProjects.length, 3);
      assert.ok(!allProjects.some((p) => p.id === created.id));
    });
  });

  // 2. SKILL WORKFLOW
  describe('Skill CRUD, Visibility, Proficiency, Icons, and Reordering', () => {
    test('complete skill lifecycle from creation to deletion', async () => {
      // 1. Create
      const newSkill = await portfolioRepository.addSkill({
        name: 'GraphQL',
        category: 'Backend',
        iconIdentifier: 'SiGraphql',
        proficiency: 88,
        visibility: 'public',
      });

      assert.ok(newSkill.id);
      assert.strictEqual(newSkill.name, 'GraphQL');
      assert.strictEqual(newSkill.proficiency, 88);
      assert.strictEqual(newSkill.iconIdentifier, 'SiGraphql');
      assert.strictEqual(newSkill.visibility, 'public');

      // 2. Read
      let allSkills = await portfolioRepository.getSkills();
      assert.strictEqual(allSkills.length, 6);

      // 3. Update proficiency & icon
      const updatedSkill = await portfolioRepository.updateSkill(newSkill.id, {
        proficiency: 95,
        iconIdentifier: 'FaCode',
      });
      assert.strictEqual(updatedSkill.proficiency, 95);
      assert.strictEqual(updatedSkill.iconIdentifier, 'FaCode');

      // 4. Proficiency boundaries validation
      await assert.rejects(
        () => portfolioRepository.updateSkill(newSkill.id, { proficiency: 150 }),
        /proficiency/i
      );
      await assert.rejects(
        () => portfolioRepository.updateSkill(newSkill.id, { proficiency: -10 }),
        /proficiency/i
      );

      // 5. Toggle visibility (hidden)
      await portfolioRepository.updateSkill(newSkill.id, { visibility: 'hidden' });
      allSkills = await portfolioRepository.getSkills();
      let publicSkills = allSkills.filter((s) => s.visibility === 'public');
      assert.strictEqual(publicSkills.length, 5);
      assert.ok(!publicSkills.some((s) => s.id === newSkill.id));

      // 6. Toggle visibility back (public)
      await portfolioRepository.updateSkill(newSkill.id, { visibility: 'public' });
      allSkills = await portfolioRepository.getSkills();
      publicSkills = allSkills.filter((s) => s.visibility === 'public');
      assert.strictEqual(publicSkills.length, 6);

      // 7. Reorder skill to top priority (displayOrder: 0)
      await portfolioRepository.updateSkill(newSkill.id, { displayOrder: 0 });
      allSkills = await portfolioRepository.getSkills();
      const sortedSkills = [...allSkills].sort((a, b) => a.displayOrder - b.displayOrder);
      assert.strictEqual(sortedSkills[0].id, newSkill.id);

      // 8. Delete skill
      const deleteSuccess = await portfolioRepository.deleteSkill(newSkill.id);
      assert.strictEqual(deleteSuccess, true);
      allSkills = await portfolioRepository.getSkills();
      assert.strictEqual(allSkills.length, 5);
      assert.ok(!allSkills.some((s) => s.id === newSkill.id));
    });
  });

  // 3. PROFILE SETTINGS & PUBLIC SYNCHRONIZATION
  describe('Profile Settings and Public Synchronization', () => {
    test('settings update, persist, and synchronize accurately', async () => {
      const initialSettings = await portfolioRepository.getSettings();
      assert.strictEqual(initialSettings.developerName, 'Tarek');

      const updatedSettings = await portfolioRepository.updateSettings({
        developerName: 'Tarek Tharwat',
        professionalTitle: 'Senior Frontend Engineer & UI Architect',
        aboutMe: 'Engineering high-performance reactive web systems with cinematic precision.',
        email: 'tarek.tharwat@example.com',
        githubUrl: 'https://github.com/tareqthrwat/new',
        linkedinUrl: 'https://linkedin.com/in/tarek-tharwat',
        resumeUrl: 'https://example.com/resume.pdf',
      });

      assert.strictEqual(updatedSettings.developerName, 'Tarek Tharwat');
      assert.strictEqual(updatedSettings.professionalTitle, 'Senior Frontend Engineer & UI Architect');
      assert.strictEqual(updatedSettings.email, 'tarek.tharwat@example.com');
      assert.strictEqual(updatedSettings.resumeUrl, 'https://example.com/resume.pdf');

      // Verify re-reading from repository persists exact changes
      const persistedSettings = await portfolioRepository.getSettings();
      assert.strictEqual(persistedSettings.developerName, 'Tarek Tharwat');
      assert.strictEqual(persistedSettings.aboutMe, 'Engineering high-performance reactive web systems with cinematic precision.');
    });
  });

  // 4. BACKUP EXPORT & IMPORT
  describe('Backup Export and Import Synchronization', () => {
    test('backup can be exported and imported without data corruption', async () => {
      // 1. Export initial backup
      const backup = await portfolioRepository.exportData();
      assert.ok(backup.exportedAt);
      assert.strictEqual(backup.schemaVersion, 1);
      assert.strictEqual(backup.projects.length, 3);
      assert.strictEqual(backup.skills.length, 5);
      assert.strictEqual(backup.settings.developerName, 'Tarek');

      // 2. Mutate active data
      await portfolioRepository.addProject({
        title: 'Temporary Project For Wipe Test',
        category: 'Frontend',
      });
      await portfolioRepository.updateSettings({
        developerName: 'Different Name',
      });

      let currentProjects = await portfolioRepository.getProjects();
      assert.strictEqual(currentProjects.length, 4);

      // 3. Import previous backup
      const importResult = await portfolioRepository.importData(backup);
      assert.strictEqual(importResult.projects.length, 3);

      // 4. Verify exact state is restored
      const restoredProjects = await portfolioRepository.getProjects();
      const restoredSkills = await portfolioRepository.getSkills();
      const restoredSettings = await portfolioRepository.getSettings();

      assert.strictEqual(restoredProjects.length, 3);
      assert.strictEqual(restoredSkills.length, 5);
      assert.strictEqual(restoredSettings.developerName, 'Tarek');
    });

    test('malformed backup is rejected and leaves existing data intact', async () => {
      const corruptPayload = {
        schemaVersion: 'invalid',
        projects: 'not-an-array',
      };

      await assert.rejects(
        () => portfolioRepository.importData(corruptPayload),
        /backup validation failed/i
      );

      // Data is intact
      const projects = await portfolioRepository.getProjects();
      assert.strictEqual(projects.length, 3);
    });
  });

  // 5. RESET TO DEFAULTS
  describe('Reset to Defaults Workflow', () => {
    test('resetData restores original seed data exactly', async () => {
      // Add custom items
      await portfolioRepository.addProject({ title: 'Extra 1', category: 'Backend' });
      await portfolioRepository.addSkill({ name: 'Docker', category: 'DevOps', proficiency: 75 });
      await portfolioRepository.updateSettings({ developerName: 'Custom Dev' });

      assert.strictEqual((await portfolioRepository.getProjects()).length, 4);
      assert.strictEqual((await portfolioRepository.getSkills()).length, 6);
      assert.strictEqual((await portfolioRepository.getSettings()).developerName, 'Custom Dev');

      // Reset
      await portfolioRepository.resetData();

      const resetProjects = await portfolioRepository.getProjects();
      const resetSkills = await portfolioRepository.getSkills();
      const resetSettings = await portfolioRepository.getSettings();

      assert.strictEqual(resetProjects.length, SEED_PROJECTS.length);
      assert.strictEqual(resetSkills.length, SEED_SKILLS.length);
      assert.strictEqual(resetSettings.developerName, SEED_SETTINGS.developerName);
    });
  });

  // 6. LOCALSTORAGE PERSISTENCE & ERROR RECOVERY
  describe('LocalStorage Persistence & Error Recovery', () => {
    test('write failure simulation throws and prevents corrupted state', async () => {
      portfolioRepository.__setSimulateWriteFailure(true);

      await assert.rejects(
        () => portfolioRepository.addProject({ title: 'Failing Project', category: 'Frontend' }),
        /quota exceeded|storage write failed/i
      );

      portfolioRepository.__setSimulateWriteFailure(false);
      const projects = await portfolioRepository.getProjects();
      assert.strictEqual(projects.length, 3);
    });
  });
});
