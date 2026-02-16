
import { AuditStatus, Shipment, Customer, LogisticsStatus, User, UserRole, Location, LocationType } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C1', name: 'Global Logistics Corp', email: 'ops@global-log.com', totalShipments: 120, rejectionRate: 5 },
  { id: 'C2', name: 'Swift Delivery Inc', email: 'audit@swiftdel.com', totalShipments: 85, rejectionRate: 12 },
  { id: 'C3', name: 'Oceanic Freight', email: 'pod@oceanic.com', totalShipments: 200, rejectionRate: 3 },
  { id: 'C4', name: 'Express Way', email: 'claims@express.com', totalShipments: 50, rejectionRate: 20 },
];

export const MOCK_USERS: User[] = [
  { id: 'U1', name: 'Rahul Sharma', email: 'rahul.s@webx.com', role: UserRole.ADMIN, locationId: 'L1', locationName: 'Mumbai Central', status: 'ACTIVE', lastLogin: '2024-05-20 10:30 AM' },
  { id: 'U2', name: 'Anita Desai', email: 'anita.d@webx.com', role: UserRole.AUDITOR, locationId: 'L1', locationName: 'Mumbai Central', status: 'ACTIVE', lastLogin: '2024-05-20 09:15 AM' },
  { id: 'U3', name: 'Vikram Singh', email: 'vikram.v@webx.com', role: UserRole.DISPATCHER, locationId: 'L2', locationName: 'Delhi Hub', status: 'ACTIVE', lastLogin: '2024-05-19 04:45 PM' },
  { id: 'U4', name: 'Suresh Kumar', email: 'suresh.k@webx.com', role: UserRole.DRIVER, locationId: 'L3', locationName: 'Bangalore Branch', status: 'INACTIVE', lastLogin: '2024-05-10 11:20 AM' },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'L1', code: 'MUM-01', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', type: LocationType.HUB, contactPerson: 'Rajesh Iyer', contactNumber: '+91 98200 12345' },
  { id: 'L2', code: 'DEL-02', name: 'Delhi Hub', city: 'New Delhi', state: 'Delhi', type: LocationType.HUB, contactPerson: 'Amit Khurana', contactNumber: '+91 98110 54321' },
  { id: 'L3', code: 'BLR-03', name: 'Bangalore Branch', city: 'Bangalore', state: 'Karnataka', type: LocationType.BRANCH, contactPerson: 'Karthik R.', contactNumber: '+91 99000 67890' },
  { id: 'L4', code: 'PNE-04', name: 'Pune Warehouse', city: 'Pune', state: 'Maharashtra', type: LocationType.WAREHOUSE, contactPerson: 'Sanjay G.', contactNumber: '+91 97600 11223' },
];

export const MOCK_SHIPMENTS: Shipment[] = [
  { 
    id: 'S1001', 
    challanNumber: 'CH-2024-001', 
    customerId: 'C1', 
    customerName: 'Global Logistics Corp', 
    deliveryDate: '2024-05-15', 
    status: AuditStatus.PENDING,
    logisticsStatus: LogisticsStatus.BOOKED,
    podImageUrl: 'https://picsum.photos/seed/pod1/600/800',
    fromCity: 'MUMBAI',
    toCity: 'DELHI',
    actualWeight: 450
  },
  { 
    id: 'S1002', 
    challanNumber: 'CH-2024-002', 
    customerId: 'C2', 
    customerName: 'Swift Delivery Inc', 
    deliveryDate: '2024-05-16', 
    status: AuditStatus.APPROVED,
    logisticsStatus: LogisticsStatus.DELIVERED,
    podImageUrl: 'https://picsum.photos/seed/pod2/600/800',
    fromCity: 'PUNE',
    toCity: 'BANGALORE',
    actualWeight: 1200
  }
];
