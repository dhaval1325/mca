
import React, { useState } from 'react';
import { Shipment, THC, LogisticsStatus } from '../types';

interface THCModuleProps {
  availableShipments: Shipment[];
  onTHCComplete: (newTHC: THC) => void;
  onClose: () => void;
}

const THCModule: React.FC<THCModuleProps> = ({ availableShipments, onTHCComplete, onClose }) => {
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<THC>>({
    thcNumber: 'THC-' + Math.floor(100000 + Math.random() * 900000),
    thcDate: new Date().toISOString().split('T')[0],
    vehicleNumber: '',
    driverName: '',
    vendorName: '',
    route: '',
    shipmentIds: []
  });

  const toggleShipmentSelection = (id: string) => {
    const current = formData.shipmentIds || [];
    if (current.includes(id)) {
      setFormData({ ...formData, shipmentIds: current.filter(sId => sId !== id) });
    } else {
      setFormData({ ...formData, shipmentIds: [...current, id] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shipmentIds || formData.shipmentIds.length === 0) {
      alert("Please select at least one docket to load on vehicle.");
      return;
    }
    const selectedShipments = availableShipments.filter(s => formData.shipmentIds?.includes(s.id));
    const totalWeight = selectedShipments.reduce((acc, curr) => acc + (curr.actualWeight || 0), 0);
    
    const newTHC: THC = {
      ...formData,
      id: `THC-${Date.now()}`,
      totalWeight,
      shipmentIds: formData.shipmentIds,
      thcNumber: formData.thcNumber || ''
    } as THC;
    
    onTHCComplete(newTHC);
  };

  const loadableShipments = availableShipments.filter(s => s.logisticsStatus === LogisticsStatus.BOOKED);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-7xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white animate-in zoom-in-95 duration-300">
        
        <div className="bg-slate-900 px-10 py-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-lg shadow-blue-500/20 text-white">T</div>
             <div>
                <h2 className="text-2xl font-black tracking-tight leading-tight uppercase italic">Execute Dispatch Manifest</h2>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">Transit Control Vehicle Loading</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/10 group">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow flex overflow-hidden bg-slate-50/30">
          <div className="w-5/12 p-12 overflow-y-auto border-r border-slate-100 bg-white shadow-xl z-10">
            <form id="thc-form" onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">THC Manifest No</label>
                  <input type="text" value={formData.thcNumber} readOnly className="w-full border-2 border-slate-100 bg-white rounded-2xl px-6 py-4 text-sm font-black text-slate-900 mono outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch Date</label>
                  <input type="date" value={formData.thcDate} onChange={e => setFormData({...formData, thcDate: e.target.value})} className="w-full border-2 border-slate-100 bg-white rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Plate Number</label>
                <input type="text" placeholder="MH-43-AW-1234" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full border-2 border-slate-100 bg-white rounded-2xl px-6 py-5 text-lg font-black focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 outline-none transition-all uppercase mono" required />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver Name</label>
                  <input type="text" placeholder="John Doe" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="w-full border-2 border-slate-100 bg-white rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-400 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor / Fleet</label>
                  <input type="text" placeholder="Self Owned" value={formData.vendorName} onChange={e => setFormData({...formData, vendorName: e.target.value})} className="w-full border-2 border-slate-100 bg-white rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-400 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Defined Route</label>
                <input type="text" placeholder="Hub-to-Hub Logistics Route" value={formData.route} onChange={e => setFormData({...formData, route: e.target.value})} className="w-full border-2 border-slate-100 bg-white rounded-2xl px-6 py-4 text-sm font-black text-blue-600 uppercase outline-none focus:border-blue-400 transition-all" />
              </div>

              <div className="bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200 mt-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-6">Manifest Summary</p>
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="text-xs font-bold text-white/80">Selected Dockets:</span>
                  <span className="text-2xl font-black text-white">{formData.shipmentIds?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center py-6">
                  <span className="text-xs font-bold text-white/80">Total Payload:</span>
                  <span className="text-3xl font-black text-white">
                    {availableShipments.filter(s => formData.shipmentIds?.includes(s.id)).reduce((acc, curr) => acc + (curr.actualWeight || 0), 0)} <span className="text-xs font-bold">KG</span>
                  </span>
                </div>
              </div>
            </form>
          </div>

          <div className="w-7/12 p-12 overflow-y-auto">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 mb-10">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-lg shadow-blue-100"></span>
              Inventory for Loading
            </h3>

            <div className="space-y-4">
              {loadableShipments.map(shipment => {
                const isSelected = formData.shipmentIds?.includes(shipment.id);
                return (
                  <div 
                    key={shipment.id}
                    onClick={() => toggleShipmentSelection(shipment.id)}
                    className={`p-8 rounded-[2rem] border-2 transition-all cursor-pointer bg-white flex justify-between items-center group ${
                      isSelected ? 'border-blue-600 shadow-xl scale-[1.01]' : 'border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'border-slate-200 bg-white group-hover:border-slate-400'
                      }`}>
                        {isSelected && <span className="text-xs font-black">✓</span>}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-lg mono tracking-tight leading-none mb-1 uppercase italic">{shipment.challanNumber}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                           {shipment.customerName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-lg font-black text-slate-800 mono">{shipment.actualWeight} <span className="text-[10px] font-bold text-slate-300">KG</span></div>
                       <div className="text-[9px] font-black text-blue-400 uppercase">{shipment.fromCity} → {shipment.toCity}</div>
                    </div>
                  </div>
                );
              })}
              {loadableShipments.length === 0 && (
                <div className="py-20 text-center bg-white border border-slate-100 rounded-[2.5rem]">
                   <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No dockets available in current branch</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-10 border-t border-slate-100 flex justify-end gap-6 shrink-0 shadow-2xl">
          <button onClick={onClose} className="px-10 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-all">
            Cancel Manifest
          </button>
          <button type="submit" form="thc-form" className="px-16 py-4 text-xs font-black text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest">
            Dispatch Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default THCModule;
