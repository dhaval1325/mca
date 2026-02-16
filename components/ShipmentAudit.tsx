
import React, { useState, useRef, useEffect } from 'react';
import { Shipment, AuditStatus, AuditType, ManualVerification, LogEvent } from '../types';
import { analyzePOD } from '../services/geminiService';

interface ShipmentAuditProps {
  shipment: Shipment;
  onAuditComplete: (updatedShipment: Shipment) => void;
  onClose: () => void;
  onLog: (event: LogEvent, details: string, durationSeconds?: number) => void;
}

const ShipmentAudit: React.FC<ShipmentAuditProps> = ({ shipment, onAuditComplete, onClose, onLog }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comments, setComments] = useState(shipment.auditComments || '');
  const [status, setStatus] = useState<AuditStatus>(shipment.status);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(shipment.podImageUrl);
  const [startTime] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [manualVerify, setManualVerify] = useState<ManualVerification>(
    shipment.manualVerification || {
      hasSignature: false,
      hasStamp: false,
      isLegible: false,
      challanMatch: false,
      dateMatch: false,
    }
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageUrl(reader.result as string);
        onLog(LogEvent.POD_UPLOADED, `Uploaded file: ${file.name} (${file.type})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAudit = async () => {
    if (!currentImageUrl) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzePOD(currentImageUrl, shipment.challanNumber);
      setAiAnalysis(result);
      setComments(result.summary);
      setStatus(result.isValid ? AuditStatus.APPROVED : AuditStatus.REJECTED);
      setManualVerify({
        hasSignature: result.hasSignature || false,
        hasStamp: result.hasStamp || false,
        isLegible: result.confidenceScore > 60,
        challanMatch: result.challanMatch || false,
        dateMatch: true,
      });
      onLog(LogEvent.AI_AUDIT_RUN, `AI Score: ${result.confidenceScore}%, Valid: ${result.isValid}`);
    } catch (error) {
      alert("AI Analysis failed. Please complete manual audit.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = (type: AuditType) => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const event = type === AuditType.AI ? LogEvent.AI_AUDIT_ACCEPTED : LogEvent.MANUAL_AUDIT_SUBMITTED;
    
    onLog(event, `Audit finalized as ${status}. Comments: ${comments.substring(0, 30)}...`, duration);
    
    onAuditComplete({
      ...shipment,
      status,
      auditType: type,
      auditComments: comments,
      aiScore: aiAnalysis?.confidenceScore,
      podImageUrl: currentImageUrl,
      manualVerification: manualVerify,
    });
    onClose();
  };

  const toggleVerify = (key: keyof ManualVerification) => {
    setManualVerify(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isPdf = currentImageUrl?.startsWith('data:application/pdf') || currentImageUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left Panel: Preview */}
        <div className="md:w-1/2 bg-slate-50 flex flex-col border-r border-slate-200">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="font-bold text-slate-700">Document Preview</h3>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload Image/PDF
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*,application/pdf" 
              className="hidden" 
            />
          </div>
          
          <div className="flex-grow flex items-center justify-center p-8 overflow-auto bg-slate-100">
            {currentImageUrl ? (
              isPdf ? (
                <iframe
                  src={currentImageUrl}
                  className="w-full h-full rounded-lg shadow-2xl border-4 border-white"
                  title="PDF Preview"
                />
              ) : (
                <img 
                  src={currentImageUrl} 
                  alt="POD Document" 
                  className="max-h-full max-w-full rounded-lg shadow-2xl border-4 border-white object-contain"
                />
              )
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all group"
              >
                <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                <p className="font-bold text-slate-500">No Document Selected</p>
                <p className="text-sm text-slate-400">Click to upload image or PDF</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Audit Controls */}
        <div className="md:w-1/2 p-8 overflow-y-auto flex flex-col bg-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-800">{shipment.challanNumber}</h2>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Shipment ID: {shipment.id}</span>
              </div>
              <p className="text-slate-500 font-medium">{shipment.customerName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 flex-grow">
            <button 
              onClick={handleAiAudit}
              disabled={isAnalyzing || !currentImageUrl}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isAnalyzing ? (
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              )}
              {isAnalyzing ? 'Analyzing Document with AI...' : 'Perform Instant AI Audit'}
            </button>

            {aiAnalysis && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                    <span>✨ AI Verification Result</span>
                  </h4>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-600 block">Trust Score</span>
                    <span className="text-lg font-black text-indigo-700">{aiAnalysis.confidenceScore}%</span>
                  </div>
                </div>
                <p className="text-sm text-indigo-700 italic bg-white p-3 rounded-xl border border-indigo-200/50">"{aiAnalysis.summary}"</p>
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Manual Verification Checklist
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'hasSignature', label: 'Legible Signature Present' },
                  { key: 'hasStamp', label: 'Company Stamp Applied' },
                  { key: 'isLegible', label: 'Document Content is Legible' },
                  { key: 'challanMatch', label: 'Challan Number Matches' },
                  { key: 'dateMatch', label: 'Delivery Date Matches Records' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => toggleVerify(item.key as keyof ManualVerification)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      manualVerify[item.key as keyof ManualVerification] 
                      ? 'bg-white border-indigo-200 text-indigo-700 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 grayscale opacity-70'
                    }`}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      manualVerify[item.key as keyof ManualVerification] ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {manualVerify[item.key as keyof ManualVerification] ? '✓' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Final Decision</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: AuditStatus.APPROVED, label: 'Approve', color: 'bg-emerald-500' },
                  { id: AuditStatus.REJECTED, label: 'Reject', color: 'bg-rose-500' },
                  { id: AuditStatus.PENDING, label: 'Hold', color: 'bg-amber-500' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatus(s.id)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border-2 ${
                      status === s.id 
                        ? `${s.color} text-white border-transparent shadow-lg shadow-${s.color.split('-')[1]}-100`
                        : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Audit Remarks</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="Detail why this POD was approved or rejected..."
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
            <button 
              onClick={() => handleSave(AuditType.MANUAL)}
              className="flex-1 bg-slate-800 text-white py-4 px-6 rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
            >
              Finish Manual Audit
            </button>
            {aiAnalysis && (
              <button 
                onClick={() => handleSave(AuditType.AI)}
                className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                Accept AI Audit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentAudit;
