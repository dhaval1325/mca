
import React from 'react';
import { User, UserRole } from '../types';

interface UserMasterProps {
  users: User[];
}

const UserMaster: React.FC<UserMasterProps> = ({ users }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">System Access Directory</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage employee permissions & credentials</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
            + Register User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-10 py-6 border-b border-slate-100">Personnel Info</th>
                <th className="px-10 py-6 border-b border-slate-100">Designated Role</th>
                <th className="px-10 py-6 border-b border-slate-100">Base Location</th>
                <th className="px-10 py-6 border-b border-slate-100">System Status</th>
                <th className="px-10 py-6 border-b border-slate-100 text-right">Last Interaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 text-xs">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm tracking-tight">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-tight">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border ${
                      u.role === UserRole.ADMIN ? 'bg-slate-900 border-slate-700 text-white' :
                      u.role === UserRole.AUDITOR ? 'bg-blue-600 border-blue-500 text-white' :
                      'bg-white border-slate-200 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-xs font-bold text-slate-700 uppercase">{u.locationName}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{u.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right text-[10px] font-bold text-slate-400 uppercase">
                    {u.lastLogin || 'No Login Data'}
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

export default UserMaster;
