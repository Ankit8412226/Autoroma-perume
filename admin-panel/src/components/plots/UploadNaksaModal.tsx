import React, { useState, useRef } from 'react';
import { X, UploadCloud, ScanText, FileImage } from 'lucide-react';
import api from '../../services/api';
import { Project } from '../../types';
import { OcrValidationViewer } from '../ocr/OcrValidationViewer';
import { useToast } from '../../context/ToastContext';

interface UploadNaksaModalProps {
  projects: Project[];
  selectedProjectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadNaksaModal: React.FC<UploadNaksaModalProps> = ({
  projects,
  selectedProjectId,
  onClose,
  onSuccess
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectId, setProjectId] = useState<string>(selectedProjectId || (projects[0]?._id || ''));
  const [mapName, setMapName] = useState<string>(() => {
    const p = projects.find(x => x._id === (selectedProjectId || projects[0]?._id));
    return p ? `${p.name} — Naksha Layout` : 'Naksha Layout';
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handleFileSelect = (f: File) => {
    setFile(f);
    if (f.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRunOcr = async () => {
    if (!projectId) {
      toast.error('Please select a project first.');
      return;
    }
    if (!file) {
      toast.error('Please upload a Naksha image first.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      formData.append('mapName', mapName || 'Naksha Layout');

      const res = await api.post('/ocr/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Extracted ${res.data?.extractedPlots?.length || 0} plots!`);
      setOcrResult(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'AI analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveComplete = () => {
    toast.success('Plots saved to database successfully!');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#0B4F3C]/20 w-full max-w-4xl rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#0B4F3C]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] text-white flex items-center justify-center">
              <ScanText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#171A18]">Naksha AI Analyzer</h3>
              <p className="text-xs text-[#171A18]/60">Upload a site layout — AI extracts all plot data automatically</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#EAF3EF] text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!ocrResult ? (
            <>
              {/* Project + Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#171A18]/70 block mb-1.5">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      const p = projects.find(x => x._id === e.target.value);
                      if (p) setMapName(`${p.name} — Naksha Layout`);
                    }}
                    className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2.5 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                  >
                    <option value="">— Select Project —</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#171A18]/70 block mb-1.5">Layout Title</label>
                  <input
                    type="text"
                    value={mapName}
                    onChange={(e) => setMapName(e.target.value)}
                    placeholder="e.g. Sector 5 Phase 2 Layout"
                    className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2.5 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                  />
                </div>
              </div>

              {/* Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  file ? 'border-[#0B4F3C]/60 bg-[#EAF3EF]/30' : 'border-[#0B4F3C]/20 bg-[#FAF9F6] hover:border-[#0B4F3C]/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />

                {previewUrl ? (
                  <div className="p-4">
                    <div className="relative rounded-xl overflow-hidden max-h-52">
                      <img src={previewUrl} alt="Preview" className="w-full object-contain max-h-52" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✅ {file?.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : file ? (
                  <div className="p-8 text-center">
                    <FileImage className="w-10 h-10 text-[#0B4F3C] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#171A18]">✅ {file.name}</p>
                    <p className="text-xs text-[#171A18]/50 mt-1">PDF ready for analysis</p>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <UploadCloud className="w-10 h-10 text-[#0B4F3C]/40 mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#171A18]">Upload Naksha Image or PDF</p>
                    <p className="text-xs text-[#171A18]/50 mt-1">PNG, JPG, PDF • AI will extract plot numbers, sizes & boundaries</p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleRunOcr()}
                  disabled={isAnalyzing || !file || !projectId}
                  className="flex-1 py-3 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <ScanText className="w-4 h-4" />
                      Analyze with AI
                    </>
                  )}
                </button>

              </div>
            </>
          ) : (
            <OcrValidationViewer
              mapData={ocrResult}
              uploadedPreviewUrl={previewUrl}
              onComplete={handleApproveComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};
