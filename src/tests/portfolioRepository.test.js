import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { portfolioRepository } from '../services/portfolioRepository.js';

describe('Portfolio Repository Core & Verification Tests', () => {
  beforeEach(async () => {
    portfolioRepository.__setSimulateWriteFailure(false);
    await portfolioRepository.resetData();
  });

  // ---------------- ORIGINAL DATA ACCURACY ----------------
  test('Check 6: Original 3 projects, 5 skills, and profile settings are accurately extracted', async () => {
    const projects = await portfolioRepository.getProjects();
    const skills = await portfolioRepository.getSkills();
    const settings = await portfolioRepository.getSettings();

    // Projects verification
    assert.strictEqual(projects.length, 3);
    assert.strictEqual(projects[0].title, 'Book Store E-Commerce Website');
    assert.strictEqual(projects[0].liveUrl, 'https://ecommercelibrary-9kid5tlyq-tareks-projects-343b86d1.vercel.app/');
    assert.strictEqual(projects[0].githubUrl, 'https://github.com/tareqthrwat/Ecommercelibrary');
    assert.deepStrictEqual(projects[0].technologies, ['React', 'Tailwind']);

    assert.strictEqual(projects[1].title, 'Synapse Analytics');
    assert.strictEqual(projects[1].liveUrl, 'https://e-comares-9sn4ivvka-tareks-projects-343b86d1.vercel.app');
    assert.strictEqual(projects[1].githubUrl, 'https://github.com/tareqthrwat/E-Comares');

    assert.strictEqual(projects[2].title, 'Orbital Studio');
    assert.strictEqual(projects[2].imageUrl, 'STUDIO//LAB');
    assert.strictEqual(projects[2].githubUrl, 'https://github.com/');

    // Skills verification
    assert.strictEqual(skills.length, 5);
    const skillMap = new Map(skills.map((s) => [s.name, s.proficiency]));
    assert.strictEqual(skillMap.get('HTML'), 96);
    assert.strictEqual(skillMap.get('CSS'), 93);
    assert.strictEqual(skillMap.get('JavaScript'), 90);
    assert.strictEqual(skillMap.get('React'), 92);
    assert.strictEqual(skillMap.get('Tailwind CSS'), 95);

    // Profile Settings verification
    assert.strictEqual(settings.developerName, 'Tarek');
    assert.strictEqual(settings.professionalTitle, 'Frontend Developer | React Specialist');
    assert.ok(settings.aboutMe.includes('Still learning, still building'));
  });

  // ---------------- DUPLICATE TITLES & SLUGS ----------------
  test('Check 2: Duplicate project titles cannot create conflicting slugs', async () => {
    const p1 = await portfolioRepository.addProject({
      title: 'Portfolio Dashboard',
      category: 'Frontend',
    });
    assert.strictEqual(p1.slug, 'portfolio-dashboard');

    const p2 = await portfolioRepository.addProject({
      title: 'Portfolio Dashboard',
      category: 'Frontend',
    });
    assert.strictEqual(p2.slug, 'portfolio-dashboard-2');

    const p3 = await portfolioRepository.addProject({
      title: 'Portfolio Dashboard',
      category: 'Frontend',
    });
    assert.strictEqual(p3.slug, 'portfolio-dashboard-3');

    // Updating a title to match an existing project generates unique slug
    const updated = await portfolioRepository.updateProject(p3.id, {
      title: 'Synapse Analytics', // existing seed title
    });
    assert.strictEqual(updated.slug, 'synapse-analytics-2');
  });

  // ---------------- LOCALSTORAGE WRITE FAILURES ----------------
  test('Check 3: LocalStorage write failures throw and do not produce false success', async () => {
    portfolioRepository.__setSimulateWriteFailure(true);

    await assert.rejects(
      async () => {
        await portfolioRepository.addProject({
          title: 'Failing Project',
          category: 'Frontend',
        });
      },
      /LocalStorage write failed: QuotaExceededError/
    );

    // Turn failure off and verify storage did not accumulate corrupt data
    portfolioRepository.__setSimulateWriteFailure(false);
    const projects = await portfolioRepository.getProjects();
    assert.strictEqual(projects.length, 3);
  });

  // ---------------- BACKUP VALIDATION (DUPLICATES & CONFLICTS) ----------------
  test('Check 4: Imported backups reject duplicate IDs and conflicting project slugs', async () => {
    // Duplicate Project IDs
    await assert.rejects(
      async () => {
        await portfolioRepository.importData({
          schemaVersion: 1,
          projects: [
            { id: 'dup_proj', title: 'P1', slug: 'p1', category: 'Frontend' },
            { id: 'dup_proj', title: 'P2', slug: 'p2', category: 'Frontend' },
          ],
          skills: [],
          settings: { developerName: 'Tarek' },
        });
      },
      /Duplicate project ID detected/
    );

    // Duplicate Project Slugs
    await assert.rejects(
      async () => {
        await portfolioRepository.importData({
          schemaVersion: 1,
          projects: [
            { id: 'p1', title: 'P1', slug: 'same-slug', category: 'Frontend' },
            { id: 'p2', title: 'P2', slug: 'same-slug', category: 'Frontend' },
          ],
          skills: [],
          settings: { developerName: 'Tarek' },
        });
      },
      /Conflicting duplicate project slug detected/
    );

    // Duplicate Skill IDs
    await assert.rejects(
      async () => {
        await portfolioRepository.importData({
          schemaVersion: 1,
          projects: [{ id: 'p1', title: 'P1', slug: 'p1', category: 'Frontend' }],
          skills: [
            { id: 'dup_skill', name: 'S1', category: 'Frontend', proficiency: 80 },
            { id: 'dup_skill', name: 'S2', category: 'Frontend', proficiency: 90 },
          ],
          settings: { developerName: 'Tarek' },
        });
      },
      /Duplicate skill ID detected/
    );
  });

  // ---------------- SAFE RECOVERY OF PARTIAL USER DATA ----------------
  test('Check 1 & 5: Recoverable partial data preserves user projects without data loss', async () => {
    // Add custom project
    const custom = await portfolioRepository.addProject({
      title: 'Custom User Project',
      category: 'Frontend',
      technologies: ['Vue', 'Vite'],
    });

    const projectsBefore = await portfolioRepository.getProjects();
    assert.strictEqual(projectsBefore.length, 4);

    // Verify it persists on subsequent fetch
    const projectsAfter = await portfolioRepository.getProjects();
    assert.strictEqual(projectsAfter.length, 4);
    assert.ok(projectsAfter.some((p) => p.id === custom.id));
  });

  // ---------------- GENERAL CRUD & RESET ----------------
  test('Standard CRUD and reset behaviour', async () => {
    const updatedSettings = await portfolioRepository.updateSettings({
      developerName: 'Tarek Tharwat',
    });
    assert.strictEqual(updatedSettings.developerName, 'Tarek Tharwat');

    await portfolioRepository.resetData();
    const resetSettings = await portfolioRepository.getSettings();
    assert.strictEqual(resetSettings.developerName, 'Tarek');
  });

  // ---------------- REORDERING & PERSISTENCE ----------------
  test('Reordering projects and skills persists and returns sorted items', async () => {
    const projects = await portfolioRepository.getProjects();
    const firstProj = projects[0];
    const secondProj = projects[1];

    // Swap order
    await portfolioRepository.updateProject(firstProj.id, { order: 2 });
    await portfolioRepository.updateProject(secondProj.id, { order: 1 });

    const reordered = await portfolioRepository.getProjects();
    assert.strictEqual(reordered[0].id, secondProj.id);
    assert.strictEqual(reordered[1].id, firstProj.id);

    // Skills reordering
    const skills = await portfolioRepository.getSkills();
    const s1 = skills[0];
    const s2 = skills[1];

    await portfolioRepository.updateSkill(s1.id, { displayOrder: 2 });
    await portfolioRepository.updateSkill(s2.id, { displayOrder: 1 });

    const reorderedSkills = await portfolioRepository.getSkills();
    assert.strictEqual(reorderedSkills[0].id, s2.id);
    assert.strictEqual(reorderedSkills[1].id, s1.id);
  });

  // ---------------- TOGGLE VISIBILITY & FEATURED ----------------
  test('Toggling visibility and featured status persists reliably', async () => {
    const projects = await portfolioRepository.getProjects();
    const target = projects[0];

    // Toggle to hidden and not featured
    await portfolioRepository.updateProject(target.id, {
      visibility: 'hidden',
      featured: false,
    });

    const refreshed = await portfolioRepository.getProjects();
    const updated = refreshed.find((p) => p.id === target.id);
    assert.strictEqual(updated.visibility, 'hidden');
    assert.strictEqual(updated.featured, false);
  });

  // ---------------- INPUT VALIDATION EDGE CASES ----------------
  test('Invalid skill inputs are rejected with descriptive errors', async () => {
    // Empty name
    await assert.rejects(
      async () => {
        await portfolioRepository.addSkill({ name: '', proficiency: 50 });
      },
      /Skill name is required/
    );

    // Proficiency out of bounds (> 100)
    await assert.rejects(
      async () => {
        await portfolioRepository.addSkill({ name: 'SuperSkill', proficiency: 150 });
      },
      /Proficiency must be a number between 0 and 100/
    );

    // Invalid category
    await assert.rejects(
      async () => {
        await portfolioRepository.addSkill({ name: 'SuperSkill', category: 'NonExistentCategory' });
      },
      /Invalid category/
    );
  });
});
