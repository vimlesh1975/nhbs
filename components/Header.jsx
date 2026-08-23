'use client';
import { useState } from 'react';
import { MonitorPlay, Database, Settings, Server, RefreshCw, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ 
  casparConnected, 
  dbStatus, 
  onRefreshDb, 
  onCheckCaspar, 
  casparHost, 
  setCasparHost, 
  casparPort, 
  setCasparPort,
  channel = 1,
  activeLayers,
  onClearChannel
}) {
  const [showConfig, setShowConfig] = useState(false);

  const isLayer2OnAir = activeLayers && activeLayers[`${channel}-2`];
  const isLayer3OnAir = activeLayers && activeLayers[`${channel}-3`];
  const isLayer4OnAir = activeLayers && activeLayers[`${channel}-4`];

  return (
    <header className="glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 mb-6 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: CASPARCG ROUTING & Layer Badges */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                CASPARCG ROUTING: CHANNEL {channel}
              </h2>
              
              {/* Layer 2 Status */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border transition-all ${
                isLayer2OnAir 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}>
                {isLayer2OnAir && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />}
                HEADLINES (L2)
              </span>

              {/* Layer 3 Status */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border transition-all ${
                isLayer3OnAir 
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}>
                {isLayer3OnAir && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />}
                ONELINER (L3)
              </span>

              {/* Layer 4 Status */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border transition-all ${
                isLayer4OnAir 
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}>
                {isLayer4OnAir && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping" />}
                TWOLINER (L4)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              AMCP Protocol Routing: <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold">1-2</span> Headlines | <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">1-3</span> Oneliner | <span className="font-mono text-blue-600 dark:text-blue-300 font-bold">1-4</span> Twoliner
            </p>
          </div>
        </div>

        {/* Right: Actions, Telemetry Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Clear App Layers Button */}
          {onClearChannel && (
            <button
              onClick={() => onClearChannel(channel)}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 dark:bg-red-950/70 dark:hover:bg-red-900 dark:border-red-500/40 dark:text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title={`Clear app layers (L2, L3, L4) on Channel ${channel}`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>CLEAR APP LAYERS (L2, L3, L4)</span>
            </button>
          )}

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
