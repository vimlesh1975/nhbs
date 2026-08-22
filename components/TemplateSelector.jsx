'use client';
import { Layout, Type, Layers, Eye } from 'lucide-react';

export default function TemplateSelector({ selectedTemplate, onSelectTemplate, onOpenPreviewModal }) {
  const templates = [
    {
      id: 'headlines',
      name: 'Headlines Title Overlay',
      desc: 'Centered headline title banner (Layer 2)',
      icon: Type,
      color: 'from-amber-500 to-orange-600',
      url: '/templates/headlines'
    },
    {
      id: 'oneliner',
      name: 'Oneliner Data Strip',
      desc: 'Single line lower-third data strip (Layer 3)',
      icon: Layout,
      color: 'from-cyan-600 to-blue-600',
      url: '/templates/oneliner'
    },
    {
      id: 'twoliner',
      name: 'Twoliner Data Strip',
      desc: 'Two line name & designation overlay (Layer 4)',
      icon: Layers,
      color: 'from-blue-600 to-indigo-600',
      url: '/templates/twoliner'
    }
  ];

  return (
    <div className="glass-panel p-5 mb-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase">
            CasparCG HTML Template Library
          </h2>
        </div>

        {/* Live Preview Template Button */}
        <button
          onClick={() => onOpenPreviewModal(selectedTemplate)}
          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>WEB PREVIEW TEMPLATE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((tpl) => {
          const IconComponent = tpl.icon;
          const isSelected = selectedTemplate === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Gradient Accent Bar */}
              <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${tpl.color}`} />

              <div className="flex items-start justify-between gap-3 mt-1">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${tpl.color} flex items-center justify-center shadow-md`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                {isSelected && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase">
                    ACTIVE
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-sm text-white mt-3">{tpl.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{tpl.desc}</p>
              
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="mono-font text-slate-500">/{tpl.id}</span>
                <span className="text-indigo-400 font-semibold hover:underline">Select & Map →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
