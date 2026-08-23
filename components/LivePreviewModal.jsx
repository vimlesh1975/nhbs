'use client';
import { useState, useRef } from 'react';
import { X, Play, Square, RefreshCw, ExternalLink, Monitor } from 'lucide-react';

export default function LivePreviewModal({ templateId, payloadData, onClose }) {
  const iframeRef = useRef(null);

  const triggerIframePlay = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (iframeRef.current.contentWindow.play) {
        iframeRef.current.contentWindow.play();
      }
    }
  };

  const triggerIframeStop = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (iframeRef.current.contentWindow.stop) {
        iframeRef.current.contentWindow.stop();
      }
    }
  };

  const triggerIframeUpdate = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (iframeRef.current.contentWindow.update) {
        iframeRef.current.contentWindow.update(JSON.stringify(payloadData));
      }
    }
  };

  const templateUrl = `/templates/${templateId || 'headlines'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-5xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0 !p-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Live Web Graphic Preview — <span className="text-indigo-600 dark:text-indigo-400 font-mono">/{templateId}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={templateUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Standalone Tab</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 16:9 Broadcast Preview Container */}
        <div className="p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
          <div 
            className="w-full aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative"
            style={{
              backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              backgroundColor: '#090d16'
            }}
          >
            <iframe
              ref={iframeRef}
              src={templateUrl}
              className="w-full h-full border-0"
              title="CasparCG HTML Template Preview"
            />
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button onClick={triggerIframePlay} className="btn-play text-xs py-1.5 px-3">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate IN (play)</span>
            </button>

            <button onClick={triggerIframeUpdate} className="btn-primary text-xs py-1.5 px-3">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Push Data (update)</span>
            </button>

            <button onClick={triggerIframeStop} className="btn-stop text-xs py-1.5 px-3">
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Simulate OUT (stop)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
