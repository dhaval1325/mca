
import React, { useState, useMemo } from 'react';
import { AuditStatus, LogisticsStatus, Shipment, Customer, User, Location, AuditLogEntry, LogEvent, FieldVisibilityConfig, THC } from './types';
import { MOCK_CUSTOMERS, MOCK_SHIPMENTS, MOCK_USERS, MOCK_LOCATIONS } from './constants';
import Dashboard from './components/Dashboard';
import ShipmentAudit from './components/ShipmentAudit';
import ShipmentBooking from './components/ShipmentBooking';
import THCModule from './components/THCModule';
import DeliveryModule from './components/DeliveryModule';
import UserMaster from './components/UserMaster';
import LocationMaster from './components/LocationMaster';

type ViewMode = 'DASHBOARD' | 'SHIPMENTS' | 'THC' | 'DELIVERY' | 'USERS' | 'LOCATIONS' | 'CUSTOMERS' | 'LOGS' | 'CONTROL';

const ITEMS_PER_PAGE = 8;

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('DASHBOARD');
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [users] = useState<User[]>(MOCK_USERS);
  const [locations] = useState<Location[]>(MOCK_LOCATIONS);
  const [thcs, setThcs] = useState<THC[]>([]);
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  
  // Modal States
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTHCModalOpen, setIsTHCModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [visibilityConfig] = useState<FieldVisibilityConfig>({
    challanNumber: true, gcnDate: true, billingParty: true, cargoType: true, gcnMode: true, paymentMode: true,
    origin: true, fromCity: true, toCity: true, destination: true, prqNo: true, transportMode: true,
    consignorName: true, consigneeName: true, actualWeight: true, chargedWeight: true, noOfPackages: true
  });

  // --- Handlers ---
  
  const handleBookingComplete = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev]);
    setIsBookingModalOpen(false);
    setCurrentPage(1);
  };

  const handleTHCComplete = (newTHC: THC) => {
    setThcs(prev => [newTHC, ...prev]);
    // Update shipment statuses to IN_THC
    setShipments(prev => prev.map(s => 
      newTHC.shipmentIds.includes(s.id) ? { ...s, logisticsStatus: LogisticsStatus.IN_THC } : s
    ));
    setIsTHCModalOpen(false);
    setView('THC');
  };

  const handleDeliveryComplete = (shipmentId: string, details: any) => {
    setShipments(prev => prev.map(s => 
      s.id === shipmentId ? { ...s, ...details, logisticsStatus: LogisticsStatus.DELIVERED } : s
    ));
    setIsDeliveryModalOpen(false);
    setView('SHIPMENTS'); // Go back to view the delivered docket
  };

  // --- Filtered Data ---

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => 
      s.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.fromCity || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.toCity || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shipments, searchQuery]);

  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredShipments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredShipments, currentPage]);

  const inTransitShipments = useMemo(() => {
    return shipments.filter(s => s.logisticsStatus === LogisticsStatus.IN_THC);
  }, [shipments]);

  const totalPages = Math.ceil(filteredShipments.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen hidden md:flex shrink-0 shadow-sm z-50">
        <div className="p-8">
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-200 italic">W</div>
            <span className="tracking-tight uppercase text-lg">WebXpress <span className="text-blue-600 font-black">Pro</span></span>
          </h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-1 overflow-y-auto mt-4">
          <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Operations</div>
          {[
            { id: 'DASHBOARD', label: 'Dashboard Monitor', icon: '📊' },
            { id: 'SHIPMENTS', label: 'Shipment Booking', icon: '📝' },
            { id: 'THC', label: 'THC Manifesting', icon: '🚛' },
            { id: 'DELIVERY', label: 'Arrival & POD', icon: '📦' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as ViewMode); setCurrentPage(1); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all relative group ${
                view === item.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              {view === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-full" />}
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
          
          <div className="px-5 pt-10 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Master Data</div>
          {[
            { id: 'USERS', label: 'User Directory', icon: '👤' },
            { id: 'LOCATIONS', label: 'Location Network', icon: '📍' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as ViewMode); setCurrentPage(1); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all relative ${
                view === item.id 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              {view === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-full" />}
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
           <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-sm shadow-sm">AD</div>
                 <div className="overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate uppercase">Admin User</p>
                    <p className="text-[10px] text-slate-500 font-bold truncate">Logistics Manager</p>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 lg:p-14 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex-grow">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-1 uppercase italic">
              {view === 'DASHBOARD' ? 'Operations Monitor' : 
               view === 'SHIPMENTS' ? 'Docket Management' : 
               view === 'THC' ? 'Transit Manifests' :
               view === 'DELIVERY' ? 'Arrival & Unloading' : 'Master Data'}
            </h2>
            <p className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Enterprise Node: {shipments.length} Records Active
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             {view === 'SHIPMENTS' && (
               <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Search Dockets..." 
                    className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs w-64 font-bold shadow-sm focus:ring-4 focus:ring-blue-600/5 outline-none transition-all" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    + Create Docket
                  </button>
               </div>
             )}
             {view === 'THC' && (
               <button 
                onClick={() => setIsTHCModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
               >
                 + New Manifest (THC)
               </button>
             )}
             {view === 'DELIVERY' && (
               <button 
                onClick={() => setIsDeliveryModalOpen(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
               >
                 + Log Hub Arrival
               </button>
             )}
          </div>
        </header>

        {view === 'DASHBOARD' && <Dashboard shipments={shipments} customers={customers} />}

        {view === 'SHIPMENTS' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Inventory List</h3>
                <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  Page {currentPage} of {totalPages || 1}
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-10 py-6 border-b border-slate-100">Docket #</th>
                      <th className="px-10 py-6 border-b border-slate-100">Customer</th>
                      <th className="px-10 py-6 border-b border-slate-100">Origin → Dest</th>
                      <th className="px-10 py-6 border-b border-slate-100">Logistics</th>
                      <th className="px-10 py-6 border-b border-slate-100">Audit</th>
                      <th className="px-10 py-6 border-b border-slate-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedShipments.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6">
                          <div className="font-black text-slate-900 text-sm mono">{s.challanNumber}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{s.gcnDate || '20-May-24'}</div>
                        </td>
                        <td className="px-10 py-6 text-xs font-extrabold text-slate-800 uppercase">{s.customerName}</td>
                        <td className="px-10 py-6">
                          <div className="text-[10px] font-bold text-slate-600 uppercase">
                             {s.fromCity} <span className="text-blue-400">→</span> {s.toCity}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border ${
                             s.logisticsStatus === LogisticsStatus.DELIVERED ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                             s.logisticsStatus === LogisticsStatus.IN_THC ? 'bg-amber-50 border-amber-100 text-amber-600' :
                             'bg-blue-50 border-blue-100 text-blue-600'
                           }`}>
                             {s.logisticsStatus}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
                             s.status === AuditStatus.APPROVED ? 'bg-emerald-500 text-white' : 
                             s.status === AuditStatus.REJECTED ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'
                           }`}>
                             {s.status}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => setSelectedShipment(s)} className="text-blue-600 font-black text-[10px] uppercase tracking-widest border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">Audit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>

             <div className="p-6 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-[10px] font-black border rounded-lg disabled:opacity-30">Prev</button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-[10px] font-black border rounded-lg disabled:opacity-30">Next</button>
             </div>
          </div>
        )}

        {view === 'THC' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Transit Manifests</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-10 py-6">Manifest #</th>
                      <th className="px-10 py-6">Vehicle Plate</th>
                      <th className="px-10 py-6">Driver / Vendor</th>
                      <th className="px-10 py-6">Gross Payload</th>
                      <th className="px-10 py-6">Dockets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {thcs.map(t => (
                      <tr key={t.id}>
                        <td className="px-10 py-6 font-black text-slate-900 mono">{t.thcNumber}</td>
                        <td className="px-10 py-6 text-xs font-black text-blue-600 mono">{t.vehicleNumber}</td>
                        <td className="px-10 py-6">
                           <div className="text-xs font-black uppercase text-slate-800">{t.driverName || 'Self'}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase">{t.vendorName || 'Fleet Operator'}</div>
                        </td>
                        <td className="px-10 py-6 font-black text-slate-800 text-xs">{t.totalWeight} KG</td>
                        <td className="px-10 py-6 font-black text-blue-500 text-xs">{t.shipmentIds.length} items</td>
                      </tr>
                    ))}
                    {thcs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-20 text-center">
                          <div className="text-4xl mb-4">🚛</div>
                          <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No manifests generated yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {view === 'DELIVERY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {inTransitShipments.map(s => (
               <div key={s.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <span className="text-4xl">🚛</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mono uppercase mb-1">{s.challanNumber}</h4>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">{s.customerName}</p>
                  
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-8">
                     <span className="bg-slate-100 px-2 py-1 rounded uppercase tracking-tighter">{s.fromCity}</span>
                     <span className="text-slate-300">→</span>
                     <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-tighter">{s.toCity}</span>
                  </div>

                  <button 
                    onClick={() => { setIsDeliveryModalOpen(true); }}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Confirm Hub Arrival
                  </button>
               </div>
             ))}
             {inTransitShipments.length === 0 && (
               <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                  <div className="text-5xl mb-6">📦</div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Zero Shipments Currently In-Transit</h3>
               </div>
             )}
          </div>
        )}

        {view === 'USERS' && <UserMaster users={users} />}
        {view === 'LOCATIONS' && <LocationMaster locations={locations} />}

        {/* --- Modals --- */}
        {isBookingModalOpen && (
          <ShipmentBooking customers={customers} visibilityConfig={visibilityConfig} onBookingComplete={handleBookingComplete} onClose={() => setIsBookingModalOpen(false)} />
        )}
        {isTHCModalOpen && (
          <THCModule availableShipments={shipments} onTHCComplete={handleTHCComplete} onClose={() => setIsTHCModalOpen(false)} />
        )}
        {isDeliveryModalOpen && (
          <DeliveryModule inTransitShipments={inTransitShipments} onDeliveryComplete={handleDeliveryComplete} onClose={() => setIsDeliveryModalOpen(false)} />
        )}
        {selectedShipment && (
          <ShipmentAudit 
            shipment={selectedShipment} 
            onClose={() => setSelectedShipment(null)} 
            onAuditComplete={(u) => setShipments(shipments.map(s => s.id === u.id ? u : s))} 
            onLog={() => {}} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
