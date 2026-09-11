import React, { useState } from 'react';
import {
  X,
  Building2,
  UploadCloud,
  ScanText,
  Cpu,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface AddProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ExtractedPlot {
  plotNo: string;
  status: string;
  sellableSqYrd?: number;
  carpetSqYrd?: number;
  dimensions?: string;
  sizeSqft?: number;
  plc12mtr?: number;
  plc9mtr?: number;
  plcCorner?: number;
  plcParkFacing?: number;
  totalPlc?: number;
  discountedPlc?: number;
  otmc?: number;
  gstOnOtherCharges?: number;
  totalCost?: number;
  confidence?: number;
  polygonPoints?: { x: number; y: number }[];
  coordinates?: { x: number; y: number; width: number; height: number };
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onSuccess }) => {
  const toast = useToast();

  // Wizard Step: 1 = Form & File Upload, 2 = AI Vision Scanning, 3 = Review Extracted Plots
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [totalAreaSqft, setTotalAreaSqft] = useState(250000);
  const [totalPlots, setTotalPlots] = useState(20);
  const [basePricePerSqft, setBasePricePerSqft] = useState(4500);
  const [mapImageUrl, setMapImageUrl] = useState('https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // AI OCR States
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusMsg, setScanStatusMsg] = useState('');
  const [extractedPlots, setExtractedPlots] = useState<ExtractedPlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }

      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
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
        toast.error('Using local image preview for OCR');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const runAiOcrAnalysis = async () => {
    if (!file && !mapImageUrl) {
      toast.error('Please upload a Naksha blueprint file or enter Image URL first');
      return;
    }

    setStep(2);
    setIsScanning(true);

    const messages = [
      'Uploading Naksha map to AI Engine...',
      'Running Google Gemini Vision on Naksha...',
      'Detecting plot boundaries & plot numbers...',
      'Extracting dimensions, sqft & costs...',
      'Building plot vector overlay layout...'
    ];
    let i = 0;
    setScanStatusMsg(messages[0]);
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) setScanStatusMsg(messages[i]);
    }, 1500);

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('projectId', '656565656565656565656565');
      formData.append('mapName', name ? `${name} Naksha` : 'Project Masterplan Layout');

      const response = await api.post('/ocr/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(interval);
      setIsScanning(false);

      const plots: ExtractedPlot[] = response.data?.extractedPlots || [];
      setExtractedPlots(plots);
      if (plots.length > 0) {
        setTotalPlots(plots.length);
      }
      setStep(3);
      toast.success(`AI successfully extracted ${plots.length} plots from Naksha!`);
    } catch (err: any) {
      clearInterval(interval);
      setIsScanning(false);
      setStep(1);
      toast.error(err?.response?.data?.message || 'AI OCR extraction failed. You can proceed with standard creation.');
    }
  };

  const handlePlotFieldChange = (index: number, field: keyof ExtractedPlot, value: any) => {
    const updated = [...extractedPlots];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedPlots(updated);
  };

  const handleAddPlot = () => {
    const newNo = `Plot-${101 + extractedPlots.length}`;
    setExtractedPlots([
      ...extractedPlots,
      {
        plotNo: newNo,
        status: 'AVAILABLE',
        sellableSqYrd: 200,
        sizeSqft: 1800,
        totalCost: 1800 * basePricePerSqft,
        confidence: 1.0
      }
    ]);
  };

  const handleRemovePlot = (index: number) => {
    setExtractedPlots(extractedPlots.filter((_, idx) => idx !== index));
  };

  const handleFinalSubmit = async () => {
    if (!name || !code || !location) {
      toast.error('Please fill in Project Name, Code, and Location');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/projects', {
        name,
        code,
        location,
        totalAreaSqft,
        totalPlots: extractedPlots.length > 0 ? extractedPlots.length : totalPlots,
        basePricePerSqft,
        bannerImage: mapImageUrl,
        status: 'ACTIVE',
        ocrPlots: extractedPlots.length > 0 ? extractedPlots : undefined
      });

      toast.success(`🎉 Project created! ${extractedPlots.length > 0 ? `${extractedPlots.length} OCR Plots added to Plot Inventory & Canvas` : 'Plots generated'}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#0B4F3C]/20 w-full max-w-3xl rounded-3xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#0B4F3C]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#171A18]">Create Real Estate Project</h3>
              <p className="text-xs text-[#171A18]/70">Add new township & extract plot map layout with AI OCR</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#EAF3EF] text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Pill Indicator */}
        <div className="flex items-center justify-between bg-[#FAF9F6] p-2.5 rounded-2xl border border-[#0B4F3C]/15 text-xs font-bold">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-xl ${step === 1 ? 'bg-[#0B4F3C] text-white shadow-sm' : 'text-[#0B4F3C]'}`}>
            <span>1. Project Details & Naksha Map</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#0B4F3C]/40" />
          <div className={`flex items-center gap-2 px-3 py-1 rounded-xl ${step === 2 ? 'bg-[#0B4F3C] text-white shadow-sm' : 'text-[#0B4F3C]'}`}>
            <Cpu className="w-3.5 h-3.5" />
            <span>2. AI OCR Scanning</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#0B4F3C]/40" />
          <div className={`flex items-center gap-2 px-3 py-1 rounded-xl ${step === 3 ? 'bg-[#0B4F3C] text-white shadow-sm' : 'text-[#0B4F3C]'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Review Extracted Plots ({extractedPlots.length})</span>
          </div>
        </div>

        {/* STEP 1: Project Details Form & Naksha Upload */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#171A18]/70 font-semibold block mb-1">Project Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Palms Executive City"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#171A18]/70 font-semibold block mb-1">Project Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="RPE-03"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                />
              </div>
              <div>
                <label className="text-[#171A18]/70 font-semibold block mb-1">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Sector 150, Noida"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[#171A18]/70 font-semibold block mb-1">Total Area (sqft)</label>
                <input
                  type="number"
                  required
                  value={totalAreaSqft}
                  onChange={(e) => setTotalAreaSqft(Number(e.target.value))}
                  className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                />
              </div>
              <div>
                <label className="text-[#171A18]/70 font-semibold block mb-1">Total Plots</label>
                <input
                  type="number"
                  required
                  value={totalPlots}
                  onChange={(e) => setTotalPlots(Number(e.target.value))}
                  className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                />
              </div>
              <div>
                <label className="text-[#171A18]/70 font-semibold block mb-1">Rate / Sqft (₹)</label>
                <input
                  type="number"
                  required
                  value={basePricePerSqft}
                  onChange={(e) => setBasePricePerSqft(Number(e.target.value))}
                  className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                />
              </div>
            </div>

            {/* Project Site Naksha Layout Upload Box */}
            <div className="p-4 bg-[#EAF3EF] rounded-2xl border border-[#0B4F3C]/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#0B4F3C] flex items-center gap-1.5 text-xs">
                  <UploadCloud className="w-4 h-4 text-[#0B4F3C]" /> Site Naksha Layout Blueprint & AI OCR
                </label>
                <span className="text-[10px] bg-[#0B4F3C] text-white px-2 py-0.5 rounded-full font-bold">
                  ✨ Gemini Vision OCR
                </span>
              </div>

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
                      <span className="text-xs font-bold text-[#0B4F3C]">Uploading Naksha layout...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-7 h-7 text-[#0B4F3C] mb-1" />
                      <span className="text-xs font-bold text-[#171A18]">
                        {fileName ? `✅ ${fileName}` : 'Click to Upload Site Naksha Map (PNG, JPG, PDF)'}
                      </span>
                      <span className="text-[10px] text-[#171A18]/70 mt-0.5">Upload masterplan to run AI plot boundary & size extraction</span>
                    </>
                  )}
                </label>
              </div>

              {/* Image Preview & Run AI OCR Trigger Button */}
              {previewUrl || mapImageUrl ? (
                <div className="space-y-2 pt-2 border-t border-[#0B4F3C]/15">
                  <div className="relative rounded-xl overflow-hidden border-2 border-[#0B4F3C]/20 max-h-40">
                    <img src={previewUrl || mapImageUrl} alt="Naksha Preview" className="w-full h-36 object-contain bg-slate-900" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        ✅ Naksha Map Loaded
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={runAiOcrAnalysis}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0B4F3C] to-emerald-700 hover:from-[#063B2D] hover:to-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/30"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> Run AI Naksha OCR Plot Extraction
                  </button>
                </div>
              ) : null}
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
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !name || !code || !location}
                className="flex-1 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] font-bold text-xs text-white shadow-md cursor-pointer border border-[#0B4F3C] disabled:opacity-40"
              >
                {isSubmitting ? 'Creating...' : 'Create Project Directly'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AI Vision Scanning Animation */}
        {step === 2 && (
          <div className="p-12 flex flex-col items-center justify-center gap-6 min-h-[320px]">
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-3xl bg-[#0B4F3C]/10 flex items-center justify-center">
                <Cpu className="w-10 h-10 text-[#0B4F3C]" />
              </div>
              <div className="absolute inset-0 rounded-3xl border-2 border-[#0B4F3C]/40 animate-ping" />
            </div>

            <div className="text-center space-y-2">
              <h4 className="text-base font-bold text-[#171A18]">Gemini Vision AI is analyzing Naksha...</h4>
              <p className="text-xs text-[#0B4F3C] font-semibold min-h-[1.2rem]">{scanStatusMsg}</p>
            </div>
          </div>
        )}

        {/* STEP 3: Review Extracted Plots Table & Confirmation */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-[#EAF3EF] p-3 rounded-2xl border border-[#0B4F3C]/20">
              <div>
                <p className="font-bold text-[#0B4F3C] text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0B4F3C]" /> Extracted {extractedPlots.length} Plots from Naksha
                </p>
                <p className="text-[11px] text-[#171A18]/70 mt-0.5">Review, edit numbers or sizes before synchronizing with Plot Inventory Canvas</p>
              </div>

              <button
                type="button"
                onClick={handleAddPlot}
                className="px-3 py-1.5 rounded-xl bg-[#0B4F3C] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Plot
              </button>
            </div>

            {/* Extracted Plots Table */}
            <div className="border border-[#0B4F3C]/20 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF3EF] text-[#0B4F3C] text-[10px] uppercase font-bold border-b border-[#0B4F3C]/15 sticky top-0 bg-white z-10">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Plot No</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Sq Yrd</th>
                    <th className="p-2.5">Dimensions</th>
                    <th className="p-2.5">Total Cost (₹)</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B4F3C]/10">
                  {extractedPlots.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#EAF3EF]/30">
                      <td className="p-2.5 font-mono text-[#171A18]/50">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-[#0B4F3C]">
                        <input
                          type="text"
                          value={p.plotNo}
                          onChange={(e) => handlePlotFieldChange(idx, 'plotNo', e.target.value)}
                          className="bg-white border border-[#0B4F3C]/20 rounded px-2 py-0.5 font-bold font-mono text-xs w-24 focus:outline-none focus:border-[#0B4F3C]"
                        />
                      </td>
                      <td className="p-2.5">
                        <select
                          value={p.status || 'AVAILABLE'}
                          onChange={(e) => handlePlotFieldChange(idx, 'status', e.target.value)}
                          className="bg-white border border-[#0B4F3C]/20 rounded px-2 py-0.5 font-bold text-[10px] focus:outline-none"
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="BOOKED">BOOKED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="SOLD">SOLD</option>
                        </select>
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          value={p.sellableSqYrd || 0}
                          onChange={(e) => handlePlotFieldChange(idx, 'sellableSqYrd', Number(e.target.value))}
                          className="bg-white border border-[#0B4F3C]/20 rounded px-2 py-0.5 font-bold text-xs w-20 focus:outline-none"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={p.dimensions || ''}
                          onChange={(e) => handlePlotFieldChange(idx, 'dimensions', e.target.value)}
                          placeholder="30x60"
                          className="bg-white border border-[#0B4F3C]/20 rounded px-2 py-0.5 font-mono text-xs w-20 focus:outline-none"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-[#0B4F3C]">
                        <input
                          type="number"
                          value={p.totalCost || 0}
                          onChange={(e) => handlePlotFieldChange(idx, 'totalCost', Number(e.target.value))}
                          className="bg-white border border-[#0B4F3C]/20 rounded px-2 py-0.5 font-bold text-xs w-28 focus:outline-none"
                        />
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemovePlot(idx)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Remove Plot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-[#0B4F3C]/15 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-[#FAF9F6] border border-[#0B4F3C]/20 font-bold text-xs text-[#171A18]/70 hover:text-[#171A18] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Details
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] font-bold text-xs text-white shadow-md cursor-pointer border border-[#0B4F3C]"
              >
                {isSubmitting ? 'Saving Project & Plots...' : `Confirm & Create Project (${extractedPlots.length} Plots)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
