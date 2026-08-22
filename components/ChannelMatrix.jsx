'use client';
import { MonitorPlay, Zap } from 'lucide-react';

export default function ChannelMatrix({ channel = 1, activeLayers, onClearChannel }) {
  const isLayer2OnAir = activeLayers && activeLayers[`${channel}-2`];
  const isLayer3OnAir = activeLayers && activeLayers[`${channel}-3`];
  const isLayer4OnAir = activeLayers && activeLayers[`${channel}-4`];

  return (
    <div className="glass-panel p-4 mb-6 border-l-4 border-l-emerald-500 bg-slate-950/80">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Multi-Layer Target Matrix Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black tracking-tight text-white">
                CASPARCG ROUTING: CHANNEL {channel}
              </h2>
              
              {/* Layer 2 Status */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border ${
                isLayer2OnAir 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {isLayer2OnAir && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                HEADLINES (L2)
              </span>

              {/* Layer 3 Status */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border ${
                isLayer3OnAir 
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {isLayer3OnAir && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                ONELINER (L3)
              </span>

              {/* Layer 4 Status */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border ${
                isLayer4OnAir 
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {isLayer4OnAir && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />}
                TWOLINER (L4)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">AMCP Protocol Routing: <span className="font-mono text-emerald-300 font-bold">1-2</span> Headlines | <span className="font-mono text-cyan-300 font-bold">1-3</span> Oneliner | <span className="font-mono text-blue-300 font-bold">1-4</span> Twoliner</p>
          </div>
        </div>

        {/* Clear App Layers Button */}
        <button
          onClick={() => onClearChannel(channel)}
          className="px-3.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          title={`Clear app layers (L2, L3, L4) on Channel ${channel}`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>CLEAR APP LAYERS (L2, L3, L4)</span>
        </button>
      </div>
    </div>
  );
}
