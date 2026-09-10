import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Project } from '../types';
import { AddProjectModal } from '../components/projects/AddProjectModal';
import { EditProjectModal } from '../components/projects/EditProjectModal';
import { ProjectCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { formatNumber } from '../utils/formatters';
import { MapPin, Plus, Trash2, Edit, RefreshCw, Building2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProjectsPage: React.FC = () => {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (e: any) {
      console.error('Failed to fetch projects:', e);
      setError(e?.friendlyMessage || 'Failed to connect to projects API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project and all associated plots?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.friendlyMessage || 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Add Project Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">Real Estate Projects & Townships</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">Active townships, masterplan settings, and project-specific pricing configurations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="p-2.5 rounded-xl bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer"
            title="Refresh Projects"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer border border-[#0B4F3C]"
          >
            <Plus className="w-4 h-4" /> Create New Project
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <ProjectCardSkeleton count={3} />
      ) : error ? (
        <ErrorState
          title="Projects Load Failed"
          message={error}
          onRetry={fetchProjects}
        />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Projects Found"
          description="There are currently no real estate projects or townships registered in the system."
          icon={Building2}
          actionLabel="Create First Project"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p._id} className="bg-white p-6 rounded-2xl border border-[#0B4F3C]/15 hover:border-[#0B4F3C]/40 transition-all space-y-4 relative group shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3EF] text-[#0B4F3C] text-[10px] font-bold border border-[#0B4F3C]/20">
                  {p.status || 'ACTIVE'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-[#171A18]/60 mr-2">{p.code || 'PRJ'}</span>
                  <button
                    onClick={() => setEditingProject(p)}
                    className="p-1.5 rounded-lg text-[#0B4F3C] hover:bg-[#EAF3EF] transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-[#171A18]">{p.name || 'Unnamed Project'}</h3>
                <p className="text-xs text-[#171A18]/70 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0B4F3C]" /> {p.location || 'Location Not Specified'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#0B4F3C]/15 text-xs">
                <div className="bg-[#EAF3EF] p-2 rounded-xl border border-[#0B4F3C]/20">
                  <p className="text-[#171A18]/70 font-semibold text-[10px]">Total Plots</p>
                  <p className="font-bold text-[#171A18] text-sm mt-0.5">{formatNumber(p.totalPlots)}</p>
                </div>
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <p className="text-emerald-800 font-semibold text-[10px]">Available</p>
                  <p className="font-bold text-emerald-900 text-sm mt-0.5">{formatNumber(p.availableCount ?? 0)}</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <p className="text-amber-800 font-semibold text-[10px]">Pending Approval</p>
                  <p className="font-bold text-amber-900 text-sm mt-0.5">{formatNumber(p.pendingCount ?? 0)}</p>
                </div>
                <div className="bg-red-50 p-2 rounded-xl border border-red-200">
                  <p className="text-red-800 font-semibold text-[10px]">Booked / Sold</p>
                  <p className="font-bold text-red-900 text-sm mt-0.5">{formatNumber((p.bookedCount ?? 0) + (p.soldCount ?? 0))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <AddProjectModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchProjects}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
};
