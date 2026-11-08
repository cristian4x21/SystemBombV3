'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/lib/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { InventoryView } from '@/components/inventory/InventoryView';
import { LoansView } from '@/components/loans/LoansView';
import { MaintenanceView } from '@/components/maintenance/MaintenanceView';
import { AuditView } from '@/components/audit/AuditView';
import { SecurityView } from '@/components/security/SecurityView';
import { LoginView } from '@/components/auth/LoginView';
import { ToastContainer } from '@/components/ui/Toast';
import { Menu, X, Flame } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, render the Login Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen">
        <LoginView />
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Navbar Header */}
      <Navbar />

      {/* Mobile Menu Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-200 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
        >
          {mobileMenuOpen ? <X className="w-4 h-4 text-red-400" /> : <Menu className="w-4 h-4 text-slate-300" />}
          <span>Módulos del Sistema</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Estación B-233
        </span>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex">
            <div className="w-72 bg-slate-900 h-full shadow-2xl p-2 animate-in slide-in-from-left duration-200 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Menú Operativo</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div onClick={() => setMobileMenuOpen(false)} className="flex-1 overflow-y-auto">
                <Sidebar />
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Dynamic View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'loans' && <LoansView />}
          {activeTab === 'maintenance' && <MaintenanceView />}
          {activeTab === 'audit' && <AuditView />}
          {activeTab === 'security' && <SecurityView />}
        </main>

      </div>

      {/* Global Toast Notifications Container */}
      <ToastContainer />

    </div>
  );
};

export default function HomePage() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
