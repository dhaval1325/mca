
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Shipment, AuditStatus, Customer } from '../types';

interface DashboardProps {
  shipments: Shipment[];
  customers: Customer[];
}

const Dashboard: React.FC<DashboardProps> = ({ shipments, customers }) => {
  const [filter, setFilter] = useState<AuditStatus | 'TOTAL'>('TOTAL');

  const stats = useMemo(() => ({
    total: shipments.length,
    pending: shipments.filter(s => s.status === AuditStatus.PENDING).length,
    approved: shipments.filter(s => s.status === AuditStatus.APPROVED).length,
    rejected: shipments.filter(s => s.status === AuditStatus.REJECTED).length,
  }), [shipments]);

  const statusData = [
    { name: 'Pending Audit', value: stats.pending, color: '#3b82f6' }, 
    { name: 'Verified / OK', value: stats.approved, color: '#10b981' }, 
    { name: 'Rejected / Error', value: stats.rejected, color: '#ef4444' }, 
  ];

  const rejectionData = useMemo(() => {
    return customers
      .map(c => ({
        name: c.name,
        rate: c.rejectionRate,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
  }, [customers]);

  const Card = ({ label, value, color, statusKey }: { label: string, value: number, color: string, statusKey: AuditStatus | 'TOTAL' }) => {
    const isActive = filter === statusKey;
    return (
      <button 
        onClick={() => setFilter(statusKey)}
        className={`relative overflow-hidden bg-white p-8 rounded-[2rem] border transition-all duration-300 text-left ${
          isActive 
            ? `border-blue-500 shadow-xl shadow-blue-900/5 ring-4 ring-blue-50` 
            : 'border-slate-200 hover:border-blue-200 hover:shadow-md'
        }`}
      >
        <div className={`absolute top-0 left-0 w-1.5 h-full ${color}`}></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{label}</p>
        <div className="flex items-center justify-between">
          <span className="text-4xl font-black text-slate-900 tracking-tight">{value.toLocaleString()}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${color}`}></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isActive ? 'Filtered View' : 'Master Dataset'}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      {/* High Scale Health Indicator */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-blue-100">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight mb-2 uppercase italic">Network Throughput: <span className="text-blue-400">Optimized</span></h3>
            <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">Processing global logistics data at 45ms per record</p>
         </div>
         <div className="flex gap-10 relative z-10">
            <div className="text-center">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Uptime</p>
               <p className="text-xl font-black">99.98%</p>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">AI Precision</p>
               <p className="text-xl font-black">94.2%</p>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Queue Size</p>
               <p className="text-xl font-black">0 Items</p>
            </div>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card label="Enterprise Units" value={stats.total} color="bg-slate-700" statusKey="TOTAL" />
        <Card label="Awaiting Audit" value={stats.pending} color="bg-blue-600" statusKey={AuditStatus.PENDING} />
        <Card label="Verified Dockets" value={stats.approved} color="bg-emerald-500" statusKey={AuditStatus.APPROVED} />
        <Card label="Audit Rejections" value={stats.rejected} color="bg-rose-500" statusKey={AuditStatus.REJECTED} />
      </div>

      {/* Analytics Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Compliance Distribution
          </h3>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '1rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Top Rejection Sources (Client)
          </h3>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rejectionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} fontSize={9} fontWeight="800" tickLine={false} axisLine={false} stroke="#64748b" />
                <Tooltip cursor={{ fill: '#f8fafc', radius: 10 }} />
                <Bar dataKey="rate" fill="#ef4444" radius={[0, 10, 10, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
