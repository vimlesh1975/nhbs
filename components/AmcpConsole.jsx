'use client';
import { useState } from 'react';
import { Terminal, Send, Trash2, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export default function AmcpConsole({ logs, onClearLogs, onSendRawCommand }) {
  const [customCmd, setCustomCmd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customCmd.trim()) {
      onSendRawCommand(customCmd.trim());
      setCustomCmd('');
    }
  };

  return (
    <div className="glass-panel p-5 mb-6">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase">
            Live AMCP Protocol Console & Response Logger
          </h2>
        </div>

        <button
          onClick={onClearLogs}
          className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
          title="Clear console logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Logs</span>
        </button>
      </div>

      {/* Terminal Log Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-[240px] overflow-y-auto mono-font text-xs space-y-2 mb-3">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-center py-12">
            AMCP TCP Protocol Terminal Ready. Playout actions will be logged here in real-time.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="border-b border-slate-900/80 pb-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="text-blue-400 font-bold">▶ SENT AMCP COMMAND</span>
                <span>{log.timestamp}</span>
              </div>
              <div className="text-emerald-400 font-semibold pl-3 border-l-2 border-emerald-500/50 break-all">
                {log.commandSent}
              </div>
              {log.casparcgResponse && (
                <div className="mt-1 pl-3 text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/60">
                  <span className="text-cyan-400 font-bold">⚡ CASPARCG SERVER RESPONSE ({log.code}):</span>
                  <pre className="whitespace-pre-wrap mt-0.5 text-slate-300">{log.casparcgResponse}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Manual AMCP Command Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Cpu className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={customCmd}
            onChange={(e) => setCustomCmd(e.target.value)}
            placeholder="Type raw AMCP command (e.g. VERSION, INFO 1, CG 1-1 PLAY 1, CLEAR 1)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white mono-font focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button type="submit" className="btn-primary py-2 text-xs flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" />
          <span>SEND AMCP</span>
        </button>
      </form>
    </div>
  );
}
