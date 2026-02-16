
export enum AuditStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum LogisticsStatus {
  BOOKED = 'BOOKED',
  IN_THC = 'IN_THC',
  DELIVERED = 'DELIVERED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DISPATCHER = 'DISPATCHER',
  AUDITOR = 'AUDITOR',
  DRIVER = 'DRIVER',
  MANAGER = 'MANAGER'
}

export enum LocationType {
  HUB = 'HUB',
  BRANCH = 'BRANCH',
  WAREHOUSE = 'WAREHOUSE'
}

// Fix: Added AuditType enum used in ShipmentAudit.tsx
export enum AuditType {
  AI = 'AI',
  MANUAL = 'MANUAL'
}

// Fix: Added ManualVerification interface used in ShipmentAudit.tsx
export interface ManualVerification {
  hasSignature: boolean;
  hasStamp: boolean;
  isLegible: boolean;
  challanMatch: boolean;
  dateMatch: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locationId: string;
  locationName: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  type: LocationType;
  contactPerson: string;
  contactNumber: string;
}

export enum LogEvent {
  SHIPMENT_CREATED = 'SHIPMENT_CREATED',
  THC_CREATED = 'THC_CREATED',
  DELIVERY_RECORDED = 'DELIVERY_RECORDED',
  POD_UPLOADED = 'POD_UPLOADED',
  AI_AUDIT_RUN = 'AI_AUDIT_RUN',
  MANUAL_AUDIT_SUBMITTED = 'MANUAL_AUDIT_SUBMITTED',
  AI_AUDIT_ACCEPTED = 'AI_AUDIT_ACCEPTED',
  STATUS_OVERRIDE = 'STATUS_OVERRIDE'
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  event: LogEvent;
  targetId: string;
  targetLabel: string;
  details: string;
  durationSeconds?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalShipments: number;
  rejectionRate: number;
}

export interface FieldVisibilityConfig {
  [key: string]: boolean;
}

export interface THC {
  id: string;
  thcNumber: string;
  thcDate: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  route: string;
  vendorName: string;
  shipmentIds: string[];
  totalWeight: number;
}

export interface Shipment {
  id: string;
  challanNumber: string; 
  customerId: string;
  customerName: string;
  deliveryDate: string;
  status: AuditStatus;
  logisticsStatus: LogisticsStatus;
  podImageUrl?: string;
  actualWeight?: number;
  fromCity?: string;
  toCity?: string;
  gcnDate?: string;
  consignorName?: string;
  consigneeName?: string;
  invoiceNumber?: string;
  invoiceAmount?: number;
  // Fix: Added missing operational and commercial fields used in ShipmentBooking.tsx
  billingParty?: string;
  cargoType?: string;
  gcnMode?: string;
  paymentMode?: string;
  origin?: string;
  destination?: string;
  prqNo?: string;
  transportMode?: string;
  currency?: string;
  gstRate?: number;
  consignorContact?: string;
  consigneeContact?: string;
  consignorAddress?: string;
  consigneeAddress?: string;
  consignorGST?: string;
  consigneeGST?: string;
  invoiceDate?: string;
  chargedWeight?: number;
  noOfPackages?: number;
  materialName?: string;
  ewayBillNo?: string;
  ewayBillDate?: string;
  // Fix: Added audit-specific fields required by ShipmentAudit.tsx
  auditComments?: string;
  auditType?: AuditType;
  aiScore?: number;
  manualVerification?: ManualVerification;
}
