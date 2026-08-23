import React, { useState } from 'react';
import { X, UploadCloud, ScanText, Sparkles } from 'lucide-react';
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
  const [projectId, setProjectId] = useState<string>(selectedProjectId || (projects[0]?._id || ''));
  const [mapName, setMapName] = useState<string>('Official Government Layout Blueprint');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleRunOcr = async (e?: React.FormEvent, isSample: boolean = false) => {
    if (e) e.preventDefault();

    if (!isSample && !file) {
      toast.error('Please select a Government Naksa PDF or Image blueprint file, or click "Try Sample Naksa Blueprint".');
      return;
    }

    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      if (file && !isSample) {
        formData.append('file', file);
      }
      formData.append('projectId', projectId);
      formData.append('mapName', mapName);

      const res = await api.post('/ocr/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Vision AI extracted plot geometry successfully!');
      setOcrResult(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to analyze Government Naksa file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveComplete = () => {
    toast.success('🎉 Government Naksa layout successfully converted & synchronized to Plot Map Canvas!');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#0B4F3C]/20 w-full max-w-4xl rounded-3xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0B4F3C]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] text-white flex items-center justify-center shadow-md">
              <ScanText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#171A18]">Upload Government Naksa & AI Canvas Generator</h3>
              <p className="text-xs text-[#171A18]/70">PyMuPDF + Vision AI vector geometry extraction & plot canvas overlay</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#EAF3EF] text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Step Guide */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold ${
            !ocrResult ? 'bg-[#0B4F3C] text-white border-[#0B4F3C]' : 'bg-[#EAF3EF] text-[#0B4F3C] border-[#0B4F3C]/20'
          }`}>
            <span>1. Select Naksa Image/PDF</span>
          </div>
          <div className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold ${
            ocrResult ? 'bg-[#0B4F3C] text-white border-[#0B4F3C]' : 'bg-[#FAF9F6] text-[#171A18]/70 border-[#0B4F3C]/15'
          }`}>
            <span>2. Vision AI Extract & Verify</span>
          </div>
          <div className="p-2.5 rounded-xl border border-[#0B4F3C]/15 bg-[#FAF9F6] text-[#171A18]/70 font-bold flex items-center justify-center gap-1.5">
            <span>3. Render Plot Canvas</span>
          </div>
        </div>

        {!ocrResult ? (
          <form onSubmit={(e) => handleRunOcr(e, false)} className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#171A18]/70 font-semibold block mb-1">Target Project / Township</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                >
                  {projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.name} ({proj.code}) - {proj.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#171A18]/70 font-semibold block mb-1">Naksa Title / Blueprint Reference</label>
                <input
                  type="text"
                  required
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                />
              </div>
            </div>

            {/* Quick Demo Test Action */}
            <div className="p-3 bg-[#EAF3EF] rounded-2xl border border-[#0B4F3C]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0B4F3C]" />
                <span className="font-bold text-[#0B4F3C]">No blueprint file on your laptop?</span>
              </div>
              <button
                type="button"
                onClick={() => handleRunOcr(undefined, true)}
                disabled={isAnalyzing}
                className="px-3.5 py-1.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer"
              >
                ⚡ Try Sample Government Naksa (1-Click Test)
              </button>
            </div>

            {/* File Dropzone */}
            <div className="border-2 border-dashed border-[#0B4F3C]/20 hover:border-[#0B4F3C] bg-[#FAF9F6] rounded-2xl p-8 text-center cursor-pointer transition-colors">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="naksa-upload-input"
              />
              <label htmlFor="naksa-upload-input" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-[#0B4F3C] mb-2" />
                <span className="text-sm font-bold text-[#171A18]">
                  {fileName ? `Selected: ${fileName}` : 'Click to Upload Official Government Naksa (PDF, PNG, JPG)'}
                </span>
                <span className="text-[10px] text-[#171A18]/70 mt-1">
                  PyMuPDF + Vision AI will automatically detect Plot Numbers, Dimensions, Boundaries & PLC details
                </span>
              </label>
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
                disabled={isAnalyzing}
                className="flex-1 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] font-bold text-xs text-white shadow-md cursor-pointer border border-[#0B4F3C] flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running AI Vision OCR & Polygon Extraction...
                  </>
                ) : (
                  <>
                    <ScanText className="w-4 h-4" /> Run AI OCR Naksa Extraction
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <OcrValidationViewer
            mapData={ocrResult}
            onComplete={handleApproveComplete}
          />
        )}
      </div>
    </div>
  );
};
