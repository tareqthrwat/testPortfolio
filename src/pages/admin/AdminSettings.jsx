import { useState, useEffect } from 'react';
import {
  FiSave,
  FiRotateCcw,
  FiDownload,
  FiUpload,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiInfo,
  FiUser,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiFileText,
  FiImage,
  FiDatabase,
  FiTrash2,
} from 'react-icons/fi';
import { usePortfolio } from '../../context/usePortfolio';

export default function AdminSettings() {
  const { settings, updateSettings, exportData, importData, resetData, isLoading } =
    usePortfolio();

  // Form State
  const [formData, setFormData] = useState({
    developerName: '',
    professionalTitle: '',
    aboutMe: '',
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    resumeUrl: '',
    profileImageUrl: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modals & Confirmation States
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [pendingImportContent, setPendingImportContent] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Keyboard accessibility: Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isResetConfirmOpen) setIsResetConfirmOpen(false);
        if (isImportConfirmOpen) {
          setIsImportConfirmOpen(false);
          setPendingImportContent(null);
          setImportError(null);
        }
      }
    };
    if (isResetConfirmOpen || isImportConfirmOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isResetConfirmOpen, isImportConfirmOpen]);

  // Prepopulate form when settings load or change
  useEffect(() => {
    if (settings) {
      setFormData({
        developerName: settings.developerName || '',
        professionalTitle: settings.professionalTitle || '',
        aboutMe: settings.aboutMe || '',
        email: settings.email || '',
        githubUrl: settings.githubUrl || '',
        linkedinUrl: settings.linkedinUrl || '',
        resumeUrl: settings.resumeUrl || '',
        profileImageUrl: settings.profileImageUrl || '',
      });
      setHasUnsavedChanges(false);
    }
  }, [settings]);

  // Check for unsaved changes
  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (settings) {
      const isDirty = Object.keys(updated).some(
        (key) => (updated[key] || '') !== (settings[key] || '')
      );
      setHasUnsavedChanges(isDirty);
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    if (settings) {
      setFormData({
        developerName: settings.developerName || '',
        professionalTitle: settings.professionalTitle || '',
        aboutMe: settings.aboutMe || '',
        email: settings.email || '',
        githubUrl: settings.githubUrl || '',
        linkedinUrl: settings.linkedinUrl || '',
        resumeUrl: settings.resumeUrl || '',
        profileImageUrl: settings.profileImageUrl || '',
      });
      setFormErrors({});
      setHasUnsavedChanges(false);
      showToast('info', 'Changes discarded.');
    }
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.developerName.trim()) {
      errors.developerName = 'Developer name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Settings
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const res = await updateSettings(formData);
      if (res.success) {
        setHasUnsavedChanges(false);
        showToast('success', 'Portfolio settings updated successfully.');
      } else {
        // Keep unsaved inputs intact on storage failure
        showToast('error', res.error || 'Failed to save settings to LocalStorage.');
      }
    } catch (err) {
      showToast('error', err.message || 'Unexpected storage error.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export Backup
  const handleExportBackup = async () => {
    try {
      const data = await exportData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('download', `portfolio-backup-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('success', 'Backup JSON file exported successfully.');
    } catch (err) {
      showToast('error', `Export failed: ${err.message}`);
    }
  };

  // Import Backup: File picker trigger
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        // Verify JSON syntax before opening confirmation modal
        JSON.parse(content);
        setPendingImportContent(content);
        setImportError(null);
        setIsImportConfirmOpen(true);
      } catch (parseErr) {
        showToast('error', `Invalid JSON syntax: ${parseErr.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Confirm Import
  const handleConfirmImport = async () => {
    if (!pendingImportContent) return;
    setIsImporting(true);
    setImportError(null);

    try {
      const res = await importData(pendingImportContent);
      if (res.success) {
        setIsImportConfirmOpen(false);
        setPendingImportContent(null);
        showToast('success', 'Portfolio data restored successfully from backup.');
      } else {
        setImportError(res.error || 'Import validation failed.');
        showToast('error', res.error || 'Import failed.');
      }
    } catch (err) {
      setImportError(err.message);
      showToast('error', err.message || 'Import error.');
    } finally {
      setIsImporting(false);
    }
  };

  // Reset to Defaults
  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      const res = await resetData();
      if (res.success) {
        setIsResetConfirmOpen(false);
        setHasUnsavedChanges(false);
        showToast('success', 'Portfolio data reset to initial default seeds.');
      } else {
        showToast('error', res.error || 'Failed to reset portfolio data.');
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to reset.');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#94A3B8]">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl transition-all duration-200 ${
            toast.type === 'success'
              ? 'border-[#22C55E]/40 bg-[#1E293B] text-[#22C55E]'
              : toast.type === 'info'
              ? 'border-[#38BDF8]/40 bg-[#1E293B] text-[#38BDF8]'
              : 'border-[#EF4444]/40 bg-[#1E293B] text-[#EF4444]'
          }`}
        >
          {toast.type === 'success' ? (
            <FiCheck className="h-5 w-5 shrink-0" />
          ) : toast.type === 'info' ? (
            <FiInfo className="h-5 w-5 shrink-0" />
          ) : (
            <FiAlertTriangle className="h-5 w-5 shrink-0" />
          )}
          <span className="text-sm font-medium text-[#F8FAFC]">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 rounded p-1 text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header with Title and Unsaved Status */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Portfolio Settings
            </h1>
            {hasUnsavedChanges && (
              <span className="rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#F59E0B]">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Configure your developer profile metadata, social links, and backup portfolio content.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleDiscardChanges}
              className="inline-flex items-center gap-2 rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition"
            >
              <FiRotateCcw className="h-3.5 w-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={isSaving || !hasUnsavedChanges}
            className="inline-flex items-center gap-2 rounded-xl bg-[#38BDF8] px-5 py-2 text-xs font-semibold text-[#0B1120] hover:bg-[#22D3EE] disabled:opacity-40 transition shadow-sm"
          >
            <FiSave className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Profile Information Form */}
      <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-6 sm:p-8">
        <h2 className="text-base font-bold text-[#F8FAFC] border-b border-[#334155] pb-4">
          Profile Information
        </h2>

        <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
          {/* Avatar Preview & URL */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Live Profile Image Preview */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[#334155] bg-[#111827]">
              {formData.profileImageUrl ? (
                <img
                  src={formData.profileImageUrl}
                  alt={formData.developerName || 'Profile'}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#94A3B8]">
                  <FiUser className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <label className="block text-xs font-semibold text-[#F8FAFC]">
                Profile Image URL / Asset Path
              </label>
              <div className="relative mt-1">
                <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={formData.profileImageUrl}
                  onChange={(e) => handleInputChange('profileImageUrl', e.target.value)}
                  placeholder="https://... or bundled asset"
                  className="w-full rounded-xl border border-[#334155] bg-[#111827] py-2 pl-10 pr-4 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Provide an image URL or keep the bundled portfolio portrait.
              </p>
            </div>
          </div>

          {/* Name & Title */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC]">
                Developer Name *
              </label>
              <div className="relative mt-1.5">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={formData.developerName}
                  onChange={(e) => handleInputChange('developerName', e.target.value)}
                  placeholder="e.g. Tarek"
                  className={`w-full rounded-xl border bg-[#111827] py-2 pl-10 pr-4 text-xs text-[#F8FAFC] focus:outline-hidden ${
                    formErrors.developerName
                      ? 'border-[#EF4444] focus:border-[#EF4444]'
                      : 'border-[#334155] focus:border-[#38BDF8]'
                  }`}
                />
              </div>
              {formErrors.developerName && (
                <p className="mt-1 text-[11px] text-[#EF4444]">{formErrors.developerName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC]">
                Professional Title
              </label>
              <input
                type="text"
                value={formData.professionalTitle}
                onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                placeholder="e.g. Frontend Developer | React Specialist"
                className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
              />
            </div>
          </div>

          {/* About Me */}
          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC]">About Me / Bio</label>
            <textarea
              rows={4}
              value={formData.aboutMe}
              onChange={(e) => handleInputChange('aboutMe', e.target.value)}
              placeholder="Tell visitors about your passion, tech focus, and background..."
              className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] p-3 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC]">Email Address</label>
            <div className="relative mt-1.5">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="developer@example.com"
                className={`w-full rounded-xl border bg-[#111827] py-2 pl-10 pr-4 text-xs text-[#F8FAFC] focus:outline-hidden ${
                  formErrors.email
                    ? 'border-[#EF4444] focus:border-[#EF4444]'
                    : 'border-[#334155] focus:border-[#38BDF8]'
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-[11px] text-[#EF4444]">{formErrors.email}</p>
            )}
          </div>

          {/* Social Links & Resume */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC]">GitHub URL</label>
              <div className="relative mt-1.5">
                <FiGithub className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-[#334155] bg-[#111827] py-2 pl-10 pr-4 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC]">LinkedIn URL</label>
              <div className="relative mt-1.5">
                <FiLinkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-[#334155] bg-[#111827] py-2 pl-10 pr-4 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC]">Resume URL</label>
              <div className="relative mt-1.5">
                <FiFileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="url"
                  value={formData.resumeUrl}
                  onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                  placeholder="https://.../resume.pdf"
                  className="w-full rounded-xl border border-[#334155] bg-[#111827] py-2 pl-10 pr-4 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Data Management Section */}
      <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#F8FAFC]">Data Management & Backup</h2>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Export full JSON backups of your projects, skills, and settings, or restore from a
            previous backup.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 border-t border-[#334155] pt-6">
          {/* Export Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[#334155] bg-[#111827] p-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
                <FiDownload className="h-4 w-4 text-[#38BDF8]" />
                <span>Export Backup</span>
              </div>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Download a complete, structured JSON backup containing all projects, skills, and
                settings.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2 text-xs font-semibold text-[#F8FAFC] hover:border-[#38BDF8] hover:text-[#38BDF8] transition"
            >
              <FiDownload className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Import Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[#334155] bg-[#111827] p-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
                <FiUpload className="h-4 w-4 text-[#22D3EE]" />
                <span>Import Backup</span>
              </div>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Restore your portfolio from an exported JSON file with strict schema validation.
              </p>
            </div>
            <label className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E293B] border border-[#334155] px-4 py-2 text-xs font-semibold text-[#F8FAFC] hover:border-[#22D3EE] hover:text-[#22D3EE] transition cursor-pointer">
              <FiUpload className="h-3.5 w-3.5" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelected}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[#334155] bg-[#111827] p-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#EF4444]">
                <FiRotateCcw className="h-4 w-4" />
                <span>Reset to Defaults</span>
              </div>
              <p className="mt-2 text-xs text-[#94A3B8]">
                Restore initial seed projects, skills, and developer settings. Recommended to export
                a backup first.
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-2 text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/20 transition"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* LocalStorage Architecture & CMS Disclaimer Banner */}
      <div className="rounded-2xl border border-[#334155] bg-[#111827] p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#F8FAFC]">
          <FiDatabase className="h-4 w-4 text-[#38BDF8]" />
          <span>Storage Architecture & Production Considerations</span>
        </div>

        <div className="grid gap-4 text-xs text-[#94A3B8] sm:grid-cols-2">
          <div className="space-y-2">
            <p>
              • <strong className="text-[#F8FAFC]">Browser-Local Storage:</strong> All changes made
              in this admin console are stored directly in your browser&apos;s LocalStorage.
            </p>
            <p>
              • <strong className="text-[#F8FAFC]">No Cross-Device Sync:</strong> Changes are not
              synchronized across multiple computers, phones, or incognito sessions.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              • <strong className="text-[#F8FAFC]">Public Visitors:</strong> External visitors viewing
              the hosted site will see the baseline seed data unless a shared server is connected.
            </p>
            <p>
              • <strong className="text-[#F8FAFC]">Future CMS / Backend:</strong> To enable permanent
              collaborative editing and password authentication, the modular repository abstraction
              can be connected to a PostgreSQL database, Supabase, or headless CMS.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#334155] bg-[#1E293B] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30">
                <FiRotateCcw className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Reset to Default Seeds</h3>
            </div>

            <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to reset all portfolio data? This will restore the initial 3
              projects, 5 skills, and default settings. All locally saved custom changes will be
              permanently lost.
            </p>
            <p className="mt-2 text-xs font-semibold text-[#F59E0B]">
              Tip: Export a JSON backup before proceeding.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                disabled={isResetting}
                className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="rounded-xl bg-[#EF4444] px-4 py-2 text-xs font-semibold text-white hover:bg-[#EF4444]/90 disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Confirmation Modal */}
      {isImportConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#334155] bg-[#1E293B] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#38BDF8]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30">
                <FiUpload className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Restore from JSON Backup</h3>
            </div>

            {importError ? (
              <div className="mt-3 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444]">
                <p className="font-semibold">Validation Error:</p>
                <p className="mt-1">{importError}</p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
                Importing will replace your current projects, skills, and portfolio settings with
                the contents of the selected file. Existing locally stored changes will be
                overwritten.
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsImportConfirmOpen(false);
                  setPendingImportContent(null);
                  setImportError(null);
                }}
                disabled={isImporting}
                className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={isImporting}
                className="rounded-xl bg-[#38BDF8] px-4 py-2 text-xs font-semibold text-[#0B1120] hover:bg-[#22D3EE] disabled:opacity-50"
              >
                {isImporting ? 'Validating & Restoring...' : 'Confirm & Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
