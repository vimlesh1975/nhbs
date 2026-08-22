'use client';
import { useState } from 'react';
import { Play, Square, RefreshCw, PlusCircle, Monitor, Code, Send } from 'lucide-react';

export default function PlayoutController({
  channel,
  layer,
  selectedTemplate,
  payloadData,
  setPayloadData,
  onExecuteAction,
  casparHost
}) {
  const [activeTab, setActiveTab] = useState('fields'); // 'fields' or 'json'

  const handleFieldChange = (key, val) => {
    setPayloadData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Construct Next.js host URL for CasparCG HTML producer
  const templateUrl = `http://${casparHost || '127.0.0.1'}:3000/templates/${selectedTemplate}`;

  return (
    <div className="glass-panel p-5 mb-6 border-l-4 border-l-blue-500">
      {/* Playout Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase">
              Playout Controller & Live AMCP Command Deck
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Routing Target: <span className="font-mono text-cyan-400 font-bold">CHANNEL {channel} / LAYER {layer}</span>
          </p>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* LOAD / CG ADD */}
          <button
            onClick={() => onExecuteAction('CG_ADD')}
            className="btn-amber text-xs py-2 px-3"
            title="Load graphic template into CasparCG layer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>LOAD (ADD)</span>
          </button>

          {/* PLAY / CG PLAY */}
          <button
            onClick={() => onExecuteAction('CG_ADD_AND_PLAY')}
            className="btn-play text-xs py-2 px-4 shadow-lg shadow-emerald-600/30"
            title="Play graphic live on air with in-animation"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>PLAY ON AIR</span>
          </button>

          {/* UPDATE / CG UPDATE */}
          <button
            onClick={() => onExecuteAction('CG_UPDATE')}
            className="btn-primary text-xs py-2 px-3"
            title="Push updated database fields to live graphic without animation break"
          >
            <RefreshCw className="w-4 h-4" />
            <span>UPDATE LIVE</span>
          </button>

          {/* STOP / CG STOP */}
          <button
            onClick={() => onExecuteAction('CG_STOP')}
            className="btn-stop text-xs py-2 px-4 shadow-lg shadow-red-600/30"
            title="Stop graphic with out-animation"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>STOP (OUT)</span>
          </button>
        </div>
      </div>

      {/* Field Mapper & Data Payload Editor */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fields')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                activeTab === 'fields'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Form Field Mapper
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                activeTab === 'json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw AMCP JSON Payload
            </button>
          </div>

          <span className="text-[11px] text-slate-400 mono-font">
            Template URL: <code className="text-indigo-300">{templateUrl}</code>
          </span>
        </div>

        {activeTab === 'fields' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {Object.keys(payloadData).length === 0 ? (
              <div className="col-span-full py-4 text-center text-xs text-slate-500">
                No record cued. Select a row from the MySQL Database Explorer above to auto-populate fields.
              </div>
            ) : (
              Object.entries(payloadData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 mono-font uppercase">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <textarea
              rows={4}
              value={JSON.stringify(payloadData, null, 2)}
              onChange={(e) => {
                try {
                  setPayloadData(JSON.parse(e.target.value));
                } catch (err) {}
              }}
              className="w-full bg-transparent text-xs text-emerald-400 mono-font focus:outline-none resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
