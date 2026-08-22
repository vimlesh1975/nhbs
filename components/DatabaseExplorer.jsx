'use client';
import { useState, useEffect } from 'react';
import { Calendar, Radio, FileCode, Play, Plus, Radio as RadioIcon, Sliders } from 'lucide-react';

export default function DatabaseExplorer({ 
  onSelectDataRecord, 
  activeRecordId,
  selectedDate: parentDate,
  setSelectedDate: setParentDate,
  onExecuteAction
}) {
  const [internalDate, setInternalDate] = useState(() => new Date().toISOString().split('T')[0]);
  const selectedDate = parentDate !== undefined ? parentDate : internalDate;
  const setSelectedDate = setParentDate || setInternalDate;

  const [selectedBulletin, setSelectedBulletin] = useState('');
  const [bulletinOptions, setBulletinOptions] = useState([]);
  
  // States for Headlines, Oneliner, and Twoliner scripts
  const [headlineLines, setHeadlineLines] = useState(['']);
  const [onelinerLines, setOnelinerLines] = useState(['']);
  const [twolinerLines, setTwolinerLines] = useState([{ name: '', designation: '' }]);
  const [loading, setLoading] = useState(false);
  const [activeLineKey, setActiveLineKey] = useState(null);

  // Mixer Position & Scale States for Layer 2, Layer 3, Layer 4 (Persistent in localStorage)
  const [mixerPos, setMixerPos] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('casparcg_mixer_pos');
        if (saved) return JSON.parse(saved);
      } catch (err) {}
    }
    return {
      2: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
      3: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
      4: { x: 0, y: 0, scaleX: 1, scaleY: 1 }
    };
  });

  // Save mixerPos state to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('casparcg_mixer_pos', JSON.stringify(mixerPos));
      } catch (err) {}
    }
  }, [mixerPos]);

  // Fetch dropdown options from bulletin table & auto-select first bulletin
  const fetchOptions = async () => {
    try {
      const res = await fetch('/api/db/options');
      const json = await res.json();
      if (json.success && json.bulletins && json.bulletins.length > 0) {
        setBulletinOptions(json.bulletins);
        setSelectedBulletin(prev => prev || json.bulletins[0].title);
      }
    } catch (err) {
      console.error("Fetch options error:", err);
    }
  };

  // Fetch Script text for HEADLINES, ONELINER, and TWOLINER
  const fetchScripts = async () => {
    if (!selectedBulletin || !selectedDate) {
      setHeadlineLines(['']);
      setOnelinerLines(['']);
      setTwolinerLines([{ name: '', designation: '' }]);
      return;
    }
    setLoading(true);
    try {
      // 1. Fetch Headlines (SlugName = 'headlines')
      const resHeadlines = await fetch(`/api/db/script?bulletin=${encodeURIComponent(selectedBulletin)}&date=${encodeURIComponent(selectedDate)}&slug=headlines`);
      const jsonHeadlines = await resHeadlines.json();
      if (jsonHeadlines.success && jsonHeadlines.script) {
        const parsed = jsonHeadlines.script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        setHeadlineLines(parsed.length > 0 ? parsed : ['']);
      } else {
        setHeadlineLines(['']);
      }

      // 2. Fetch Oneliner (SlugName = 'oneliner')
      const resOneliner = await fetch(`/api/db/script?bulletin=${encodeURIComponent(selectedBulletin)}&date=${encodeURIComponent(selectedDate)}&slug=oneliner`);
      const jsonOneliner = await resOneliner.json();
      if (jsonOneliner.success && jsonOneliner.script) {
        const parsed = jsonOneliner.script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        setOnelinerLines(parsed.length > 0 ? parsed : ['']);
      } else {
        setOnelinerLines(['']);
      }

      // 3. Fetch Twoliner (SlugName = 'twoliner')
      const resTwoliner = await fetch(`/api/db/script?bulletin=${encodeURIComponent(selectedBulletin)}&date=${encodeURIComponent(selectedDate)}&slug=twoliner`);
      const jsonTwoliner = await resTwoliner.json();
      if (jsonTwoliner.success && jsonTwoliner.script) {
        const parsed = jsonTwoliner.script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const twolinerObjects = parsed.map(line => {
          if (line.includes('$$$$')) {
            const parts = line.split('$$$$');
            return { name: parts[0].trim(), designation: parts[1].trim() };
          }
          return { name: line, designation: '' };
        });
        setTwolinerLines(twolinerObjects.length > 0 ? twolinerObjects : [{ name: '', designation: '' }]);
      } else {
        setTwolinerLines([{ name: '', designation: '' }]);
      }
    } catch (err) {
      console.error("Fetch scripts error:", err);
      setHeadlineLines(['']);
      setOnelinerLines(['']);
      setTwolinerLines([{ name: '', designation: '' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchScripts();
  }, [selectedDate, selectedBulletin]);

  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  // Handlers for Headlines
  const handleHeadlineChange = (index, value) => {
    const updated = [...headlineLines];
    updated[index] = value;
    setHeadlineLines(updated);
  };

  const handleAddHeadline = () => {
    setHeadlineLines(prev => [...prev, '']);
  };

  // Handlers for Oneliner
  const handleOnelinerChange = (index, value) => {
    const updated = [...onelinerLines];
    updated[index] = value;
    setOnelinerLines(updated);
  };

  const handleAddOneliner = () => {
    setOnelinerLines(prev => [...prev, '']);
  };

  // Handlers for Twoliner fields (Name & Designation)
  const handleTwolinerFieldChange = (index, field, value) => {
    const updated = [...twolinerLines];
    updated[index] = { ...updated[index], [field]: value };
    setTwolinerLines(updated);
  };

  const handleAddTwoliner = () => {
    setTwolinerLines(prev => [...prev, { name: '', designation: '' }]);
  };

  // Mixer X, Y, ScaleX, and ScaleY Handlers - Auto-sends LIVE while changing
  const handleMixerPosChange = (layerNum, field, val) => {
    const defaultVal = (field === 'scaleX' || field === 'scaleY') ? 1 : 0;
    const numVal = val !== '' ? (parseFloat(val) || defaultVal) : defaultVal;
    const currentPos = mixerPos[layerNum] || { x: 0, y: 0, scaleX: 1, scaleY: 1 };

    const updatedX = field === 'x' ? numVal : currentPos.x;
    const updatedY = field === 'y' ? numVal : currentPos.y;
    const updatedScaleX = field === 'scaleX' ? numVal : (currentPos.scaleX ?? 1);
    const updatedScaleY = field === 'scaleY' ? numVal : (currentPos.scaleY ?? 1);

    setMixerPos(prev => ({
      ...prev,
      [layerNum]: { x: updatedX, y: updatedY, scaleX: updatedScaleX, scaleY: updatedScaleY }
    }));

    const rawMixerCmd = `MIXER 1-${layerNum} FILL ${updatedX} ${updatedY} ${updatedScaleX} ${updatedScaleY}`;
    if (onExecuteAction) {
      onExecuteAction('MIXER_FILL', rawMixerCmd, { x: updatedX, y: updatedY, width: updatedScaleX, height: updatedScaleY }, null, layerNum);
    }
  };

  const handleResetMixer = (layerNum) => {
    setMixerPos(prev => ({ ...prev, [layerNum]: { x: 0, y: 0, scaleX: 1, scaleY: 1 } }));
    const rawClearCmd = `MIXER 1-${layerNum} CLEAR`;
    if (onExecuteAction) {
      onExecuteAction('MIXER_CLEAR', rawClearCmd, {}, null, layerNum);
    }
  };

  // Play Headlines (Layer 2) or Oneliner (Layer 3)
  const handlePlayLine = (lineText, index, type) => {
    const lineKey = `${type}-${index}`;
    setActiveLineKey(lineKey);

    let linePayload = { f0: lineText };
    let targetTemplate = 'headlines';
    let targetLayer = 2; // Layer 2 for Headlines

    if (type === 'oneliner') {
      targetTemplate = 'oneliner';
      targetLayer = 3; // Layer 3 for Oneliner
    }

    if (onSelectDataRecord) {
      onSelectDataRecord('headlines', linePayload, lineText, lineKey);
    }
    if (onExecuteAction) {
      onExecuteAction('ADD_PLAY', '', linePayload, targetTemplate, targetLayer);
    }
  };

  // Play 2-line Twoliner row (Name & Designation) on Layer 4
  const handlePlayTwolinerRow = (item, index) => {
    const lineKey = `twoliner-${index}`;
    setActiveLineKey(lineKey);

    const linePayload = {
      f0: item.name || '',
      f1: item.designation || ''
    };

    if (onSelectDataRecord) {
      onSelectDataRecord('headlines', linePayload, item.name, lineKey);
    }
    if (onExecuteAction) {
      onExecuteAction('ADD_PLAY', '', linePayload, 'twoliner', 4); // Layer 4 for Twoliner
    }
  };

  return (
    <div className="glass-panel p-5 mb-6 border-l-4 border-l-cyan-400">
      {/* SIDE-BY-SIDE CONTROL BAR: Date Selector + News Bulletin Combo Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 shadow-md">
        {/* 1. Date Selector */}
        <div>
          <label className="block text-[11px] font-bold text-cyan-300 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Broadcast Date Selector</span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
              onClick={(e) => {
                try { if (e.target.showPicker) e.target.showPicker(); } catch (err) {}
              }}
              onFocus={(e) => {
                try { if (e.target.showPicker) e.target.showPicker(); } catch (err) {}
              }}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
            />
            <button
              onClick={setTodayDate}
              className={`px-2.5 py-1.5 rounded text-[11px] font-bold border transition-all ${
                selectedDate === new Date().toISOString().split('T')[0]
                  ? 'bg-cyan-600 border-cyan-400 text-white shadow'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* 2. News Bulletin Combo Box */}
        <div>
          <label className="block text-[11px] font-bold text-cyan-300 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. News Bulletin (bulletin Table)</span>
          </label>
          <select
            value={selectedBulletin}
            onChange={(e) => setSelectedBulletin(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
          >
            <option value="">-- Select News Bulletin --</option>
            {bulletinOptions.map((b, idx) => (
              <option key={idx} value={b.title}>
                {b.title} {b.bulletintime ? `(${b.bulletintime})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-COLUMN SIDE-BY-SIDE GRID: HEADLINES (LAYER 2) | ONELINER (LAYER 3) | TWOLINER (LAYER 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* COLUMN 1: HEADLINES (LAYER 2) */}
        <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>HEADLINES</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono rounded">
                    L2
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Single STOP Button for Headlines Layer 2 */}
              <button
                onClick={() => {
                  setActiveLineKey(null);
                  if (onExecuteAction) onExecuteAction('STOP', '', null, 'headlines', 2);
                }}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5 transition-all shadow"
                title="Stop Layer 2 Headlines graphics"
              >
                <RadioIcon className="w-3 h-3" />
                <span>STOP</span>
              </button>

              <button
                onClick={handleAddHeadline}
                className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5 transition-all shadow"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* LIVE AUTO-SEND MIXER POS & SCALE (X, Y, SX, SY) DECK FOR LAYER 2 */}
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 mb-3 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-300 font-mono">MIXER:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="X Position">
                <span className="text-[9px] font-mono font-bold text-cyan-400">X:</span>
                <input
                  type="number"
                  step="0.01"
                  value={mixerPos[2]?.x ?? 0}
                  onChange={(e) => handleMixerPosChange(2, 'x', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Y Position">
                <span className="text-[9px] font-mono font-bold text-cyan-400">Y:</span>
                <input
                  type="number"
                  step="0.01"
                  value={mixerPos[2]?.y ?? 0}
                  onChange={(e) => handleMixerPosChange(2, 'y', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Scale X">
                <span className="text-[9px] font-mono font-bold text-emerald-400">SX:</span>
                <input
                  type="number"
                  step="0.05"
                  value={mixerPos[2]?.scaleX ?? 1}
                  onChange={(e) => handleMixerPosChange(2, 'scaleX', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Scale Y">
                <span className="text-[9px] font-mono font-bold text-emerald-400">SY:</span>
                <input
                  type="number"
                  step="0.05"
                  value={mixerPos[2]?.scaleY ?? 1}
                  onChange={(e) => handleMixerPosChange(2, 'scaleY', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <button
                onClick={() => handleResetMixer(2)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[9px] transition-all"
                title="Reset MIXER 1-2 CLEAR"
              >
                RST
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-slate-500 text-xs font-mono">
              Loading...
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {headlineLines.map((lineText, idx) => {
                const isActive = activeLineKey === `headline-${idx}`;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-7 text-center py-1 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                      L{idx + 1}
                    </span>

                    <input
                      type="text"
                      value={lineText}
                      onChange={(e) => handleHeadlineChange(idx, e.target.value)}
                      placeholder={`Headline ${idx + 1}...`}
                      className="flex-1 min-w-[100px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handlePlayLine(lineText, idx, 'headline')}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-0.5 transition-all shadow"
                        title={`Play Headline Line ${idx + 1} on Layer 2`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>PLAY</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 2: ONELINER (LAYER 3) */}
        <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>ONELINER</span>
                  <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[9px] font-mono rounded">
                    L3
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Single STOP Button for Oneliner Layer 3 */}
              <button
                onClick={() => {
                  setActiveLineKey(null);
                  if (onExecuteAction) onExecuteAction('STOP', '', null, 'oneliner', 3);
                }}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5 transition-all shadow"
                title="Stop Layer 3 Oneliner graphics"
              >
                <RadioIcon className="w-3 h-3" />
                <span>STOP</span>
              </button>

              <button
                onClick={handleAddOneliner}
                className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5 transition-all shadow"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* LIVE AUTO-SEND MIXER POS & SCALE (X, Y, SX, SY) DECK FOR LAYER 3 */}
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 mb-3 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-300 font-mono">MIXER:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="X Position">
                <span className="text-[9px] font-mono font-bold text-cyan-400">X:</span>
                <input
                  type="number"
                  step="0.01"
                  value={mixerPos[3]?.x ?? 0}
                  onChange={(e) => handleMixerPosChange(3, 'x', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Y Position">
                <span className="text-[9px] font-mono font-bold text-cyan-400">Y:</span>
                <input
                  type="number"
                  step="0.01"
                  value={mixerPos[3]?.y ?? 0}
                  onChange={(e) => handleMixerPosChange(3, 'y', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Scale X">
                <span className="text-[9px] font-mono font-bold text-emerald-400">SX:</span>
                <input
                  type="number"
                  step="0.05"
                  value={mixerPos[3]?.scaleX ?? 1}
                  onChange={(e) => handleMixerPosChange(3, 'scaleX', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Scale Y">
                <span className="text-[9px] font-mono font-bold text-emerald-400">SY:</span>
                <input
                  type="number"
                  step="0.05"
                  value={mixerPos[3]?.scaleY ?? 1}
                  onChange={(e) => handleMixerPosChange(3, 'scaleY', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <button
                onClick={() => handleResetMixer(3)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[9px] transition-all"
                title="Reset MIXER 1-3 CLEAR"
              >
                RST
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-slate-500 text-xs font-mono">
              Loading...
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {onelinerLines.map((lineText, idx) => {
                const isActive = activeLineKey === `oneliner-${idx}`;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-7 text-center py-1 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                      L{idx + 1}
                    </span>

                    <input
                      type="text"
                      value={lineText}
                      onChange={(e) => handleOnelinerChange(idx, e.target.value)}
                      placeholder={`Oneliner ${idx + 1}...`}
                      className="flex-1 min-w-[100px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handlePlayLine(lineText, idx, 'oneliner')}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-0.5 transition-all shadow"
                        title={`Play Oneliner Line ${idx + 1} on Layer 3`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>PLAY</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 3: TWOLINER (LAYER 4) */}
        <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-blue-400" />
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>TWOLINER</span>
                  <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[9px] font-mono rounded">
                    L4
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Single STOP Button for Twoliner Layer 4 */}
              <button
                onClick={() => {
                  setActiveLineKey(null);
                  if (onExecuteAction) onExecuteAction('STOP', '', null, 'twoliner', 4);
                }}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5 transition-all shadow"
                title="Stop Layer 4 Twoliner graphics"
              >
                <RadioIcon className="w-3 h-3" />
                <span>STOP</span>
              </button>

              <button
                onClick={handleAddTwoliner}
                className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5 transition-all shadow"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* LIVE AUTO-SEND MIXER POS & SCALE (X, Y, SX, SY) DECK FOR LAYER 4 */}
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 mb-3 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-300 font-mono">MIXER:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="X Position">
                <span className="text-[9px] font-mono font-bold text-cyan-400">X:</span>
                <input
                  type="number"
                  step="0.01"
                  value={mixerPos[4]?.x ?? 0}
                  onChange={(e) => handleMixerPosChange(4, 'x', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Y Position">
                <span className="text-[9px] font-mono font-bold text-cyan-400">Y:</span>
                <input
                  type="number"
                  step="0.01"
                  value={mixerPos[4]?.y ?? 0}
                  onChange={(e) => handleMixerPosChange(4, 'y', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Scale X">
                <span className="text-[9px] font-mono font-bold text-emerald-400">SX:</span>
                <input
                  type="number"
                  step="0.05"
                  value={mixerPos[4]?.scaleX ?? 1}
                  onChange={(e) => handleMixerPosChange(4, 'scaleX', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800" title="Scale Y">
                <span className="text-[9px] font-mono font-bold text-emerald-400">SY:</span>
                <input
                  type="number"
                  step="0.05"
                  value={mixerPos[4]?.scaleY ?? 1}
                  onChange={(e) => handleMixerPosChange(4, 'scaleY', e.target.value)}
                  className="w-14 bg-transparent text-[11px] font-mono text-white focus:outline-none font-bold"
                />
              </div>

              <button
                onClick={() => handleResetMixer(4)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[9px] transition-all"
                title="Reset MIXER 1-4 CLEAR"
              >
                RST
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-slate-500 text-xs font-mono">
              Loading...
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {twolinerLines.map((item, idx) => {
                const isActive = activeLineKey === `twoliner-${idx}`;

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Row Header with Badge & Playout Buttons */}
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 text-center py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                          L{idx + 1}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono italic">Name & Designation</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handlePlayTwolinerRow(item, idx)}
                          className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-0.5 transition-all shadow"
                          title={`Play Twoliner Line ${idx + 1} on Layer 4`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>PLAY</span>
                        </button>
                      </div>
                    </div>

                    {/* 2 Stacked Input Boxes: Line 1 (Name) & Line 2 (Designation) */}
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => handleTwolinerFieldChange(idx, 'name', e.target.value)}
                        placeholder="Line 1: Name..."
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        value={item.designation || ''}
                        onChange={(e) => handleTwolinerFieldChange(idx, 'designation', e.target.value)}
                        placeholder="Line 2: Designation..."
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
