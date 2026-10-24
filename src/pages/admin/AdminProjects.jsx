import { useState, useMemo, useEffect } from 'react';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiEye,
  FiEyeOff,
  FiArrowUp,
  FiArrowDown,
  FiExternalLink,
  FiGithub,
  FiImage,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiLayers,
} from 'react-icons/fi';
import { usePortfolio } from '../../context/usePortfolio';
import { PROJECT_CATEGORIES } from '../../models/portfolioModels';

const INITIAL_FORM = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  category: 'Frontend',
  technologies: '',
  imageUrl: '',
  additionalImages: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
  visibility: 'public',
};

export default function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject, isLoading } = usePortfolio();

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

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.technologies || []).some((t) =>
            t.toLowerCase().includes(searchTerm.toLowerCase())
          );
        const matchesCategory =
          selectedCategory === 'All' || project.category === selectedCategory;
        const matchesVisibility =
          selectedVisibility === 'All' || project.visibility === selectedVisibility;
        return matchesSearch && matchesCategory && matchesVisibility;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [projects, searchTerm, selectedCategory, selectedVisibility]);

  // Form management
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      order: projects.length + 1,
    });
    setFormErrors({});
    setFormSubmitError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      fullDescription: project.fullDescription || '',
      category: project.category || 'Frontend',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      imageUrl: project.imageUrl || '',
      additionalImages: Array.isArray(project.additionalImages)
        ? project.additionalImages.join(', ')
        : '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: Boolean(project.featured),
      visibility: project.visibility || 'public',
      order: project.order ?? 1,
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
    if (!formData.title.trim()) {
      errors.title = 'Project title is required';
    }
    if (!PROJECT_CATEGORIES.includes(formData.category)) {
      errors.category = 'Select a valid category';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormSubmitError(null);

    // Parse technologies and additional images from comma-separated string
    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const additionalImagesArray = formData.additionalImages
      .split(',')
      .map((img) => img.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      category: formData.category,
      technologies: techArray,
      imageUrl: formData.imageUrl.trim(),
      additionalImages: additionalImagesArray,
      githubUrl: formData.githubUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
      featured: formData.featured,
      visibility: formData.visibility,
    };

    try {
      if (editingId) {
        const res = await updateProject(editingId, payload);
        if (!res.success) {
          setFormSubmitError(res.error || 'Failed to update project.');
          showToast('error', res.error || 'Failed to update project.');
          setIsSubmitting(false);
          return;
        }
        showToast('success', `Project "${payload.title}" updated successfully.`);
      } else {
        const res = await addProject(payload);
        if (!res.success) {
          setFormSubmitError(res.error || 'Failed to create project.');
          showToast('error', res.error || 'Failed to create project.');
          setIsSubmitting(false);
          return;
        }
        showToast('success', `Project "${payload.title}" created successfully.`);
      }

      closeModal();
    } catch (err) {
      setFormSubmitError(err.message || 'An unexpected error occurred.');
      showToast('error', err.message || 'Storage error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Toggles
  const handleToggleFeatured = async (project) => {
    const updated = !project.featured;
    const res = await updateProject(project.id, { featured: updated });
    if (res.success) {
      showToast(
        'success',
        `"${project.title}" ${updated ? 'marked as featured' : 'removed from featured'}.`
      );
    } else {
      showToast('error', res.error || 'Failed to toggle featured status.');
    }
  };

  const handleToggleVisibility = async (project) => {
    const updated = project.visibility === 'public' ? 'hidden' : 'public';
    const res = await updateProject(project.id, { visibility: updated });
    if (res.success) {
      showToast(
        'success',
        `"${project.title}" is now ${updated === 'public' ? 'visible' : 'hidden'}.`
      );
    } else {
      showToast('error', res.error || 'Failed to toggle visibility.');
    }
  };

  // Reorder Handler
  const handleMoveOrder = async (project, direction) => {
    const sorted = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentIndex = sorted.findIndex((p) => p.id === project.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetProject = sorted[targetIndex];
    const currentOrder = project.order ?? currentIndex + 1;
    const targetOrder = targetProject.order ?? targetIndex + 1;

    const res1 = await updateProject(project.id, { order: targetOrder });
    const res2 = await updateProject(targetProject.id, { order: currentOrder });

    if (res1.success && res2.success) {
      showToast('success', `Reordered "${project.title}".`);
    } else {
      showToast('error', 'Failed to update project order in storage.');
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await deleteProject(deleteTarget.id);
      if (res.success) {
        showToast('success', `Project "${deleteTarget.title}" deleted.`);
        setDeleteTarget(null);
      } else {
        showToast('error', res.error || 'Failed to delete project.');
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to delete project.');
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
            Projects Management
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Manage your project portfolio showcase, reorder items, and configure visibility.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#38BDF8] px-4 py-2.5 text-xs font-semibold text-[#0B1120] transition hover:bg-[#22D3EE] shadow-sm self-start sm:self-auto"
        >
          <FiPlus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#334155] bg-[#1E293B] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by title or technology..."
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
              {PROJECT_CATEGORIES.map((cat) => (
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

      {/* Projects List / Table */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-[#94A3B8]">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#334155] bg-[#111827] text-[#94A3B8]">
            <FiLayers className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[#F8FAFC]">No projects found</h3>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {searchTerm || selectedCategory !== 'All' || selectedVisibility !== 'All'
              ? 'Try adjusting your search query or filters.'
              : 'Get started by creating your first project.'}
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
        <div className="space-y-4">
          {filteredProjects.map((project, index) => {
            const isFirst = index === 0;
            const isLast = index === filteredProjects.length - 1;

            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between gap-4 rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition hover:border-[#38BDF8]/40 md:flex-row md:items-center"
              >
                {/* Left: Thumbnail & Project Details */}
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-[#334155] bg-[#111827]">
                    {project.imageUrl && !project.imageUrl.startsWith('STUDIO') ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-[#94A3B8] p-1 text-center">
                        {project.imageUrl || 'PREVIEW'}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#F8FAFC]">{project.title}</h3>
                      <span className="rounded-md border border-[#334155] bg-[#111827] px-2 py-0.5 text-[10px] font-medium text-[#94A3B8]">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="flex items-center gap-1 rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2 py-0.5 text-[10px] font-medium text-[#F59E0B]">
                          <FiStar className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                      {project.visibility === 'public' ? (
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

                    <p className="line-clamp-2 text-xs text-[#94A3B8] max-w-2xl">
                      {project.shortDescription || project.fullDescription || 'No description'}
                    </p>

                    {/* Technologies tags */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-[#111827] px-2 py-0.5 text-[10px] font-medium text-[#94A3B8] border border-[#334155]/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions & Reordering */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  {/* Order controls */}
                  <div className="flex items-center rounded-xl border border-[#334155] bg-[#111827] p-1">
                    <button
                      onClick={() => handleMoveOrder(project, 'up')}
                      disabled={isFirst}
                      className="rounded p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:hover:text-[#94A3B8]"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <FiArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(project, 'down')}
                      disabled={isLast}
                      className="rounded p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:hover:text-[#94A3B8]"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <FiArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Toggle Featured */}
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`rounded-xl border p-2 transition ${
                      project.featured
                        ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'border-[#334155] bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                    title={project.featured ? 'Featured on Portfolio' : 'Mark as Featured'}
                    aria-label={project.featured ? 'Featured on Portfolio' : 'Mark as Featured'}
                  >
                    <FiStar className="h-4 w-4" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggleVisibility(project)}
                    className={`rounded-xl border p-2 transition ${
                      project.visibility === 'public'
                        ? 'border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]'
                        : 'border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]'
                    }`}
                    title={project.visibility === 'public' ? 'Publicly Visible' : 'Hidden'}
                    aria-label={project.visibility === 'public' ? 'Publicly Visible' : 'Hidden'}
                  >
                    {project.visibility === 'public' ? (
                      <FiEye className="h-4 w-4" />
                    ) : (
                      <FiEyeOff className="h-4 w-4" />
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(project)}
                    className="rounded-xl border border-[#334155] bg-[#111827] p-2 text-[#94A3B8] hover:border-[#38BDF8] hover:text-[#38BDF8] transition"
                    title="Edit Project"
                    aria-label="Edit Project"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="rounded-xl border border-[#334155] bg-[#111827] p-2 text-[#94A3B8] hover:border-[#EF4444] hover:text-[#EF4444] transition"
                    title="Delete Project"
                    aria-label="Delete Project"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#334155] bg-[#1E293B] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#334155] px-6 py-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">
                {editingId ? 'Edit Project' : 'Add New Project'}
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
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formSubmitError && (
                <div className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444]">
                  <FiAlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{formSubmitError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC]">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next-Gen Commerce"
                  className={`mt-1.5 w-full rounded-xl border bg-[#111827] px-3.5 py-2 text-xs text-[#F8FAFC] focus:outline-hidden ${
                    formErrors.title
                      ? 'border-[#EF4444] focus:border-[#EF4444]'
                      : 'border-[#334155] focus:border-[#38BDF8]'
                  }`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-[11px] text-[#EF4444]">{formErrors.title}</p>
                )}
              </div>

              {/* Category & Status Row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F8FAFC]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] px-3 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                  >
                    {PROJECT_CATEGORIES.map((cat) => (
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

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-[#334155] bg-[#111827] text-[#38BDF8] focus:ring-0"
                    />
                    <span>Featured Project</span>
                  </label>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC]">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  placeholder="Brief one-line summary for cards"
                  className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] px-3.5 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC]">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, fullDescription: e.target.value })
                  }
                  placeholder="Detailed project description, architecture notes, and features..."
                  className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] p-3 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC]">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Tailwind, Node.js, TypeScript"
                  className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] px-3.5 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />
              </div>

              {/* Image URL & Live Preview */}
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC]">
                  Main Image URL or Asset Path
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /assets/..."
                  className="mt-1.5 w-full rounded-xl border border-[#334155] bg-[#111827] px-3.5 py-2 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                />

                {/* Live Preview */}
                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#334155] bg-[#111827] p-2">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#1E293B]">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">
                      <span>Image Preview</span>
                      <p className="line-clamp-1 font-mono text-[10px] text-[#94A3B8]/70">
                        {formData.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* External URLs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#F8FAFC]">GitHub URL</label>
                  <div className="relative mt-1.5">
                    <FiGithub className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-[#334155] bg-[#111827] py-2 pl-9 pr-3 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8FAFC]">Live Demo URL</label>
                  <div className="relative mt-1.5">
                    <FiExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://demo.vercel.app/..."
                      className="w-full rounded-xl border border-[#334155] bg-[#111827] py-2 pl-9 pr-3 text-xs text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-hidden"
                    />
                  </div>
                </div>
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
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
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
              <h3 className="text-base font-bold text-[#F8FAFC]">Delete Project</h3>
            </div>

            <p className="mt-3 text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-[#F8FAFC]">{deleteTarget.title}</strong>? This will remove it
              from your portfolio data.
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
