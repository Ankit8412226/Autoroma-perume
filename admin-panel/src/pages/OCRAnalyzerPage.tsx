import React, { useState } from 'react';
import api from '../services/api';
import { OcrValidationViewer } from '../components/ocr/OcrValidationViewer';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, ScanText, Lock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const OCRAnalyzerPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'DIRECTOR';
  const [file, setFile] = useState<File | null>(null);
  const [mapName, setMapName] = useState<string>('Sector 82 Masterplan');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('mapName', mapName);

      const response = await api.post('/ocr/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Site map analyzed successfully!');
      setOcrResult(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze site map layout');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">AI Plot Map & Document Analyzer</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">PyMuPDF + OpenCV + Google Gemini 1.5 Pro Vision OCR layout extraction pipeline</p>
        </div>
      </div>

      {!isAdmin ? (
        <div className="bg-white p-12 rounded-3xl border border-[#0B4F3C]/15 max-w-xl mx-auto text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#171A18]">Administrator Access Required</h3>
          <p className="text-xs text-[#171A18]/70">
            Architectural Naksa map upload & Vision AI OCR analysis is restricted to Administrators and Directors.
          </p>
        </div>
      ) : !ocrResult ? (
        <div className="bg-white p-8 rounded-3xl border border-[#0B4F3C]/15 max-w-2xl mx-auto space-y-6 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#0B4F3C] text-white flex items-center justify-center mx-auto shadow-md">
            <ScanText className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-[#171A18]">Upload Architectural Site Plan / Layout</h3>
            <p className="text-xs text-[#171A18]/70 mt-1">Supports PDF, PNG, and JPG layout blueprints up to 50MB</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs text-[#171A18]/70 font-semibold">Layout Map Title</label>
              <input
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-4 py-2 text-xs text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>

            <div className="border-2 border-dashed border-[#0B4F3C]/20 hover:border-[#0B4F3C] bg-[#FAF9F6] rounded-2xl p-8 text-center cursor-pointer transition-colors">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="w-8 h-8 text-[#0B4F3C] mb-2" />
                <span className="text-xs font-bold text-[#171A18]">
                  {file ? file.name : 'Click to select or drag blueprint file here'}
                </span>
                <span className="text-[10px] text-[#171A18]/70 mt-1">Automated Plot No, Dimension & Status Detection</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#0B4F3C]"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Layout OCR & Vector Geometry...
              </>
            ) : (
              'Run AI OCR Extraction Pipeline'
            )}
          </button>
        </div>
      ) : (
        <OcrValidationViewer
          mapData={ocrResult}
          onComplete={() => setOcrResult(null)}
        />
      )}
    </div>
  );
};
