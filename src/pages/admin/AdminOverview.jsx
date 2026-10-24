import { Link } from 'react-router-dom';
import {
  FiFolder,
  FiCode,
  FiStar,
  FiEye,
  FiLayers,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiExternalLink,
} from 'react-icons/fi';
import { usePortfolio } from '../../context/usePortfolio';

export default function AdminOverview() {
  const { projects, skills, settings, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#38BDF8] border-t-transparent" />
          <span>Loading dashboard statistics...</span>
        </div>
      </div>
    );
  }

  // Live Metrics derived strictly from PortfolioContext
  const totalProjects = projects.length;
  const totalSkills = skills.length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const publicProjects = projects.filter((p) => p.visibility === 'public').length;

  // Project Category Breakdown
  const projectCategories = {
    Frontend: projects.filter((p) => p.category === 'Frontend').length,
    Backend: projects.filter((p) => p.category === 'Backend').length,
    'Full Stack': projects.filter((p) => p.category === 'Full Stack').length,
  };

  // Skill Category Breakdown
  const skillCategories = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Recent Projects by createdAt (verified real data)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      subtext: `${publicProjects} visible publicly`,
      icon: FiFolder,
      color: '#38BDF8',
      link: '/admin/projects',
    },
    {
      label: 'Total Skills',
      value: totalSkills,
      subtext: `${Object.keys(skillCategories).length} active categories`,
      icon: FiCode,
      color: '#22D3EE',
      link: '/admin/skills',
    },
    {
      label: 'Featured Projects',
      value: featuredProjects,
      subtext: totalProjects > 0 ? `${Math.round((featuredProjects / totalProjects) * 100)}% of portfolio` : 'None',
      icon: FiStar,
      color: '#F59E0B',
      link: '/admin/projects',
    },
    {
      label: 'Public Visibility',
      value: `${publicProjects}/${totalProjects}`,
      subtext: `${totalProjects - publicProjects} hidden from visitors`,
      icon: FiEye,
      color: '#22C55E',
      link: '/admin/projects',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#334155] bg-gradient-to-r from-[#1E293B] to-[#111827] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC] sm:text-2xl">
              Welcome back, {settings?.developerName || 'Developer'}
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Manage your portfolio content, showcase projects, and update technical skills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-[#38BDF8] px-4 py-2.5 text-xs font-semibold text-[#0B1120] transition hover:bg-[#22D3EE] shadow-sm"
            >
              <span>Manage Projects</span>
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/admin/skills"
              className="inline-flex items-center gap-2 rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-2.5 text-xs font-semibold text-[#F8FAFC] transition hover:border-[#38BDF8] hover:text-[#38BDF8]"
            >
              <span>Manage Skills</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#334155] bg-[#1E293B] p-5 transition-all hover:border-[#38BDF8]/50 hover:bg-[#1E293B]/80 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
                  {stat.label}
                </span>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#334155] bg-[#111827]"
                  style={{ color: stat.color }}
                >
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-[#94A3B8]">{stat.subtext}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Category Breakdown & Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Categories */}
        <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-6">
          <div className="flex items-center justify-between border-b border-[#334155] pb-4">
            <div className="flex items-center gap-2">
              <FiLayers className="h-5 w-5 text-[#38BDF8]" />
              <h3 className="text-base font-bold text-[#F8FAFC]">Project Categories</h3>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-medium text-[#38BDF8] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {Object.entries(projectCategories).map(([category, count]) => {
              const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F8FAFC]">{category}</span>
                    <span className="text-[#94A3B8]">
                      {count} {count === 1 ? 'project' : 'projects'} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#111827]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#22D3EE] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Categories */}
        <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-6">
          <div className="flex items-center justify-between border-b border-[#334155] pb-4">
            <div className="flex items-center gap-2">
              <FiCode className="h-5 w-5 text-[#22D3EE]" />
              <h3 className="text-base font-bold text-[#F8FAFC]">Skill Categories</h3>
            </div>
            <Link
              to="/admin/skills"
              className="text-xs font-medium text-[#22D3EE] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {Object.entries(skillCategories).map(([category, count]) => {
              const percentage = totalSkills > 0 ? Math.round((count / totalSkills) * 100) : 0;
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F8FAFC]">{category}</span>
                    <span className="text-[#94A3B8]">
                      {count} {count === 1 ? 'skill' : 'skills'} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#111827]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verified Recent Activity / Updates */}
      <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-6">
        <div className="flex items-center justify-between border-b border-[#334155] pb-4">
          <div className="flex items-center gap-2">
            <FiClock className="h-5 w-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold text-[#F8FAFC]">Recent Projects</h3>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs font-medium text-[#38BDF8] hover:underline flex items-center gap-1"
          >
            <span>All projects</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#94A3B8]">
            No projects found in the repository.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-[#334155]/60">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#334155] bg-[#111827] text-[#38BDF8]">
                    <FiFolder className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8FAFC]">{project.title}</h4>
                    <p className="line-clamp-1 text-xs text-[#94A3B8]">
                      {project.shortDescription || project.fullDescription || 'No description provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="rounded-md border border-[#334155] bg-[#111827] px-2.5 py-1 text-[11px] font-medium text-[#94A3B8]">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="flex items-center gap-1 rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-1 text-[11px] font-medium text-[#F59E0B]">
                      <FiStar className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                  {project.visibility === 'public' ? (
                    <span className="flex items-center gap-1 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-1 text-[11px] font-medium text-[#22C55E]">
                      <FiCheckCircle className="h-3 w-3" />
                      Public
                    </span>
                  ) : (
                    <span className="rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-2 py-1 text-[11px] font-medium text-[#EF4444]">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/admin/projects"
          className="group rounded-xl border border-[#334155] bg-[#111827] p-4 transition hover:border-[#38BDF8]/40 hover:bg-[#1E293B]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F8FAFC]">Projects Management</span>
            <FiArrowRight className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-1 group-hover:text-[#38BDF8]" />
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Add, update, or reorder projects and upload images.
          </p>
        </Link>

        <Link
          to="/admin/skills"
          className="group rounded-xl border border-[#334155] bg-[#111827] p-4 transition hover:border-[#22D3EE]/40 hover:bg-[#1E293B]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F8FAFC]">Skills Management</span>
            <FiArrowRight className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-1 group-hover:text-[#22D3EE]" />
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Configure technical skills, proficiency levels, and icons.
          </p>
        </Link>

        <Link
          to="/admin/settings"
          className="group rounded-xl border border-[#334155] bg-[#111827] p-4 transition hover:border-[#38BDF8]/40 hover:bg-[#1E293B]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F8FAFC]">Portfolio Settings</span>
            <FiArrowRight className="h-4 w-4 text-[#94A3B8] transition-transform group-hover:translate-x-1 group-hover:text-[#38BDF8]" />
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Edit profile bio, social accounts, and manage JSON backups.
          </p>
        </Link>
      </div>
    </div>
  );
}
