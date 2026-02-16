
import React, { useState } from 'react';
import { Shipment, AuditStatus, LogisticsStatus, Customer, FieldVisibilityConfig } from '../types';

interface ShipmentBookingProps {
  customers: Customer[];
  visibilityConfig: FieldVisibilityConfig;
  onBookingComplete: (newShipment: Shipment) => void;
  onClose: () => void;
}

const ShipmentBooking: React.FC<ShipmentBookingProps> = ({ customers, visibilityConfig, onBookingComplete, onClose }) => {
  const [formData, setFormData] = useState<Partial<Shipment>>({
    challanNumber: 'GCN' + Math.floor(100000 + Math.random() * 900000),
    gcnDate: new Date().toISOString().split('T')[0],
    billingParty: '',
    cargoType: 'FTL',
    gcnMode: 'Surface',
    paymentMode: 'TBB',
    origin: 'MUMB',
    fromCity: 'MUMBAI',
    toCity: '',
    destination: '',
    transportMode: 'Road',
    currency: 'INR',
    gstRate: 18,
    status: AuditStatus.PENDING,
    logisticsStatus: LogisticsStatus.BOOKED,
    actualWeight: 0,
    chargedWeight: 0,
    noOfPackages: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.toCity || !formData.challanNumber) {
      alert("Please complete the required fields (Billing Party, GCN Number, To City)");
      return;
    }

    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    
    const finalShipment: Shipment = {
      ...formData,
      id: `S${Date.now()}`,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      deliveryDate: formData.deliveryDate || new Date().toISOString().split('T')[0],
      status: AuditStatus.PENDING,
      logisticsStatus: LogisticsStatus.BOOKED,
      challanNumber: formData.challanNumber || 'GCN-ERR'
    } as Shipment;

    onBookingComplete(finalShipment);
  };

  const Section = ({ title, children, icon, keys }: { title: string, children?: React.ReactNode, icon: string, keys: string[] }) => {
    const isSectionVisible = keys.some(k => visibilityConfig[k] !== false);
    if (!isSectionVisible) return null;

    return (
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden mb-8 shadow-sm">
        <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
            <span className="text-blue-600 text-lg">{icon}</span> {title}
          </h3>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {children}
        </div>
      </div>
    );
  };

  const Input = ({ label, name, type = "text", placeholder = "", required = false }: any) => {
    if (visibilityConfig[name] === false) return null;
    return (
      <div className="space-y-2 animate-in fade-in duration-300">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={(formData as any)[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 outline-none transition-all bg-white font-bold text-slate-800 placeholder:text-slate-300"
        />
      </div>
    );
  };

  const Select = ({ label, name, options, required = false }: any) => {
    if (visibilityConfig[name] === false) return null;
    return (
      <div className="space-y-2 animate-in fade-in duration-300">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <select
          name={name}
          value={(formData as any)[name] || ''}
          onChange={handleChange}
          required={required}
          className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-600/5 focus:border-blue-500 outline-none transition-all bg-white font-bold text-slate-800"
        >
          <option value="">Select...</option>
          {options.map((opt: any) => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white w-full max-w-7xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
        
        <div className="bg-slate-900 px-10 py-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/20">
              <span className="font-black text-2xl italic">W</span>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-tight uppercase italic">GCN Master Entry</h2>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">Logistics Flow  Consignment Booking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/10 group">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-12 bg-slate-50/30">
          <form id="gcn-form" onSubmit={handleSubmit} className="max-w-7xl mx-auto">
            
            <Section title="Operational Detail" icon="📋" keys={['challanNumber', 'gcnDate', 'billingParty', 'cargoType', 'gcnMode', 'paymentMode', 'origin', 'fromCity', 'toCity', 'destination', 'prqNo', 'transportMode']}>
              <Input label="GCN No" name="challanNumber" required />
              <Input label="GCN Date" name="gcnDate" type="date" required />
              <Select label="Billing Party" name="customerId" options={customers.map(c => ({ value: c.id, label: c.name }))} required />
              <Select label="Cargo Type" name="cargoType" options={['FTL', 'LTL', 'Part Load', 'Documents']} />
              <Select label="GCN Mode" name="gcnMode" options={['Surface', 'Air', 'Train']} />
              <Select label="Payment Mode" name="paymentMode" options={['TBB', 'Paid', 'To Pay']} />
              <Input label="Origin Code" name="origin" />
              <Input label="From City" name="fromCity" required />
              <Input label="To City" name="toCity" required />
              <Input label="Destination" name="destination" required />
              <Input label="PRQ No" name="prqNo" />
              <Select label="Transport Mode" name="transportMode" options={['Road', 'Rail', 'Sea']} />
            </Section>

            <Section title="Entity Particulars" icon="🏢" keys={['consignorName', 'consignorContact', 'consignorGST', 'consignorAddress', 'consigneeName', 'consigneeContact', 'consigneeGST', 'consigneeAddress']}>
              <Input label="Consignor Name" name="consignorName" />
              <Input label="Consignor Contact" name="consignorContact" />
              <Input label="Consignee Name" name="consigneeName" />
              <Input label="Consignee Contact" name="consigneeContact" />
              <Input label="Consignor Address" name="consignorAddress" />
              <Input label="Consignee Address" name="consigneeAddress" />
            </Section>

            <Section title="Commercials & Weight" icon="📄" keys={['ewayBillNo', 'ewayBillDate', 'invoiceNumber', 'invoiceDate', 'invoiceAmount', 'actualWeight', 'chargedWeight', 'noOfPackages', 'materialName']}>
              <Input label="Eway Bill No" name="ewayBillNo" />
              <Input label="Eway Bill Date" name="ewayBillDate" type="date" />
              <Input label="Invoice No" name="invoiceNumber" required />
              <Input label="Invoice Date" name="invoiceDate" type="date" required />
              <Input label="Invoice Amount" name="invoiceAmount" type="number" />
              <Input label="Actual Weight (KG)" name="actualWeight" type="number" required />
              <Input label="Charged Weight (KG)" name="chargedWeight" type="number" required />
              <Input label="Package Count" name="noOfPackages" type="number" required />
              <Input label="Material Name" name="materialName" />
            </Section>

          </form>
        </div>

        <div className="bg-white px-12 py-8 border-t border-slate-100 flex justify-end gap-6 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-10 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all"
          >
            Discard Transaction
          </button>
          <button 
            type="submit" 
            form="gcn-form"
            className="px-16 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all active:scale-95"
          >
            Confirm & Save Docket
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBooking;
