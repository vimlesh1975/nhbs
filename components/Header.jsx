'use client';
import { useState } from 'react';
import { Radio, Database, Settings, Server, RefreshCw } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ 
  casparConnected, 
  dbStatus, 
  onRefreshDb, 
  onCheckCaspar, 
  casparHost, 
  setCasparHost, 
  casparPort, 
  setCasparPort
}) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <header className="glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4 mb-6 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              CASPAR<span className="text-blue-500">CG</span> STUDIO
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                PRO CLIENT v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MySQL Dynamic Data Playout Controller & AMCP TCP Bridge</p>
          </div>
        </div>

        {/* Telemetry Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">

          {/* CasparCG Status Badge */}
          <div 
            onClick={onCheckCaspar}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
              casparConnected 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm dark:bg-emerald-950/60 dark:border-emerald-500/40 dark:text-emerald-300 dark:shadow-md dark:shadow-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm dark:bg-amber-950/60 dark:border-amber-500/40 dark:text-amber-300 dark:shadow-md dark:shadow-amber-950'
            }`}
            title="Click to re-ping CasparCG Server TCP socket"
          >
            <div className={`status-pulse ${casparConnected ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500 dark:bg-emerald-400' : 'text-amber-500 dark:text-amber-400 bg-amber-500 dark:bg-amber-400'}`} />
            <Server className="w-3.5 h-3.5" />
            <span>{casparConnected ? 'CONNECTED (5250)' : 'SIMULATION MODE'}</span>
            <RefreshCw className="w-3 h-3 opacity-60 hover:rotate-180 transition-transform" />
          </div>

          {/* MySQL DB Status Badge */}
          <div 
            onClick={onRefreshDb}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
              dbStatus?.connected
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-sm dark:bg-cyan-950/60 dark:border-cyan-500/40 dark:text-cyan-300 dark:shadow-md dark:shadow-cyan-950'
                : 'bg-red-50 border-red-300 text-red-800 shadow-sm dark:bg-red-950/60 dark:border-red-500/40 dark:text-red-300 dark:shadow-md dark:shadow-red-950'
            }`}
            title="Click to re-test MySQL Database connection"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{dbStatus?.connected ? 'MySQL LIVE (nrcsnew)' : 'MySQL DISCONNECTED'}</span>
            <RefreshCw className="w-3 h-3 opacity-60 hover:rotate-180 transition-transform" />
          </div>

          {/* Dark / Light Mode Switch */}
          <ThemeToggle />

          {/* Settings Toggle */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700 transition-all shadow-sm"
            title="Server Connection Configuration"
            aria-label="Server Connection Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Config Drawer Modal */}
      {showConfig && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-100/90 dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">CasparCG Host IP</label>
            <input
              type="text"
              value={casparHost}
              onChange={(e) => setCasparHost(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-white mono-font focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">AMCP TCP Port</label>
            <input
              type="number"
              value={casparPort}
              onChange={(e) => setCasparPort(parseInt(e.target.value, 10))}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-white mono-font focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                onCheckCaspar();
                onRefreshDb();
                setShowConfig(false);
              }}
              className="btn-primary py-1.5 text-xs w-full justify-center"
            >
              Save & Test Connections
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
