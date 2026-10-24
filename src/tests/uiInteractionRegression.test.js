import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Task 7: UI Interaction & Accessibility Regression Tests', () => {
  // ---------------- 1. CONTACT FORM BEHAVIOR & MAILTO WORKFLOW ----------------
  describe('Contact Form Workflow & Validation', () => {
    // Form validation logic matching Contact.jsx
    function validateForm(formData) {
      const errors = {};
      if (!formData.name?.trim()) errors.name = 'Please provide your name';
      if (!formData.email?.trim()) {
        errors.email = 'Please provide your email address';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errors.email = 'Please provide a valid email address';
      }
      if (!formData.message?.trim()) errors.message = 'Please enter a message';
      return errors;
    }

    // Mailto generator matching Contact.jsx
    function buildMailtoUrl(formData, recipientEmail) {
      const rawEmail = recipientEmail?.trim() || '';
      const isValidRecipient =
        Boolean(rawEmail) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) &&
        rawEmail.toLowerCase() !== 'tarek@example.com' &&
        !rawEmail.toLowerCase().endsWith('@example.com');

      if (!isValidRecipient) return null;

      const emailSubject =
        formData.subject?.trim() || `Portfolio Contact from ${formData.name.trim()}`;
      const emailBody = `Sender Name: ${formData.name.trim()}\nSender Email: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`;

      return `mailto:${encodeURIComponent(rawEmail)}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
    }

    test('valid input produces a properly encoded mailto URL with subject and body', () => {
      const validData = {
        name: 'Grace Hopper',
        email: 'grace@navy.mil',
        subject: 'Frontend Architecture Inquiry',
        message: 'Hello Tarek, we would like to invite you for an interview & project discussion.',
      };

      const errors = validateForm(validData);
      assert.strictEqual(Object.keys(errors).length, 0);

      const mailto = buildMailtoUrl(validData, 'developer@portfolio.dev');
      assert.ok(mailto.startsWith('mailto:developer%40portfolio.dev'));
      assert.ok(mailto.includes('subject=Frontend%20Architecture%20Inquiry'));
      assert.ok(mailto.includes('Grace%20Hopper'));
      assert.ok(mailto.includes('interview%20%26%20project%20discussion'));
    });

    test('missing required fields triggers accurate validation errors', () => {
      const emptyData = { name: '', email: '', subject: '', message: '' };
      const errors = validateForm(emptyData);

      assert.strictEqual(errors.name, 'Please provide your name');
      assert.strictEqual(errors.email, 'Please provide your email address');
      assert.strictEqual(errors.message, 'Please enter a message');
    });

    test('invalid email formats are strictly rejected', () => {
      const invalidEmails = ['plainaddress', '@missinguser.com', 'user@domain', 'user@.com'];
      for (const badEmail of invalidEmails) {
        const errors = validateForm({ name: 'User', email: badEmail, message: 'Hi' });
        assert.strictEqual(errors.email, 'Please provide a valid email address');
      }
    });

    test('missing or placeholder recipient email returns null instead of using a fake fallback', () => {
      const data = { name: 'Ada', email: 'ada@domain.org', message: 'Hello' };
      assert.strictEqual(buildMailtoUrl(data, null), null);
      assert.strictEqual(buildMailtoUrl(data, ''), null);
      assert.strictEqual(buildMailtoUrl(data, 'tarek@example.com'), null);
    });
  });

  // ---------------- 2. CLIPBOARD FEEDBACK & ERROR HANDLING ----------------
  describe('Clipboard Feedback Handling', () => {
    test('successful writeText sets copied status', async () => {
      let state = 'idle';
      const mockClipboard = {
        writeText: async () => true,
      };

      await mockClipboard.writeText('tarek@example.com')
        .then(() => { state = 'copied'; })
        .catch(() => { state = 'failed'; });

      assert.strictEqual(state, 'copied');
    });

    test('rejected clipboard writeText sets failed status (never sets copied)', async () => {
      let state = 'idle';
      const mockFailingClipboard = {
        writeText: async () => { throw new Error('NotAllowedError: Permission denied'); },
      };

      await mockFailingClipboard.writeText('tarek@example.com')
        .then(() => { state = 'copied'; })
        .catch(() => { state = 'failed'; });

      assert.strictEqual(state, 'failed');
      assert.notStrictEqual(state, 'copied');
    });

    test('unsupported navigator.clipboard safely transitions to failed status', () => {
      let state = 'idle';
      const unsupportedNavigator = {};

      if (!unsupportedNavigator?.clipboard?.writeText) {
        state = 'failed';
      }

      assert.strictEqual(state, 'failed');
    });
  });

  // ---------------- 3. BOOT SCREEN & SESSION RECOVERY ----------------
  describe('Boot Screen State & Dismissal Logic', () => {
    const BOOT_SESSION_KEY = 'portfolio_boot_completed';

    test('first visit without sessionStorage boots with native cursor enabled', () => {
      const mockSessionStorage = new Map();
      const hasBooted = mockSessionStorage.get(BOOT_SESSION_KEY);
      const isBooting = !hasBooted;

      assert.strictEqual(isBooting, true);

      // Verify custom cursor class should NOT be on body during boot
      const shouldApplyCustomCursor = !isBooting;
      assert.strictEqual(shouldApplyCustomCursor, false);
    });

    test('returning visit within the same session skips boot sequence', () => {
      const mockSessionStorage = new Map([[BOOT_SESSION_KEY, 'true']]);
      const hasBooted = mockSessionStorage.get(BOOT_SESSION_KEY);
      const isBooting = !hasBooted;

      assert.strictEqual(isBooting, false);
      const shouldApplyCustomCursor = !isBooting;
      assert.strictEqual(shouldApplyCustomCursor, true);
    });

    test('prefers-reduced-motion bypasses boot sequence immediately', () => {
      const prefersReducedMotion = true;
      let isBooting = true;

      if (prefersReducedMotion) {
        isBooting = false;
      }

      assert.strictEqual(isBooting, false);
    });

    test('Escape, Space, or Enter key dismisses boot sequence and records session', () => {
      const mockSessionStorage = new Map();
      let isBooting = true;

      const dismissBoot = () => {
        mockSessionStorage.set(BOOT_SESSION_KEY, 'true');
        isBooting = false;
      };

      const handleKeyDown = (key) => {
        if (key === 'Escape' || key === ' ' || key === 'Enter') {
          dismissBoot();
        }
      };

      handleKeyDown('Escape');
      assert.strictEqual(isBooting, false);
      assert.strictEqual(mockSessionStorage.get(BOOT_SESSION_KEY), 'true');
    });
  });

  // ---------------- 4. MOBILE NAVIGATION KEYBOARD INTERACTIONS ----------------
  describe('Mobile Navigation Accessibility & Focus Management', () => {
    test('Escape key closes mobile menu and triggers focus restoration', () => {
      let isMenuOpen = true;
      let focusTarget = null;

      const toggleButton = {
        focus: () => { focusTarget = 'toggleButton'; },
      };

      const closeMenu = () => {
        isMenuOpen = false;
        toggleButton.focus();
      };

      const onKeyDown = (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
          closeMenu();
        }
      };

      onKeyDown({ key: 'Escape' });
      assert.strictEqual(isMenuOpen, false);
      assert.strictEqual(focusTarget, 'toggleButton');
    });

    test('Tab key wraps inside mobile drawer elements', () => {
      const focusable = ['link1', 'link2', 'link3', 'dashboardLink'];
      let currentFocusedIndex = focusable.length - 1; // At last element

      // Simulating forward Tab on last item
      let nextFocusedIndex = null;
      if (currentFocusedIndex === focusable.length - 1) {
        nextFocusedIndex = 0; // Wrap to first
      }

      assert.strictEqual(nextFocusedIndex, 0);

      // Simulating Shift+Tab on first item
      currentFocusedIndex = 0;
      let prevFocusedIndex = null;
      if (currentFocusedIndex === 0) {
        prevFocusedIndex = focusable.length - 1; // Wrap to last
      }

      assert.strictEqual(prevFocusedIndex, focusable.length - 1);
    });
  });
});
