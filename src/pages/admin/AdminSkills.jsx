import { useState, useMemo, useEffect } from 'react';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiArrowUp,
  FiArrowDown,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiCpu,
} from 'react-icons/fi';
import { usePortfolio } from '../../context/usePortfolio';
import { SKILL_CATEGORIES } from '../../models/portfolioModels';
import SkillIcon from '../../components/admin/SkillIcon';
import { COMMON_ICON_OPTIONS } from '../../constants/skillsIcons';

const INITIAL_FORM = {
  name: '',
  category: 'Frontend',
  iconIdentifier: 'FaCode',
  proficiency: 85,
  visibility: 'public',
};

export default function AdminSkills() {
  const { skills, addSkill, updateSkill, deleteSkill, isLoading } = usePortfolio();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVisibility, setSelectedVisibility] = useState('All');

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Keyboard accessibility: Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (deleteTarget) {
          setDeleteTarget(null);
        } else if (isModalOpen) {
          closeModal();
        }
      }
    };
    if (isModalOpen || deleteTarget) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen, deleteTarget]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Filtered and sorted skills
  const filteredSkills = useMemo(() => {
    return skills
      .filter((skill) => {
        const matchesSearch = skill.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || skill.category === selectedCategory;
        const matchesVisibility =
          selectedVisibility === 'All' || skill.visibility === selectedVisibility;
        return matchesSearch && matchesCategory && matchesVisibility;
      })
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [skills, searchTerm, selectedCategory, selectedVisibility]);

  // Form management
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      displayOrder: skills.length + 1,
    });
    setFormErrors({});
    setFormSubmitError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Frontend',
      iconIdentifier: skill.iconIdentifier || 'FaCode',
      proficiency: Number(skill.proficiency ?? 80),
      visibility: skill.visibility || 'public',
      displayOrder: skill.displayOrder ?? 1,
    });
    setFormErrors({});
    setFormSubmitError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setFormSubmitError(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Skill name is required';
    }
    if (!SKILL_CATEGORIES.includes(formData.category)) {
      errors.category = 'Select a valid category';
    }
    const prof = Number(formData.proficiency);
    if (isNaN(prof) || prof < 0 || prof > 100) {
      errors.proficiency = 'Proficiency must be between 0 and 100';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormSubmitError(null);

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      iconIdentifier: formData.iconIdentifier.trim() || 'FaCode',
      proficiency: Number(formData.proficiency),
      visibility: formData.visibility,
    };

    try {
      if (editingId) {
        const res = await updateSkill(editingId, payload);
        if (!res.success) {
          setFormSubmitError(res.error || 'Failed to update skill.');
          showToast('error', res.error || 'Failed to update skill.');
          setIsSubmitting(false);
          return;
        }
        showToast('success', `Skill "${payload.name}" updated successfully.`);
      } else {
        const res = await addSkill(payload);
        if (!res.success) {
          setFormSubmitError(res.error || 'Failed to create skill.');
          showToast('error', res.error || 'Failed to create skill.');
          setIsSubmitting(false);
          return;
        }
        showToast('success', `Skill "${payload.name}" added successfully.`);
      }

      closeModal();
    } catch (err) {
      setFormSubmitError(err.message || 'An unexpected error occurred.');
      showToast('error', err.message || 'Storage error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Visibility Toggle
  const handleToggleVisibility = async (skill) => {
    const updated = skill.visibility === 'public' ? 'hidden' : 'public';
    const res = await updateSkill(skill.id, { visibility: updated });
    if (res.success) {
      showToast(
        'success',
        `"${skill.name}" is now ${updated === 'public' ? 'visible' : 'hidden'}.`
      );
    } else {
      showToast('error', res.error || 'Failed to toggle visibility.');
    }
  };

  // Reorder Handler
  const handleMoveOrder = async (skill, direction) => {
    const sorted = [...skills].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const currentIndex = sorted.findIndex((s) => s.id === skill.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetSkill = sorted[targetIndex];
    const currentOrder = skill.displayOrder ?? currentIndex + 1;
    const targetOrder = targetSkill.displayOrder ?? targetIndex + 1;

    const res1 = await updateSkill(skill.id, { displayOrder: targetOrder });
    const res2 = await updateSkill(targetSkill.id, { displayOrder: currentOrder });

    if (res1.success && res2.success) {
      showToast('success', `Reordered "${skill.name}".`);
    } else {
      showToast('error', 'Failed to update skill order in storage.');
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await deleteSkill(deleteTarget.id);
      if (res.success) {
        showToast('success', `Skill "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
      } else {
        showToast('error', res.error || 'Failed to delete skill.');
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to delete skill.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl transition-all duration-200 ${
            toast.type === 'success'
              ? 'border-[#22C55E]/40 bg-[#1E293B] text-[#22C55E]'
              : 'border-[#EF4444]/40 bg-[#1E293B] text-[#EF4444]'
          }`}
        >
          {toast.type === 'success' ? (
            <FiCheck className="h-5 w-5 shrink-0" />
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

      {/* Header & Primary Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Skills Management
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Manage technical proficiencies, technology icons, and showcase matrix categories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#38BDF8] px-4 py-2.5 text-xs font-semibold text-[#0B1120] transition hover:bg-[#22D3EE] shadow-sm self-start sm:self-auto"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#334155] bg-[#1E293B] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search skills by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#334155] bg-[#111827] py-2 pl-10 pr-4 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#38BDF8] focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="h-3.5 w-3.5 text-[#94A3B8]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-[#334155] bg-[#111827] px-3 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
            className="rounded-xl border border-[#334155] bg-[#111827] px-3 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
          >
            <option value="All">All Visibility</option>
            <option value="public">Public Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-[#94A3B8]">Loading skills...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#334155] bg-[#111827] text-[#94A3B8]">
            <FiCpu className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[#F8FAFC]">No skills found</h3>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {searchTerm || selectedCategory !== 'All' || selectedVisibility !== 'All'
              ? 'Try adjusting your search query or filters.'
              : 'Add your first skill to populate your portfolio capability matrix.'}
          </p>
          {(searchTerm || selectedCategory !== 'All' || selectedVisibility !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedVisibility('All');
              }}
              className="mt-4 text-xs font-semibold text-[#38BDF8] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, index) => {
            const isFirst = index === 0;
            const isLast = index === filteredSkills.length - 1;

            return (
              <div
                key={skill.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition hover:border-[#38BDF8]/40"
              >
                <div>
                  {/* Top Bar: Icon, Name, Category & Visibility */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#334155] bg-[#111827] text-[#38BDF8]">
                        <SkillIcon
                          iconIdentifier={skill.iconIdentifier}
                          skillName={skill.name}
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F8FAFC]">{skill.name}</h3>
                        <span className="rounded-md border border-[#334155] bg-[#111827] px-2 py-0.5 text-[10px] font-medium text-[#94A3B8]">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    {/* Visibility status chip */}
                    {skill.visibility === 'public' ? (
                      <span className="flex items-center gap-1 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-medium text-[#22C55E]">
                        <FiEye className="h-3 w-3" />
                        Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-2 py-0.5 text-[10px] font-medium text-[#EF4444]">
                        <FiEyeOff className="h-3 w-3" />
                        Hidden
                      </span>
                    )}
                  </div>

                  {/* Proficiency Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-[#94A3B8]">Proficiency</span>
                      <span className="font-bold text-[#F8FAFC]">{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#111827]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] transition-all duration-300"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-[#334155]/60 pt-3">
                  {/* Order controls */}
                  <div className="flex items-center rounded-xl border border-[#334155] bg-[#111827] p-1">
                    <button
                      onClick={() => handleMoveOrder(skill, 'up')}
                      disabled={isFirst}
                      className="rounded p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:hover:text-[#94A3B8]"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <FiArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(skill, 'down')}
                      disabled={isLast}
                      className="rounded p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:hover:text-[#94A3B8]"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <FiArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Toggle, Edit, Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleVisibility(skill)}
                      className={`rounded-xl border p-2 transition ${
                        skill.visibility === 'public'
                          ? 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]'
                          : 'border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]'
                      }`}
                      title={skill.visibility === 'public' ? 'Publicly Visible' : 'Hidden'}
                      aria-label={skill.visibility === 'public' ? 'Publicly Visible' : 'Hidden'}
                    >
                      {skill.visibility === 'public' ? (
                        <FiEye className="h-3.5 w-3.5" />
                      ) : (
                        <FiEyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => openEditModal(skill)}
                      className="rounded-xl border border-[#334155] bg-[#111827] p-2 text-[#94A3B8] hover:border-[#38BDF8] hover:text-[#38BDF8] transition"
                      title="Edit Skill"
                      aria-label="Edit Skill"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(skill)}
                      className="rounded-xl border border-[#334155] bg-[#111827] p-2 text-[#94A3B8] hover:border-[#EF4444] hover:text-[#EF4444] transition"
                      title="Delete Skill"
                      aria-label="Delete Skill"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-[#334155] bg-[#1E293B] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#334155] px-6 py-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">
                {editingId ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formSubmitError && (
                <div className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444]">
                  <FiAlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{formSubmitError}</span>
                </div>
              )}

              {/* Skill Name */}
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC]">Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. TypeScript, React, Docker"
                  className={`mt-1.5 w-full rounded-xl border bg-[#111827] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-hidden ${
                    formErrors.name
                      ? 'border-[#EF4444] focus:border-[#EF4444]'
                      : 'border-[#334155] focus:border-[#38BDF8]'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-[#EF4444]">{formErrors.name}</p>
                )}
              </div>

              {/* Category & Visibility Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#F8FAFC]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] px-3 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8FAFC]">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] px-3 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                  >
                    <option value="public">Public</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Icon Selector & Preview */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#F8FAFC]">
                    Technology Icon
                  </label>
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <span>Preview:</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#334155] bg-[#111827] text-[#38BDF8]">
                      <SkillIcon
                        iconIdentifier={formData.iconIdentifier}
                        skillName={formData.name}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto rounded-xl border border-[#334155] bg-[#111827] p-2">
                  {COMMON_ICON_OPTIONS.map((iconOpt) => (
                    <button
                      type="button"
                      key={iconOpt.id}
                      onClick={() => setFormData({ ...formData, iconIdentifier: iconOpt.id })}
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] transition ${
                        formData.iconIdentifier === iconOpt.id
                          ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-semibold'
                          : 'border-[#334155]/60 bg-[#1E293B]/40 text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <SkillIcon iconIdentifier={iconOpt.id} className="h-3.5 w-3.5" />
                      <span>{iconOpt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Proficiency Slider & Number Input */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#F8FAFC]">
                    Proficiency Level (0–100%)
                  </label>
                  <span className="rounded-md border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2 py-0.5 text-xs font-bold text-[#38BDF8]">
                    {formData.proficiency}%
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) =>
                      setFormData({ ...formData, proficiency: Number(e.target.value) })
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#111827] accent-[#38BDF8]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) =>
                      setFormData({ ...formData, proficiency: Number(e.target.value) })
                    }
                    className="w-16 rounded-xl border border-[#334155] bg-[#111827] py-1.5 px-2 text-center text-xs font-semibold text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                  />
                </div>
                {formErrors.proficiency && (
                  <p className="mt-1 text-[11px] text-[#EF4444]">{formErrors.proficiency}</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-[#334155] pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#38BDF8] px-5 py-2 text-xs font-semibold text-[#0B1120] hover:bg-[#22D3EE] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#334155] bg-[#1E293B] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30">
                <FiTrash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Delete Skill</h3>
            </div>

            <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-[#F8FAFC]">{deleteTarget.name}</strong>? This will remove it
              from your portfolio skill matrix.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-xl border border-[#334155] bg-[#111827] px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="rounded-xl bg-[#EF4444] px-4 py-2 text-xs font-semibold text-white hover:bg-[#EF4444]/90 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
