
import React from 'react';
import { FieldVisibilityConfig } from '../types';

interface ControlPanelProps {
  config: FieldVisibilityConfig;
  onConfigChange: (newConfig: FieldVisibilityConfig) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, onConfigChange }) => {
  const toggleField = (key: string) => {
    onConfigChange({ ...config, [key]: !config[key] });
  };

  const Section = ({ title, fields }: { title: string, fields: { key: string, label: string }[] }) => (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map(f => (
          <button
            key={f.key}
            onClick={() => toggleField(f.key)}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              config[f.key] 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm' 
                : 'bg-white border-slate-100 text-slate-400 grayscale'
            }`}
          >
            <span className="text-xs font-bold tracking-tight">{f.label}</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${config[f.key] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config[f.key] ? 'left-6' : 'left-1'}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">UI Configuration Console</h2>
          <p className="text-indigo-200 text-sm font-medium">Toggle fields across the GCN Entry module to streamline your operations.</p>
        </div>
      </div>

      <Section 
        title="Basic GCN Details" 
        fields={[
          { key: 'challanNumber', label: 'GCN Number' },
          { key: 'gcnDate', label: 'GCN Date' },
          { key: 'billingParty', label: 'Billing Party' },
          { key: 'cargoType', label: 'Cargo Type' },
          { key: 'gcnMode', label: 'GCN Mode' },
          { key: 'paymentMode', label: 'Payment Mode' },
          { key: 'origin', label: 'Origin Code' },
          { key: 'fromCity', label: 'From City' },
          { key: 'toCity', label: 'To City' },
          { key: 'destination', label: 'Destination' },
          { key: 'prqNo', label: 'PRQ Number' },
          { key: 'transportMode', label: 'Transport Mode' },
        ]} 
      />

      <Section 
        title="Custom Tracking Fields" 
        fields={[
          { key: 'inboundNumber', label: 'Inbound No.' },
          { key: 'poDoNumber', label: 'PO/DO Number' },
          { key: 'tokenNo', label: 'Token Number' },
          { key: 'remarks', label: 'Remarks Field' },
          { key: 'movementType', label: 'Movement Type' },
          { key: 'rfqNo', label: 'RFQ Number' },
        ]} 
      />

      <Section 
        title="Consignor / Consignee" 
        fields={[
          { key: 'consignorName', label: 'Consignor Name' },
          { key: 'consignorContact', label: 'Consignor Contact' },
          { key: 'consignorGST', label: 'Consignor GST' },
          { key: 'consigneeName', label: 'Consignee Name' },
          { key: 'consigneeContact', label: 'Consignee Contact' },
          { key: 'consigneeGST', label: 'Consignee GST' },
        ]} 
      />

      <Section 
        title="Invoice & Commercials" 
        fields={[
          { key: 'ewayBillNo', label: 'Eway Bill No.' },
          { key: 'ewayBillDate', label: 'Eway Bill Date' },
          { key: 'invoiceNumber', label: 'Invoice No.' },
          { key: 'invoiceDate', label: 'Invoice Date' },
          { key: 'invoiceAmount', label: 'Invoice Amount' },
          { key: 'actualWeight', label: 'Actual Weight' },
          { key: 'chargedWeight', label: 'Charged Weight' },
          { key: 'noOfPackages', label: 'Package Count' },
        ]} 
      />

      <Section 
        title="Freight & Financials" 
        fields={[
          { key: 'freightRate', label: 'Freight Rate' },
          { key: 'freightAmount', label: 'Freight Amount' },
          { key: 'grossAmount', label: 'Gross Amount' },
          { key: 'gstRate', label: 'GST Rate %' },
          { key: 'totalAmount', label: 'Total Amount' },
          { key: 'advancePaid', label: 'Advance Paid' },
        ]} 
      />
    </div>
  );
};

export default ControlPanel;
