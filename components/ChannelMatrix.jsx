'use client';
import { MonitorPlay, Zap } from 'lucide-react';

export default function ChannelMatrix({ channel = 1, activeLayers, onClearChannel }) {
  const isLayer2OnAir = activeLayers && activeLayers[`${channel}-2`];

  return (
    <div className="glass-panel p-4 mb-6 border-l-4 border-l-emerald-500 bg-white/90 dark:bg-slate-950/80 transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Multi-Layer Target Matrix Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                CASPARCG ROUTING: CHANNEL {channel}
              </h2>
              
              {/* Layer 2 Status */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border ${
                isLayer2OnAir 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}>
                {isLayer2OnAir && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />}
                <span>{isLayer2OnAir ? 'ON AIR (L2)' : 'STANDBY (L2)'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">AMCP Protocol Routing: <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold">{channel}-2</span> (Headlines / Oneliner / Twoliner)</p>
          </div>
        </div>

        {/* Clear App Layers Button */}
        <button
          onClick={() => onClearChannel(channel)}
          className="px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 dark:bg-red-950/70 dark:hover:bg-red-900 dark:border-red-500/40 dark:text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          title={`Clear Layer 2 graphics on Channel ${channel}`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>CLEAR L2</span>
        </button>
      </div>
    </div>
  );
}
