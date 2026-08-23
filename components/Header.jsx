'use client';
import { Database, Server, RefreshCw, Zap } from 'lucide-react';
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
  setChannel,
  activeLayers,
  onClearChannel,
  selectedDate,
  setSelectedDate,
  selectedBulletin,
  setSelectedBulletin,
  bulletinOptions = [],
  onRefreshScripts,
  loadingScripts
}) {
  const isLayer2OnAir = activeLayers && activeLayers[`${channel}-2`];

  return (
    <header className="glass-panel border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 mb-4 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="w-full mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Leftmost: Date & Bulletin Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Selector (No Today button) */}
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate && setSelectedDate(e.target.value)}
            onClick={(e) => {
              try { if (e.target.showPicker) e.target.showPicker(); } catch (err) {}
            }}
            onFocus={(e) => {
              try { if (e.target.showPicker) e.target.showPicker(); } catch (err) {}
            }}
            className="w-[145px] bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-cyan-400 cursor-pointer shadow-xs"
            title="Broadcast Date"
          />

          {/* Bulletin Selector */}
          <div className="flex items-center gap-1">
            <select
              value={selectedBulletin || ''}
              onChange={(e) => setSelectedBulletin && setSelectedBulletin(e.target.value)}
              className="w-[190px] sm:w-[230px] bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-cyan-500 shadow-xs truncate"
              title="News Bulletin"
            >
              <option value="">-- Select Bulletin --</option>
              {bulletinOptions.map((b, idx) => (
                <option key={idx} value={b.title}>
                  {b.title} {b.bulletintime ? `(${b.bulletintime})` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onRefreshScripts}
              disabled={loadingScripts || !selectedDate || !selectedBulletin}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap"
              title="Refresh scripts for selected date and bulletin"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingScripts ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Center: Channel Switcher, Layer Badges & Protocol Info */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            {/* Channel Switcher Buttons for CH 1 and CH 2 */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-200/90 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => setChannel && setChannel(1)}
                className={`px-2.5 py-1 rounded-md text-xs font-black transition-all ${
                  channel === 1
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch playout routing to CasparCG Channel 1"
              >
                CH 1
              </button>
              <button
                type="button"
                onClick={() => setChannel && setChannel(2)}
                className={`px-2.5 py-1 rounded-md text-xs font-black transition-all ${
                  channel === 2
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch playout routing to CasparCG Channel 2"
              >
                CH 2
              </button>
            </div>

            {/* Layer 2 Status Badge */}
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1.5 border transition-all ${
              isLayer2OnAir 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
            }`}>
              {isLayer2OnAir && <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />}
              <span>{isLayer2OnAir ? 'ON AIR (L2)' : 'STANDBY (L2)'}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            AMCP Protocol Routing: <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold">{channel}-2</span> (Headlines / Oneliner / Twoliner)
          </p>
        </div>

        {/* Right: Actions, Telemetry Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Clear App Layer 2 Button */}
          {onClearChannel && (
            <button
              onClick={() => onClearChannel(channel)}
              className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 dark:bg-red-950/70 dark:hover:bg-red-900 dark:border-red-500/40 dark:text-red-300 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              title={`Clear Layer 2 graphics on Channel ${channel}`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>CLEAR L2</span>
            </button>
          )}

          {/* CasparCG Status Badge */}
          <div 
            onClick={onCheckCaspar}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
              casparConnected 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm dark:bg-emerald-950/60 dark:border-emerald-500/40 dark:text-emerald-300 dark:shadow-md dark:shadow-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm dark:bg-amber-950/60 dark:border-amber-500/40 dark:text-amber-300 dark:shadow-md dark:shadow-amber-950'
            }`}
            title="Click to re-ping CasparCG Server TCP socket"
          >
            <div className={`status-pulse ${casparConnected ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500 dark:bg-emerald-400' : 'text-amber-500 dark:text-amber-400 bg-amber-500 dark:bg-amber-400'}`} />
            <Server className="w-3.5 h-3.5" />
            <span>{casparConnected ? '5250 LIVE' : 'SIMULATION'}</span>
            <RefreshCw className="w-3 h-3 opacity-60 hover:rotate-180 transition-transform" />
          </div>

          {/* MySQL DB Status Badge */}
          <div 
            onClick={onRefreshDb}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
              dbStatus?.connected
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-sm dark:bg-cyan-950/60 dark:border-cyan-500/40 dark:text-cyan-300 dark:shadow-md dark:shadow-cyan-950'
                : 'bg-red-50 border-red-300 text-red-800 shadow-sm dark:bg-red-950/60 dark:border-red-500/40 dark:text-red-300 dark:shadow-md dark:shadow-red-950'
            }`}
            title="Click to re-test MySQL Database connection"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{dbStatus?.connected ? 'MySQL LIVE' : 'MySQL OFF'}</span>
            <RefreshCw className="w-3 h-3 opacity-60 hover:rotate-180 transition-transform" />
          </div>

          {/* Dark / Light Mode Switch */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
