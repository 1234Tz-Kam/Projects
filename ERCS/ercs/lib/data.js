export const EMERGENCY_TYPES = [
  'Fire', 'Medical', 'Flood', 'Road Accident',
  'Security Threat', 'Natural Disaster', 'Gas Leak', 'Other',
];

export const STATUS_FLOW = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

export const RESPONDERS = [
  'Fire Unit 7', 'Fire Unit 2',
  'Ambulance A1', 'Ambulance A3',
  'Police Unit 5', 'Rescue Team 1', 'Hazmat Unit 3',
];

export const STATUS_STYLES = {
  Pending:     { bg: '#3a2a10', text: '#f5a623', border: '#f5a623' },
  Assigned:    { bg: '#0f2a3a', text: '#4fc3f7', border: '#4fc3f7' },
  'In Progress': { bg: '#1a1060', text: '#b39ddb', border: '#9575cd' },
  Resolved:    { bg: '#0a2a1a', text: '#66bb6a', border: '#66bb6a' },
};

export const SEED_USERS = [
  { id: 1, name: 'Alice Sharma',  email: 'user@ercs.com',  password: 'user123',  role: 'user'  },
  { id: 2, name: 'Admin Khan',    email: 'admin@ercs.com', password: 'admin123', role: 'admin' },
];

export const SEED_EMERGENCIES = [
  {
    id: 'EID-0001', userId: 1, userName: 'Alice Sharma',
    type: 'Fire',
    description: 'Building fire on 3rd floor, smoke spreading rapidly through stairwell.',
    location: 'Block C, Sector 4',
    status: 'In Progress',
    responder: 'Fire Unit 7',
    submittedAt: '2026-03-24 09:14',
    history: [
      { status: 'Pending',     note: 'Report submitted',        at: '2026-03-24 09:14' },
      { status: 'Assigned',    note: 'Fire Unit 7 assigned',    at: '2026-03-24 09:20' },
      { status: 'In Progress', note: 'Unit en route to scene',  at: '2026-03-24 09:28' },
    ],
  },
  {
    id: 'EID-0002', userId: 1, userName: 'Alice Sharma',
    type: 'Medical',
    description: 'Elderly person collapsed, unresponsive, possible cardiac event.',
    location: 'Park Avenue, Lane 2',
    status: 'Resolved',
    responder: 'Ambulance A3',
    submittedAt: '2026-03-22 14:05',
    history: [
      { status: 'Pending',     note: 'Report submitted',                    at: '2026-03-22 14:05' },
      { status: 'Assigned',    note: 'Ambulance A3 dispatched',             at: '2026-03-22 14:09' },
      { status: 'In Progress', note: 'Paramedics on scene',                 at: '2026-03-22 14:18' },
      { status: 'Resolved',    note: 'Patient stabilised and transported',  at: '2026-03-22 15:00' },
    ],
  },
];
