
import React, { useState } from 'react';
import { Shipment, LogisticsStatus, AuditStatus } from '../types';

interface DeliveryModuleProps {
  inTransitShipments: Shipment[];
  onDeliveryComplete: (shipmentId: string, deliveryDetails: any) => void;
  onClose: () => void;
}

const DeliveryModule: React.FC<DeliveryModuleProps> = ({ inTransitShipments, onDeliveryComplete, onClose }) => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');

  const handleDeliver = () => {
    if (!selectedShipment) return;
    onDeliveryComplete(selectedShipment.id, {
      deliveryDate,
      auditComments: remarks,
      logisticsStatus: LogisticsStatus.DELIVERED
    });
    setSelectedShipment(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white animate-in slide-in-from-bottom-6 duration-300">
        
        <div className="bg-emerald-600 px-10 py-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black italic border border-white/20 shadow-lg shadow-emerald-500/20 text-white">D</div>
             <div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic leading-tight">Hub Arrival Control</h2>
                <p className="text-[10px] text-emerald-200 font-black uppercase tracking-[0.3em]">Destination Ops  Hub In-Scanning</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/10 group">
            <svg className="w-6 h-6 text-white/50 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow flex overflow-hidden bg-slate-50/50">
          <div className="w-2/3 p-12 overflow-y-auto border-r border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-100"></span>
                Consignments In-Transit
              </h3>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">{inTransitShipments.length} Pending Arrivals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inTransitShipments.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedShipment(s)}
                  className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    selectedShipment?.id === s.id 
                    ? 'bg-emerald-50 border-emerald-600 shadow-2xl scale-[1.02]' 
                    : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-lg font-black text-slate-900 mono uppercase italic tracking-tight">{s.challanNumber}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter italic">In-Transit</span>
                  </div>
                  <div className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.1em] mb-6 flex items-center gap-3">
                    {s.fromCity} <span className="text-slate-300">→</span> {s.toCity}
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase truncate max-w-[160px]">{s.customerName}</span>
                    <span className="text-xs font-black text-slate-800 mono">{s.actualWeight} KG</span>
                  </div>
                </div>
              ))}
              {inTransitShipments.length === 0 && (
                <div className="col-span-2 py-40 flex flex-col items-center justify-center space-y-6">
                  <div className="text-5xl opacity-30">🚚</div>
                  <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">No shipments currently on-road</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-1/3 p-12 bg-slate-50/50 flex flex-col">
            {selectedShipment ? (
              <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full -mr-10 -mt-10"></div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase mono italic">{selectedShipment.challanNumber}</h4>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{selectedShipment.customerName}</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hub Arrival Date</label>
                    <input 
                      type="date" 
                      value={deliveryDate} 
                      onChange={e => setDeliveryDate(e.target.value)}
                      className="w-full border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Arrival Verification Remarks</label>
                    <textarea 
                      placeholder="Inspect seals, verify package count, or record damages..."
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      rows={6}
                      className="w-full border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all resize-none bg-white placeholder:text-slate-200"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleDeliver}
                  className="w-full bg-emerald-600 text-white font-black py-6 rounded-2xl shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 uppercase text-xs tracking-[0.2em] italic"
                >
                  Confirm Arrival
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-14 space-y-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner text-emerald-600">📍</div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-4">Pending Hub Action</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-tight">Select an arriving manifest from the left panel to update its lifecycle status to 'Delivered' at destination.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModule;
