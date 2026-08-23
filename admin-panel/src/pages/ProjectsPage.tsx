import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Project } from '../types';
import { AddProjectModal } from '../components/projects/AddProjectModal';
import { EditProjectModal } from '../components/projects/EditProjectModal';
import { MapPin, Plus, Trash2, Edit, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProjectsPage: React.FC = () => {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete project');
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
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer border border-[#0B4F3C]"
          >
            <Plus className="w-4 h-4" /> Create New Project
          </button>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#0B4F3C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p._id} className="bg-white p-6 rounded-2xl border border-[#0B4F3C]/15 hover:border-[#0B4F3C]/40 transition-all space-y-4 relative group shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3EF] text-[#0B4F3C] text-[10px] font-bold border border-[#0B4F3C]/20">
                  {p.status}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-[#171A18]/60 mr-2">{p.code}</span>
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
                <h3 className="text-lg font-serif font-bold text-[#171A18]">{p.name}</h3>
                <p className="text-xs text-[#171A18]/70 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0B4F3C]" /> {p.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#0B4F3C]/15 text-xs">
                <div className="bg-[#EAF3EF] p-2.5 rounded-xl border border-[#0B4F3C]/20">
                  <p className="text-[#171A18]/70 font-semibold text-[10px]">Total Plots</p>
                  <p className="font-bold text-[#171A18] text-sm mt-0.5">{p.totalPlots}</p>
                </div>
                <div className="bg-[#EAF3EF] p-2.5 rounded-xl border border-[#0B4F3C]/20">
                  <p className="text-[#171A18]/70 font-semibold text-[10px]">Base Price / Sqft</p>
                  <p className="font-bold text-[#0B4F3C] text-sm mt-0.5">₹{p.basePricePerSqft}</p>
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
