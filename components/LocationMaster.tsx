
import React from 'react';
import { Location, LocationType } from '../types';

interface LocationMasterProps {
  locations: Location[];
}

const LocationMaster: React.FC<LocationMasterProps> = ({ locations }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Logistics Network Map</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure hubs, branches and transfer points</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
            + New Location
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-10 py-6 border-b border-slate-100">Code / Name</th>
                <th className="px-10 py-6 border-b border-slate-100">Category</th>
                <th className="px-10 py-6 border-b border-slate-100">Geographic Hub</th>
                <th className="px-10 py-6 border-b border-slate-100">Primary Liaison</th>
                <th className="px-10 py-6 border-b border-slate-100 text-right">Contact Line</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {locations.map(l => (
                <tr key={l.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 text-sm mono tracking-tight">{l.code}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{l.name}</div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border ${
                      l.type === LocationType.HUB ? 'bg-blue-50 border-blue-200 text-blue-600' :
                      l.type === LocationType.WAREHOUSE ? 'bg-amber-50 border-amber-200 text-amber-600' :
                      'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      {l.type}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-xs font-bold text-slate-800 uppercase">{l.city}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{l.state}</div>
                  </td>
                  <td className="px-10 py-8 text-xs font-extrabold text-slate-700 uppercase">{l.contactPerson}</td>
                  <td className="px-10 py-8 text-right text-xs font-black text-blue-600 mono">
                    {l.contactNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LocationMaster;
