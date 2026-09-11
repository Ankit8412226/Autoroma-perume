import React, { useState } from 'react';
import { X, Building2, UploadCloud } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface AddProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onSuccess }) => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [totalAreaSqft, setTotalAreaSqft] = useState(250000);
  const [totalPlots, setTotalPlots] = useState(20);
  const [basePricePerSqft, setBasePricePerSqft] = useState(4500);
  const [mapImageUrl, setMapImageUrl] = useState('https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'project_maps');

        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data?.url) {
          setMapImageUrl(response.data.url);
          toast.success('Map uploaded to S3 successfully!');
        }
      } catch (err) {
        console.error('S3 Upload Error:', err);
        toast.error('Failed to upload image to S3, using fallback local preview');
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) setMapImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/projects', {
        name,
        code,
        location,
        totalAreaSqft,
        totalPlots,
 basePricePerSqft,
        bannerImage: mapImageUrl,
        status: 'ACTIVE'
      });

      toast.success('Project created successfully with Plot Map Layout background!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#0B4F3C]/20 w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-[#0B4F3C]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#171A18]">Create Real Estate Project</h3>
              <p className="text-xs text-[#171A18]/70">Add new township & upload plot layout map</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#EAF3EF] text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[#171A18]/70 font-semibold">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Palms Executive City"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#171A18]/70 font-semibold">Project Code</label>
              <input
                type="text"
                required
                placeholder="RPE-03"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>
            <div>
              <label className="text-[#171A18]/70 font-semibold">Location</label>
              <input
                type="text"
                required
                placeholder="Sector 150, Noida"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#171A18]/70 font-semibold">Total Area (sqft)</label>
              <input
                type="number"
                required
                value={totalAreaSqft}
                onChange={(e) => setTotalAreaSqft(Number(e.target.value))}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>
            <div>
              <label className="text-[#171A18]/70 font-semibold">Total Plots</label>
              <input
                type="number"
                required
                value={totalPlots}
                onChange={(e) => setTotalPlots(Number(e.target.value))}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>
            <div>
              <label className="text-[#171A18]/70 font-semibold">Rate / Sqft (₹)</label>
              <input
                type="number"
                required
                value={basePricePerSqft}
                onChange={(e) => setBasePricePerSqft(Number(e.target.value))}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>
          </div>

          {/* Project Site Map / Banner Image Upload Box */}
          <div className="p-4 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/20 space-y-3">
            <label className="font-bold text-[#0B4F3C] flex items-center gap-1.5 text-[11px]">
              <UploadCloud className="w-4 h-4 text-[#0B4F3C]" /> Project Banner Image
            </label>

            {/* Upload Zone */}
            <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all bg-white ${isUploading ? 'border-[#0B4F3C] bg-[#EAF3EF]/50' : 'border-[#0B4F3C]/20 hover:border-[#0B4F3C]'}`}>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="project-map-upload"
                disabled={isUploading}
              />
              <label htmlFor="project-map-upload" className={`flex flex-col items-center gap-1 ${isUploading ? 'cursor-wait' : 'cursor-pointer'}`}>
                {isUploading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-[#0B4F3C] border-t-transparent rounded-full animate-spin mb-1" />
                    <span className="text-xs font-bold text-[#0B4F3C]">Uploading to S3...</span>
                    <span className="text-[10px] text-[#171A18]/70">Please wait</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-7 h-7 text-[#0B4F3C] mb-1" />
                    <span className="text-xs font-bold text-[#171A18]">
                      {fileName ? `✅ ${fileName}` : 'Click to Upload Banner Image (PNG, JPG, PDF)'}
                    </span>
                    <span className="text-[10px] text-[#171A18]/70 mt-0.5">Image will appear on project card & landing page</span>
                  </>
                )}
              </label>
            </div>

            {/* URL Input */}
            <div className="border-t border-[#0B4F3C]/15 pt-2">
              <label className="text-[10px] text-[#171A18]/70 block mb-1 font-semibold">Or paste Image URL directly:</label>
              <input
                type="text"
                placeholder="https://..."
                value={mapImageUrl}
                onChange={(e) => setMapImageUrl(e.target.value)}
                className="w-full bg-white border border-[#0B4F3C]/20 rounded-lg px-3 py-1.5 text-[#171A18] font-mono text-[11px] focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>

            {/* Image Preview */}
            {mapImageUrl && (
              <div className="relative rounded-xl overflow-hidden border-2 border-[#0B4F3C]/20 mt-2">
                <img
                  src={mapImageUrl}
                  alt="Preview"
                  className="w-full h-36 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0.3';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                  {mapImageUrl.includes('amazonaws.com') && (
                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      ✅ AWS S3
                    </span>
                  )}
                  <span className="bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setMapImageUrl(''); setFileName(''); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors font-bold"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#0B4F3C]/15 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B4F3C]/20 font-bold text-xs text-[#171A18]/70 hover:text-[#171A18]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] font-bold text-xs text-white shadow-md cursor-pointer border border-[#0B4F3C]"
            >
              {isSubmitting ? 'Creating...' : 'Create Project & Plot Map'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
