
import React from 'react';
import { AuditLogEntry, LogEvent } from '../types';

interface AuditLogsProps {
  logs: AuditLogEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  const reversedLogs = [...logs].reverse();

  // Behavior Analytics Calculations
  const avgDuration = logs
    .filter(l => l.durationSeconds)
    .reduce((acc, curr, _, arr) => acc + (curr.durationSeconds || 0) / arr.length, 0);

  const eventCounts = logs.reduce((acc, log) => {
    acc[log.event] = (acc[log.event] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const aiPreference = (eventCounts[LogEvent.AI_AUDIT_ACCEPTED] || 0) / 
                       ((eventCounts[LogEvent.MANUAL_AUDIT_SUBMITTED] || 0) + (eventCounts[LogEvent.AI_AUDIT_ACCEPTED] || 0) || 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Behavior Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Audit Velocity</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{avgDuration.toFixed(1)}s</h4>
            <span className="text-xs font-bold text-emerald-600">Per Document</span>
          </div>
          <p className="mt-4 text-xs text-slate-500">Average time user takes to finalize an audit decision.</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">AI Adoption Rate</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-indigo-600">{(aiPreference * 100).toFixed(0)}%</h4>
            <span className="text-xs font-bold text-indigo-400">Acceptance</span>
          </div>
          <p className="mt-4 text-xs text-slate-500">How often the user trusts and accepts AI analysis results.</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Events</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{logs.length}</h4>
            <span className="text-xs font-bold text-slate-400">Logs Recorded</span>
          </div>
          <p className="mt-4 text-xs text-slate-500">Total system interactions tracked in the current session.</p>
        </div>
      </div>

      {/* Timeline Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900">System Activity Trail</h3>
          <div className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
            Real-time Monitoring Active
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Operator</th>
                <th className="px-8 py-4">Event</th>
                <th className="px-8 py-4">Reference</th>
                <th className="px-8 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reversedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                        {log.userName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-block px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                      log.event === LogEvent.AI_AUDIT_RUN ? 'bg-indigo-100 text-indigo-700' :
                      log.event === LogEvent.STATUS_OVERRIDE ? 'bg-amber-100 text-amber-700' :
                      log.event === LogEvent.POD_UPLOADED ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {log.event.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-900">{log.targetLabel}</td>
                  <td className="px-8 py-5 text-xs text-slate-500 italic max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 text-sm italic">
                    No activity recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
