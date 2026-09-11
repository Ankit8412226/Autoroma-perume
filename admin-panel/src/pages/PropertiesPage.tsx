import React, { useEffect, useState } from 'react';
import { Edit, Home, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { ListingProperty } from '../types';
import { deleteProperty, fetchProperties } from '../services/propertiesService';
import { AddPropertyModal } from '../components/properties/AddPropertyModal';
import { EditPropertyModal } from '../components/properties/EditPropertyModal';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { useToast } from '../context/ToastContext';

const TYPE_LABEL: Record<string, string> = {
  RESIDENTIAL_PLOT: 'Residential Plot',
  COMMERCIAL: 'Commercial',
  VILLA: 'Villa',
  SHOWROOM: 'Showroom',
  APARTMENT: 'Apartment',
  LAND: 'Land'
};

export const PropertiesPage: React.FC = () => {
  const toast = useToast();
  const [properties, setProperties] = useState<ListingProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<ListingProperty | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch (e: any) {
      setError(e?.friendlyMessage || 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this property listing? Township project and plots stay intact.')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      load();
    } catch (e: any) {
      toast.error(e?.friendlyMessage || 'Failed to delete property');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">Property Listings</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">Separate from township projects — plots stay under Projects / Plot Inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="p-2.5 rounded-xl bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] cursor-pointer" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setIsAddOpen(true)} className="px-4 py-2.5 rounded-xl bg-[#0B4F3C] text-white font-bold text-xs flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Create Property
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && !isLoading && properties.length === 0 && (
        <EmptyState
          icon={Home}
          title="No property listings yet"
          description="Create residential plots, commercial units, villas or showrooms. These are not township projects."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {properties.map((property) => {
          const projectName = typeof property.projectId === 'object' && property.projectId
            ? property.projectId.name
            : '';
          return (
            <article key={property._id} className="bg-white border border-[#0B4F3C]/10 rounded-3xl overflow-hidden shadow-sm">
              <div className="h-40 bg-[#EAF3EF] relative">
                {property.heroImage ? (
                  <img src={property.heroImage} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#0B4F3C]/40">
                    <Home className="w-10 h-10" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-extrabold text-[#0B4F3C]">
                  {TYPE_LABEL[property.propertyType] || property.propertyType}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-serif font-bold text-[#171A18] leading-snug">{property.title}</h3>
                <p className="text-xs text-[#171A18]/60">{[property.location, property.city].filter(Boolean).join(', ') || 'Location pending'}</p>
                {projectName && <p className="text-[10px] font-bold text-[#0B4F3C]">Linked project: {projectName}</p>}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-extrabold text-[#0B4F3C]">
                    {property.priceRange || (property.price ? `₹${property.price.toLocaleString('en-IN')}` : 'Price on request')}
                  </span>
                  <span className="text-[10px] font-bold uppercase">{property.status}</span>
                </div>
                <p className="text-[10px] text-[#171A18]/50">{property.gallery?.length || 0} gallery photos</p>
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={() => setEditing(property)} className="flex-1 px-3 py-2 rounded-xl bg-[#EAF3EF] text-[#0B4F3C] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(property._id)} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {isAddOpen && <AddPropertyModal onClose={() => setIsAddOpen(false)} onSuccess={load} />}
      {editing && <EditPropertyModal property={editing} onClose={() => setEditing(null)} onSuccess={load} />}
    </div>
  );
};
