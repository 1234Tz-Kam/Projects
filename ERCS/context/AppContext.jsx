'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { SEED_USERS, SEED_EMERGENCIES } from '@/lib/data';
import { generateId, nowString } from '@/lib/utils';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [users, setUsers] = useState(SEED_USERS);
  const [emergencies, setEmergencies] = useState(SEED_EMERGENCIES);
  const [currentUser, setCurrentUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const u = localStorage.getItem('ercs_users');
      const e = localStorage.getItem('ercs_emergencies');
      const cu = localStorage.getItem('ercs_current_user');
      if (u) setUsers(JSON.parse(u));
      if (e) setEmergencies(JSON.parse(e));
      if (cu) setCurrentUser(JSON.parse(cu));
    } catch (_) {}
    setHydrated(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('ercs_users', JSON.stringify(users));
  }, [users, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('ercs_emergencies', JSON.stringify(emergencies));
  }, [emergencies, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (currentUser) localStorage.setItem('ercs_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('ercs_current_user');
  }, [currentUser, hydrated]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { error: 'Invalid email or password.' };
    setCurrentUser(user);
    return { user };
  }

  function register(name, email, password) {
    if (users.find(u => u.email === email)) return { error: 'Email already registered.' };
    const newUser = { id: Date.now(), name, email, password, role: 'user' };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { user: newUser };
  }

  function logout() {
    setCurrentUser(null);
  }

  // ── Emergencies ───────────────────────────────────────────────────────────
  function submitEmergency({ type, description, location }) {
    const report = {
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      type, description, location,
      status: 'Pending',
      responder: null,
      submittedAt: nowString(),
      history: [{ status: 'Pending', note: 'Report submitted', at: nowString() }],
    };
    setEmergencies(prev => [report, ...prev]);
    return report;
  }

  function updateEmergency(id, { status, responder, note }) {
    setEmergencies(prev => prev.map(e => {
      if (e.id !== id) return e;
      const updated = { ...e };
      if (responder) updated.responder = responder;
      if (status && status !== e.status) {
        updated.status = status;
        updated.history = [
          ...e.history,
          { status, note: note || `Status updated to ${status}`, at: nowString() },
        ];
      }
      return updated;
    }));
  }

  if (!hydrated) return null;

  return (
    <AppContext.Provider value={{
      users, currentUser, emergencies,
      login, register, logout,
      submitEmergency, updateEmergency,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
